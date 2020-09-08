import { 
    IonContent, 
    IonPage, 
    IonCard, 
    IonCardHeader, 
    IonCardContent,
    IonItem, 
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle
} from '@ionic/react';
import React, { useState, useRef, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as authActions from '../../../../store/reducers/auth';
import './NewRep.scss';
import CoreService from '../../../../shared/services/CoreService';

let initialValues = {
    firstname: "",
    lastname: "",
    business_name: "",
    email: "",
    password: "",
    confirm_password: ""
};

const NewRepProfileInfo: React.FC = () => {
    console.log('NewRepProfileInfo Page');
    const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [addRep, setAddRep] = useState({ status: false, memID: '', repID: ''  });
    const { control, errors, handleSubmit, watch } = useForm({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });
    const password = useRef({});
    password.current = watch("password", "");

    /**
     *
     * @param _fieldName
     */
    const showError = (_fieldName: string, msg: string) => {
        let error = (errors as any)[_fieldName];
        return error ? (
        (error.ref.name === _fieldName)? (
            <div className="invalid-feedback">
            {error.message || `${msg} is required`}
        </div>
        ) : null
        ) : null;
    };

    const onCallbackFn = useCallback((res: any) => { console.log(res);
        if(res.status === 'SUCCESS'){
            dispatch(authActions.setMenu({ menu: res.data.menu }));
            setAddRep({ status: true, memID: res.data.rep.mem_id, repID: res.data.rep.id  });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'addRep',
            memID: repProfile.mem_id,
            repID: repProfile.id,
            ...data
        };
        CoreService.onPostFn('member_update', fd, onCallbackFn);
    }

    if( addRep.status  ){
        return <Redirect to={`/layout/rep-profile/${addRep.repID}/${addRep.memID}`} />;
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonCard className="card-center mt-2">
                <IonCardHeader>
                    <IonCardTitle color="medium" className="ion-text-center">Additional Rep Profile</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <IonGrid>
                        <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="firstname"
                                placeholder="First Name *"
                                rules={{
                                required: true,
                                pattern: {
                                    value: /^[A-Z0-9 ]{2,25}$/i,
                                    message: "Invalid First Name"
                                }
                                }}
                            />
                            </IonItem>
                            {showError("firstname", "First Name")}
                        </IonCol>
                        <IonCol>
                            <IonItem class="ion-no-padding">
                                <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                name="lastname"
                                placeholder="Last Name *"
                                rules={{
                                    required: true,
                                    pattern: {
                                    value: /^[A-Z0-9 ]{1,25}$/i,
                                    message: "Invalid Last Name"
                                    }
                                }}
                                />
                            </IonItem>
                            {showError("lastname", "Last Name")}
                        </IonCol>
                        </IonRow>
                        <IonRow>
                        <IonCol >
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="business_name"
                                placeholder="Business Name (if applicable)"
                                rules={{
                                required: false,
                                minLength: {
                                    value: 3,
                                    message: "Invalid Business Name"
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Business Name must consist of at maximum 100 characters"
                                }
                                }}
                            />
                            </IonItem>
                            {showError("business_name", "Business Name")}
                        </IonCol>
                        </IonRow>
                        <IonRow>
                        <IonCol>
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="email"
                                placeholder="Email *"
                                rules={{
                                required: true,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "Invalid Email Address"
                                }
                                }}
                            />
                            </IonItem>
                            {/* {errors.username && "Username is required"} */}
                            {showError("email", "Email")}
                        </IonCol>
                        </IonRow>  
                        <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="password"
                                type="password"
                                placeholder="Password *"
                                rules={{
                                required: true,
                                minLength: {
                                    value: 5,
                                    message: "Password must have at least 5 characters"
                                },
                                maxLength: {
                                    value: 15,
                                    message: "Password must consist of at maximum 15 characters"
                                },
                                pattern: {
                                    value: /^[A-Z0-9._%+-@!#$%^&*()]{5,15}$/i,
                                    message: "Invalid Password"
                                }
                                }}
                            />
                            </IonItem>
                            {showError("password", "Password")}
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="confirm_password"
                                type="password"
                                placeholder="Confirm Password *"
                                rules={{
                                required: true,
                                minLength: {
                                    value: 5,
                                    message: "Password must have at least 5 characters"
                                },
                                maxLength: {
                                    value: 15,
                                    message: "Password must consist of at maximum 15 characters"
                                },
                                pattern: {
                                    value: /^[A-Z0-9._%+-@!#$%^&*()]{5,15}$/i,
                                    message: "Invalid Confirm Password"
                                },
                                validate: value => ( value === password.current || "The passwords do not match" )
                                }}
                            />
                            </IonItem>
                            {showError("confirm_password", "Confirm Password")}
                            
                        </IonCol>
                        </IonRow>
                            
                    </IonGrid>
                    
                    <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="submit">
                        Submit
                    </IonButton>
                    </form>  
                    
                </IonCardContent>
                </IonCard>
                
            </IonContent>

        </IonPage>
    );
};

  
  
export default NewRepProfileInfo;
  