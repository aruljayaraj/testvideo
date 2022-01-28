import { 
  IonContent, IonPage, IonTitle, IonToolbar,
  IonItem, 
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonRadio, IonRadioGroup
} from '@ionic/react';
import React, { useCallback, useEffect  } from 'react';
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import './LocalQuotes.scss'; 
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as repActions from '../../../store/reducers/dashboard/rep';
import CoreService from '../../../shared/services/CoreService';

type FormInputs = {
    st_email_notify: string; 
    st_email_alternate: string;
    st_sms_notify: string;
    st_mobile_alternate: string;
    st_tele_notify: string;
    st_phone_alternate: string;
    st_urgent_request: string;
}

const RFQSettings: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user ); 
  const repProfile = useSelector( (state:any) => state.rep.repProfile);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormInputs>({
      // defaultValues: { ...initialValues },
      mode: "onChange"
  });
  const st_email_notify = watch("st_email_notify");
  const st_sms_notify = watch("st_sms_notify");
  const st_tele_notify = watch("st_tele_notify");

  // Get Member details
  const onMemberCbFn = useCallback((res: any) => { 
    if(res.status === 'SUCCESS'){
        dispatch(repActions.setMemberProfile({ data: res.data.user }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( authUser.ID && authUser.repID ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'get_member',
        memID: authUser.ID,
        repID: authUser.repID
      };
      CoreService.onPostFn('get_member', data, onMemberCbFn);
    }
  }, [dispatch, onMemberCbFn, authUser.ID, authUser.repID]);

  // Initiate form values from API
  useEffect(() => {
    if (repProfile && Object.keys(repProfile).length > 0) {
        setValue('st_email_notify', repProfile.qq_email_notify);
        setValue('st_email_alternate', repProfile.qq_email_alternate);
        setValue('st_sms_notify', repProfile.qq_sms_notify);
        setValue('st_mobile_alternate', repProfile.qq_mobile_alternate);
        setValue('st_tele_notify', repProfile.qq_phone_notify);
        setValue('st_phone_alternate', repProfile.qq_phone_alternate);
        setValue('st_urgent_request', repProfile.qq_urgent_request);
    }
  }, [repProfile]);

  // Submit Callback
  const onCallbackFn = useCallback((res: any) => { console.log(res.data.user);
    if(res.status === 'SUCCESS'){
        dispatch(repActions.setMemberProfile({ data: res.data.user }));
    }
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  const onSubmit = (data: any) => { console.log(data);
    dispatch(uiActions.setShowLoading({ loading: true }));
    const fd = {
        action: 'qq_settings_update',
        memID: authUser.ID,
        repID: authUser.repID,
        ...data
    };
    CoreService.onPostFn('qq_update', fd, onCallbackFn);
  }

  return (
    <IonPage className="rfq-page">
        
        <IonToolbar>
            <IonTitle className="page-title"> Set Your RFQ Notification Preferrences</IonTitle>
        </IonToolbar>
        
        <IonContent className="ion-padding">
        {/* { repProfile && Object.keys(repProfile).length > 0 &&  */}
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding" lines="none">
                                <IonLabel position="stacked">Email Notify <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="st_email_notify"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonRadioGroup 
                                            // onIonChange={onChange} 
                                            onIonChange={ (e:any) => {
                                                if(e.detail.value === 'no'){
                                                    setValue('st_email_alternate', '', { shouldValidate: true });
                                                }else{
                                                    if( repProfile && Object.keys(repProfile).length > 0 ){
                                                        setValue('st_email_alternate', repProfile.qq_email_alternate, { shouldValidate: true });
                                                    }
                                                }
                                                onChange(e.detail.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}>
                                        <IonRow>
                                            <IonCol>
                                                <IonItem lines="none">
                                                    <IonLabel color="medium">Yes</IonLabel>
                                                    <IonRadio slot="start" value="yes" />
                                                </IonItem>
                                            </IonCol>
                                            <IonCol>
                                                <IonItem lines="none">
                                                    <IonLabel color="medium">No</IonLabel>
                                                    <IonRadio slot="start" value="no" />
                                                </IonItem>
                                            </IonCol>
                                        </IonRow>
                                    </IonRadioGroup>
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Email Notify is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="st_email_notify"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        {/* { st_email_notify && st_email_notify === 'yes' &&  */}
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Email Address to receive notifications <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="st_email_alternate"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="email" 
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Invalid Email Address"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="st_email_alternate"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        {/* } */}
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding" lines="none">
                                <IonLabel position="stacked">SMS (text to cell) <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="st_sms_notify"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonRadioGroup 
                                            onIonChange={ (e:any) => {
                                                if(e.detail.value === 'no'){
                                                    setValue('st_mobile_alternate', '', { shouldValidate: true });
                                                }else{
                                                    if( repProfile && Object.keys(repProfile).length > 0 ){
                                                        setValue('st_mobile_alternate', repProfile.qq_mobile_alternate, { shouldValidate: true });
                                                    }
                                                }
                                                onChange(e.detail.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}>
                                            <IonRow>
                                                <IonCol>
                                                    <IonItem lines="none">
                                                        <IonLabel color="medium">Yes</IonLabel>
                                                        <IonRadio slot="start" value="yes" />
                                                    </IonItem>
                                                </IonCol>
                                                <IonCol>
                                                    <IonItem lines="none">
                                                        <IonLabel color="medium">No</IonLabel>
                                                        <IonRadio slot="start" value="no" />
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                        </IonRadioGroup>
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "SMS Notify is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="st_sms_notify"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        { st_sms_notify && st_sms_notify === 'yes' && 
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Cell Number to text <IonText color="danger">*</IonText></IonLabel>
                               <Controller 
                                name="st_mobile_alternate"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput type="tel"
                                        onIonChange={(e: any) => onChange(e.target.value)}
                                        onBlur={onBlur}
                                        value={value}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Cell Number is required"
                                    },
                                    pattern: {
                                        value: /^[0-9 ]{5,15}$/i,
                                        message: "Invalid Cell Number"
                                    }
                                }}
                            />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="st_mobile_alternate"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    }
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding" lines="none">
                                <IonLabel position="stacked">Tele-notifications <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="st_tele_notify"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonRadioGroup 
                                            onIonChange={ (e:any) => {
                                                if(e.detail.value === 'no'){
                                                    setValue('st_phone_alternate', '', { shouldValidate: true });
                                                }else{
                                                    if( repProfile && Object.keys(repProfile).length > 0 ){
                                                        setValue( 'st_phone_alternate', repProfile.qq_phone_alternate, { shouldValidate: true });
                                                    }
                                                }
                                                onChange(e.detail.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}>
                                            <IonRow>
                                                <IonCol>
                                                    <IonItem lines="none">
                                                        <IonLabel color="medium">Yes</IonLabel>
                                                        <IonRadio slot="start" value="yes" />
                                                    </IonItem>
                                                </IonCol>
                                                <IonCol>
                                                    <IonItem lines="none">
                                                        <IonLabel color="medium">No</IonLabel>
                                                        <IonRadio slot="start" value="no" />
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                        </IonRadioGroup>
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Tele-notifications is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="st_tele_notify"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        { st_tele_notify && st_tele_notify === 'yes' && 
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Phone Number to call <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="st_phone_alternate"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="tel"
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Phone Number is required"
                                        },
                                        pattern: {
                                            value: /^[0-9 ]{5,15}$/i,
                                            message: "Invalid Phone Number"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="st_phone_alternate"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        }
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="12" sizeXs="12">
                            <IonItem class="ion-no-padding" lines="none">
                                <IonLabel position="stacked" className="ion-text-wrap m-0 p-1">If you have selected Yes to tele-notifications do you want to receive reminders for urgent requests submitted <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="st_urgent_request"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonRadioGroup
                                            onIonChange={ (e:any) => {
                                                onChange(e.detail.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}>
                                            <IonRow>
                                                <IonCol>
                                                    <IonItem lines="none">
                                                        <IonLabel color="medium">Yes</IonLabel>
                                                        <IonRadio slot="start" value="yes" />
                                                    </IonItem>
                                                </IonCol>
                                                <IonCol>
                                                    <IonItem lines="none">
                                                        <IonLabel color="medium">No</IonLabel>
                                                        <IonRadio slot="start" value="no" />
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                        </IonRadioGroup>
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Urgent Request is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="st_urgent_request"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        
                    </IonRow>
                                       
                </IonGrid>
        
                <IonButton color="greenbg" className="ion-margin-top mt-4 float-right  mb-3" type="submit">
                    Submit
                </IonButton> 
            </form>
        </IonContent> 
    </IonPage>
  );
};

export default RFQSettings;