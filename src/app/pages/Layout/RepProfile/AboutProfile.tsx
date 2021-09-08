import {
    IonItem,
    IonText,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonAvatar,
    IonIcon
  } from '@ionic/react';
import { 
    informationOutline
  } from 'ionicons/icons';
import React, { useState } from 'react';
import './RepProfile.scss';
import { useSelector } from 'react-redux';
import AboutProfileModal from './AboutProfileModal';

const AboutProfile: React.FC = () => {
    // console.log('Profile Description Page');
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [showAboutProfileModal, setShowAboutProfileModal] = useState(false);

    return (<>  
        { Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18" onClick={() => setShowAboutProfileModal(true)}>
                    <span>About Rep Profile</span>
                    <i className="fa fa-pencil float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
                { !repProfile.profile_description &&
                    <IonCardSubtitle>
                        <IonText className="text-10 ml-2" color="danger">(Update required)</IonText>
                    </IonCardSubtitle>        
                }
            </IonCardHeader>
            
            <IonCardContent>
                <IonList>
                    { repProfile.profile_description && <IonItem lines="none">
                        <IonAvatar slot="start">
                            <IonIcon color="greenbg" size="large" icon={informationOutline}></IonIcon>
                        </IonAvatar>
                        <IonText>
                            { repProfile.profile_description && <div className="external_text" dangerouslySetInnerHTML={{ __html: repProfile.profile_description }} ></div>}
                        </IonText>
                    </IonItem>}
                    { !repProfile.profile_description &&
                        <IonItem lines="none" >
                            <IonText className="fs-13" color="warning">Profile Information not updated.</IonText>
                        </IonItem>
                    }
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        <IonModal backdropDismiss={false} isOpen={showAboutProfileModal} cssClass='my-custom-class'>
          { Object.keys(repProfile).length > 0 && showAboutProfileModal === true && <AboutProfileModal 
            showAboutProfileModal={showAboutProfileModal}
            setShowAboutProfileModal={setShowAboutProfileModal} 
           /> }
        </IonModal>
    </>);
};
  
export default AboutProfile;
  