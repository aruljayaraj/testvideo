import {
    IonItem,
    IonModal,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonRow,
    IonCol,
    IonActionSheet
} from '@ionic/react';
import { cameraOutline, ellipsisHorizontalOutline, imageOutline, close } from 'ionicons/icons';
import React, { useState, useCallback } from 'react';  
import { isPlatform } from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import './RepProfile.scss';
import CommonService from '../../../shared/services/CommonService';
import { lfConfig } from '../../../../Constants';
import ImageModal from '../../../components/Image/ImageModal';
import { useCameraPhoto } from '../../../hooks/useCameraPhoto';
import * as uiActions from '../../../store/reducers/ui';
import * as repActions from '../../../store/reducers/dashboard/rep';
import CoreService from '../../../shared/services/CoreService';
import CommonInitService from '../../../shared/services/CommonInitService';

const ProfileAndLogo: React.FC = () => {
    // console.log('Profile Logo Page');
    const dispatch = useDispatch();
    const { takePhoto } = useCameraPhoto();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const [showImageModal, setShowImageModal] = useState(CommonInitService.initialValuesImageModal(''));
    const [showProfileActSheet, setShowProfileActSheet] = useState(false);
    const { apiBaseURL } = lfConfig;

    const imageModalFn = (title: string, actionType: string) => {
        setShowImageModal({ 
            ...showImageModal, 
            isOpen: true,
            title: title,
            actionType: actionType,
            memId: (repProfile && Object.keys(repProfile).length > 0)? repProfile.mem_id: '',
            repId: (repProfile && Object.keys(repProfile).length > 0)? repProfile.id: '',
            frmId: (repProfile && Object.keys(repProfile).length > 0)? repProfile.id: ''
        });
    }

    // Upload Camera Picture callback
    const uploadCameraPhotoCbFn = useCallback((res:any)=> {
        if(res.status === 'SUCCESS'){
            dispatch(repActions.setRepProfile({ data: res.data }));
            imageModalFn('Edit Profile Picture', 'rep_profile');
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
            fd.append('formId', authUser.repID);
            fd.append('action', 'rep_profile' );
            CoreService.onUploadFn('file_upload', fd, uploadCameraPhotoCbFn);
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Image Capture error!' }));
        }
    }    

    const repImage = (Object.keys(repProfile).length > 0 && repProfile.profile_image) ? `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.id}/${repProfile.profile_image}` : `${basename}/assets/img/avatar.svg`;
    const logoImage = (Object.keys(repProfile).length > 0 && repProfile.profile_logo) ? `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.id}/${repProfile.profile_logo}` : `${basename}/assets/img/placeholder.png`;
    return (<>
        { repProfile && Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12" className={(isPlatform('desktop') || isPlatform('tablet')) ? 'border-right': 'my-3 border-bottom' }>
                        <IonCardTitle className="text-center mb-3 card-custom-title">
                            <span>Profile Picture</span>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-image-wrap p-0" lines="none" onClick={() => setShowProfileActSheet(true)}>
                                <div className="profile-image">
                                    <img src={repImage} alt="Rep Profile" onError={() => CommonService.onImgErr('profile')} />
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>    
                            </IonItem>
                        </IonList>
                    </IonCol>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonCardTitle className="text-center mb-3 card-custom-title">
                            <span>Logo</span>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-logo-wrap p-0 m-0" lines="none" onClick={() => imageModalFn('Edit Logo', 'rep_logo')}>
                                <div className="profile-logo">
                                    <img src={logoImage} alt="Rep Profile Logo" />
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>
                            </IonItem>
                        </IonList>
                    </IonCol>
                </IonRow>
                
                
            </IonCardContent>
        </IonCard>}
        <IonActionSheet
            isOpen={showProfileActSheet}
            onDidDismiss={() => setShowProfileActSheet(false)}
            cssClass=''
            buttons={[{
                text: 'Take Photo',
                icon: cameraOutline,
                handler: () => {
                    // console.log('Take Photo clicked');
                    takePhoto(uploadCameraPhotoFn);
                }
            }, {
                text: (Object.keys(repProfile).length > 0 && repProfile.profile_image) ? 'Edit Photo': 'Browse',
                icon: (Object.keys(repProfile).length > 0 && repProfile.profile_image) ? imageOutline : ellipsisHorizontalOutline,
                handler: () => {
                    imageModalFn('Edit Profile Picture', 'rep_profile');
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
        <IonModal backdropDismiss={false} isOpen={showImageModal.isOpen} cssClass='image-crop-modal-container'>
            { repProfile && Object.keys(repProfile).length > 0 && showImageModal.isOpen === true &&  <ImageModal
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal} 
           /> }
        </IonModal>
    </>);
};
  
export default ProfileAndLogo;
  