import { IonContent, IonPage } from '@ionic/react';
import React, {useCallback, useEffect} from 'react';
import CoreService from '../../../shared/services/CoreService';
import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as repActions from '../../../store/reducers/dashboard/rep';
// import { IntfMember } from '../../../interfaces/Member';
import ProfileSetup from './ProfileSetup';
import Notification from './Notification';

const Dashboard: React.FC = () => {
  const authValues = useSelector( (state:any) => state.auth.data);
  const dispatch = useDispatch();

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(repActions.setMemberProfile({ data: res.data.user }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( authValues && +(authValues.user.mem_level) !== 0 ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'get_member',
        memID: authValues.user.ID,
        repID: authValues.user.repID
      };
      CoreService.onPostFn('get_member', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, authValues]);
  return (
    <IonPage className="dashboard-page">
      <IonContent>
      { +(authValues.user.mem_level) === 0 &&  
         <ProfileSetup />
      }
      { +(authValues.user.mem_level) !== 0 &&  
         <Notification  />
      }
      
      </IonContent> 
    </IonPage>
  );
};

export default Dashboard;
