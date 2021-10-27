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
    IonProgressBar,
    IonGrid,
    IonActionSheet
} from '@ionic/react';
import { cameraOutline, ellipsisHorizontalOutline, close } from 'ionicons/icons';  
import React, { useState, useCallback, useRef} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toArray } from 'lodash';
import '../LocalQuotes.scss';

import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import QuotationStepInd from './QuotationStepInd';
import { useCameraPhoto } from '../../../../hooks/useCameraPhoto';

let cancelToken = axios.CancelToken;
let source = cancelToken.source();

let initialValues = {
    isOpen: false,
    title: '',
    actionType: '', // new or edit
    memId: '',
    frmId: ''
};

let initPreviewValues ={
    isOpen: false,
    memID: '',
    prID: ''
}

const QQMedia: React.FC = () => { 
    const dispatch = useDispatch();
    const { takePhoto } = useCameraPhoto();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const quote = useSelector( (state:any) => state.qq.quotation);
    const fileProgress = useSelector( (state:any) => state.qq.fileProgress);
    const [mSelected, setmSelected] = useState<string>('document');

    const [showDocActSheet, setShowDocActSheet] = useState(false);
    const [showAudActSheet, setShowAudActSheet] = useState(false);
    const [showVidActSheet, setShowVidActSheet] = useState(false);
    const [showImageModal, setShowImageModal] = useState(initialValues);
    const [resPreviewModal, setResPreviewModal] = useState(initPreviewValues);
    const [addQQ, setAddQQ] = useState({ status: false, memID: '', ID: '' });
    const { basename } = lfConfig;
    let { id, mem_id, rfqType, quote_id } = useParams<any>();
    const fileDocInputRef = useRef<HTMLInputElement>(null);
    const fileAudInputRef = useRef<HTMLInputElement>(null);
    const fileVidInputRef = useRef<HTMLInputElement>(null);
    const resTypeText = rfqType ? rfqType.charAt(0).toUpperCase() + rfqType.slice(1): '';

    // For Server Side file delete
    const onRemoveCbFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(qqActions.setSQ({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setAddQQ]);
    const removeQQResource = (attach_id: number) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'qq_upload_delete',
            memID: authUser.ID,
            repID: authUser.repID,
            rfqType: rfqType,
            qqType: 'seller',
            resType: mSelected? mSelected: '',
            formID: id,
            attach_id: attach_id
        };
        CoreService.onPostFn('qq_update', fd, onRemoveCbFn);
    }

    // Single File Type check
    const isValidFileType = (fileType: string, resType: string): boolean => {
        let result = false;
        if( ['document', 'article'].includes(resType) ){ 
            result = lfConfig.acceptedDocumentTypes.includes(fileType);
        }else if( ['audio'].includes(resType) ){
            result = lfConfig.acceptedAudioTypes.includes(fileType);
        }else if( ['video'].includes(resType) ){
            result = lfConfig.acceptedVideoTypes.includes(fileType);
        }
        return result;
    };

    // Multiple File Type Check
    const checkFileTypes = (files: any, qqResType: string) => {
        let flag = true; // console.log(files.length);
        for (let i = 0; i < files.length; i++) { 
            const file = files[i]; 
            if (file && !isValidFileType(file.type, qqResType)) {
                let msg = '';
                if( ['document','article'].includes(qqResType) ){
                    msg = `Only ${lfConfig.acceptedDocTypes} these type are allowed`;
                }else if(qqResType === 'audio'){
                    msg = `Only ${lfConfig.acceptedAudTypes} these type are allowed`;
                }else if(qqResType === 'video'){
                    msg = `Only ${lfConfig.acceptedVidTypes} these type are allowed`;
                }
                dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: msg }));
                return false;
            }
        }
        return flag;
    }
    // Single File Size Check
    const isAllowedFilesize = (filesize: number, resType: string): boolean => {
        let result = false;
        if( ['document', 'article'].includes(resType) ){
            return +(lfConfig.acceptedQQDocSize) > filesize;
        }else if( ['audio'].includes(resType) ){
            return +(lfConfig.acceptedQQAudSize) > filesize;
        }else if( ['video'].includes(resType) ){
            return +(lfConfig.acceptedQQVidSize) > filesize;
        }
        return result;
    };
    
    // Multiple File Size Check
    const checkFileSizes = (files: any, qqResType: string) => {
        let flag = true; // console.log(files.length);
        let filesize = 0;

        for (let i = 0; i < files.length; i++) { 
            const file = files[i];  // console.log(file.name+"=="+file.size);
            filesize += file.size; 
        }
        if (filesize && !isAllowedFilesize(filesize, qqResType)) {
            let msg = '';
            if( filesize > 0 ){
                if( ['document','article'].includes(qqResType? qqResType: '') ){
                    msg = `Only less than ${lfConfig.acceptedQQDocSizeMB} size is allowed`;
                }else if(qqResType === 'audio'){
                    msg = `Only less than ${lfConfig.acceptedQQAudSizeMB} size is allowed`;
                }else if(qqResType === 'video'){
                    msg = `Only less than ${lfConfig.acceptedQQVidSizeMB} size is allowed`;
                }
            }else{
                msg = `Please attach a valid file`;
            }
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: msg }));
            return false;
        }
        return flag;
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
                        
                    if(file){
                        const fd = new FormData();
                        fd.append('memID', authUser.ID);
                        fd.append('repID', authUser.repID);
                        fd.append('formID', id);
                        fd.append('action', 'qq_upload' );
                        fd.append('rfqType', rfqType? rfqType: '' );
                        fd.append('qqType', 'seller' );
                        fd.append('resType', qqResType? qqResType: '' );
                        fd.append('dataFile', file); // console.log(file);
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
                                    dispatch(qqActions.setSQ({ data: res.data }));
                                    setAddQQ({ status: true, memID: res.data.mem_id, ID: res.data.id  });
                                    // Need to reset once upload queues done
                                    dispatch(qqActions.fileProgress({ data: {} }));
                                }
                            }
                            dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
                        })
                        .catch((err: any) => {
                            if(axios.isCancel(err)){ 
                                console.log("post Request canceled'");
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

    // Upload Camera Picture callback
    const uploadCameraPhotoCbFn = useCallback((res:any)=> {
        if(res.status === 'SUCCESS'){
            dispatch(qqActions.setQQ({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    },[dispatch]);
    // Upload Camera Picture
    const uploadCameraPhotoFn = (u8Image: any) => {
        if(u8Image){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const fileName = new Date().getTime() + '.jpg';
            const fd = new FormData();
            fd.append("dataFile", new Blob([ u8Image ], {type: "image/jpg"}), fileName);
            fd.append('memId', authUser.ID);
            fd.append('repId', authUser.repID);
            fd.append('formId', id? id: '');
            fd.append('qqType', 'seller' );
            fd.append('action', 'localquote' );
            CoreService.onUploadFn('file_upload', fd, uploadCameraPhotoCbFn);
        }
    }    

    // if( addQQ.status  ){
    //     return <Redirect to={`/layout/quotation/${rfqType}/${id}/${mem_id}/${quote_id}/3`} />;
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
                                <span>Upload {resTypeText} Documents</span>
                            </IonCardTitle>
                            <IonCardSubtitle className="text-center">
                                <IonText>Only {lfConfig.acceptedDocTypes} these types are allowed.</IonText>
                            </IonCardSubtitle>
                                   
                            <IonList className="text-center">
                                { quote && Object.keys(quote).length > 0 && Object.keys(quote.attachments.document).length > 0 && 
                                    toArray(quote.attachments.document).map((attach: any, index: number) => { 
                                    return (<IonItem className="p-0 text-center mx-auto" lines="none" key={index}>
                                    <IonLabel className="ion-text-wrap">
                                        <i className="fa fa-paperclip pr-3" aria-hidden="true"></i> {attach.uploaded_name}
                                        <IonButton className="pl-3" size="small" color="danger" onClick={() => removeQQResource(attach.id)}> Remove</IonButton>
                                    </IonLabel>
                                </IonItem>)} )};
                                { fileProgress && (toArray(fileProgress).length === 0 || toArray(fileProgress)[0].percentage === 100) &&  
                                <IonItem className="profile-logo-wrap p-0" lines="none">
                                    <input id="documentFile" type="file" name="imageFile" hidden multiple
                                        accept={lfConfig.acceptedDocumentTypes.toString()}
                                        ref={fileDocInputRef}
                                        onChange={(e) => { setmSelected('document'); handleFileChange(e, 'document');   }} />
                                    <IonButton  color="warning" size="large" className="ion-margin-top mt-4 mb-3 mx-auto" type="button" onClick={ () => setShowDocActSheet(true) } >
                                        Add Document
                                    </IonButton>
                                </IonItem>}
                                
                            </IonList>
                            { mSelected === 'document' && fileProgress && toArray(fileProgress).length > 0 && 
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
                                                    <IonCol size="10" sizeMd="10">
                                                        <IonProgressBar className="pt-2" color="primary" value={progressInfo.percentage/100}></IonProgressBar>
                                                    </IonCol>
                                                    <IonCol className="p-0" size="2" sizeMd="2">
                                                        <IonLabel>{`${progressInfo.percentage}%`}</IonLabel>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    )
                                } 
                            )}
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol>
                    <IonCard className="card-center mb-2">
                        <IonCardContent>
                            <IonCardTitle className="text-center mb-3 card-custom-title">
                                <span>Upload {resTypeText} Audios</span>
                            </IonCardTitle>
                            <IonCardSubtitle className="text-center">
                                <IonText>Only {lfConfig.acceptedAudTypes} these types are allowed.</IonText>
                            </IonCardSubtitle>
                                   
                            <IonList className="text-center">
                                { quote && Object.keys(quote).length > 0 && Object.keys(quote.attachments.audio).length > 0 && 
                                    toArray(quote.attachments.audio).map((attach: any, index: number) => { 
                                    return (<IonItem className="p-0 text-center mx-auto" lines="none" key={index}>
                                    <IonLabel className="ion-text-wrap">
                                        <i className="fa fa-paperclip pr-3" aria-hidden="true"></i> {attach.uploaded_name}
                                        <IonButton className="pl-3" size="small" color="danger" onClick={() => removeQQResource(attach.id)}> Remove</IonButton>
                                    </IonLabel>
                                </IonItem>)} )};
                                { fileProgress && (toArray(fileProgress).length === 0 || toArray(fileProgress)[0].percentage === 100) &&  
                                <IonItem className="profile-logo-wrap p-0" lines="none">
                                    <input id="audioFile" type="file" name="imageFile" hidden multiple
                                        accept={lfConfig.acceptedAudioTypes.toString()}
                                        ref={fileAudInputRef}
                                        onChange={(e) => { setmSelected('audio'); handleFileChange(e, 'audio');   }} />
                                    <IonButton  color="warning" size="large" className="ion-margin-top mt-4 mb-3 mx-auto" type="button" onClick={ () => setShowAudActSheet(true) } >
                                        Add Audio
                                    </IonButton>
                                </IonItem>}
                                
                            </IonList>
                            { mSelected === 'audio' && fileProgress && toArray(fileProgress).length > 0 && 
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
                                                    <IonCol size="10" sizeMd="10">
                                                        <IonProgressBar className="pt-2" color="primary" value={progressInfo.percentage/100}></IonProgressBar>
                                                    </IonCol>
                                                    <IonCol className="p-0" size="2" sizeMd="2">
                                                        <IonLabel>{`${progressInfo.percentage}%`}</IonLabel>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    )
                                } 
                            )}
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol>
                    <IonCard className="card-center mb-2">
                        <IonCardContent>
                            <IonCardTitle className="text-center mb-3 card-custom-title">
                                <span>Upload {resTypeText} Videos</span>
                            </IonCardTitle>
                            <IonCardSubtitle className="text-center">
                                <IonText>Only {lfConfig.acceptedVidTypes} these types are allowed.</IonText>
                            </IonCardSubtitle>
                                   
                            <IonList className="text-center">
                                { quote && Object.keys(quote).length > 0 && Object.keys(quote.attachments.video).length > 0 && 
                                    toArray(quote.attachments.video).map((attach: any, index: number) => { 
                                    return (<IonItem className="p-0 text-center mx-auto" lines="none" key={index}>
                                    <IonLabel className="ion-text-wrap">
                                        <i className="fa fa-paperclip pr-3" aria-hidden="true"></i> {attach.uploaded_name}
                                        <IonButton className="pl-3" size="small" color="danger" onClick={() => removeQQResource(attach.id)}> Remove</IonButton>
                                    </IonLabel>
                                </IonItem>)} )};
                                { fileProgress && (toArray(fileProgress).length === 0 || toArray(fileProgress)[0].percentage === 100) &&  
                                <IonItem className="profile-logo-wrap p-0" lines="none">
                                    <input id="videoFile" type="file" name="imageFile" hidden multiple
                                        // accept={lfConfig.acceptedVideoTypes.toString()}
                                        accept="video/mp4,video/x-m4v,video/*"
                                        ref={fileVidInputRef}
                                        onChange={(e) => { setmSelected('video'); handleFileChange(e, 'video');   }} />
                                    <IonButton  color="warning" size="large" className="ion-margin-top mt-4 mb-3 mx-auto" type="button" onClick={ () => setShowVidActSheet(true) } >
                                        Add Video
                                    </IonButton>
                                </IonItem>}
                                
                            </IonList>
                            { mSelected === 'video' && fileProgress && toArray(fileProgress).length > 0 && 
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
                                                    <IonCol size="10" sizeMd="10">
                                                        <IonProgressBar className="pt-2" color="primary" value={progressInfo.percentage/100}></IonProgressBar>
                                                    </IonCol>
                                                    <IonCol className="p-0" size="2" sizeMd="2">
                                                        <IonLabel>{`${progressInfo.percentage}%`}</IonLabel>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </div>
                                    )
                                } 
                            )}
                        </IonCardContent>
                    </IonCard>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                { fileProgress && toArray(fileProgress).length === 0 && <IonButton color="greenbg"
                    routerLink={`${basename}/layout/quotation/${rfqType}/${id}/${mem_id}/${quote_id}/3`}
                    className="ion-margin-top mt-4 mb-3 float-right">
                    Next
                </IonButton>}
                </IonCol>
            </IonRow>
        </IonGrid>        
        <IonActionSheet
            isOpen={showDocActSheet}
            onDidDismiss={() => setShowDocActSheet(false)}
            cssClass=''
            buttons={[{
                text: 'Take Photo',
                icon: cameraOutline,
                handler: () => {
                    console.log('Take Photo clicked');
                    takePhoto(uploadCameraPhotoFn);
                }
            }, {
                text: 'Browse',
                icon: ellipsisHorizontalOutline,
                handler: () => {
                    console.log('Browse clicked');
                    // onClick={ () => fileDocInputRef.current!.click() }
                    fileDocInputRef.current!.click();
                }
            }, {
                text: 'Cancel',
                icon: close,
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]}
        >
        </IonActionSheet>
        <IonActionSheet
            isOpen={showAudActSheet}
            onDidDismiss={() => setShowAudActSheet(false)}
            cssClass=''
            buttons={[{
                text: 'Record Audio',
                icon: cameraOutline,
                handler: () => {
                    console.log('Record Audio clicked');
                    // uploadRecoredAudioFn();
                }
            }, {
                text: 'Browse',
                icon: ellipsisHorizontalOutline,
                handler: () => {
                    console.log('Browse Audio clicked');
                    // onClick={ () => fileDocInputRef.current!.click() }
                    fileAudInputRef.current!.click();
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
                    console.log('Record Video clicked');
                    // uploadRecoredVideoFn();
                }
            }, {
                text: 'Browse',
                icon: ellipsisHorizontalOutline,
                handler: () => {
                    console.log('Browse Video clicked');
                    // onClick={ () => fileDocInputRef.current!.click() }
                    fileVidInputRef.current!.click();
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
  