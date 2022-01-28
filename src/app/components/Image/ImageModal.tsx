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
    IonText,
    IonSegment,
    IonSegmentButton,
    IonLabel
  } from '@ionic/react';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { close } from 'ionicons/icons';
import { useForm } from "react-hook-form";
// import ReactCrop from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './ImageModal.scss';
import { useDispatch, useSelector } from 'react-redux';

import CoreService from '../../shared/services/CoreService';
import CommonService from '../../shared/services/CommonService';
import { lfConfig } from '../../../Constants';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../store/reducers/ui';
import * as prActions from '../../store/reducers/dashboard/pr';
import * as dealActions from '../../store/reducers/dashboard/deal';
import { isPlatform } from '@ionic/react';

interface Props {
    showImageModal: any,
    setShowImageModal: Function,
}
interface ImageData {
    name: any,
    image: any,
    uploaded: boolean
}

let initialValues: any = {
    name: '',
    image: '',
    uploaded: false
}


const ImageModal: React.FC<Props> = ({ showImageModal, setShowImageModal }) => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const dd = useSelector( (state:any) => state.deals.localDeal);
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const { handleSubmit} = useForm();
    let { title, actionType, memId, frmId } = showImageModal;
    const [ picture, setPicture ] = useState<ImageData>(initialValues);
    const [zoomValue, setZoomValue] = useState<any>(0);
    const [dragValue, setDragValue] = useState<any>('move');
    // const [ croppedPic, setCroppedPic ] = useState<ImageData>(initialValues);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { apiBaseURL } = lfConfig;
    const rectTypes = ['rep_logo', 'company_logo'];

    const cropperRef = useRef<any>(null);
    // const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState<any>();
    
    let initialCropValues = {
        unit: "px", 
        width: (actionType && rectTypes.includes(actionType) )? 300: 300, 
        height: (actionType && rectTypes.includes(actionType) )? 150: 300, 
        aspect: (actionType && rectTypes.includes(actionType) )? 0: 1, // 16/9
        // aspect: 1,
        // minContainerWidth: 800, // 548
        // minContainerHeight: 800 // 400
    }

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
            }else if( actionType === 'local_deal' ){
                dispatch(dealActions.setDeal({ data: res.data }));
            }  
            setShowImageModal({ ...showImageModal, isOpen: false });
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        setTimeout( () => {
            dispatch(uiActions.setShowLoading({ loading: false }));
        }, 2000 );
        
    }, [dispatch, setShowImageModal, showImageModal, actionType]);
    const onSubmit = () => {
        if (typeof cropper !== "undefined") {
            dispatch(uiActions.setShowLoading({ loading: true }));
            setCropData(cropper.getCroppedCanvas().toDataURL());
            const base64Image = cropper.getCroppedCanvas().toDataURL();
            var u8Image  = CommonService.b64ToUint8Array(base64Image);

            const fd = new FormData();
            fd.append("dataFile", new Blob([ u8Image ], {type: "image/jpg"}), picture.name);
            fd.append('memId', memId);
            fd.append('repId', authUser.repID);
            fd.append('formId', frmId);
            fd.append('action', actionType );
            CoreService.onUploadFn('file_upload', fd, onCallbackFn);
        }    
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
            }else if( actionType === 'local_deal' ){
                dispatch(dealActions.setDeal({ data: res.data }));
            } 
            setPicture({
                ...picture,
                image: '',
                name: '',
                uploaded: false
            });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setPicture, actionType]);
    const deleteImageFn = () => {
        if( picture.image && picture.name && picture.uploaded === true ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const formData = {
                action: 'delete_image',
                formId: frmId,
                memId: memId,
                repId: authUser.repID,
                actionType: actionType
            };
            CoreService.onPostFn('file_upload', formData, deleteImageFnCb);
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Image should not be empty!' }));
        }
    }
    
    const handleFileChange = (e: any) => {    
        e.preventDefault();
        let files: any;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if( ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(files.item(0).type) ){
            if( files.item(0).size <= 5242880 ){
                const reader = new FileReader();
                const imgname = files.item(0).name;
                
                reader.onload = () => { 
                    let image: any = new Image();
                    // image.src = reader.result as any;
                    image.src = reader.result;
                    image.onload = function() {
                        // console.log("The width of the image is " + image.width + "px.");
                        // console.log(initialCropValues.width, initialCropValues.height);
                        // console.log(image.width, image.height);
                        if( image.width > initialCropValues.width &&  image.height > initialCropValues.height ){
                            setPicture({
                                ...picture,
                                name: imgname,
                                image: reader.result
                                // image: reader.result as any
                            });
                        }else{
                            reader.abort();
                            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: `File dimensions should be more than ${initialCropValues.width}X${initialCropValues.height}.` }));
                        }
                    }; 
                };
                reader.readAsDataURL(files[0]);
            }else{
                dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'File size should be less than 5MB is allowed.' }));
            }
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Only (png, jpg, gif) Image is allowed.' }));
        }
    }

    let cropTempURL = '';
    let cropImgName = '';
    if( !picture.image ){
        if( actionType === 'rep_profile' && repProfile && (Object.keys(repProfile).length > 0 && repProfile.profile_image)){
            cropTempURL = `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.id}/${repProfile.profile_image}`;
            cropImgName = repProfile.profile_image;
        }else if( actionType === 'rep_logo' && repProfile && (Object.keys(repProfile).length > 0 && repProfile.profile_logo)){
            cropTempURL = `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.id}/${repProfile.profile_logo}`;
            cropImgName = repProfile.profile_logo;
        }else if( actionType === 'company_logo' && comProfile && (Object.keys(comProfile).length > 0 && comProfile.company_logo)){
            cropTempURL = `${apiBaseURL}uploads/member/${comProfile.mem_id}/${comProfile.company_logo}`;
            cropImgName = comProfile.company_logo;
        }else if( actionType === 'press_release' && pr && (Object.keys(pr).length > 0 && pr.pr_image)){
            cropTempURL = `${apiBaseURL}uploads/member/${pr.pr_mem_id}/${pr.pr_rep_id}/${pr.pr_image}`;
            cropImgName = pr.pr_image;
        }else if( actionType === 'local_deal' && dd && (Object.keys(dd).length > 0 && dd.image)){
            cropTempURL = `${apiBaseURL}uploads/member/${dd.mem_id}/${dd.rep_id}/${dd.image}`;
            cropImgName = dd.image;
        }
    }
    useEffect(() => {
        if( cropTempURL ){
            setPicture({
                ...picture,
                name: cropImgName,
                image: cropTempURL,
                uploaded: true
            });
        }
    }, [cropTempURL, repProfile, comProfile, pr]);

    const handleCropChange = () => {
        const croppedImgData = cropperRef.current.cropper
          .getCroppedCanvas()
          .toDataURL();
    }
    const handleRotate = (dir: string) => {
        let dirVal = 90;
        if(dir === 'left'){
            dirVal = -90;
        }
        if(cropperRef.current){
            cropperRef.current.cropper.rotate(dirVal);
            handleCropChange();
            // console.log(dirVal);
            // setRotateValue(dirVal);
        }
    }
    const handleZoom = (dir: any) => {
        let newZoomValue: any;
        if(dir === 'plus'){
            newZoomValue = parseFloat(zoomValue) + 0.20;
            if(cropperRef.current){
                setZoomValue(newZoomValue);
            }
        }else if(dir === 'minus' && parseFloat(zoomValue) > 0){
            newZoomValue = parseFloat(zoomValue) - 0.20;
            if(cropperRef.current){
                setZoomValue(newZoomValue);
            }
        }else if(dir === 'reset'){
            newZoomValue = 0.5;
            if(cropperRef.current){
                setZoomValue(newZoomValue);
                cropperRef.current.cropper.rotate(0);
            }
        }
    }
    
    return (<>
        <form className="image-crop-modal-container" onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowImageModal({
                            ...showImageModal, 
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

                    <IonRow>
                        <IonCol className="d-flex justify-content-center">
                            { !picture.image && 
                                <img src={`${basename}/assets/img/placeholder.png`} alt="placeholder" width="75%"/>
                            }
                        
                            { picture.image && initialCropValues.height &&
                            <Cropper
                                ref={cropperRef}
                                className='cropper-container cropper-bg'
                                style={{ height: "100%", width: '100%' }}
                                // style={{ minHeight: initialCropValues.minContainerHeight, height: "100%", width: initialCropValues.minContainerWidth }}
                                // style={{ height: initialCropValues.height, width: initialCropValues.width }}
                                initialAspectRatio={1}
                                // aspectRatio={initialCropValues.aspect}
                                src={picture.image}
                                dragMode={dragValue}
                                // rotatable={true}
                                // rotateTo={rotateValue}
                                zoomTo={zoomValue}
                                viewMode={1}
                                guides={true}
                                minCropBoxWidth={initialCropValues.width}
                                minCropBoxHeight={initialCropValues.height}
                                // minContainerWidth={initialCropValues.minContainerWidth}
                                // minContainerHeight={initialCropValues.minContainerHeight}
                                background={false}
                                responsive={true}
                                // autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                            /> }
                            
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText>Image Size minimum to be: {initialCropValues.width}px X {initialCropValues.height}px (jpg, png {(actionType && !rectTypes.includes(actionType) )? 'or gif' : ''})</IonText>
                        </IonCol>
                    </IonRow>  
                    { picture.image && initialCropValues.height && <IonRow>
                        <IonCol>
                            <div className="btn-group">
                                <IonButton type="button" color="primary" title="Move" onClick={() => setDragValue('move')}>
                                    <i className="fa fa-arrows fa-lg" aria-hidden="true"></i> 
                                </IonButton>
                                {/* <IonButton type="button" color="primary" title="Rotate Left" onClick={() => setDragValue('crop')}>
                                    <i className="fa fa-crop fa-lg" aria-hidden="true"></i> 
                                </IonButton> */}
                                <IonButton type="button" color="primary" title="Rotate Left" onClick={() => handleRotate('left')}>
                                    <i className="fa fa-undo fa-lg" aria-hidden="true"></i> 
                                </IonButton>
                                <IonButton type="button" color="primary" title="Rotate Right" onClick={() => handleRotate('right')}>
                                    <i className="fa fa-repeat fa-lg" aria-hidden="true"></i>
                                </IonButton>
                                <IonButton type="button" color="primary" title="Zoom In" onClick={() => handleZoom('plus')}>
                                    <i className="fa fa-search-plus fa-lg" aria-hidden="true"></i> 
                                </IonButton>
                                <IonButton type="button" color="primary" title="Zoom Out" onClick={() => handleZoom('minus')}>
                                    <i className="fa fa-search-minus fa-lg" aria-hidden="true"></i>
                                </IonButton>
                                <IonButton type="button" color="primary" title="Reset" onClick={() => handleZoom('reset')}>
                                    <i className="fa fa-refresh fa-lg" aria-hidden="true"></i>
                                </IonButton>
                            </div>
                        </IonCol>
                    </IonRow>} 
                    
                    <div>           
                        <>
                            { picture.image && picture.uploaded === true && 
                            <IonButton color="medium" className="ion-margin-top mt-4 mb-3 float-left" onClick={() => deleteImageFn()}>
                                Delete
                            </IonButton>}
                            <div className="float-right">
                                <input id="customImageFile" type="file" name="imageFile" hidden
                                    ref={fileInputRef}
                                    onChange={handleFileChange} />
                                <IonButton color="warning" className="ion-margin-top mt-4 mb-3" type="button" onClick={ () => {
                                    if( fileInputRef && fileInputRef.current ){
                                        fileInputRef.current.click();
                                    }
                                  }} >
                                    { !picture.image? 'Add': 'Change' } Picture
                                </IonButton>
                                { (isPlatform('desktop')) && 
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
  