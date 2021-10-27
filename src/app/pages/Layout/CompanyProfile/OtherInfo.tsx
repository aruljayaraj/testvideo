import {
    IonItem, 
    IonLabel,
    IonText,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonAvatar,
    IonIcon,
    IonListHeader
  } from '@ionic/react';
import React, { useState } from 'react';
import { callOutline } from 'ionicons/icons';
import './CompanyProfile.scss';
import { useSelector } from 'react-redux';
import OtherInfoModal from './OtherInfoModal';

const OtherInfo: React.FC = () => {
    // console.log('Rep Profile Info Page');
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const [showOtherModal, setShowOtherModal] = useState(false);

    return (<>
        { Object.keys(comProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title" onClick={() => setShowOtherModal(true)}>
                    <span>Other Information</span>
                    <i className="fa fa-pencil float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
            </IonCardHeader>
              
            <IonCardContent className="ion-padding"> 
                <IonList>
                    { comProfile.linkedin && <IonItem>
                        <IonAvatar slot="start">
                            <i className="fa fa-linkedin-square fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <p><a 
                                href={comProfile.linkedin} 
                                className="green" target="_blank" rel="noopener noreferrer">Linkedin
                            </a></p>
                        </IonLabel>
                    </IonItem> }
                    { comProfile.facebook && <IonItem>
                        <IonAvatar slot="start">
                            <i className="fa fa-facebook-square fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <p><a 
                                href={comProfile.facebook} 
                                className="green" target="_blank" rel="noopener noreferrer">Facebook
                                </a>
                            </p>
                        </IonLabel>
                    </IonItem> }
                    { comProfile.twitter && <IonItem>
                        <IonAvatar slot="start">
                            <i className="fa fa-twitter-square fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <p><a 
                                href={comProfile.twitter} 
                                className="green" target="_blank" rel="noopener noreferrer">Twitter
                                </a>
                            </p>
                        </IonLabel>
                    </IonItem> }
                    { comProfile.other_promotional_assets && <IonItem>
                        <IonAvatar slot="start">
                            <i className="fa fa-info-circle fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <p><b>Other Promotional Assets</b></p>
                            {JSON.parse(comProfile.other_promotional_assets).map((field: any, index: number) => {
                                return (
                                    <p key={index}>
                                        <a href={field.link} className="green" target="_blank" rel="noopener noreferrer">Other Link {index+1}</a>
                                    </p>
                                );
                            })} 
                        </IonLabel>
                    </IonItem> }        
                    { comProfile.special_features && <IonItem>
                        <IonAvatar slot="start">
                            <i className="fa fa-info-circle fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <p><b>Special Features</b></p>
                            {JSON.parse(comProfile.special_features).map((field: any, index: number) => {
                                return (
                                    <p key={index}>{field.name}</p>
                                );
                            })} 
                        </IonLabel>
                    </IonItem> } 
                    { comProfile.member_organizations && <IonItem lines="none">
                        <IonAvatar slot="start">
                            <i className="fa fa-info-circle fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <p><b>Member Organizations</b></p>
                            { JSON.parse(comProfile.member_organizations).length > 0 && JSON.parse(comProfile.member_organizations).map((field: any, index: number) => {
                                return (
                                    <p key={index}>{field.name}</p>
                                );
                            })} 
                        </IonLabel>
                    </IonItem> } 
                    
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        
        <IonModal backdropDismiss={false} isOpen={showOtherModal} cssClass='my-custom-class'>
          { Object.keys(comProfile).length > 0 && <OtherInfoModal
            showOtherModal={showOtherModal}
            setShowOtherModal={setShowOtherModal} /> }
        </IonModal>
        
    </>);
};
  
export default OtherInfo;
  