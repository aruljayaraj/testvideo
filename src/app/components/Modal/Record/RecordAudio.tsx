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
    IonInput
  } from '@ionic/react';
  import { 
    close,
    micOutline,
    pauseOutline,
    trashOutline,
    stopOutline,
    refreshOutline,
    playOutline
  } from 'ionicons/icons';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import './Record.scss';
import { useDispatch, useSelector } from 'react-redux';

import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import { lfConfig } from '../../../../Constants';
import useTimer from '../../../hooks/useTimer';
import { nanoid } from 'nanoid';
import * as uiActions from '../../../store/reducers/ui';
import * as qqActions from '../../../store/reducers/dashboard/qq';
// import * as dealActions from '../../store/reducers/dashboard/deal';
// import Timer from './Timer';
import { isPlatform } from '@ionic/react';
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';

interface Props {
    showRecordAudioModal: any,
    setShowRecordAudioModal: Function,
}

type FormInputs = {
    title_line: string;
}

let audioInitialValues: any = {
    status: '',
    base64Sound: '',
    mimeType: '',
    ext: ''
}

const RecordAudio: React.FC<Props> = ({ showRecordAudioModal, setShowRecordAudioModal }) => {
    const dispatch = useDispatch();
    let { title, actionType, memId, repId, frmId, resType, qqType } = showRecordAudioModal;
    // const qq = useSelector( (state:any) => state.qq.localQuote);
    const { apiBaseURL, basename } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const inputRef = useRef<any>(null);
    const { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(0);

    const [audio, setAudio] = useState<any>(audioInitialValues);
    // const [audioFileTitle, setAudioFileTitle] = useState<string>('');
    const audioRef = useRef<any>();

    let initialValues = {
        title_line: ""
    };

    const { control, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onRecord = () => { 
        VoiceRecorder.canDeviceVoiceRecord()
        .then((result: GenericResponse) => {
            console.log(result.value);
            VoiceRecorder.hasAudioRecordingPermission()
            .then((result: GenericResponse) => {
                console.log(result.value);
                
                VoiceRecorder.requestAudioRecordingPermission()
                .then((result: GenericResponse) => {
                    console.log(result.value);
                    // Recording
                    VoiceRecorder.startRecording()
                    .then((result: any) => { // GenericResponse
                        // Start Timer
                        handleStart();
                        setAudio({
                            ...audio,
                            status: 'recording'
                        });
                    })
                    .catch(error => console.log(error))
                });
            }).catch((error) =>{
                console.log(error);
                VoiceRecorder.requestAudioRecordingPermission()
                .then((result: GenericResponse) => {
                    console.log(result.value);
                    // Recording
                    VoiceRecorder.startRecording()
                    .then((result: any) => { // GenericResponse
                        // Start Timer
                        handleStart();
                        setAudio({
                            ...audio,
                            status: 'recording'
                        });
                        
                    })
                    .catch(error => console.log(error))
                });
            });
        });
    }

    const onPause = () => { console.log("pause");
        VoiceRecorder.pauseRecording()
        .then((result: GenericResponse) => {
            // Timer Pause
            handlePause();
            const audDetails = {
                status: 'paused'
            }
            setAudio(audDetails);
        })
        .catch(error => console.log(error));
    }
    const onResume = () => { console.log("resume");
        VoiceRecorder.resumeRecording()
        .then((result: GenericResponse) => {
            // Timer Pause
            handleResume();
            const audDetails = {
                status: 'recording'
            }
            setAudio(audDetails);
        })
        .catch(error => console.log(error));
    }
    const onStop = () => { console.log("stop");
        VoiceRecorder.stopRecording()
        .then((result: RecordingData) => {
            console.log(result.value);
            let mime_ext = CommonService.mimeTypes(result.value.mimeType); console.log(mime_ext);
            handlePause();
            handleReset();
            const audDetails = {
                status: 'recorded',
                base64Sound: result.value.recordDataBase64,
                mimeType: result.value.mimeType,
                ext: mime_ext
            }
            setAudio(audDetails);
        })
        .catch(error => console.log(error));
    }

    const onDelete = () => {
        setAudio({
            status: '',
            base64Sound: '',
            mimeType: '',
            ext: ''
        });
    }
    const onCallbackFn = useCallback((res: any) => { console.log(res);
        if(res.status === 'SUCCESS'){
            if( actionType === 'localquote' ){
                if( qqType === 'buyer' ){
                    dispatch(qqActions.setQQ({ data: res.data }));
                }else{
                    dispatch(qqActions.setSQ({ data: res.data }));
                }
                
            }
            setShowRecordAudioModal({ ...showRecordAudioModal, isOpen: false });
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        setTimeout( () => {
            dispatch(uiActions.setShowLoading({ loading: false }));
        }, 2000 );
        
    }, [dispatch]);
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        console.log(audio);
        var u8Audio  = CommonService.b64ToUint8Array(audio.base64Sound); console.log(audio.mimeType);
        
        const fd = new FormData();
        fd.append("dataFile", new Blob([ u8Audio ], {type: audio.mimeType}), nanoid()+"."+audio.ext);
        fd.append('memId', memId);
        fd.append('repId', repId);
        fd.append('formId', frmId);
        fd.append('action', actionType); // actionType
        fd.append('resType', resType);
        fd.append('qqType', qqType);
        fd.append('uploadFrom', 'recording');
        fd.append('uploadTitle', data.title_line);
        // console.log(showRecordAudioModal, title, actionType, memId, repId, frmId);
        CoreService.onUploadFn('record_upload', fd, onCallbackFn);
    }

    // if( inputRef && inputRef.current ){
    //     console.log(inputRef.current.value);
    // }

    return (<>
        <form className="image-crop-modal-container" onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowRecordAudioModal({
                            ...showRecordAudioModal, 
                            isOpen: false
                        })}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    
                    { (!isPlatform('desktop') && audio.base64Sound && inputRef && inputRef.current && inputRef.current.value) &&  
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
                    <IonRow className="d-flex justify-content-center mb-2">
                        <IonCol sizeMd="8" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Title for the Audio <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="title_line"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput type="text"
                                        ref={inputRef}
                                        onIonChange={(e: any) => {
                                            // console.log(getValues('title_line'));
                                            // setAudio({ ...audio, title_line: e.target.value });
                                            // inputRef.current = e.target.value;
                                            onChange(e.target.value); 
                                        }}
                                        onBlur={onBlur}
                                        value={value}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Title Line is required"
                                    },
                                    minLength: {
                                        value: 3,
                                        message: 'Title Line should be minimum 3 characters'
                                    },
                                    maxLength: {
                                        value: 150,
                                        message: 'Title Line should be lessthan 150 characters'
                                    }
                                }}
                            />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="title_line"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    { !audio.base64Sound && <IonRow>
                        <IonCol className="d-flex justify-content-center mb-4">
                            <p className='fs-20'>{CommonService.formatTime(timer)}</p>
                        </IonCol>
                    </IonRow>}
                    { audio.base64Sound && audio.ext !== 'm4a' && <IonRow>
                        <IonCol className="d-flex justify-content-center my-5">
                            <audio controls ref={audioRef}>
                                <source src={audio.base64Sound} type="audio/ogg" />
                            </audio>
                        </IonCol>
                    </IonRow>}
                    <IonRow>
                        {/* <IonCol className="d-flex justify-content-centers" > */}
                        <IonCol sizeMd="12" sizeXs="12">
                            <div className="d-flex justify-content-center">
                            <IonButton color="greenbg" shape="round" onClick={onDelete} disabled={audio.base64Sound? false : true}>
                                <IonIcon icon={trashOutline} />
                            </IonButton>
                            { !audio.base64Sound && !['recording', 'paused'].includes(audio.status) && <IonButton color="greenbg" shape="round" onClick={onRecord}>
                                <IonIcon icon={micOutline} />
                            </IonButton> }
                            <IonButton color="greenbg" shape="round" onClick={onPause} disabled={['recording'].includes(audio.status)? false : true}>
                                <IonIcon icon={pauseOutline} />
                            </IonButton>
                            <IonButton color="greenbg" shape="round" onClick={onResume} disabled={['paused'].includes(audio.status)? false : true}>
                                <IonIcon icon={refreshOutline} />
                            </IonButton>
                            <IonButton color="greenbg" shape="round" onClick={onStop} disabled={['recording', 'paused'].includes(audio.status)? false : true}>
                                <IonIcon icon={stopOutline} />
                            </IonButton>
                            </div>
                        </IonCol>
                    </IonRow>
                       
                </IonGrid>
                <div className="float-right">
                    { (isPlatform('desktop') && audio.base64Sound && inputRef && inputRef.current && inputRef.current.value ) && 
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 pl-2" type="submit" >
                            Save
                        </IonButton>
                    }
                </div>
            </IonContent> 
        </form> 
    </>);
};
  
export default RecordAudio;
  