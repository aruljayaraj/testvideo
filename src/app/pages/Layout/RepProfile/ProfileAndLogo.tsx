import {
    IonItem,
    IonModal,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonRow,
    IonCol
  } from '@ionic/react';
  
import React, { useState } from 'react';
import { isPlatform } from '@ionic/react';

import './RepProfile.scss';
import { useSelector } from 'react-redux';
// import * as uiActions from '../../../store/reducers/ui';
// import { IntfMember } from '../../../interfaces/Member';
import { lfConfig } from '../../../../Constants';
import ImageModal from '../../../components/Image/ImageModal';
let initialValues = {
    isOpen: false,
    title: '',
    actionType: '', // new or edit
    memId: '',
    frmId: ''
};

const ProfileAndLogo: React.FC = () => {
    // console.log('Profile Logo Page');
    // const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const [showImageModal, setShowImageModal] = useState(initialValues);
    const { apiBaseURL } = lfConfig;

    const imageModalFn = (title: string, actionType: string) => {
        setShowImageModal({ 
            ...showImageModal, 
            isOpen: true,
            title: title,
            actionType: actionType,
            memId: (repProfile && Object.keys(repProfile).length > 0)? repProfile.mem_id: '',
            frmId: (repProfile && Object.keys(repProfile).length > 0)? repProfile.id: ''
        });
    }
    const repImage = (Object.keys(repProfile).length > 0 && repProfile.profile_image) ? `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.profile_image}` : `${basename}/assets/img/avatar.svg`
    const logoImage = (Object.keys(repProfile).length > 0 && repProfile.profile_logo) ? `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.profile_logo}` : `${basename}/assets/img/placeholder.png`
    return (<>
        { repProfile && Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12" className={(isPlatform('desktop') || isPlatform('tablet')) ? 'border-right': 'my-3 border-bottom' }>
                        <IonCardTitle className="text-center">
                            <span>Profile Picture</span>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-image-wrap p-0" lines="none" onClick={() => imageModalFn('Edit Profile Picture', 'rep_profile')}>
                                <div className="profile-image">
                                    <img src={repImage} alt="Rep Profile" />
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>    
                            </IonItem>
                        </IonList>
                    </IonCol>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonCardTitle className="text-center">
                            <span>Logo</span>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-logo-wrap p-0" lines="none" onClick={() => imageModalFn('Edit Logo', 'rep_logo')}>
                                <div className="profile-logo">
                                    <img src={logoImage} alt="Rep Profile Logo"/>
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>
                            </IonItem>
                        </IonList>
                    </IonCol>
                </IonRow>
                
                
            </IonCardContent>
        </IonCard>}
        <IonModal isOpen={showImageModal.isOpen} cssClass='my-custom-class'>
            { repProfile && Object.keys(repProfile).length > 0 && showImageModal.isOpen === true &&  <ImageModal
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal} 
           /> }
        </IonModal>
    </>);
};
  
export default ProfileAndLogo;
  