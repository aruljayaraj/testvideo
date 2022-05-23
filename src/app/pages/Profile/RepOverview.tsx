import {
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonCardHeader
} from '@ionic/react';
import React from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';
import CommonService from '../../shared/services/CommonService';

const GeneralInfo: React.FC = () => {
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const { apiBaseURL, basename } = lfConfig;

    const repImage = (Object.keys(repProfile).length > 0 && repProfile.profile_image) ? `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.id}/${CommonService.getThumbImg(repProfile.profile_image)}` : `${basename}/assets/img/avatar.svg`;
    return (<>
        { Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">
                    <span>
                        {`${repProfile.firstname} ${repProfile.lastname}`} 
                        { repProfile.rep_title? ` - ${repProfile.rep_title}`: '' }
                    </span>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <div className="profile-image-wrap pt-3">
                    <div className="profile-image ion-float-left mr-3">
                        <img src={repImage} alt="Rep Profile" onError={() => CommonService.onImgErr('profile')} />
                    </div>
                    <IonText>
                        { repProfile.profile_description && <div className="external_text pt-3" dangerouslySetInnerHTML={{ __html: repProfile.profile_description }} ></div>}
                    </IonText>
                </div>
            </IonCardContent>
        </IonCard>}
    </>);
};
  
export default GeneralInfo;
  