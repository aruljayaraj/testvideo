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
import React, { useState } from 'react';
import { callOutline } from 'ionicons/icons';
import './CompanyProfile.scss';
import { useSelector } from 'react-redux';
import CompanyInfoModal from './CompanyInfoModal';

const CompanyInfo: React.FC = () => {
    // console.log('Rep Profile Info Page');
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const [showCompanyModal, setShowCompanyModal] = useState(false);

    return (<>
        { Object.keys(comProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title" onClick={() => setShowCompanyModal(true)}>
                    <span>Company Information</span>
                    <i className="fa fa-pencil float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
                { !comProfile.country &&
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
                            { comProfile.company_name && <h2>{comProfile.company_name}</h2> }
                            { comProfile.firstname && <h3>{comProfile.firstname+" "+comProfile.lastname}</h3> }
                            { comProfile.website && 
                                <p><a 
                                href={comProfile.website.includes('http')? comProfile.website: `http://${comProfile.website}`} 
                                className="green" target="_blank" rel="noopener noreferrer">{comProfile.website}
                                </a></p>
                            }
                        </IonLabel>
                    </IonItem>
                    {comProfile.address1 && <IonItem>
                        <IonAvatar slot="start">
                            <i className="fa fa-address-card-o fa-2x green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <h2>Address</h2>
                            { comProfile.address1 && <p>{comProfile.address1}</p>}
                            { comProfile.address2 && <p>{comProfile.address2}</p>}
                            { comProfile.city && <p>{`${comProfile.city}, ${comProfile.state}`}</p>}
                            { comProfile.postal && <p>{`${comProfile.country}, ${comProfile.postal}`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { comProfile.phone && <IonItem lines="none">
                        <IonAvatar slot="start">
                            <IonIcon color="greenbg" size="large" icon={callOutline}></IonIcon>
                        </IonAvatar>
                        <IonLabel>
                            { comProfile.phone && <h2>{`Phone: ${comProfile.phone_code} ${comProfile.phone}`}</h2> }
                            { comProfile.phoneext && <p>{`Ext: ${comProfile.phoneext}`}</p>}
                            { comProfile.mobile && <p>{`Mobile: ${comProfile.mobile_code} ${comProfile.mobile}`}</p>}
                            { comProfile.fax && <p>{`Fax: ${comProfile.fax}`}</p>}
                        </IonLabel>
                    </IonItem>}
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        
        <IonModal backdropDismiss={false} isOpen={showCompanyModal} cssClass='my-custom-class'>
          { Object.keys(comProfile).length > 0 && <CompanyInfoModal
            showCompanyModal={showCompanyModal}
            setShowCompanyModal={setShowCompanyModal} /> }
        </IonModal>
        
    </>);
};
  
export default CompanyInfo;
  