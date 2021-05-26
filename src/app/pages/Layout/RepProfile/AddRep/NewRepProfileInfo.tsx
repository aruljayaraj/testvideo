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
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as authActions from '../../../../store/reducers/auth';
import './NewRep.scss';
import CoreService from '../../../../shared/services/CoreService';

type FormInputs = {
    firstname: string;
    lastname: string;
    business_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

let initialValues = {
    firstname: "",
    lastname: "",
    business_name: "",
    email: "",
    password: "",
    confirm_password: ""
};

const NewRepProfileInfo: React.FC = () => {
    const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [addRep, setAddRep] = useState({ status: false, memID: '', repID: ''  });
    const { control, handleSubmit, watch, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });
    const password = useRef({});
    password.current = watch("password", "");

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
        return <Redirect to={`/layout/rep-profile/${addRep.memID}/${addRep.repID}`} />;
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonCard className="card-center mt-2">
                <IonCardHeader>
                    <IonCardTitle color="medium" className="ion-text-center fs-18">Additional Rep Profile</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <IonGrid>
                        <IonRow>
                            <IonCol sizeMd="6" sizeXs="12">
                                <IonItem class="ion-no-padding">
                                <Controller 
                                    name="firstname"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonInput 
                                            {...field}
                                            type="text"
                                            placeholder="First Name *"
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Firstname is required"
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9 ]{2,25}$/i,
                                            message: "Invalid Firstname"
                                        }
                                    }}
                                />
                                </IonItem>
                                <ErrorMessage
                                    errors={errors}
                                    name="firstname"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
                            </IonCol>
                            <IonCol>
                                <IonItem class="ion-no-padding">
                                <Controller 
                                    name="lastname"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonInput 
                                            {...field}
                                            type="text"
                                            placeholder="Last Name *"
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Lastname is required"
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9 ]{2,25}$/i,
                                            message: "Invalid Last Name"
                                        }
                                    }}
                                />
                                </IonItem>
                                <ErrorMessage
                                    errors={errors}
                                    name="lastname"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol >
                                <IonItem class="ion-no-padding">
                                    <Controller 
                                        name="business_name"
                                        control={control}
                                        render={({ field }) => {
                                            return <IonInput 
                                                {...field}
                                                type="text"
                                                placeholder="Business Name (if applicable)"
                                                onIonChange={(e: any) => field.onChange(e.target.value)}
                                            />
                                        }}
                                        rules={{
                                            minLength: {
                                                value: 3,
                                                message: "Invalid Business Name"
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: "Business Name must consist of at maximum 100 characters"
                                            },
                                            pattern: {
                                                value: /^[A-Z0-9!@#$&-_() ]{2,100}$/i,
                                                message: "Invalid Business Name"
                                            }
                                        }}
                                    />
                                </IonItem>
                                <ErrorMessage
                                    errors={errors}
                                    name="business_name"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonItem class="ion-no-padding">
                                    <Controller 
                                        name="email"
                                        control={control}
                                        render={({ field: {onChange, onBlur} }) => {
                                        return <IonInput 
                                            type="email"
                                            placeholder="Email *"
                                            onIonChange={onChange} 
                                            onBlur={onBlur} />
                                        }}
                                        rules={{
                                        required: {
                                            value: true,
                                            message: "Email is required"
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Invalid Email Address"
                                        }
                                        }}
                                    />
                                </IonItem>
                                <ErrorMessage
                                    errors={errors}
                                    name="email"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
                            </IonCol>
                        </IonRow>  
                        <IonRow>
                            <IonCol sizeMd="6" sizeXs="12">
                                <IonItem class="ion-no-padding">
                                    <Controller 
                                        name="password"
                                        control={control}
                                        render={({ field: {onChange, onBlur} }) => {
                                            return <IonInput 
                                            type="password"
                                            placeholder="Password *"
                                            onIonChange={onChange} 
                                            onBlur={onBlur} />
                                        }}
                                        rules={{
                                            required: {
                                            value: true,
                                            message: "Password is required"
                                            },
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
                                <ErrorMessage
                                    errors={errors}
                                    name="password"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
                            </IonCol>
                            <IonCol sizeMd="6" sizeXs="12">
                                <IonItem class="ion-no-padding">
                                    <Controller 
                                        name="confirm_password"
                                        control={control}
                                        render={({ field: {onChange, onBlur} }) => {
                                            return <IonInput 
                                            type="password"
                                            placeholder="Confirm Password *"
                                            onIonChange={onChange} 
                                            onBlur={onBlur} />
                                        }}
                                        rules={{
                                            required: {
                                            value: true,
                                            message: "Confirm Password is required"
                                            },
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
                                <ErrorMessage
                                    errors={errors}
                                    name="confirm_password"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
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
  