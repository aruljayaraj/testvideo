import { IonCard, IonCardContent, IonCardTitle, IonCol, IonContent, IonPage, IonRow, IonText } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { useParams } from "react-router-dom";
import CoreService from '../../shared/services/CoreService';
import './Profile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as resActions from '../../store/reducers/dashboard/resource';
import * as uiActions from '../../store/reducers/ui';
// import CompanyInfo from './CompanyInfo';
// import OtherInfo from './OtherInfo';
// import AboutCompany from './AboutCompany';
/*
import B2C from './B2C';*/
import Overview from './Overview';
import RepOverview from './RepOverview';
import Buscats from './Buscats';
import Resources from './Resources';
import GeneralInfo from './GeneralInfo';

const CompanyProfile: React.FC = () => {
  const dispatch = useDispatch();
  // const memid = useSelector( (state:any) => state.auth.data.user.ID);
  const repProfile = useSelector( (state:any) => state.rep.repProfile);
  const comProfile = useSelector( (state:any) => state.rep.comProfile);
  // const memOpts = useSelector( (state:any) => state.auth.memOptions );
  // const resources = useSelector( (state:any) => state.res.resources);

  let { memid, repid } = useParams<any>();

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(repActions.setMemberProfile({ data: res.data.user }));
      if(res.data.b2b){
        dispatch(repActions.setB2B({ data: res.data.b2b }));
      }
      if(res.data.b2c){
        dispatch(repActions.setB2C({ data: res.data.b2c }));
      }
      if(res.data.resources){
        dispatch(resActions.setResources({ data: res.data.resources }));
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
        action: 'get_profile_details',
        memID: memid,
        repID: repid
      };
      CoreService.onPostFn('get_member', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, memid, repid]);

  return (
    <IonPage className="profile-page">
      { comProfile && 
        <IonContent>
          <IonRow>
            <IonCol sizeMd="6">
              <Overview />
              <RepOverview />
              <Buscats />
              <Resources />
            </IonCol>

            <IonCol sizeMd="4">
              <GeneralInfo />
            </IonCol>

            <IonCol sizeMd="2">
              <IonCard className="card-center mt-4">
                <IonCardContent>
                  <div className="py-3">
                  Logo's content goes here
                  </div>
                </IonCardContent> 
              </IonCard>   
            </IonCol>
          </IonRow>
            
        </IonContent> 
      } 
    </IonPage>
  );
};

export default CompanyProfile;
