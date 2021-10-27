import {  
    IonCard, 
    IonCardHeader,  
    IonCardContent,
    IonCardTitle,
    IonText,
    IonRouterLink
  } from '@ionic/react';
import React from 'react';
import './Dashboard.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';

const Notification: React.FC = () => {
    const authValues = useSelector( (state:any) => state.auth.data);
    const memOpts = useSelector( (state:any) => state.auth.memOptions);
    const repProfile = useSelector( (state:any) => state.rep.repProfile); 
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const { basename } = lfConfig;

    return (<>
        <IonCard className="card-center mt-4">
            <IonCardHeader color="light">
                <IonCardTitle className="card-custom-title">Dashboard</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            Dashboard Content goes here
            </IonCardContent>
        </IonCard>
        { +(authValues.user.mem_level) !== 0 
        && ( (memOpts && [1,3].includes(parseInt(memOpts.profile)) === true && comProfile && Object.keys(comProfile).length > 0 && (!comProfile.country || !comProfile.description))
           || ( memOpts && [2,3].includes(parseInt(memOpts.profile)) === true && repProfile && Object.keys(repProfile).length > 0 && (!repProfile.country || !repProfile.phone || !repProfile.profile_description) )
        ) &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="light">
                <IonCardTitle color="medium" className="ion-text-center card-custom-title">
                    Complete Your Profile Set Up
                </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <p className="mt-4 mb-3">
                    <IonText>In order to serve better need the following things to complete.</IonText>
                </p>
                { repProfile && (!repProfile.country || !repProfile.phone || !repProfile.profile_description) && 
                    <p><IonRouterLink href={`${basename}/layout/rep-profile/${repProfile.mem_id}/${repProfile.id}`}>Complete your { parseInt(memOpts.profile) === 2? 'Profile': 'Rep Profile'}</IonRouterLink></p>
                }
                { comProfile && (!comProfile.country || !comProfile.description) && authValues.user.accType === 'full' &&
                    <p><IonRouterLink href={`${basename}/layout/company-profile`}>Complete your Company Profile</IonRouterLink></p> 
                }
            </IonCardContent>
        </IonCard> 
        }
    </>);
};
  
export default Notification;
  