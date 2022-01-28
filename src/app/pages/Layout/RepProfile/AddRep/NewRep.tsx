import { IonContent, IonPage } from '@ionic/react';
import React, {useCallback, useEffect} from 'react';
import CoreService from '../../../../shared/services/CoreService';
import './NewRep.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../../store/reducers/ui';
import NewRepProfileInfo from './NewRepProfileInfo';

const NewRep: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector( (state:any) => state.auth.data.user );
  const repProfile = useSelector( (state:any) => state.rep.repProfile);
  
  const onGetMemberCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(repActions.setMemberProfile({ data: res.data.user }));
      if(res.data.buscats){
        dispatch(repActions.setBuscats({ data: res.data.buscats }));
      }
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( user && user.ID && user.repID ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'get_member',
        memID: user.ID,
        repID: user.repID
      };
      CoreService.onPostFn('get_member', data, onGetMemberCb);
    }
  }, [dispatch, onGetMemberCb, user]);

  return (
    <IonPage className="repprofile-page">
      { repProfile && Object.keys(repProfile).length > 0 && 
        <IonContent>
            <NewRepProfileInfo />
        </IonContent> 
      } 
    </IonPage>
  );
};

export default NewRep;