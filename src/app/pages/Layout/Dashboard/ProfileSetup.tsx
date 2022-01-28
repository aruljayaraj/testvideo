import {  
    IonCard, 
    IonCardHeader,  
    IonCardContent,
    IonItem, 
    IonLabel,
    IonNote,
    IonButton,
    IonRadioGroup,
    IonRadio,
    IonList,
    IonCardTitle,
    IonText
  } from '@ionic/react';
import React, { useCallback } from 'react';
// import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { useSelector } from 'react-redux';
import CoreService from '../../../shared/services/CoreService';
import './Dashboard.scss';
import { useDispatch } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as authActions from '../../../store/reducers/auth';
import * as repActions from '../../../store/reducers/dashboard/rep';

type FormInputs = {
    memLevel: number|string;
}

const ProfileSetup: React.FC = () => {
    const user = useSelector( (state:any) => state.auth.data.user);
    // const repProfile = useSelector( (state:any) => state.rep.repProfile);
    let initialValues = {
        memLevel: user.business_type === 'Seller'? '1': '6'
    };
    const dispatch = useDispatch();
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(repActions.setMemberProfile({ data: res.data }));
            dispatch(authActions.setUser({ user: res.data.member }));
            dispatch(authActions.setMenu({menu: res.menu}));
            dispatch(authActions.setMemOptions({ options: res.memOpts}));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    /**
     * @param data
     */
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'plan_create_profile',
            plan: data.memLevel,
            memID: user.ID,
        };
        CoreService.onPostFn('create_profile', fd, onCallbackFn);
    }

    return (<>
        <IonCard className="card-center mt-4">
            <IonCardHeader color="light">
                <IonCardTitle color="medium" className="ion-text-center card-custom-title">
                    Complete Your Profile Set Up
                </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <p className="mt-4 mb-3">
                    <IonText>In order for customers to find you, please answer the following question.</IonText>
                </p>
                <p><IonText><strong>What best describes your business type?</strong></IonText></p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IonList lines="none">
                        <Controller 
                            name="memLevel"
                            control={control}
                            render={({ field: {onChange, onBlur, value} }) => {
                            return <IonRadioGroup
                                onIonChange={onChange} 
                                onBlur={onBlur}
                                value={value}>
                                { (user && Object.keys(user).length > 0 && user.business_type === 'Seller') &&
                                <>
                                    <IonItem>
                                        <IonLabel className="ion-text-wrap" color="medium">As a business, we serve the general public or business</IonLabel>
                                        <IonRadio slot="start" value="1" />
                                    </IonItem>
                                    <IonNote className="pl-3" color="medium">If you only serve business clients you will be able to indicate that in your profile.</IonNote>
                                    <IonItem>
                                        <IonLabel className="ion-text-wrap" color="medium">As a member organization, we serve the general public or business</IonLabel>
                                        <IonRadio slot="start" value="2" />
                                    </IonItem>
                                    <IonNote className="pl-3" color="medium">An Organization is an association or network of business people designed to promote and protect the interests of its members (e.g. Chamber of Commerce, Builders Associations, etc.). If you only serve business clients you will be able to indicate that in your profile.</IonNote>
                                </>}
                                { (user && Object.keys(user).length > 0 && user.business_type === 'Buyer')  &&
                                <>
                                    <IonItem>
                                        <IonLabel color="medium">I want to buy local products and services for personal use</IonLabel>
                                        <IonRadio slot="start" value="4" />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel color="medium">I want to procure products for a corporation</IonLabel>
                                        <IonRadio slot="start" value="3" />
                                    </IonItem>
                                </>}
                            </IonRadioGroup>
                            }}
                            rules={{ 
                                required: {
                                    value: true,
                                    message: "Business Type is required"
                                }
                             }}
                        />
                        {errors.memLevel && <div className="invalid-feedback">{errors.memLevel.message}</div>}
                    </IonList>
                
                    <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="submit">
                        Submit
                    </IonButton>
                </form>  
                
            </IonCardContent>
        </IonCard>
    </>);
};
  
export default ProfileSetup;
  