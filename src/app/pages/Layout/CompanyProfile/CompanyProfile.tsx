import { IonContent, IonPage } from '@ionic/react'; // IonCardContent, IonCard, IonCardHeader, IonCardTitle 
import React, {useCallback, useEffect} from 'react';
import CoreService from '../../../shared/services/CoreService';
import './CompanyProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';
import CompanyInfo from './CompanyInfo';
import OtherInfo from './OtherInfo';
import AboutCompany from './AboutCompany';
/*import B2B from './B2B';
import B2C from './B2C';*/
import CompanyAndLogo from './CompanyAndLogo';

const CompanyProfile: React.FC = () => {
  const dispatch = useDispatch();
  const memid = useSelector( (state:any) => state.auth.data.user.ID);
  const comProfile = useSelector( (state:any) => state.rep.comProfile);
  // const memOpts = useSelector( (state:any) => state.auth.memOptions );

  const onGetMemberCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(repActions.setCompanyProfile({ data: res.data.company }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( memid ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        memID: memid
      };
      CoreService.onPostFn('get_company', data, onGetMemberCb);
    }
  }, [dispatch, onGetMemberCb, memid]);

  return (
    <IonPage className="company-profile-page">
      { comProfile && 
        <IonContent>
            <CompanyAndLogo />
            <CompanyInfo />
            <OtherInfo />
            {/*{ ([1,3].includes(parseInt(memOpts.buscat_type))) === true  && <B2B /> }
            { ([2,3].includes(parseInt(memOpts.buscat_type))) === true  && <B2C /> } */}
            <AboutCompany />
        </IonContent> 
      } 
    </IonPage>
  );
};

export default CompanyProfile;
