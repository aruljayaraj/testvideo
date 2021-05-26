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
    IonProgressBar
  } from '@ionic/react';
  
import React, { useState, useCallback, useRef} from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../ResourceUpload.scss';

import * as uiActions from '../../../../store/reducers/ui';
import * as resActions from '../../../../store/reducers/dashboard/resource';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import ImageModal from '../../../../components/Image/ImageModal';
import ResStepInd from './ResStepInd';
import ResPreviewModal from './ResPreviewModal';

var CancelToken = axios.CancelToken;
const source = CancelToken.source();

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

const ResMedia: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const resource = useSelector( (state:any) => state.res.resource);
    const [showImageModal, setShowImageModal] = useState(initialValues);
    const [resPreviewModal, setResPreviewModal] = useState(initPreviewValues);
    const [addRes, setAddRes] = useState({ status: false, memID: '', ID: '' });
    // const { apiBaseURL, basename } = lfConfig;
    let { id, res_type } = useParams<any>();
    let acceptedTypes = '';
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [resFile, setResFile] = useState<any>();
    const [uploadProgress, updateUploadProgress] = useState(0);
    // const [imageURI, setImageURI] = useState<string|null>(null);
    const [uploadStatus, setUploadStatus] = useState(false);
    const [uploading, setUploading] = useState(false);
    const resTypeText = res_type ? res_type.charAt(0).toUpperCase() + res_type.slice(1): '';

    const previewModalFn = () => {
        setResPreviewModal({ 
            ...showImageModal,
            isOpen: true,
            memID: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            prID: (resource && Object.keys(resource).length > 0)? resource.id: ''
        });
    }
    // const resImage = ( resource && Object.keys(resource).length > 0 && resource.filename) ? `${apiBaseURL}uploads/press_release/${resource.filename}` : `${basename}/assets/img/placeholder.png`;
    
    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddRes({ status: true, memID: res.data.mem_id, ID: res.data.id  });
            dispatch(resActions.setResource({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setAddRes]);

    const onSubmit = (e: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'res_activate',
            memID: authUser.ID,
            resType: res_type,
            formID: id,
            isActive: 1
        };
        CoreService.onPostFn('res_update', fd, onCallbackFn);
    }

    // For Server Side file delete
    const onRemoveCbFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(resActions.setResource({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setAddRes]);
    const removeResource = () => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'res_upload_delete',
            memID: authUser.ID,
            resType: res_type,
            formID: id
        };
        CoreService.onPostFn('res_update', fd, onRemoveCbFn);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files; // console.log(files);
        if( files && files.length > 0 ){
            const file = files.item(0); 
            setResFile(file);
            const resType = res_type? res_type : ''; 
            if (file && !isValidFileType(file.type, resType)) { console.log(file.type);
                let msg = '';
                if( ['document','article'].includes(res_type? res_type: '') ){
                    msg = `Only ${lfConfig.acceptedDocTypes} these type are allowed`;
                }else if(res_type === 'audio'){
                    msg = `Only ${lfConfig.acceptedAudTypes} these type are allowed`;
                }else if(res_type === 'video'){
                    msg = `Only ${lfConfig.acceptedVidTypes} these type are allowed`;
                }
                dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: msg }));
                return;
            }else { 
                if (file && !isAllowedFilesize(file.size, resType)) { console.log(file.type);
                    let msg = '';
                    if( file.size > 0 ){
                        if( ['document','article'].includes(res_type? res_type: '') ){
                            msg = `Only less than ${lfConfig.acceptedDocSizeMB} size is allowed`;
                        }else if(res_type === 'audio'){
                            msg = `Only less than ${lfConfig.acceptedAudSizeMB} size is allowed`;
                        }else if(res_type === 'video'){
                            msg = `Only less than ${lfConfig.acceptedVidSizeMB} size is allowed`;
                        }
                    }else{
                        msg = `Please attach valid file`;
                    }
                    dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: msg }));
                    return;
                }else{
                    event.preventDefault();
                    if(file){
                        setUploading(true);
                        const fd = new FormData();
                        fd.append('memID', authUser.ID);
                        fd.append('formID', id? id: '');
                        fd.append('action', 'res_upload' );
                        fd.append('resType', res_type? res_type: '' );
                        fd.append('dataFile', file); // console.log(file);
                        // dispatch(uiActions.setShowLoading({ loading: true, msg: `0% Uploading...` }));
                        axios({
                            method: 'post',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            data: fd,
                            url: `v2/res_update`,
                            onUploadProgress: (ev: ProgressEvent) => {
                                const progress = ev.loaded / ev.total * 100; console.log("Progress = " +progress);
                                const percent = Math.round(progress);
                                // dispatch(uiActions.setShowLoading({ loading: true, msg: `${percent}% Uploading...` }));
                                updateUploadProgress(Math.round(percent));
                            },
                            cancelToken: source.token
                        })
                        .then((resp: any) => {
                            const res = resp.data;
                            setUploadStatus(true);
                            setUploading(false);
                            updateUploadProgress(0);
                            setResFile('');
                            if(res.status === 'SUCCESS'){
                                dispatch(resActions.setResource({ data: res.data }));
                            }
                            // dispatch(uiActions.setShowLoading({ loading: false, msg: '' }));
                            dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
                        })
                        .catch((err: any) => {
                            if(axios.isCancel(err)){
                                setUploadStatus(false);
                                setUploading(false);
                                updateUploadProgress(0);
                                setResFile('');
                            }else{
                                console.error(err);
                            }
                        });
                    }else{
                        dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'File should not be empty!' }));
                    }
                }
            }    
        }
    }
    
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

    const isAllowedFilesize = (filesize: number, resType: string): boolean => {
        let result = false;
        if( ['document', 'article'].includes(resType) ){
            return +(lfConfig.acceptedDocSize) > filesize;
        }else if( ['audio'].includes(resType) ){
            return +(lfConfig.acceptedAudSize) > filesize;
        }else if( ['video'].includes(resType) ){
            return +(lfConfig.acceptedVidSize) > filesize;
        }
        return result;
    };

    
    if( res_type && ['document', 'article'].includes(res_type) ){
        acceptedTypes = lfConfig.acceptedDocumentTypes.toString();
    }else if( res_type && ['audio'].includes(res_type) ){
        acceptedTypes = lfConfig.acceptedAudioTypes.toString();
    }else if( res_type && ['video'].includes(res_type) ){
        // acceptedTypes = lfConfig.acceptedVideoTypes.toString();
        acceptedTypes = "video/mp4,video/x-m4v,video/*";
    }

    if( addRes.status  ){
        return <Redirect to={`/layout/resources/${res_type}/`} />;
    }
    
    return (<>
        { resource && Object.keys(resource).length > 0 &&
        <>
        <ResStepInd />
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <IonRow>
                    <IonCol>
                        <IonCardTitle className="text-center mb-3 fs-18">
                            <span>Upload {resTypeText}</span>
                        </IonCardTitle>
                        <IonCardSubtitle className="text-center">
                            { res_type && ['document', 'article'].includes(res_type) &&
                                <IonText>Only {lfConfig.acceptedDocTypes} these types are allowed.</IonText>
                            }
                            { res_type && ['audio'].includes(res_type) &&
                                <IonText>Only {lfConfig.acceptedAudTypes} these types are allowed.</IonText>
                            }
                            { res_type && ['video'].includes(res_type) &&
                                <IonText>Only {lfConfig.acceptedVidTypes} these types are allowed.</IonText>
                            }
                        </IonCardSubtitle>
                        <IonList className="text-center">
                            { !uploading && resource && Object.keys(resource).length > 0 && !resource.filename && <IonItem className="profile-logo-wrap p-0" lines="none">
                                <input id="customImageFile" type="file" name="imageFile" hidden
                                    accept={acceptedTypes}
                                    ref={fileInputRef}
                                    onChange={handleFileChange} />
                                <IonButton  color="warning" size="large" className="ion-margin-top mt-4 mb-3 mx-auto" type="button" onClick={ () => fileInputRef.current!.click() } >
                                    Add {resTypeText}
                                </IonButton>
                            </IonItem>}
                            {uploading && <div className="text-center mt-3">
                                {resFile && <p className="mb-4">
                                    <i className="fa fa-paperclip" aria-hidden="true"></i> {resFile.name}
                                    <IonButton className="ml-3 mt-neg-4" size="small" color="danger" onClick={() => source.cancel('Operation canceled by the user.')}>Cancel</IonButton>
                                </p>}
                                <IonProgressBar color="primary" value={uploadProgress/100}></IonProgressBar>
                                {/* <IonButton className="pl-3"  color="danger" onClick={() => source.cancel('Operation canceled by the user.')}> Remove</IonButton> */}
                                <IonLabel>{`${uploadProgress}% uploading...`}</IonLabel>
                            </div>}
                            { resource && Object.keys(resource).length > 0 && resource.filename && 
                            <IonItem className="p-0 text-center mx-auto" lines="none">
                                <IonLabel>
                                    <i className="fa fa-paperclip pr-3" aria-hidden="true"></i> {resource.uploaded_name}
                                    <IonButton className="pl-3" size="small" color="danger" onClick={removeResource}> Remove</IonButton>
                                </IonLabel>
                            </IonItem>}
                        </IonList>
                    </IonCol>
                    
                </IonRow>
                { resource && Object.keys(resource).length > 0 && resource.filename && 
                <>
                    <IonButton color="warning" 
                        onClick={() => previewModalFn()}
                        className="ion-margin-top mt-4 mb-3 float-left">
                        Preview
                    </IonButton>
                    <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" onClick={onSubmit}>
                        Submit
                    </IonButton>
                </>    
                }
                
            </IonCardContent>
        </IonCard>
        </>}
        <IonModal isOpen={resPreviewModal.isOpen} cssClass='my-custom-class'>
            { resource && Object.keys(resource).length > 0 && resPreviewModal.isOpen === true &&  <ResPreviewModal
            resPreviewModal={resPreviewModal}
            setResPreviewModal={setResPreviewModal}
           /> }
        </IonModal>
    </>);
};
  
export default ResMedia;
  