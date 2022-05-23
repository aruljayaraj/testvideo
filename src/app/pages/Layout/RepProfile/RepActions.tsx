import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
    IonRouterLink
  } from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { 
    ellipsisHorizontalOutline,
    trashOutline,
    pauseOutline,
    playOutline
  } from 'ionicons/icons';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import * as uiActions from '../../../store/reducers/ui';
import * as authActions from '../../../store/reducers/auth';
import CoreService from '../../../shared/services/CoreService';
import * as repActions from '../../../store/reducers/dashboard/rep';

const RepActions: React.FC = () => {
    const dispatch = useDispatch(); 
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [delRep, setDelRep] = useState({ status: false, memID: '', repID: ''  });
    const { basename } = lfConfig;

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(repActions.setRepProfile({ data: res.data.rep }));
            if( res.redirect === true ){
                dispatch(authActions.setMenu({ menu: res.data.menu }));
                setDelRep({ status: true, memID: res.data.rep.mem_id, repID: res.data.rep.id  });
            }
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSuspend = () => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'profile_suspend',
            memID: repProfile.mem_id,
            repID: repProfile.id,
        };
        CoreService.onPostFn('member_update', fd, onCallbackFn);
    }

    const onActivate = () => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'profile_activate',
            memID: repProfile.mem_id,
            repID: repProfile.id,
        };
        CoreService.onPostFn('member_update', fd, onCallbackFn);
    }

    const onDelete = () => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'profile_delete',
            memID: repProfile.mem_id,
            repID: repProfile.id,
        };
        CoreService.onPostFn('member_update', fd, onCallbackFn);
    }
    /*const onProfileView = () => { // mem_id: number, rep_id: number
        console.log('Meow');
        return <Redirect to={`${basename}/profile/${repProfile.mem_id}/${repProfile.id}`} />;
    }*/

    if( delRep.status  ){
        return <Redirect to={`/layout/rep-profile/${delRep.memID}/${delRep.repID}`} />;
    }

    return (<>
        { repProfile && Object.keys(repProfile).length > 0 &&
        <IonFab horizontal="end" vertical="bottom" slot="fixed">
            <IonFabButton color="greenbg">
                <IonIcon icon={ellipsisHorizontalOutline} />
            </IonFabButton>
            <IonFabList side="start">
                
                { +(repProfile.is_primary) === 0 && repProfile.rep_account === 'sub' && <>
                    <IonFabButton color="greenbg" title="To Delete" onClick={()=> onDelete()}>
                        <IonIcon icon={trashOutline}></IonIcon>
                    </IonFabButton>
                    { [0,1].includes(+(repProfile.is_active)) &&
                        <IonFabButton color="greenbg" title="To Suspend" onClick={() => onSuspend()}>
                            <IonIcon icon={pauseOutline}></IonIcon>
                        </IonFabButton> 
                    }
                    { +(repProfile.is_active) === 2 &&
                        <IonFabButton color="greenbg" title="To Activate" onClick={() => onActivate()}>
                            <IonIcon icon={playOutline}></IonIcon>
                        </IonFabButton>
                    }
                </>}
                <IonFabButton color="greenbg" title="To View">
                    <IonRouterLink color="blackbg" href={`${basename}/profile/${repProfile.mem_id}/${repProfile.id}`}>
                        {/* <IonIcon icon={eyeOutline} size="small"></IonIcon> */}
                        <i className="fa fa-eye fa-lg" aria-hidden="true"></i>
                    </IonRouterLink>
                </IonFabButton>
            </IonFabList>
        </IonFab>
        }
        
    </>);
};
  
export default RepActions;
  
