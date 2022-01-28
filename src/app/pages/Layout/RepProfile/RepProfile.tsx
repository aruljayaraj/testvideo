import { IonContent, IonPage } from '@ionic/react'; // IonCardContent, IonCard, IonCardHeader, IonCardTitle 
import React, {useCallback, useEffect} from 'react';
import { useParams } from "react-router-dom";
import CoreService from '../../../shared/services/CoreService';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';
import ProfileInfo from './ProfileInfo';
import ContactInfo from './ContactInfo';
import AboutProfile from './AboutProfile';
import Buscats from './Buscats';
import ProfileAndLogo from './ProfileAndLogo';
import RepActions from './RepActions';

const RepProfile: React.FC = () => {
  const dispatch = useDispatch();
  const repProfile = useSelector( (state:any) => state.rep.repProfile);
  const memOpts = useSelector( (state:any) => state.auth.memOptions );
  let { repid, memid } = useParams<any>();

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(repActions.setMemberProfile({ data: res.data.user }));
      if(res.data.buscats){
        dispatch(repActions.setBuscats({ data: res.data.buscats }));
      }
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( memid && repid ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'get_member',
        memID: memid,
        repID: repid
      };
      CoreService.onPostFn('get_member', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, memid, repid]);

  return (
    <IonPage className="repprofile-page">
      { repProfile && Object.keys(repProfile).length > 0 && 
        <IonContent>
          { [2,3].includes(parseInt(repProfile.is_active)) && 
          <div className="alert alert-warning" role="alert">
            { +(repProfile.is_active) === 2? `Rep Profile was suspended by Primary member` : `Rep Profile was suspended by Admin`  }
          </div>}
          <ProfileAndLogo />
          <ProfileInfo />
          <ContactInfo />
          { memOpts && ([1,2].includes(parseInt(memOpts.buscat_type))) === true  && <Buscats /> }
          <AboutProfile />
          <RepActions />
        </IonContent> 
      } 
    </IonPage>
  );
};

export default RepProfile;
