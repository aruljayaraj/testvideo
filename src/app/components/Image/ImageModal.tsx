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
import React, { useState, useEffect, useRef, useCallback } from "react";
import { close } from 'ionicons/icons';
import { useForm } from "react-hook-form";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch, useSelector } from 'react-redux';

import CoreService from '../../shared/services/CoreService';
import { lfConfig } from '../../../Constants';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../store/reducers/ui';
import * as prActions from '../../store/reducers/dashboard/pr';
import { isPlatform } from '@ionic/react';

// Setting a high pixel ratio avoids blurriness in the canvas crop preview.
const pixelRatio = 4;

function b64ToUint8Array(b64Image: any) {
    var img = atob(b64Image.split(',')[1]);
    var img_buffer = [];
    var i = 0;
    while (i < img.length) {
       img_buffer.push(img.charCodeAt(i));
       i++;
    }
    return new Uint8Array(img_buffer);
 }

interface Props {
    showImageModal: any,
    setShowImageModal: Function,
}
interface ImageData {
    selectedFile: any,
    picURL: string
}

let initialValues = {
    selectedFile: 0,
    picURL: ''
}


const ImageModal: React.FC<Props> = ({ showImageModal, setShowImageModal }) => {
    const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const { handleSubmit} = useForm();
    let { title, actionType, memId, frmId } = showImageModal;
    const [ picture, setPicture ] = useState<ImageData>(initialValues);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { apiBaseURL } = lfConfig;
    const rectTypes = ['rep_logo', 'company_logo'];
    
    let initialCropValues = {
        unit: "px", 
        width: (actionType && rectTypes.includes(actionType) )? 300: 200, 
        height: (actionType && rectTypes.includes(actionType) )? 150: 200, 
        aspect: (actionType && rectTypes.includes(actionType) )? 16/9: 1,
    }

    const imgRef = useRef(null);
    const [crop, setCrop] = useState<any>(initialCropValues);
    const [completedCrop, setCompletedCrop] = useState(null);

    const onLoad = useCallback(img => {
        imgRef.current = img;
    }, []);

    useEffect(() => () => {
        if(picture.picURL && picture.picURL.startsWith("blob")){
            URL.revokeObjectURL(picture.picURL);
            // console.log("Revoked URL: ", picture.picURL);
        }
    }, [picture]);

    /**
     * @param data
     */
    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if( actionType === 'company_logo' ){
                dispatch(repActions.setCompanyProfile({ data: res.data }));
            }else if( actionType === 'rep_profile' || actionType === 'rep_logo' ){
                dispatch(repActions.setRepProfile({ data: res.data }));
            }else if( actionType === 'press_release' ){
                dispatch(prActions.setPressRelease({ data: res.data }));
            } 
            setShowImageModal({ ...showImageModal, isOpen: false });
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        setTimeout( () => {
            dispatch(uiActions.setShowLoading({ loading: false }));
        }, 2000 );
        
    }, [dispatch, setShowImageModal, showImageModal, actionType]);
    const onSubmit = () => {
        console.log(!completedCrop, !imgRef.current, !picture.picURL);
        if (!completedCrop || !imgRef.current || !picture.picURL) { // || !previewCanvasRef.current
            return;
        }
        dispatch(uiActions.setShowLoading({ loading: true }));
        const image: any = imgRef.current;
        const canvas: any = document.createElement('canvas');
        const crop: any = completedCrop;
        
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
    
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
    
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingEnabled = false;
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        var u8Image  = b64ToUint8Array(base64Image);
        const fd = new FormData();
        fd.append("dataFile", new Blob([ u8Image ], {type: "image/jpg"}), picture.selectedFile.name);
        fd.append('memId', memId);
        fd.append('formId', frmId);
        fd.append('action', actionType );
        CoreService.onUploadFn('file_upload', fd, onCallbackFn);
    }

    // Image Delete
    const deleteImageFnCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if( actionType === 'company_logo' ){
                dispatch(repActions.setCompanyProfile({ data: res.data }));
            }else if( actionType === 'rep_profile' || actionType === 'rep_logo' ){
                dispatch(repActions.setRepProfile({ data: res.data }));
            }else if( actionType === 'press_release' ){
                dispatch(prActions.setPressRelease({ data: res.data }));
            } 
            setPicture({
                selectedFile: 0,
                picURL: ''
            });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setPicture, actionType]);
    const deleteImageFn = () => {
        if( !picture.picURL ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const formData = {
                action: 'delete_image',
                formId: frmId,
                memId: memId,
                actionType: actionType
            };
            CoreService.onPostFn('file_upload', formData, deleteImageFnCb);
        }else{
            setPicture({
                selectedFile: 0,
                picURL: ''
            });
        }
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { console.log("Handle Change "+event.target.files);
        const files = event.target.files; // console.log(files);
        if( files && files.length > 0 ){
            const file = files.item(0);
            const pictureURL = URL.createObjectURL(file);
            setPicture({
                selectedFile: file,
                picURL: pictureURL
            });
            // console.log(pictureURL, file);
        }
    }

    let cropTempURL = picture.picURL;
    if( !picture.picURL ){
        if( actionType === 'rep_profile' && repProfile && (Object.keys(repProfile).length > 0 && repProfile.profile_image)){
            cropTempURL = `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.profile_image}`;
        }else if( actionType === 'rep_logo' && repProfile && (Object.keys(repProfile).length > 0 && repProfile.profile_logo)){
            cropTempURL = `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.profile_logo}`;
        }else if( actionType === 'company_logo' && comProfile && (Object.keys(comProfile).length > 0 && comProfile.company_logo)){
            cropTempURL = `${apiBaseURL}uploads/member/${comProfile.mem_id}/${comProfile.company_logo}`;
        }else if( actionType === 'press_release' && pr && (Object.keys(pr).length > 0 && pr.pr_image)){
            cropTempURL = `${apiBaseURL}uploads/member/${pr.pr_mem_id}/${pr.pr_image}`;
        }
    }    

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop') || isPlatform('tablet')? 'end': 'start' }>
                        <IonButton onClick={() => setShowImageModal({
                            ...showImageModal, 
                            isOpen: false
                        })}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (isPlatform('android') || isPlatform('ios')) &&  
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            <strong>Save</strong>
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle> {title}</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
            <IonIcon color="danger" icon={close} slot="icon-only"></IonIcon>
            <IonGrid>

                <IonRow>
                    <IonCol>
                        { !cropTempURL &&
                        <img src={`${basename}/assets/img/placeholder.png`} alt="placeholder" />}
                        { cropTempURL && <>
                            <ReactCrop
                                src={cropTempURL}
                                onImageLoaded={onLoad}
                                crop={crop}
                                minWidth={ (actionType && rectTypes.includes(actionType) )? 300: 200 }
                                minHeight={(actionType && rectTypes.includes(actionType) )? 150: 200 }
                                maxWidth={550}
                                maxHeight={550}
                                onChange={(c: any) => setCrop(c)}
                                onComplete={(c: any) => setCompletedCrop(c)}
                            />
                        </>}
                    </IonCol>
                </IonRow>
                
                <div className="mt-4">           
                    <>
                        { cropTempURL && 
                        <IonButton color="medium" className="ion-margin-top mt-4 mb-3 float-left" onClick={() => deleteImageFn()}>
                            Delete
                        </IonButton>}
                        <div className="float-right">
                            <input id="customImageFile" type="file" name="imageFile" hidden
                                ref={fileInputRef}
                                onChange={handleFileChange} />
                            <IonButton color="warning" className="ion-margin-top mt-4 mb-3" type="button" onClick={ () => fileInputRef.current!.click() } >
                                { !cropTempURL? 'Add': 'Change' } Picture
                            </IonButton>
                            { (isPlatform('desktop') || isPlatform('tablet')) && 
                            <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 pl-2" type="submit" >
                                Save
                            </IonButton>}
                        </div> 
                    </>
                </div>
                </IonGrid>
            </IonContent> 
        </form> 
    </>);
};
  
export default ImageModal;
  