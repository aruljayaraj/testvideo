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
    close
  } from 'ionicons/icons';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import "video.js/dist/video-js.min.css";
import "videojs-record/dist/css/videojs.record.css";
import videojs from "video.js";
import "videojs-record/dist/videojs.record.js";
import RecordRTC from "recordrtc";
import './Record.scss';

import { useDispatch, useSelector } from 'react-redux';
import CoreService from '../../../shared/services/CoreService';
import { lfConfig } from '../../../../Constants';
import * as uiActions from '../../../store/reducers/ui';
import * as qqActions from '../../../store/reducers/dashboard/qq';
import { isPlatform } from '@ionic/react';
import CommonService from '../../../shared/services/CommonService';

interface Props {
    showRecordVideoModal: any,
    setShowRecordVideoModal: Function,
}

type FormInputs = {
    title_line: string;
}

var options = {
    controls: true,
    bigPlayButton: false,
    width: 1920,
    height: 1080,
    fluid: true,
    plugins: {
      record: {
        audio: true,
        video: true,
        maxLength: 30 * 60, // 2 * 60 * 60
        displayMilliseconds: false,
        // fire the timestamp event every 5 seconds
        timeSlice: 2000
      }
    }
};

let videoInitialValues: any = {
    status: '',
    stream: '',
    mimeType: '',
    player: null
}

const RecordVideo: React.FC<Props> = ({ showRecordVideoModal, setShowRecordVideoModal }) => {
    const dispatch = useDispatch();
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    let { title, actionType, memId, repId, frmId, resType, qqType } = showRecordVideoModal;
    // const qq = useSelector( (state:any) => state.qq.localQuote);
    const { apiBaseURL } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const inputDeviceIdIndex = useRef(0);
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const inputRef = useRef<any>(null);
    const [video, setVideo] = useState<any>(videoInitialValues);

    let initialValues = {
        title_line: ""
    };
    const { control, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });
    
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        var player: any = videojs("myVideo", options, function () {
            // print version information at startup
            var msg =
                "Using video.js " +
                videojs.VERSION +
                " with videojs-record " +
                videojs.getPluginVersion("record") +
                " and recordrtc " +
                RecordRTC.version;
            videojs.log(msg);
        });
        // Helpers

        let setDeviceId = function(deviceId: any) {
            player.record().setVideoInput(deviceId);
        }

        // Handlers
    
        // enumerate devices once
        player.one("deviceReady", function () {
            player.record().enumerateDevices();
        });
    
        player.on("enumerateReady", function () {
            const devices = player.record().devices;
    
            // Filter out video input devices
            const videoInputDevices = devices.filter(
                ({ kind }) => kind === "videoinput"
            );
    
            // change video input device
            setDeviceId(videoInputDevices[inputDeviceIdIndex.current].deviceId);
    
            console.log(videoInputDevices);
    
            // Add switch camera btn
            var Button = videojs.getComponent("Button");
            var SwitchCameraBtn = videojs.extend(Button, {
                constructor: function () {
                    Button.apply(this, arguments);
                    /* initialize your button */
                    this.controlText("Switch camera");
                },
                handleClick: function () {
                    // Switch camera on click
                    inputDeviceIdIndex.current =
                    (inputDeviceIdIndex.current + 1) % videoInputDevices.length;
        
                    setDeviceId(videoInputDevices[inputDeviceIdIndex.current].deviceId);
                },
                buildCSSClass: function () {
                    return "vjs-icon-spinner vjs-control vjs-button";
                }
            });
            videojs.registerComponent("SwitchCameraBtn", SwitchCameraBtn);
    
            player
            .getChild("controlBar")
            .addChild(
                "SwitchCameraBtn",
                {},
                player.controlBar.children().length - 2
            );
        });
    
        // error handling
        player.on("deviceError", function () {
            console.log("device error:", player.deviceErrorCode);
        });

        player.on("error", function (element, error) {
            console.error(error);
        });
    
        // user clicked the record button and started recording
        player.on("startRecord", function () {
            setVideo({
                ...video,
                status: 'recording'
            });
            console.log("started recording!");
        });

        // user completed recording
        player.on("finishRecord", async function () {
            setVideo({
                ...video,
                player: player,
                stream: player.recordedData,
                mimeType: player.recordedData.type,
                status: 'recorded'
            });
            console.log("finished recording");
            console.log({ stream: player.recordedData });
        });
    
        // monitor stream data during recording
        player.on("timestamp", function () {
            // console.log("current timestamp: ", player.currentTimestamp);
            // console.log(
            //   "all timestamps (" + player.allTimestamps.length + "): ",
            //   player.allTimestamps
            // );
            // // stream data
            // console.log({ stream: player.recordedData });
        });
        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
            // player.dispose();
        }
    }, []);  // showRecordVideoModal
    
    // Dispose the Video.js player when the functional component unmounts
    // React.useEffect(() => {
    //     const player = playerRef.current;

    //     return () => {
    //     if (player) {
    //         player.dispose();
    //         playerRef.current = null;
    //     }
    //     };
    // }, [playerRef]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if( actionType === 'localquote' ){
                if( qqType === 'buyer' ){
                    dispatch(qqActions.setQQ({ data: res.data }));
                }else{
                    dispatch(qqActions.setSQ({ data: res.data }));
                }
                setVideo({
                    status: '',
                    stream: '',
                    mimeType: '',
                    player: null
                });
            }
            setShowRecordVideoModal({ ...showRecordVideoModal, isOpen: false,  });
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        setTimeout( () => {
            dispatch(uiActions.setShowLoading({ loading: false }));
        }, 2000 );
        
    }, [dispatch]);
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = new FormData();
        console.log(video);
        console.log(video.stream.name);
        fd.append("dataFile", video.stream, video.stream.name);
        fd.append('memId', memId);
        fd.append('repId', repId);
        fd.append('formId', frmId);
        fd.append('action', actionType); // actionType
        fd.append('resType', resType);
        fd.append('qqType', qqType);
        fd.append('uploadFrom', 'recording');
        fd.append('uploadTitle', data.title_line);
        console.log(actionType, resType, qqType, memId, repId, frmId);
        CoreService.onUploadFn('record_upload', fd, onCallbackFn);
    }

    return (<>
        <form className="image-crop-modal-container" onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot='start'>
                        <IonButton onClick={() => {
                           if(video.player){
                                video.player.dispose();
                            }
                            setShowRecordVideoModal({
                                ...showRecordVideoModal, 
                                isOpen: false
                            })}
                            
                        }>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (video && video.stream && inputRef && inputRef.current && inputRef.current.value) &&
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
                            <IonLabel position="stacked">Title for the Video <IonText color="danger">*</IonText></IonLabel>
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
                    <IonRow>
                        <IonCol>
                            <video ref={videoRef} id="myVideo" playsInline className="video-js vjs-default-skin" />
                        </IonCol>
                    </IonRow>
                    
                </IonGrid>
                {/* <div className="float-right">
                    
                    { (isPlatform('desktop') && video.stream) &&
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 pl-2" type="submit" >
                            Save
                        </IonButton>
                    }
                </div> */}
            </IonContent> 
        </form> 
    </>);
};
  
export default RecordVideo;
  