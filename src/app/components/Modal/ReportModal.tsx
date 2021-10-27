import {
    IonItem, 
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonTextarea,
    IonInput
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';
import CoreService from '../../shared/services/CoreService';
import * as uiActions from '../../store/reducers/ui';

interface Props {
    showReportModal: any,
    setShowReportModal: Function
}

type FormInputs = {
    name: string,
    email: string,
    reason: string;
}

const ReportModal: React.FC<Props> = ({ showReportModal, setShowReportModal}) => {
    let { repID, memID } = showReportModal;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const dispatch = useDispatch();
    let initialValues = {
        name: (authUser && Object.keys(authUser).length > 0)? `${authUser.firstname} ${authUser.lastname}`: '',
        email: (authUser && Object.keys(authUser).length > 0)? authUser.email: '',
        reason: ''
    }; 
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowReportModal({ ...showReportModal, isOpen: false });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, showReportModal, setShowReportModal]);
    const onSubmit = (data: any) => {
        if( data.reason ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const formData = {
                action: 'send_report_profile',
                repID,
                memID,
                name: data.name,
                email: data.email,
                reason: data.reason
            };
            CoreService.onPostFn('member_update', formData, onCallbackFn);
        }
    } 
    
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowReportModal({...showReportModal, isOpen: false})}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (!isPlatform('desktop')) &&  
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            <strong>Submit</strong>
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle>Send Report Profile</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent id="buscat-form-wrap" fullscreen className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Full Name <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="name"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput 
                                        type="text"
                                        onIonChange={onChange} 
                                        onBlur={onBlur} 
                                        value={value} />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Name is required"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9 ]{2,75}$/i,
                                        message: "Invalid Full Name"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Email <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="email"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput 
                                        type="email"
                                        onIonChange={onChange} 
                                        onBlur={onBlur}
                                        value={value} />
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
                        <IonCol>
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Reason <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="reason"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonTextarea
                                            {...field}
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Reason is required"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9,\- ]{2,250}$/i,
                                            message: "Invalid Keyword"
                                        }
                                    }}
                                />
                            </IonItem>
                            <p className="font-weight-light text-13">
                                <IonText color="medium">
                                    Reason must be less than 250 characters. 
                                </IonText>
                            </p>
                            <ErrorMessage
                                errors={errors}
                                name="reason"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                
                        </IonCol>
                    </IonRow>
                
                
                <div className="mt-4">           
                { (isPlatform('desktop')) && 
                    <>
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                            Submit
                        </IonButton>
                    </>
                }
                </div> 
                </IonGrid>
            </IonContent> 
        </form> 
    </>);
};
  
export default ReportModal;
  