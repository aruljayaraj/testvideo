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
    IonProgressBar,
    IonItem,
    IonLabel,
    IonText,
    IonInput
  } from '@ionic/react';
  import { 
    close
  } from 'ionicons/icons';
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import './Record.scss';
import { useCameraPhoto } from '../../../hooks/useCameraPhoto';
import { useFileHook } from '../../../hooks/useFileHook';
import { useDispatch, useSelector } from 'react-redux';

import CoreService from '../../../shared/services/CoreService';
import { lfConfig } from '../../../../Constants';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { toArray } from 'lodash';
import * as uiActions from '../../../store/reducers/ui';
import * as qqActions from '../../../store/reducers/dashboard/qq';
import { isPlatform } from '@ionic/react';

let cancelToken = axios.CancelToken;
let source = cancelToken.source();

interface Props {
    showLocalQuoteUploadModal: any,
    setShowLocalQuoteUploadModal: Function,
}

type FormInputs = {
    title_line: string;
}

const LocalQuoteUpload: React.FC<Props> = ({ showLocalQuoteUploadModal, setShowLocalQuoteUploadModal }) => {
    const dispatch = useDispatch();
    const { takePhoto } = useCameraPhoto();
    const { checkFileTypes, checkFileSizes } = useFileHook();
    let { title, actionType, memId, repId, frmId, resType, qqType } = showLocalQuoteUploadModal;
    let { id } = useParams<any>();
    const { apiBaseURL, basename } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const qq = useSelector( (state:any) => state.qq.localQuote);
    const fileProgress = useSelector( (state:any) => state.qq.fileProgress);
    const [mSelected, setmSelected] = useState<string>('document');
    const [addQQ, setAddQQ] = useState({ status: false, memID: '', ID: '' });

    const inputRef = useRef<any>(null);
    const fileDocInputRef = useRef<HTMLInputElement>(null);
    const fileAudInputRef = useRef<HTMLInputElement>(null);
    const fileVidInputRef = useRef<HTMLInputElement>(null);

    let initialValues = {
        title_line: ""
    };

    const { control, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    // Upload Camera Picture callback
    const uploadCameraPhotoCbFn = useCallback((res:any)=> {
        if(res.status === 'SUCCESS'){
            if(qqType === 'buyer'){
                dispatch(qqActions.setQQ({ data: res.data }));
            }else{
                dispatch(qqActions.setSQ({ data: res.data }));
            }
        }
        setTimeout( () => {
            setShowLocalQuoteUploadModal({ ...showLocalQuoteUploadModal, isOpen: false });
            dispatch(uiActions.setShowLoading({ loading: false }));
        }, 2000 );
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    },[dispatch]);
    // Upload Camera Picture
    const uploadCameraPhotoFn = (u8Image: any) => {
        if(u8Image){
            const uploadTitle = getValues('title_line');
            dispatch(uiActions.setShowLoading({ loading: true }));
            const fileName = new Date().getTime() + '.jpg';
            const fd = new FormData();
            fd.append("dataFile", new Blob([ u8Image ], {type: "image/jpg"}), fileName);
            fd.append('memId', authUser.ID);
            fd.append('repId', authUser.repID);
            fd.append('formId', id? id: '');
            fd.append('action', 'localquote' );
            fd.append('resType', 'document' );
            fd.append('qqType', qqType );
            fd.append('uploadFrom', 'camera');
            fd.append('uploadTitle', uploadTitle);
            CoreService.onUploadFn('file_upload', fd, uploadCameraPhotoCbFn);
        }
    }

    let axiosCancelFn = (source: any) => {
        source.cancel('Operation canceled by the user.');
	    // regenerate cancelToken
        source = cancelToken.source();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, qqResType: string) => {
        const files = event.target.files; 
        if( files && files.length > 0 && files.length <= 5 ){
            if(checkFileTypes(files, qqResType) && checkFileSizes(files, qqResType)){
                event.preventDefault();
                dispatch(qqActions.fileProgress({ data: files }));
                for (let i = 0; i < files.length; i++) { 
                    const file = files[i]; 
                        
                    if(file && authUser){
                        const uploadTitle = getValues('title_line');
                        const fd = new FormData();
                        fd.append('memID', authUser.ID);
                        fd.append('repID', authUser.repID);
                        fd.append('formID', id? id: '');
                        fd.append('action', 'qq_upload' );
                        fd.append('qqType', qqType );
                        fd.append('resType', qqResType? qqResType: '' );
                        fd.append('dataFile', file); // console.log(file);
                        fd.append('uploadFrom', 'upload');
                        fd.append('uploadTitle', uploadTitle);
                        axios({
                            method: 'post',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            data: fd,
                            url: `v2/qq_update`,
                            onUploadProgress: (ev: ProgressEvent) => {
                                // const progress = ev.loaded / ev.total * 100; console.log("Progress = " +progress);
                                // const percent = Math.round(progress);
                                // dispatch(uiActions.setShowLoading({ loading: true, msg: `${percent}% Uploading...` }));
                                // updateUploadProgress(Math.round(percent));
                                const percent = Math.round((100 * ev.loaded) / ev.total);
                                dispatch(qqActions.setUploadProgress({ id: (i+1), percentage: percent }));
                            },
                            cancelToken: source.token
                        })
                        .then((resp: any) => {
                            const res = resp.data; // console.log(files.length, i);
                            if(res.status === 'SUCCESS'){
                                if( files.length === (i+1) ){
                                    if(qqType === 'buyer'){
                                        dispatch(qqActions.setQQ({ data: res.data }));
                                    }else{
                                        dispatch(qqActions.setSQ({ data: res.data }));
                                    }
                                    setAddQQ({ status: true, memID: res.data.mem_id, ID: res.data.id  });
                                    // Need to reset once upload queues done
                                    dispatch(qqActions.fileProgress({ data: {} }));
                                    setShowLocalQuoteUploadModal({ ...showLocalQuoteUploadModal, isOpen: false });
                                }
                            }
                            dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
                        })
                        .catch((err: any) => {
                            if(axios.isCancel(err)){ 
                                console.log("Post Request canceled'");
                                console.log(err);
                                dispatch(qqActions.fileProgress({ data: [] }));
                            }else{
                                console.error(err);
                            }
                        });
                    }else{
                        dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'File should not be empty!' }));
                    }
                }
            }

        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Maximum 5 Files are allowed!' }));  
        }
    }

    // For Server Side file delete
    const onRemoveCbFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if(qqType === 'buyer'){
                dispatch(qqActions.setQQ({ data: res.data }));
            }
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    const removeQQResource = (attach_id: number) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'qq_upload_delete',
            memID: authUser.ID,
            repID: authUser.repID,
            qqType: 'buyer',
            resType: 'audio',
            formID: id,
            attach_id: attach_id
        };
        CoreService.onPostFn('qq_update', fd, onRemoveCbFn);
    }

    return (<>
        <form className="image-crop-modal-container">
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowLocalQuoteUploadModal({
                            ...showLocalQuoteUploadModal, 
                            isOpen: false
                        })}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    
                    
                    <IonTitle> {title}</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen className="ion-padding img-container">
                <IonIcon color="danger" icon={close} slot="icon-only"></IonIcon>
                <IonGrid>
                    <IonRow className="d-flex justify-content-center mb-2">
                        <IonCol sizeMd="8" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <IonLabel position="stacked" style={{ textTransform:'capitalize'}}>Title for the {resType} <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="title_line"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput type="text"
                                        ref={inputRef}
                                        onIonChange={(e: any) => {
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
                        <IonCol sizeMd="12" sizeXs="12">
                            <div>
                            { fileProgress && toArray(fileProgress).length > 0 && // mediaInfo.progressInfos && mediaInfo.progressInfos.length > 0 &&
                                toArray(fileProgress).map((progressInfo: any, index: number) => {
                                    // let progressInfo: any = fileProgress[key]; 
                                    // console.log(progressInfo);
                                    return ( 
                                        <div className="text-center mt-4" key={index}>
                                            {progressInfo && <p className="mb-0">
                                                <i className="fa fa-paperclip" aria-hidden="true"></i> {progressInfo.file.name}
                                                { progressInfo.percentage < 100 && <IonButton className="ml-3 mt-neg-4" size="small" color="danger" onClick={() => axiosCancelFn(source)}>Cancel</IonButton> }
                                            </p>}
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol size="10" sizeMd="11">
                                                        <IonProgressBar className="pt-2" color="primary" value={progressInfo.percentage/100}></IonProgressBar>
                                                    </IonCol>
                                                    <IonCol className="p-0" size="2" sizeMd="1">
                                                        <IonLabel>{`${progressInfo.percentage}%`}</IonLabel>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    )
                                } 
                            )}
                            </div>
                            
                            { resType === 'document' && fileProgress && (toArray(fileProgress).length === 0 || toArray(fileProgress)[0].percentage === 100) &&
                            <div className="d-flex justify-content-center">
                                <IonButton color="greenbg" shape="round" onClick={() => takePhoto(uploadCameraPhotoFn)} disabled={getValues('title_line').length <=2}>
                                    Take Photo 
                                </IonButton>
                                <input id="documentFile" type="file" name="imageFile" hidden multiple
                                        accept={lfConfig.acceptedDocumentTypes.toString()}
                                        ref={fileDocInputRef}
                                        onChange={(e) => { setmSelected('document'); handleFileChange(e, 'document');   }} />
                                <IonButton color="greenbg" shape="round" onClick={()=> {
                                    if(fileDocInputRef && fileDocInputRef.current){
                                        fileDocInputRef.current.click();
                                    }
                                }} disabled={getValues('title_line').length <=2}>
                                    Browse
                                </IonButton>
                            </div>}

                            { resType === 'audio' && fileProgress && (toArray(fileProgress).length === 0 || toArray(fileProgress)[0].percentage === 100) &&
                            <div className="d-flex justify-content-center">
                                <input id="audioFile" type="file" name="imageFile" hidden multiple
                                    accept={lfConfig.acceptedAudioTypes.toString()}
                                    ref={fileAudInputRef}
                                    onChange={(e) => { setmSelected('audio'); handleFileChange(e, 'audio');  }} />
                                <IonButton color="greenbg" shape="round" onClick={()=> {
                                    if(fileAudInputRef && fileAudInputRef.current){
                                        fileAudInputRef.current.click();
                                    }
                                }} disabled={getValues('title_line').length <=2}>
                                    Browse
                                </IonButton>
                            </div>}

                            { resType === 'video' && fileProgress && (toArray(fileProgress).length === 0 || toArray(fileProgress)[0].percentage === 100) &&
                            <div className="d-flex justify-content-center">
                                <input id="videoFile" type="file" name="videoFile" hidden multiple
                                        // accept={lfConfig.acceptedVideoTypes.toString()}
                                        accept="video/mp4,video/x-m4v,video/*"
                                        ref={fileVidInputRef}
                                        onChange={(e) => { setmSelected('video'); handleFileChange(e, 'video');  }} />
                                <IonButton color="greenbg" shape="round" onClick={()=> {
                                    if(fileVidInputRef && fileVidInputRef.current){
                                        fileVidInputRef.current.click();
                                    }
                                }} disabled={getValues('title_line').length <=2}>
                                    Browse
                                </IonButton>
                            </div>}

                        </IonCol>
                    </IonRow>
                       
                </IonGrid>
            </IonContent> 
        </form> 
    </>);
};
  
export default memo(LocalQuoteUpload);