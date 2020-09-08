import { IonContent, IonPage } from '@ionic/react'; // IonCardContent, IonCard, IonCardHeader, IonCardTitle 
import React, {useCallback, useEffect} from 'react';
import { useParams } from "react-router-dom";
import CoreService from '../../../shared/services/CoreService';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';
// import ProfileImage from './ProfileImage';
import ProfileInfo from './ProfileInfo';
import ContactInfo from './ContactInfo';
import AboutProfile from './AboutProfile';
import B2B from './B2B';
import B2C from './B2C';
import ProfileAndLogo from './ProfileAndLogo';
import RepActions from './RepActions';

const RepProfile: React.FC = () => {
  const dispatch = useDispatch();
  const repProfile = useSelector( (state:any) => state.rep.repProfile);
  const memOpts = useSelector( (state:any) => state.auth.memOptions );
  // const [member, setMember] = useState<null | IntfMember>(null);
  let { repid,memid } = useParams();

  const onGetMemberCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(repActions.setMemberProfile({ data: res.data.user }));
      if(res.data.b2b){
        dispatch(repActions.setB2B({ data: res.data.b2b }));
      }
      if(res.data.b2c){
        dispatch(repActions.setB2C({ data: res.data.b2c }));
      }
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
      CoreService.onPostFn('get_member', data, onGetMemberCb);
    }
  }, [dispatch, onGetMemberCb, memid, repid]);

  return (
    <IonPage className="repprofile-page">
      { repProfile && Object.keys(repProfile).length > 0 && 
        <IonContent>
          { +(repProfile.suspended_by) !== 0 && 
          <div className="alert alert-warning" role="alert">
            
            { +(repProfile.suspended_by) === 1? `Rep Profile was suspended by Primary member` : `Rep Profile was suspended by Admin`  }
          </div>}
          <ProfileAndLogo />
          <ProfileInfo />
          <ContactInfo />
          { memOpts && ([1,3].includes(parseInt(memOpts.buscat_type))) === true  && <B2B /> }
          { memOpts && ([2,3].includes(parseInt(memOpts.buscat_type))) === true  && <B2C /> }
          <AboutProfile />
          <RepActions />
        </IonContent> 
      } 
    </IonPage>
  );
};

export default RepProfile;
