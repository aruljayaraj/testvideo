import { IonCard, IonCardContent, IonCol, IonContent, IonPage, IonRow } from '@ionic/react'; 
import React, {useCallback, useEffect, useState, useLayoutEffect} from 'react';
import { useParams } from "react-router-dom";
import CoreService from '../../../../shared/services/CoreService';
import { isPlatform } from '@ionic/react';
import '../../../Profile/Profile.scss';
import { lfConfig } from '../../../../../Constants';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../../store/reducers/dashboard/rep';
import * as resActions from '../../../../store/reducers/dashboard/resource';
import * as dealActions from '../../../../store/reducers/dashboard/deal';
import * as prActions from '../../../../store/reducers/dashboard/pr';
import * as uiActions from '../../../../store/reducers/ui';
import PartnerAds from '../../../../components/Common/PartnerAds';

import Overview from '../../../Profile/Overview';
import RepOverview from '../../../Profile/RepOverview';
import Buscats from '../../../Profile/Buscats';
import Resources from '../../../Profile/Resources';
// import Deals from './Deals';
import ProfileItems from '../../../Profile/ProfileItems';
import GeneralInfo from '../../../Profile/GeneralInfo';

const PreviewProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { ADS } = lfConfig;
  const comProfile = useSelector( (state:any) => state.rep.comProfile);
  let { memid, repid } = useParams<any>();
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(repActions.setMemberProfile({ data: res.data.user }));
      if(res.data.buscats){
        dispatch(repActions.setBuscats({ data: res.data.buscats }));
      }
      if(res.data.resources){
        dispatch(resActions.setResources({ data: res.data.resources }));
      }
      if(res.data.deals){
        dispatch(dealActions.setDeals({ data: res.data.deals }));
      }
      if(res.data.deals){
        dispatch(dealActions.setDeals({ data: res.data.deals }));
      }
      if(res.data.prs){
        dispatch(prActions.setPressReleases({ data: res.data.prs }));
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
            <IonCol sizeSm="7" sizeLg="6">
              <Overview />
              <RepOverview />
              <Buscats />
              <Resources />
              <ProfileItems />
            </IonCol>

            <IonCol sizeSm="5" sizeLg="3" sizeXl="3">
              <GeneralInfo />
              { (width < 992) && <div className="mt-4 side-ads-container">
              <PartnerAds limit={ADS.PROFILE} /> 
              </div>}
            </IonCol>

            { (width >= 992) && 
            <IonCol sizeXs="12" sizeLg="3" sizeXl="3" className="mt-4 side-ads-container">
              <PartnerAds limit={ADS.PROFILE} />
            </IonCol>
            }
          </IonRow>
            
        </IonContent> 
      } 
    </IonPage>
  );
};

export default PreviewProfile;
