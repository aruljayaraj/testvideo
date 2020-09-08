import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList
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
import * as uiActions from '../../../store/reducers/ui';
import * as authActions from '../../../store/reducers/auth';
import CoreService from '../../../shared/services/CoreService';
import * as repActions from '../../../store/reducers/dashboard/rep';

const RepActions: React.FC = () => {
    const dispatch = useDispatch(); console.log('Actions');
    const repProfile = useSelector( (state:any) => state.rep.repProfile);   console.log(repProfile);
    const [delRep, setDelRep] = useState({ status: false, memID: '', repID: ''  });

    const onCallbackFn = useCallback((res: any) => { console.log(res);
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

    if( delRep.status  ){
        return <Redirect to={`/layout/rep-profile/${delRep.repID}/${delRep.memID}`} />;
    }

    return (<>
        { repProfile && Object.keys(repProfile).length > 0 && +(repProfile.is_primery) === 1 && repProfile.rep_account === 'sub' &&
        <IonFab horizontal="end" vertical="bottom" slot="fixed">
            <IonFabButton color="greenbg">
                <IonIcon icon={ellipsisHorizontalOutline} />
            </IonFabButton>
            <IonFabList side="start">
                <IonFabButton color="greenbg" title="To Delete" onClick={()=> onDelete()}>
                    <IonIcon icon={trashOutline}></IonIcon>
                </IonFabButton>
                { +(repProfile.suspended_by) === 0 &&
                <IonFabButton color="greenbg" title="To Suspend" onClick={() => onSuspend()}>
                    <IonIcon icon={pauseOutline}></IonIcon>
                </IonFabButton> }
                { +(repProfile.suspended_by) !== 0 &&
                <IonFabButton color="greenbg" title="To Activate" onClick={() => onActivate()}>
                    <IonIcon icon={playOutline}></IonIcon>
                </IonFabButton>
                }
            </IonFabList>
        </IonFab>
        }
        
    </>);
};
  
export default RepActions;
  
