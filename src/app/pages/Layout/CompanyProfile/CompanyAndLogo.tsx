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
// import { isPlatform } from '@ionic/react';

import './CompanyProfile.scss';
import { useSelector } from 'react-redux';
// import * as uiActions from '../../../store/reducers/ui';
// import { IntfMember } from '../../../interfaces/Member';
import { lfConfig } from '../../../../Constants';
import ImageModal from '../../../components/Image/ImageModal';
import CommonService from '../../../shared/services/CommonService';
import CommonInitService from '../../../shared/services/CommonInitService';

const CompanyAndLogo: React.FC = () => {
    // console.log('Profile Logo Page');
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const [showImageModal, setShowImageModal] = useState(CommonInitService.initialValuesImageModal(''));
    const { apiBaseURL, basename } = lfConfig;

    const imageModalFn = (title: string, actionType: string) => {
        setShowImageModal({ 
            ...showImageModal, 
            isOpen: true,
            title: title,
            actionType: actionType,
            memId: (Object.keys(comProfile).length > 0)? comProfile.mem_id: '',
            repId: (Object.keys(authUser).length > 0)? authUser.prepID: '',
            frmId: (Object.keys(comProfile).length > 0)? comProfile.id: ''
        });
    };
    const logoImage = (Object.keys(comProfile).length > 0 && comProfile.company_logo) ? `${apiBaseURL}uploads/member/${comProfile.mem_id}/${comProfile.company_logo}` : `${basename}/assets/img/placeholder.png`;
    return (<>
        { Object.keys(comProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12" >
                        <IonCardTitle className="text-center card-custom-title mb-3">
                            <span>Logo</span>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-logo-wrap p-0" lines="none" onClick={() => imageModalFn('Edit Logo', 'company_logo')}>
                                <div className="profile-logo">
                                    <img src={logoImage} alt="Company Logo" />
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>
                            </IonItem>
                        </IonList>
                    </IonCol>
                    <IonCol sizeMd="6" sizeXs="12">
                        {/* <IonCardTitle className="text-center">
                            <span>Membership Organizations</span>
                        </IonCardTitle> */}
                        <IonList>
                            {/* <IonItem className="profile-logo-wrap p-0" lines="none" onClick={() => imageModalFn('Edit Logo', 'company_logo')}>
                                <div className="profile-logo">
                                    <img src={logoImage} alt="Rep Profile Logo"/>
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>
                            </IonItem> */}
                        </IonList>
                    </IonCol>
                </IonRow>
                
                
            </IonCardContent>
        </IonCard>}
        <IonModal backdropDismiss={false} isOpen={showImageModal.isOpen} cssClass='my-custom-class'>
            { Object.keys(comProfile).length > 0 && showImageModal.isOpen === true &&  <ImageModal
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal} 
           /> }
        </IonModal>
    </>);
};
  
export default CompanyAndLogo;
  