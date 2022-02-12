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
    IonCol
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
import { useForm } from "react-hook-form";

import './Record.scss';
import { useDispatch, useSelector } from 'react-redux';

import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import { lfConfig } from '../../../../Constants';
import useTimer from '../../../hooks/useTimer';
// import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';
// import * as prActions from '../../store/reducers/dashboard/pr';
// import * as dealActions from '../../store/reducers/dashboard/deal';
// import Timer from './Timer';
import { isPlatform } from '@ionic/react';
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';

interface Props {
    showRecordAudioModal: any,
    setShowRecordAudioModal: Function,
}

let initialValues: any = {
    status: '',
    base64Sound: '',
    mimeType: ''
}

const RecordAudio: React.FC<Props> = ({ showRecordAudioModal, setShowRecordAudioModal }) => {
    const dispatch = useDispatch();
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const { handleSubmit} = useForm();
    let { title, actionType, memId, frmId } = showRecordAudioModal;
    const { apiBaseURL } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);

    const { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(0);

    const [audio, setAudio] = useState<any>(initialValues);
    const audioRef = useRef<any>();

    const onRecord = () => { console.log("meow");
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
            // console.log(result.value);
            handlePause();
            handleReset();
            const audDetails = {
                status: 'recorded',
                base64Sound: result.value.recordDataBase64,
                mimeType: result.value.mimeType
            }
            setAudio(audDetails);
        })
        .catch(error => console.log(error));
    }

    const onDelete = () => {
        setAudio({
            status: '',
            base64Sound: '',
            mimeType: ''
        });
    }
    const onCallbackFn = useCallback((res: any) => { console.log(res);
        if(res.status === 'SUCCESS'){
            /*if( actionType === 'company_logo' ){
                dispatch(repActions.setCompanyProfile({ data: res.data }));
            }else if( actionType === 'rep_profile' || actionType === 'rep_logo' ){
                dispatch(repActions.setRepProfile({ data: res.data }));
            }else if( actionType === 'press_release' ){
                dispatch(prActions.setPressRelease({ data: res.data }));
            }else if( actionType === 'local_deal' ){
                dispatch(dealActions.setDeal({ data: res.data }));
            } 
            setShowImageModal({ ...showImageModal, isOpen: false });*/
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        setTimeout( () => {
            dispatch(uiActions.setShowLoading({ loading: false }));
        }, 2000 );
        
    }, [dispatch]);
    const onSubmit = () => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        var u8Audio  = CommonService.b64ToUint8Array(audio.base64Sound);
        const fd = new FormData();
        fd.append("dataFile", new Blob([ u8Audio ], {type: audio.mimeType}), '');
        fd.append('memId', memId);
        fd.append('repId', authUser.repID);
        fd.append('formId', frmId);
        fd.append('action', ''); // actionType
        CoreService.onUploadFn('file_upload', fd, onCallbackFn);
    }

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
                    { !audio.base64Sound && <IonRow>
                        <IonCol className="d-flex justify-content-center mb-4">
                            <p className='fs-20'>{CommonService.formatTime(timer)}</p>
                        </IonCol>
                    </IonRow>}
                    { audio.base64Sound && <IonRow>
                        <IonCol className="d-flex justify-content-center my-5">
                            <audio controls ref={audioRef}>
                                <source src={audio.base64Sound} type="audio/ogg" />
                            </audio>
                        </IonCol>
                    </IonRow>}
                    <IonRow>
                        <IonCol className="d-flex justify-content-center">
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
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <div className="float-right">
                    { (isPlatform('desktop')) && 
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
  