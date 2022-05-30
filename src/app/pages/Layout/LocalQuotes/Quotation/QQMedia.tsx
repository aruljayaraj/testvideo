import {
    IonItem,
    IonModal,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonRow,
    IonCol,
    IonButton,
    IonCardSubtitle,
    IonText,
    IonLabel,
    IonGrid,
    IonActionSheet
} from '@ionic/react';
import { cameraOutline, ellipsisHorizontalOutline, close, micOutline } from 'ionicons/icons';  
import { MediaCapture, MediaFile, CaptureAudioOptions, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture';
import React, { useState, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toArray } from 'lodash';
import { File, DirectoryEntry } from "@ionic-native/file";
import { Capacitor } from "@capacitor/core";
import { nanoid } from 'nanoid';
import '../LocalQuotes.scss';

import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import QuotationStepInd from './QuotationStepInd';
import LocalQuoteUpload from '../../../../components/Modal/Record/LocalQuoteUpload';
import RecordAudio from '../../../../components/Modal/Record/RecordAudio';
import RecordVideo from '../../../../components/Modal/Record/RecordVideo';

let initialValues = {
    isOpen: false,
    title: '',
    actionType: '', // new or edit
    resType: '',
    qqType: 'seller',
    memId: '',
    repId: '',
    frmId: ''
};


const QQMedia: React.FC = () => { 
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const quote = useSelector( (state:any) => state.qq.quotation);
    const fileProgress = useSelector( (state:any) => state.qq.fileProgress);
    const [showAudActSheet, setShowAudActSheet] = useState(false);
    const [showVidActSheet, setShowVidActSheet] = useState(false);
    const [showLocalQuoteUploadModal, setShowLocalQuoteUploadModal] = useState(initialValues);
    const [showRecordAudioModal, setShowRecordAudioModal] = useState(initialValues);
    const [showRecordVideoModal, setShowRecordVideoModal] = useState(initialValues);
    // const [addQQ, setAddQQ] = useState({ status: false, memID: '', ID: '' });
    const { basename } = lfConfig;
    let { id, mem_id, quote_id } = useParams<any>();

    // For Server Side file delete
    const onRemoveCbFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(qqActions.setSQ({ data: res.data }));
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
            qqType: 'seller',
            // resType: mSelected? mSelected: '',
            formID: id,
            attach_id: attach_id
        };
        CoreService.onPostFn('qq_update', fd, onRemoveCbFn);
    }

    const uploadDocumentFn = async(title: string, actionType: string, resType: string) => {
        setShowLocalQuoteUploadModal({ 
            ...showLocalQuoteUploadModal, 
            isOpen: true,
            title: title,
            actionType: actionType,
            qqType: 'seller',
            resType: resType,
            memId: authUser.ID,
            repId: authUser.repID,
            frmId: id? id: ''
        });
    }

    // Record Audio and Upload
    const uploadRecoredAudioFn = async(title: string, actionType: string) => {
        if(Capacitor.isNativePlatform()){  // For Real Devices ios, android
             dispatch(uiActions.setShowLoading({ loading: true }));
             let options: CaptureAudioOptions = { limit: 1, duration: 30 };
             const capture:any = await MediaCapture.captureAudio(options);
             let media: any = (capture[0] as MediaFile);
             // alert((capture[0] as MediaFile).fullPath);
             let resolvedPath: DirectoryEntry;
             let path = media.fullPath.substring(0, media.fullPath.lastIndexOf("/"));
             if (Capacitor.getPlatform() === "ios") {
                 resolvedPath = await File.resolveDirectoryUrl("file://" + path);
             } else {
                 resolvedPath = await File.resolveDirectoryUrl(path);
             }
             console.log(media);
             // console.log(resolvedPath);
             return File.readAsArrayBuffer(resolvedPath.nativeURL, media.name).then(
             // return File.readAsDataURL(directoryPath.trim()+"/", fileName.trim()).then(
                 (buffer: any) => { // console.log("meow"); console.log(buffer);
                   // get the buffer and make a blob to be saved
                   let imgBlob = new Blob([buffer], {
                     type: media.type,
                   });
                   // alert(JSON. stringify(imgBlob));
                   console.log(imgBlob);
                   const fd = new FormData();
                   fd.append("dataFile", imgBlob, nanoid()+".mp3");
                   fd.append('memId', authUser.ID);
                   fd.append('repId', authUser.repID);
                   fd.append('formId', id? id: '');
                   fd.append('action', 'localquote');
                   fd.append('resType', 'audio');
                   fd.append('qqType', 'seller');
                   CoreService.onUploadFn('record_upload', fd, onCallbackFn);
                 },
                 (error: any) => {
                     dispatch(uiActions.setShowLoading({ loading: false }));
                     console.log(error);
                 }
             )
         }else{ // For web, browser
            setShowRecordAudioModal({ 
                ...showRecordAudioModal, 
                isOpen: true,
                title: title,
                actionType: actionType,
                resType: 'audio',
                qqType: 'seller',
                memId: authUser.ID,
                repId: authUser.repID,
                frmId: id? id: ''
            }); // console.log(authUser);
        }    
            
    }
 
     const onCallbackFn = useCallback((res: any) => { // console.log(res);
         if(res.status === 'SUCCESS'){
             dispatch(qqActions.setQQ({ data: res.data }));
         }
         dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
         dispatch(uiActions.setShowLoading({ loading: false }));
     }, [dispatch]);
     // Record Video and Upload
     const uploadRecoredVideoFn = async (title: string, actionType: string) => { // console.log("Meow 123");
        if(Capacitor.isNativePlatform()){  // For Real Devices ios, android
             dispatch(uiActions.setShowLoading({ loading: true }));
             let options: CaptureVideoOptions = { limit: 1, duration: 30 };
             let capture:any = await MediaCapture.captureVideo(options);
             let media: any = (capture[0] as MediaFile);
             // alert((capture[0] as MediaFile).fullPath);
             let resolvedPath: DirectoryEntry;
             let path = media.fullPath.substring(0, media.fullPath.lastIndexOf("/"));
             if (Capacitor.getPlatform() === "ios") {
                 resolvedPath = await File.resolveDirectoryUrl("file://" + path);
             } else {
                 resolvedPath = await File.resolveDirectoryUrl(path);
             }
             // console.log(resolvedPath);
             console.log(media);
             return File.readAsArrayBuffer(resolvedPath.nativeURL, media.name).then(
                 (buffer: any) => { console.log(buffer);
                   // get the buffer and make a blob to be saved
                   let imgBlob = new Blob([buffer], {
                     type: media.type,
                   });
                   // setFileData(imgBlob);
                   // alert(imgBlob);
                   console.log(imgBlob);
                   const fd = new FormData();
                   fd.append("dataFile", imgBlob, nanoid()+".mp4");
                   fd.append('memId', authUser.ID);
                   fd.append('repId', authUser.repID);
                   fd.append('formId', id? id: '');
                   fd.append('action', 'localquote');
                   fd.append('resType', 'video');
                   fd.append('qqType', 'seller');
                   CoreService.onUploadFn('record_upload', fd, onCallbackFn);
                 },
                 (error: any) => {
                     dispatch(uiActions.setShowLoading({ loading: false }));
                     console.log(error);
                 }
               )
             // VideoRecorder.destroy();
         }else{ // For web, browser
             setShowRecordVideoModal({ 
                 ...showRecordVideoModal, 
                 isOpen: true,
                 title: title,
                 actionType: actionType,
                 qqType: 'seller',
                 resType: 'video',
                 memId: authUser.ID,
                 repId: authUser.repID,
                 frmId: id? id: ''
            }); // console.log(authUser);
        }
    };

    // if( addQQ.status  ){
    //     return <Redirect to={`/layout/quotation/${id}/${mem_id}/${quote_id}/3`} />;
    // }
    
    return (<>
        { quote && Object.keys(quote).length > 0 && <>
        <QuotationStepInd />
        <IonGrid>
            <IonRow className="mt-4 mb-4">
                <IonCol>
                    <IonCard className="card-center mb-2">
                        <IonCardContent>
                            <IonCardTitle className="text-center mb-3 card-custom-title">
                                <span>Upload Documents</span>
                            </IonCardTitle>
                            <IonCardSubtitle className="text-center">
                                <IonText>Only {lfConfig.acceptedDocTypes} these types are allowed.</IonText>
                            </IonCardSubtitle>
                                   
                            <IonList className="text-center">
                                { quote && Object.keys(quote).length > 0 && Object.keys(quote.attachments.document).length > 0 && 
                                    toArray(quote.attachments.document).map((attach: any, index: number) => { 
                                    return (<IonItem className="p-0 text-center mx-auto" lines="none" key={index}>
                                    <IonLabel className="ion-text-wrap">
                                        <i className="fa fa-paperclip pr-3" aria-hidden="true"></i> {attach.upload_title? attach.upload_title: attach.uploaded_name}
                                        <IonButton className="pl-3" size="small" color="danger" onClick={() => removeQQResource(attach.id)}> Remove</IonButton>
                                    </IonLabel>
                                </IonItem>)} )}
                                <IonItem className="profile-logo-wrap p-0" lines="none">
                                    <IonButton  color="warning" size="large" className="ion-margin-top mt-4 mb-3 mx-auto" type="button" onClick={() => uploadDocumentFn('Upload Document', 'localquote', 'document')} >
                                        Add Document
                                    </IonButton>
                                </IonItem>
                                
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol>
                    <IonCard className="card-center mb-2">
                        <IonCardContent>
                            <IonCardTitle className="text-center mb-3 card-custom-title">
                                <span>Upload Audios</span>
                            </IonCardTitle>
                            <IonCardSubtitle className="text-center">
                                <IonText>Only {lfConfig.acceptedAudTypes} these types are allowed.</IonText>
                            </IonCardSubtitle>
                                   
                            <IonList className="text-center">
                                { quote && Object.keys(quote).length > 0 && Object.keys(quote.attachments.audio).length > 0 && 
                                    toArray(quote.attachments.audio).map((attach: any, index: number) => { 
                                    return (<IonItem className="p-0 text-center mx-auto" lines="none" key={index}>
                                    <IonLabel className="ion-text-wrap">
                                        <i className="fa fa-paperclip pr-3" aria-hidden="true"></i> {attach.upload_title? attach.upload_title: attach.uploaded_name}
                                        <IonButton className="pl-3" size="small" color="danger" onClick={() => removeQQResource(attach.id)}> Remove</IonButton>
                                    </IonLabel>
                                </IonItem>)} )}
                                <IonItem className="profile-logo-wrap p-0" lines="none">
                                    <IonButton  color="warning" size="large" className="ion-margin-top mt-4 mb-3 mx-auto" type="button" onClick={ () => setShowAudActSheet(true) } >
                                        Add Audio
                                    </IonButton>
                                </IonItem>
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol>
                    <IonCard className="card-center mb-2">
                        <IonCardContent>
                            <IonCardTitle className="text-center mb-3 card-custom-title">
                                <span>Upload Videos</span>
                            </IonCardTitle>
                            <IonCardSubtitle className="text-center">
                                <IonText>Only {lfConfig.acceptedVidTypes} these types are allowed.</IonText>
                            </IonCardSubtitle>
                                   
                            <IonList className="text-center">
                                { quote && Object.keys(quote).length > 0 && Object.keys(quote.attachments.video).length > 0 && 
                                    toArray(quote.attachments.video).map((attach: any, index: number) => { 
                                    return (<IonItem className="p-0 text-center mx-auto" lines="none" key={index}>
                                    <IonLabel className="ion-text-wrap">
                                        <i className="fa fa-paperclip pr-3" aria-hidden="true"></i> {attach.upload_title? attach.upload_title: attach.uploaded_name}
                                        <IonButton className="pl-3" size="small" color="danger" onClick={() => removeQQResource(attach.id)}> Remove</IonButton>
                                    </IonLabel>
                                </IonItem>)} )}
                                <IonItem className="profile-logo-wrap p-0" lines="none">
                                    <IonButton  color="warning" size="large" className="ion-margin-top mt-4 mb-3 mx-auto" type="button" onClick={ () => setShowVidActSheet(true) } >
                                        Add Video
                                    </IonButton>
                                </IonItem>
                                
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                { fileProgress && toArray(fileProgress).length === 0 && <IonButton color="greenbg"
                    routerLink={`${basename}/layout/quotation/${id}/${mem_id}/${quote_id}/3`}
                    className="ion-margin-top mt-4 mb-3 float-right">
                    Next
                </IonButton>}
                </IonCol>
            </IonRow>
        </IonGrid>
        <IonModal backdropDismiss={false} isOpen={showLocalQuoteUploadModal.isOpen} className='view-modal-wrap'>
            { showLocalQuoteUploadModal.isOpen === true &&  <LocalQuoteUpload
            showLocalQuoteUploadModal={showLocalQuoteUploadModal}
            setShowLocalQuoteUploadModal={setShowLocalQuoteUploadModal} 
           /> }
        </IonModal>
        <IonModal backdropDismiss={false} isOpen={showRecordAudioModal.isOpen} className='view-modal-wrap'>
            { showRecordAudioModal.isOpen === true &&  <RecordAudio
            showRecordAudioModal={showRecordAudioModal}
            setShowRecordAudioModal={setShowRecordAudioModal} 
           /> }
        </IonModal>
        <IonModal backdropDismiss={false} isOpen={showRecordVideoModal.isOpen} className='view-modal-wrap'>
            { showRecordVideoModal.isOpen === true &&  <RecordVideo
            showRecordVideoModal={showRecordVideoModal}
            setShowRecordVideoModal={setShowRecordVideoModal} 
           /> }
        </IonModal>     
        
        <IonActionSheet
            isOpen={showAudActSheet}
            onDidDismiss={() => setShowAudActSheet(false)}
            cssClass=''
            buttons={[{
                cssClass: 'cursor',
                text: 'Record Audio',
                icon: micOutline,
                handler: () => {
                    uploadRecoredAudioFn('Record Audio', 'localquote');
                }
            }, {
                text: 'Browse',
                icon: ellipsisHorizontalOutline,
                handler: () => {
                    uploadDocumentFn('Upload Audio', 'localquote', 'audio');
                }
            }, {
                text: 'Cancel',
                icon: close,
                role: 'cancel',
                handler: () => {
                    // console.log('Cancel clicked');
                }
            }]}
        >
        </IonActionSheet>
        <IonActionSheet
            isOpen={showVidActSheet}
            onDidDismiss={() => setShowVidActSheet(false)}
            cssClass=''
            buttons={[{
                text: 'Record Video',
                icon: cameraOutline,
                handler: () => {
                    uploadRecoredVideoFn('Record Video', 'localquote');
                }
            },  {
                text: 'Browse',
                icon: ellipsisHorizontalOutline,
                handler: () => {
                    uploadDocumentFn('Upload Video', 'localquote', 'video');
                }
            }, {
                text: 'Cancel',
                icon: close,
                role: 'cancel',
                handler: () => {
                    // console.log('Cancel clicked');
                }
            }]}
        >
        </IonActionSheet>
        </>}
        
    </>);
};
  
export default QQMedia;
  