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
import './CompanyProfile.scss';
import { useSelector } from 'react-redux';
// import { IntfMember } from '../../../interfaces/Member';
import AboutCompanyModal from './AboutCompanyModal';

const AboutCompany: React.FC = () => {
    // console.log('Profile Description Page');
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const [showAboutCompanyModal, setShowAboutCompanyModal] = useState(false);

    return (<>
        { Object.keys(comProfile).length > 0 &&
        <IonCard className="card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle onClick={() => setShowAboutCompanyModal(true)}>
                    <span>About Company Profile</span>
                    <i className="fa fa-pencil float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
                { !comProfile.description &&
                    <IonCardSubtitle>
                        <IonText className="text-10 ml-2" color="danger">(Update required)</IonText>
                    </IonCardSubtitle>        
                }
            </IonCardHeader>
            
            <IonCardContent>
                <IonList>
                    { comProfile.description && <IonItem lines="none">
                        <IonAvatar slot="start">
                            <IonIcon color="greenbg" size="large" icon={informationOutline}></IonIcon>
                        </IonAvatar>
                        <IonText>
                            { comProfile.description && <div className="external_text" dangerouslySetInnerHTML={{ __html: comProfile.description }} ></div>}
                        </IonText>
                    </IonItem>}
                    { !comProfile.description &&
                        <IonItem lines="none" >
                            <IonText className="fs-13" color="warning">Company Information not updated.</IonText>
                        </IonItem>
                    }
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        <IonModal isOpen={showAboutCompanyModal} cssClass='my-custom-class'>
          { Object.keys(comProfile).length > 0 && showAboutCompanyModal === true && <AboutCompanyModal 
            showAboutCompanyModal={showAboutCompanyModal}
            setShowAboutCompanyModal={setShowAboutCompanyModal} 
           /> }
        </IonModal>
    </>);
};
  
export default AboutCompany;
  