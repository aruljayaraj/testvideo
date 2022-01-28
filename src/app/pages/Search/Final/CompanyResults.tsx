import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';
import ViewRepresentatives from "./ViewRepresentatives";
import ComResContent from './ComResContent';
import RegionNonMemResults from './RegionNonMemResults';

const CompanyResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const { apiBaseURL, basename } = lfConfig;
  const location = useSelector( (state:any) => state.auth.location);
  const companyResults = useSelector( (state:any) => state.search.companyResults); // console.log(companyResults);

  const mainSearchSettings = { company_name: '' };
  const { company_name } = (props.location && props.location.state)? props.location.state : mainSearchSettings;
  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(searchActions.setCompanyResults({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { // console.log("Meow", key , type , display);
    if(company_name ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'company_search',
        location,
        keyword: company_name
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, company_name, location]);

  // if(!props.location || !props.location.state){
  //   return <Redirect to="/" />;
  // }

  return (
    <IonPage className="search-page">
      <IonContent>
        { companyResults && companyResults['Mem'] && companyResults['Mem'].length > 0 && <ComResContent title="Your Premium Suppliers" results={companyResults['Mem']} type="Mem" /> }
        { companyResults && companyResults['Non'] && companyResults['Non'].length > 0 && <RegionNonMemResults results={companyResults['Non']} title="Your Local Non-registered Suppliers (Not Verified)" /> } 
      </IonContent>
    </IonPage>
  );
};

export default React.memo(CompanyResults);
