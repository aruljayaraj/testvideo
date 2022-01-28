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
    IonAvatar
  } from '@ionic/react';
import React, { useState } from 'react';

import './RepProfile.scss';
import { useSelector } from 'react-redux';
import ProfileInfoModal from './ProfileInfoModal';

const ProfileInfo: React.FC = () => {
    // console.log('Rep Profile Info Page');
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [showProfileModal, setShowProfileModal] = useState(false);

    return (<>
        { Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title" onClick={() => setShowProfileModal(true)}>
                    <span >Profile Information</span>
                    <i className="fa fa-pencil float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
                { !repProfile.country &&
                    <IonCardSubtitle>
                        <IonText className="text-10 ml-2" color="danger">(Update required)</IonText>
                    </IonCardSubtitle>        
                }
            </IonCardHeader>
              
            <IonCardContent> 
                <IonList>
                    <IonItem>
                        <IonAvatar slot="start">
                        <i className="fa fa-building fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            { repProfile.rep_title && <h2>{repProfile.rep_title}</h2> }
                            { repProfile.firstname && <h3>{repProfile.firstname+" "+repProfile.lastname}</h3> }
                            { repProfile.email && <p>{repProfile.email}</p> }
                            { repProfile.website && 
                                <p><a 
                                href={repProfile.website.includes('http')? repProfile.website: `http://${repProfile.website}`} 
                                className="green" target="_blank" rel="noopener noreferrer">{repProfile.website}
                                </a></p>
                            }
                        </IonLabel>
                    </IonItem>
                    {repProfile.address1 && <IonItem lines="none">
                        <IonAvatar slot="start">
                            <i className="fa fa-address-card-o fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <h2>Address</h2>
                            { repProfile.address1 && <p>{repProfile.address1}</p>}
                            { repProfile.address2 && <p>{repProfile.address2}</p>}
                            { repProfile.city && <p>{`${repProfile.city}, ${repProfile.state}`}</p>}
                            { repProfile.postal && <p>{`${repProfile.country}, ${repProfile.postal}`}</p>}
                        </IonLabel>
                    </IonItem>}
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        
        <IonModal backdropDismiss={false} isOpen={showProfileModal} className='my-custom-class'>
          { Object.keys(repProfile).length > 0 && <ProfileInfoModal
            showProfileModal={showProfileModal}
            setShowProfileModal={setShowProfileModal} /> }
        </IonModal>
        
    </>);
};
  
export default ProfileInfo;
  