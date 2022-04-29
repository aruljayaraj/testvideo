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
    IonRouterLink,
    IonFab,
    IonFabButton,
    IonActionSheet
  } from '@ionic/react';
import { cameraOutline, ellipsisHorizontalOutline, imageOutline, close } from 'ionicons/icons';  
import React, { useState, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../Deals.scss';
import { useCameraPhoto } from '../../../../hooks/useCameraPhoto';
import * as uiActions from '../../../../store/reducers/ui';
import * as dealActions from '../../../../store/reducers/dashboard/deal';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import CommonService from '../../../../shared/services/CommonService';
import ImageModal from '../../../../components/Image/ImageModal';
import StepInd from './StepInd';
import PreviewModal from './PreviewModal';

let initialValues = {
    isOpen: false,
    title: '',
    actionType: '', // new or edit
    memId: '',
    repId: '',
    frmId: ''
};

let initPreviewValues ={
    isOpen: false,
    memID: '',
    ddID: ''
}

const DDMedia: React.FC = () => {
    const dispatch = useDispatch();
    const { takePhoto } = useCameraPhoto();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const dd = useSelector( (state:any) => state.deals.localDeal);
    const [showProfileActSheet, setShowProfileActSheet] = useState(false);
    const [showImageModal, setShowImageModal] = useState(initialValues);
    const [previewModal, setPreviewModal] = useState(initPreviewValues);
    const [addDeal, setAddDeal] = useState({ status: false, memID: '', id: '' });
    const { apiBaseURL, basename } = lfConfig;
    let { id } = useParams<any>();

    const imageModalFn = (title: string, actionType: string) => {
        setShowImageModal({ 
            ...showImageModal, 
            isOpen: true,
            title: title,
            actionType: actionType,
            memId: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            repId: (dd && Object.keys(dd).length > 0)? dd.rep_id: '',
            frmId: (dd && Object.keys(dd).length > 0)? dd.id: ''
        });
    }
    const previewModalFn = () => {
        setPreviewModal({ 
            ...showImageModal,
            isOpen: true,
            memID: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            ddID: (dd && Object.keys(dd).length > 0)? dd.id: ''
        });
    }
    const ddImage = ( dd && Object.keys(dd).length > 0 && dd.image) ? `${apiBaseURL}uploads/member/${dd.mem_id}/${dd.rep_id}/${dd.image}` : `${basename}/assets/img/placeholder.png`;

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddDeal({ status: true, memID: res.data.mem_id, id: res.data.id  });
            dispatch(dealActions.setDeal({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setAddDeal]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'dl_update_activate',
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id,
            isActive: true
        };
        CoreService.onPostFn('deal_update', fd, onCallbackFn);
    }

    // Upload Camera Picture callback
    const uploadCameraPhotoCbFn = useCallback((res:any)=> {
        if(res.status === 'SUCCESS'){ console.log(res.data);
            dispatch(dealActions.setDeal({ data: res.data }));
            imageModalFn('Edit Supporting Media', 'local_deal');
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        
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
            fd.append('formId', id);
            fd.append('action', 'local_deal' );
            CoreService.onUploadFn('file_upload', fd, uploadCameraPhotoCbFn);
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Image Capture error!' }));
        }
    }

    if( addDeal.status  ){
        return <Redirect to={`/layout/deals/local-deals`} />;
    }

    return (<>
        { dd && Object.keys(dd).length > 0 &&
        <>
        <StepInd />
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <IonRow>
                    <IonCol className="">
                        <IonCardTitle className="text-center mb-3 card-custom-title">
                            <span>Upload Supporting Media</span>
                            <IonRouterLink color="greenbg" href={`${basename}/layout/deals/local-deals`} className="float-right router-link-anchor" title="Deal Listing">
                                <i className="fa fa-list green cursor" aria-hidden="true"></i>
                            </IonRouterLink>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-logo-wrap p-0" lines="none" onClick={() => setShowProfileActSheet(true)}>
                                <div className="profile-logo">
                                    <img src={ddImage} alt="Deal Media" />
                                    <IonFab  vertical="bottom" horizontal="end" slot="fixed">
                                        <IonFabButton color="greenbg" size="small"><i className="fa fa-pencil fa-lg cursor" aria-hidden="true"></i></IonFabButton>
                                    </IonFab>
                                </div>
                            </IonItem>
                        </IonList>
                    </IonCol>
                    
                </IonRow>
                { dd && Object.keys(dd).length > 0 && 
                <>
                    <IonButton color="warning" 
                        onClick={() => previewModalFn()}
                        className="ion-margin-top mt-4 mb-3 float-left">
                        Preview
                    </IonButton>
                    { dd.image && 
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" onClick={onSubmit}>
                            Submit
                        </IonButton>
                    }
                </>    
                }
                
            </IonCardContent>
        </IonCard>
        </>}
        <IonActionSheet
            isOpen={showProfileActSheet}
            onDidDismiss={() => setShowProfileActSheet(false)}
            buttons={[{
                text: 'Take Photo',
                icon: cameraOutline,
                handler: () => {
                    // console.log('Take Photo clicked');
                    takePhoto(uploadCameraPhotoFn);
                }
            }, {
                text: (dd && Object.keys(dd).length > 0 && dd.image) ? 'Edit Photo': 'Browse',
                icon: (dd && Object.keys(dd).length > 0 && dd.image) ? imageOutline : ellipsisHorizontalOutline,
                handler: () => {
                    imageModalFn('Upload Supporting Media', 'local_deal')
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
        <IonModal backdropDismiss={false} isOpen={showImageModal.isOpen} className='view-modal-wrap'>
            { dd && Object.keys(dd).length > 0 && showImageModal.isOpen === true &&  <ImageModal
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal} 
           /> }
        </IonModal>
        <IonModal backdropDismiss={false} isOpen={previewModal.isOpen} className='view-modal-wrap'>
            { dd && Object.keys(dd).length > 0 && previewModal.isOpen === true &&  <PreviewModal
            previewModal={previewModal}
            setPreviewModal={setPreviewModal} 
           /> }
        </IonModal>
    </>);
};
  
export default DDMedia;
  