import { IonContent, IonPage } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import '../Search.scss';
import CoreService from '../../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
import ComResContent from './ComResContent';
import RegionNonMemResults from './RegionNonMemResults';

const CompanyResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const location = useSelector( (state:any) => state.auth.location);
  const companyResults = useSelector( (state:any) => state.search.companyResults); // console.log(companyResults);

  const mainSearchSettings = { company_name: '', city: '' }; 
  const { company_name, city } = (props.location && props.location.state)? props.location.state : mainSearchSettings;
  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(searchActions.setCompanyResults({ data: res.data })); // console.log(res.data);
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
        keyword: company_name,
        city
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, company_name, location, city]);

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
