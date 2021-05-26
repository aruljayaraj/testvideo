import {
    IonCard,
    IonCardContent,
    IonText,
    IonList,
    IonAvatar,
    IonLabel,
    IonItem,
    IonIcon,
    IonRouterLink,
    IonModal
} from '@ionic/react';
import React, {useState} from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';
import { alertCircleOutline, callOutline, locateOutline, logoFacebook, logoLinkedin, logoTwitter, mailOutline, phonePortraitOutline } from 'ionicons/icons';
import ReportModal from './../../components/Modal/ReportModal';

const RepOverview: React.FC = () => {
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const { apiBaseURL } = lfConfig;

    const other_promotional_assets = comProfile.other_promotional_assets? JSON.parse(comProfile.other_promotional_assets): [];
    const special_features = comProfile.special_features? JSON.parse(comProfile.special_features): [];
    const member_organizations = comProfile.member_organizations? JSON.parse(comProfile.member_organizations): [];
    const [showReportModal, setShowReportModal] = useState(false);

    const logoImage = (Object.keys(comProfile).length > 0 && comProfile.company_logo) ? `${apiBaseURL}uploads/member/${comProfile.mem_id}/${comProfile.company_logo}` : `${basename}/assets/img/placeholder.png`;

    let comAddress = comProfile.address1? comProfile.address1: '';
    comAddress += comProfile.address2? ','+comProfile.address2: '';
    comAddress += comProfile.city? ','+comProfile.city: '';
    comAddress += comProfile.state? ','+comProfile.state: '';
    comAddress += comProfile.country? ','+comProfile.country: '';
    comAddress += comProfile.postal? ','+comProfile.postal: ''; 

    let repAddress = repProfile.address1? repProfile.address1: '';
    repAddress += repProfile.address2? ','+repProfile.address2: '';
    repAddress += repProfile.city? ','+repProfile.city: '';
    repAddress += repProfile.state? ','+repProfile.state: '';
    repAddress += repProfile.country? ','+repProfile.country: '';
    repAddress += repProfile.postal? ','+repProfile.postal: ''; 
    

    return (<>
        { Object.keys(repProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <div className="py-3">
                    <img src={logoImage} alt="Company Logo" />
                </div>
                <p>
                    <IonText><b>General Contact Information</b></IonText>
                </p>
                <IonList>
                    {comProfile.address1 && <IonItem lines="none">
                        <IonAvatar slot="start">
                            <i className="fa fa-address-card-o fa-lg green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            { comProfile.address1 && <p>{comProfile.address1}</p>}
                            { comProfile.address2 && <p>{comProfile.address2}</p>}
                            { comProfile.city && <p>{`${comProfile.city}, ${comProfile.state}`}</p>}
                            { comProfile.postal && <p>{`${comProfile.country}, ${comProfile.postal}`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { comProfile.phone && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={callOutline}></IonIcon>
                        <IonLabel>
                            { comProfile.phone_code && comProfile.phone && <p>{`${comProfile.phone_code} ${comProfile.phone}`}</p> }
                            { comProfile.phoneext && <p>{`Ext: ${comProfile.phoneext}`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { comProfile.mobile && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={phonePortraitOutline}></IonIcon>
                        <IonLabel>
                            { comProfile.mobile_code && comProfile.mobile && <p>{`${comProfile.mobile_code} ${comProfile.mobile}`}</p>}
                            { comProfile.fax && <p>{`Fax: ${comProfile.fax}`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { comProfile.email && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={mailOutline}></IonIcon>
                        <IonLabel>
                            { comProfile.email && <p><IonRouterLink href={`mailto:${comProfile.email}`}>Email</IonRouterLink></p>}
                        </IonLabel>
                    </IonItem>}
                    { comProfile.linkedin && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={logoLinkedin}></IonIcon>
                        <IonLabel>
                            { comProfile.linkedin && <IonRouterLink href={comProfile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</IonRouterLink>}
                        </IonLabel>
                    </IonItem>}
                    { comProfile.facebook && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={logoFacebook}></IonIcon>
                        <IonLabel>
                            { comProfile.facebook && <IonRouterLink href={comProfile.facebook} target="_blank" rel="noopener noreferrer">Facebook</IonRouterLink>}
                        </IonLabel>
                    </IonItem>}
                    { comProfile.twitter && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={logoTwitter}></IonIcon>
                        <IonLabel>
                            { comProfile.twitter && <p><IonRouterLink href={comProfile.twitter} target="_blank" rel="noopener noreferrer">Twitter</IonRouterLink></p>}
                        </IonLabel>
                    </IonItem>}
                    <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={locateOutline}></IonIcon>
                        <IonLabel>
                            <p><IonRouterLink target="_blank" href={encodeURI(`https://www.google.com/maps/search/${comAddress}`)}>Map</IonRouterLink></p>
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={alertCircleOutline}></IonIcon>
                        <IonLabel>
                            <p><IonRouterLink onClick={() => setShowReportModal(true)}>Report Profile</IonRouterLink></p>
                        </IonLabel>
                    </IonItem>
                    
                </IonList>

                <p  className="py-2"><b>Other Promotional Assets</b></p>
                { other_promotional_assets && other_promotional_assets.length > 0 && other_promotional_assets.map((item: any, index: number)=> {
                    return (<div className="pl-3" key={index}>
                        <p><IonRouterLink href={item.link} target="_blank" rel="noopener noreferrer">Other Link {index+1}</IonRouterLink></p>
                    </div>)
                })}

                <p  className="py-2"><b>Special Services</b></p>
                { special_features && special_features.length > 0 && special_features.map((item: any, index: number)=> {
                    return (<div className="pl-3" key={index}>
                        <IonText>
                            <p>{item.name}</p>
                        </IonText>
                    </div>)
                })} 
                <p className="py-2"><b>Member Organizations</b></p>
                { member_organizations && member_organizations.length > 0 && member_organizations.map((item: any, index: number)=> {
                    return (<div className="pl-3" key={index}>
                        <IonText>
                            <p>{item.name}</p>
                        </IonText>
                    </div>)
                })}  
                
                <div className="mt-3 fs-16">
                    <IonText><b>{`${repProfile.firstname} ${repProfile.lastname}`}</b></IonText>
                </div>
                <IonList>
                    { repProfile.phone && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={callOutline}></IonIcon>
                        <IonLabel>
                            { repProfile.phone_code && repProfile.phone && <p>{`${repProfile.phone_code} ${repProfile.phone}`}</p> }
                            { repProfile.phoneext && <p>{`Ext: ${repProfile.phoneext}`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { repProfile.mobile && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={phonePortraitOutline}></IonIcon>
                        <IonLabel>
                            { repProfile.mobile_code && repProfile.mobile && <p>{`${repProfile.mobile_code} ${comProfile.mobile}`}</p>}
                        </IonLabel>
                    </IonItem>}
                    { repProfile.email && <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={mailOutline}></IonIcon>
                        <IonLabel>
                            { repProfile.email && <p><IonRouterLink href={`mailto:${repProfile.email}`}>Email</IonRouterLink></p>}
                        </IonLabel>
                    </IonItem>}
                    <IonItem lines="none">
                        <IonIcon color="greenbg" slot="start" icon={locateOutline}></IonIcon>
                        <IonLabel>
                            <p><IonRouterLink target="_blank" href={encodeURI(`https://www.google.com/maps/search/${repAddress}`)}>Map</IonRouterLink></p>
                        </IonLabel>
                    </IonItem>
                </IonList>
                
            </IonCardContent>
        </IonCard>}

        <IonModal isOpen={showReportModal} cssClass='my-custom-class'>
          { Object.keys(repProfile).length > 0 && <ReportModal
            showReportModal={showReportModal}
            setShowReportModal={setShowReportModal} />}
        </IonModal>
    </>);
};
  
export default RepOverview;
  