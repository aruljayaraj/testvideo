import {
    IonItem, 
    IonLabel,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader
  } from '@ionic/react';
  import { close, closeOutline } from 'ionicons/icons';
import React, { useEffect, useCallback } from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';

import CoreService from '../../../shared/services/CoreService';
import './CompanyProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';

type FormValues = {
    linkedin: string;
    facebook: string;
    twitter: string;
    other_promotional_assets: {
      link: string;
    }[];
    special_features: {
        name: string;
    }[];
    member_organizations: {
        name: string
    }[];
};

interface Props {
    showOtherModal: boolean,
    setShowOtherModal: Function
}

const OtherInfoModal: React.FC<Props> = ({showOtherModal, setShowOtherModal}) => {

    const dispatch = useDispatch();
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    
    let initialValues = {
        linkedin: (Object.keys(comProfile).length > 0)? comProfile.linkedin: '',
        facebook: (Object.keys(comProfile).length > 0)? comProfile.facebook: '',
        twitter: (Object.keys(comProfile).length > 0)? comProfile.twitter: '',
        other_promotional_assets: (Object.keys(comProfile).length > 0 && comProfile.other_promotional_assets)? JSON.parse(comProfile.other_promotional_assets): [],
        special_features: (Object.keys(comProfile).length > 0 && comProfile.special_features)? JSON.parse(comProfile.special_features): [],
        member_organizations: (Object.keys(comProfile).length > 0 && comProfile.member_organizations)? JSON.parse(comProfile.member_organizations): []
    }; // console.log(initialValues);
    
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
      } = useForm<FormValues>({
        defaultValues: { ...initialValues },
        mode: "onBlur"
      });
      const { fields: paFields, append: paAppend, remove: paRemove } = useFieldArray({
        name: "other_promotional_assets",
        control
      }); 
      const { fields: sfFields, append: sfAppend, remove: sfRemove } = useFieldArray({
        name: "special_features",
        control
      });
      const { fields: moFields, append: moAppend, remove: moRemove } = useFieldArray({
        name: "member_organizations",
        control
      });

    
    // For Country default to load
    useEffect(() => {
        if( showOtherModal === true ){
            // dispatch(uiActions.setShowLoading({ loading: true }));
            // CoreService.onPostFn('get_location', {'action': 'get_all_countries'}, onCountryCb);
        }
    }, [dispatch, showOtherModal]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowOtherModal(false);
            dispatch(repActions.setCompanyProfile({ data: res.data })); 
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setShowOtherModal]);
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const user = {
            action: 'company_other_info_update',
            memID: comProfile.mem_id,
            formID: comProfile.id,
            ...data
        }; // console.log(user);
        CoreService.onPostFn('company_update', user, onCallbackFn);
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowOtherModal(false)}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (!isPlatform('desktop')) &&   
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            Save
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle>Edit Other Info</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen>
                <IonTitle className="my-3">Links to your other promotional assets: </IonTitle>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="9" sizeXs="10">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">LinkedIn Profile </IonLabel>   
                                <Controller
                                    name="linkedin"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonInput 
                                            {...field}
                                            type="url"
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/,
                                            message: "Invalid Facebook page"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="linkedin"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="9" sizeXs="10">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Facebook Page </IonLabel>
                                <Controller 
                                    name="facebook"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonInput 
                                            {...field}
                                            type="url"
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/,
                                            message: "Invalid Facebook page"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="facebook"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow> 
                    <IonRow>
                        <IonCol sizeMd="9" sizeXs="10">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Twitter </IonLabel>
                                <Controller 
                                    name="twitter"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonInput 
                                            {...field}
                                            type="url"
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/,
                                            message: "Invalid Twitter page"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="twitter"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow> 
                                 
                    {paFields.map((field, index) => {
                        return (
                            <IonRow key={field.id} >
                                <IonCol sizeMd="9" sizeXs="10">
                                    <IonItem class="ion-no-padding">
                                        <IonLabel position="stacked">Other Link {(index+1)} </IonLabel>
                                        <IonInput placeholder="Other Link"
                                        {...register(`other_promotional_assets.${index}.link` as const, {
                                            required: {
                                                value: true,
                                                message: "Other Link is required"
                                            }
                                        })}
                                        value={field.link}
                                        className="" />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name={`other_promotional_assets.${index}.link`}
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                                <IonCol sizeMd="3" sizeSm="2">
                                    <IonButton color="danger" type="button" onClick={() => paRemove(index)}>
                                        <IonIcon icon={closeOutline} size="small"></IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        );
                    })}

                    <IonRow>
                        <IonCol>
                            <IonButton shape="round" fill="outline" color="primary" type="button" onClick={() => paAppend({ link: "" }) } > Add more links </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonTitle className="my-3">Special features or offers</IonTitle>
                <IonGrid>
                    {sfFields.map((field, index) => {
                        return (
                            <IonRow key={field.id} >
                                <IonCol sizeMd="9" sizeXs="10">
                                    <IonItem class="ion-no-padding">
                                        <IonLabel position="stacked">My Special feature {(index+1)} </IonLabel>
                                        <IonInput placeholder="My Special feature"
                                        {...register(`special_features.${index}.name` as const, {
                                            required: {
                                                value: true,
                                                message: "My Special feature is required"
                                            }
                                        })}
                                        value={field.name}
                                        className="" />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name={`special_features.${index}.name`}
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                                <IonCol sizeMd="3" sizeSm="2">
                                    <IonButton color="danger" type="button" onClick={() => sfRemove(index)}>
                                        <IonIcon icon={closeOutline} size="small"></IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        );
                    })}

                    <IonRow>
                        <IonCol>
                            <IonButton shape="round" fill="outline" color="primary" type="button" onClick={() => sfAppend({ name: "" }) } > Add more features </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonTitle className="my-3">List business organizations you're member of</IonTitle>
                <IonGrid>
                    {moFields.map((field, index) => {
                        return (
                            <IonRow key={field.id} >
                                <IonCol sizeMd="9" sizeXs="10">
                                    <IonItem class="ion-no-padding">
                                        <IonLabel position="stacked">Member Organizations {(index+1)} </IonLabel>
                                        <IonInput placeholder="Member Organizations"
                                        {...register(`member_organizations.${index}.name` as const, {
                                            required: {
                                                value: true,
                                                message: "Member Organization is required"
                                            }
                                        })}
                                        value={field.name}
                                        className="" />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name={`member_organizations.${index}.name`}
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                                <IonCol sizeMd="3" sizeSm="2">
                                    <IonButton color="danger" type="button" onClick={() => moRemove(index)}>
                                        <IonIcon icon={closeOutline} size="small"></IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        );
                    })}

                    <IonRow>
                        <IonCol>
                            <IonButton shape="round" fill="outline" color="primary" type="button" onClick={() => moAppend({ name: "" }) } > Add more member organizations </IonButton>
                        </IonCol>
                    </IonRow>

                    { (isPlatform('desktop')) && 
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                            Submit
                        </IonButton>
                    }
                
                </IonGrid>
            </IonContent>
        </form> 
    </>);
};
  
export default OtherInfoModal;
  