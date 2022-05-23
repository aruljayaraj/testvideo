import {
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonText,
    IonTextarea
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import './Chat.scss';

import { useDispatch, useSelector } from 'react-redux';
import CoreService from '../../../shared/services/CoreService';
import { lfConfig } from '../../../../Constants';
import * as uiActions from '../../../store/reducers/ui';
import * as qqActions from '../../../store/reducers/dashboard/qq';
import * as repActions from '../../../store/reducers/dashboard/rep';
import { isPlatform } from '@ionic/react';
import Messages from './Messages';

interface Props {
    showChatModal: any,
    setShowChatModal: Function,
}
type FormInputs = {
    message: string;
}

const Chat: React.FC<Props> = ({ showChatModal, setShowChatModal }) => {
    const dispatch = useDispatch();
    let { title, qq_type, bid, sid, mem_id, receiver_id} = showChatModal;
    // const qq = useSelector( (state:any) => state.qq.localQuote);
    const { apiBaseURL, basename } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);

    let initialValues = {
        message: ''
    }; 
    const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitSuccessful } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    }); // formState: { errors }, 

    useEffect(() => {
        if (isSubmitSuccessful) {
          reset({ ...initialValues });
        }
    }, [isSubmitSuccessful, initialValues, reset]);
    
    useEffect(() => {
        let data = {
            action: 'get_messages',
            qq_type,
            bid: bid,
            sid: sid,
            mem_id: mem_id,
            receiver_id: receiver_id,
            is_viewed: true
        };
        dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostsFn('qq_message', data).then((res:any) => {
            if(res.data.status === 'SUCCESS'){ // console.log(res.data)
                dispatch(qqActions.setMessages({ data: res.data.data }));
                dispatch(repActions.setNotifications({ data: res.data.notifications }));
            }
            dispatch(uiActions.setShowLoading({ loading: false }));
        }).catch((error) => {
            dispatch(uiActions.setShowLoading({ loading: false }));
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error.message }));
        });
        
    },[]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(qqActions.setMessages({ data: res.data }));
            // setValue('message', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
            reset({...initialValues});
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch]);
    const onSubmit = (data: any) => {
        if( data.message ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const formData = {
                action: 'send_message',
                bid,
                sid,
                mem_id,
                receiver_id,
                qq_type,
                message: data.message
            };
            CoreService.onPostFn('qq_message', formData, onCallbackFn);
        }
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => {
                            setShowChatModal({
                                ...showChatModal, 
                                isOpen: false
                            })}
                            
                        }>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (!isPlatform('desktop')) &&
                        <IonButtons slot="end">
                            <IonButton color="blackbg" type="submit">
                                <strong>Save</strong>
                            </IonButton>
                        </IonButtons>
                    }
                    <IonTitle> {title}</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen className="ion-padding img-container">
                <IonIcon color="danger" icon={close} slot="icon-only"></IonIcon>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <Messages qq_type={qq_type} />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='10'>
                            <IonItem className="ion-no-padding">
                                <Controller 
                                    name="message"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonTextarea
                                            placeholder='Type message here..'
                                            {...field}
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Message is required"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9,\-.?@!#$%()_+&* ]{2,250}$/i,
                                            message: "Invalid Message"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="message"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        <IonCol size='2' >
                            <IonButton color="greenbg" className="ion-margin-top mt-5 pl-2" type="submit" >
                                Save
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    
                </IonGrid>
            </IonContent> 
        </form> 
    </>);
};
  
export default Chat;
  