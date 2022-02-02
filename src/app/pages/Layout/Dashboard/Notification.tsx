import {  
    IonCard, 
    IonCardHeader,  
    IonCardContent,
    IonCardTitle,
    IonText,
    IonRouterLink,
    IonPopover,
    IonList,
    IonItem
  } from '@ionic/react';
import React, {useState} from 'react';
import './Dashboard.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import { nanoid } from 'nanoid';

const Notification: React.FC = () => {
    const authValues = useSelector( (state:any) => state.auth.data);
    const memOpts = useSelector( (state:any) => state.auth.memOptions);
    const repProfile = useSelector( (state:any) => state.rep.repProfile); 
    const reps = useSelector( (state:any) => state.rep.reps);
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const { basename } = lfConfig;
    const [showPopover, setShowPopover] = useState(false);

    return (<>
        <IonCard className="card-center mt-4">
            <IonCardHeader color="light">
                <IonCardTitle className="card-custom-title">Dashboard</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <p>Dashboard Content goes here</p>
                
                { reps && reps.length > 0 && <div className="view-profiles-wrap">
                    {reps.length === 1 && <IonRouterLink slot="end" color="greenbg" className="float-right view-profiles-btn-single" routerLink={`${basename}/layout/profile/${reps[0].mem_id}/${reps[0].rep_id}`} title="View Profile">
                            <i className="fa fa-user fa-lg cursor" aria-hidden="true"></i>
                        </IonRouterLink>
                    }
                    {reps.length > 1 && <IonRouterLink slot="end" color="greenbg" onClick={() => setShowPopover(true)} className="float-right view-profiles-btn-group" title="View Profiles">
                            <i className="fa fa-users fa-lg cursor" aria-hidden="true"></i>
                        </IonRouterLink>
                    }
                    <IonPopover
                        mode="md"
                        isOpen={showPopover}
                        className='profiles-list-popover'
                        onDidDismiss={e => setShowPopover(false)}
                    >
                        {  reps && reps.length > 1 && <IonList className="p-3">
                            { reps.map((item: any, index: number) => {
                                return <IonItem key={nanoid()} lines={ reps.length === (index+1)? "none": "full"} button>
                                        <IonRouterLink className="py-3" key={index} routerLink={`${basename}/layout/profile/${item.mem_id}/${item.rep_id}`}>
                                            <i className="fa fa-user fa-lg cursor pr-3" aria-hidden="true"></i>
                                            {`${item.firstname} ${item.lastname}`}
                                        </IonRouterLink>
                                    </IonItem>
                            })}
                        </IonList> }
                    </IonPopover>
                </div>}
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
                    <IonText>In order to serve you better complete your profile. Once you complete your profile you will have access to the Local Quotes system, Press Release and the Local Deals system as well as the Resource Uploads system.</IonText>
                </p>
                { repProfile && (!repProfile.country || !repProfile.phone || !repProfile.profile_description) && 
                    <p><IonRouterLink href={`${basename}/layout/rep-profile/${repProfile.mem_id}/${repProfile.id}`}>Complete your { parseInt(memOpts.profile) === 2? 'Profile': 'Rep Profile'}</IonRouterLink></p>
                }
                { comProfile && (!comProfile.country || !comProfile.description) && authValues.user.accType === 'full' && [1,2,3].includes(+(repProfile.mem_level)) &&
                    <p><IonRouterLink href={`${basename}/layout/company-profile`}>Complete your Company Profile</IonRouterLink></p> 
                }
            </IonCardContent>
        </IonCard> 
        }
           
    </>);
};
  
export default Notification;
  