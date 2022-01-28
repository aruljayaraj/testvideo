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
    IonNote
  } from '@ionic/react';
  import { close } from 'ionicons/icons';
import React, { useCallback } from 'react';
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import { Editor } from '@tinymce/tinymce-react';

import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';
import CommonService from '../../../shared/services/CommonService';

type FormInputs = {
    description: string;
}

interface Props {
    showAboutProfileModal: boolean,
    setShowAboutProfileModal: Function
}

const AboutProfileModal: React.FC<Props> = ({showAboutProfileModal, setShowAboutProfileModal}) => {
    let { repid,memid } = useParams<any>();
    const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    let initialValues = {
        description: (repProfile)? repProfile.profile_description: ''
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        if(res.status === 'SUCCESS'){
            dispatch(repActions.setRepProfile({ data: res.data }));
            window.location.reload();
            setShowAboutProfileModal(false);
        }
    }, [dispatch, setShowAboutProfileModal]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const user = {
            action: 'profile_desc_update',
            memID: memid,
            repID: repid,
            ...data
        };
        CoreService.onPostFn('member_update', user, onCallbackFn);
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowAboutProfileModal(false)}>
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
                    <IonTitle>Edit Profile Description</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen>
            <IonGrid>
                
                <IonRow>
                    <IonCol>
                        <IonItem lines="none" class="ion-no-padding">
                            <IonLabel className="mb-3" position="stacked">Profile Description <IonText color="danger">*</IonText></IonLabel>
                            { showAboutProfileModal === true && <Controller 
                                name="description"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <Editor
                                        value={value}
                                        apiKey={lfConfig.tinymceKey}
                                        init={CommonService.onEditorConfig(lfConfig.tinymceMaxLength)}
                                        // onEditorChange={handleEditorChange}
                                        onEditorChange={(val: any) =>{
                                            onChange(val);
                                        }}
                                        onBlur={onBlur}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Profile Description is required"
                                    }
                                }}
                            />
                            }
                            <IonNote className="mt-2">Write a profile of your skills that will be seen on our system: (maximum 500 words)</IonNote><br />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="description"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                    
                </IonRow>

                { (isPlatform('desktop')) && 
                    <IonButton color="greenbg" className="ion-margin-top mt-5 mb-3 float-right" type="submit" >
                        Submit
                    </IonButton>
                }
                
                </IonGrid>
            </IonContent>
        </form>  
    </>);
};
  
export default AboutProfileModal;