import {
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonCardHeader,
    IonRow,
    IonCol
} from '@ionic/react';
import React, {useState} from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';

const GeneralInfo: React.FC = () => {
    // const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const { apiBaseURL } = lfConfig;

    const repImage = (Object.keys(repProfile).length > 0 && repProfile.profile_image) ? `${apiBaseURL}uploads/member/${repProfile.mem_id}/${repProfile.profile_image}` : `${basename}/assets/img/avatar.svg`;
    return (<>
        { Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">
                    <span>{`${repProfile.firstname} ${repProfile.lastname}`} - Representative</span>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonRow>
                    <IonCol sizeMd="3">
                        <div className="profile-image-wrap pt-3">
                            <div className="profile-image">
                                <img src={repImage} alt="Rep Profile" />
                            </div>
                        </div>
                    </IonCol>
                    <IonCol sizeMd="9" className="pl-3">
                        <IonText>
                            { repProfile.profile_description && <div className="external_text pt-3" dangerouslySetInnerHTML={{ __html: repProfile.profile_description }} ></div>}
                        </IonText>
                    </IonCol>
                </IonRow>
                
            </IonCardContent>
        </IonCard>}
    </>);
};
  
export default GeneralInfo;
  