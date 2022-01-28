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
    IonIcon
  } from '@ionic/react';
  import { 
    callOutline,
    timeOutline
  } from 'ionicons/icons';
import React, { useState } from 'react';
import { isPlatform } from '@ionic/react';

import './RepProfile.scss';
import { useSelector } from 'react-redux';
import ContactInfoModal from './ContactInfoModal';

const ContactInfo: React.FC = () => {
    // console.log('Rep Contact Info Page');
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [showContactModal, setShowContactModal] = useState(false);

    return (<>
        { Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title" onClick={() => setShowContactModal(true)}>
                    <span>Contact Information</span>
                    <i className="fa fa-pencil float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
                { !repProfile.phone &&
                    <IonCardSubtitle>
                        <IonText className="text-10 ml-2" color="danger">(Update required)</IonText>
                    </IonCardSubtitle>        
                }
            </IonCardHeader>
              
            <IonCardContent>
                <IonList>
                    { repProfile.phone && <IonItem>
                        <IonAvatar slot="start">
                            <IonIcon color="greenbg" size="large" icon={callOutline}></IonIcon>
                        </IonAvatar>
                        <IonLabel>
                            { repProfile.phone && <h2>{`Phone: ${repProfile.phone_code} ${repProfile.phone}`}</h2> }
                            { repProfile.phoneext && <p>{`Ext: ${repProfile.phoneext}`}</p>}
                            { repProfile.mobile && <p>{`Mobile: ${repProfile.mobile_code} ${repProfile.mobile}`}</p>}
                            { repProfile.fax && <p>{`Fax: ${repProfile.fax}`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { repProfile.advcontacttype && <IonItem lines="none">
                        <IonAvatar slot="start">
                            <IonIcon color="greenbg" size="large" icon={timeOutline}></IonIcon>
                        </IonAvatar>
                        <IonLabel>
                            { repProfile.advcontacttype && 
                                <h2>{ (isPlatform('desktop'))? 'Best ': ''}Ways to Contact:  
                                    <span style={{ textTransform:'capitalize'}}> {repProfile.advcontacttype.replace(/,/g, ', ')}</span>
                                </h2> 
                            }
                            { repProfile.advdaystxt && 
                                <p>{ (isPlatform('desktop'))? 'Best ': ''}Days to Contact:  {repProfile.advdaystxt}</p>
                            }
                            { repProfile.advtimetxt && 
                                <p>{ (isPlatform('desktop'))? 'Best ': ''}Time to Contact:  {repProfile.advtimetxt}</p>
                            }
                            { repProfile.newsletteryn && <p>{`Newsletter: ${repProfile.newsletteryn === 'Y'? 'Yes': 'No' }`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { !repProfile.phone &&
                        <IonItem lines="none" >
                            <IonText className="fs-13" color="warning">Contact Information not updated.</IonText>
                        </IonItem>
                    }
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        <IonModal backdropDismiss={false} isOpen={showContactModal} className='my-custom-class'>
          { Object.keys(repProfile).length > 0 && <ContactInfoModal
            showContactModal={showContactModal}
            setShowContactModal={setShowContactModal} /> }
        </IonModal> 
    </>);
};
  
export default ContactInfo;
  