import { IonContent, IonPage } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import CoreService from '../../../shared/services/CoreService';
import '../Search.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
import RegionResults from './RegionResults';

const FinalResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const location = useSelector( (state:any) => state.auth.location);
  const localResults = useSelector( (state:any) => state.search.finalResults.local);
  const regionalResults = useSelector( (state:any) => state.search.finalResults.regional);
  const nationalResults = useSelector( (state:any) => state.search.finalResults.national);
  const internationalResults = useSelector( (state:any) => state.search.finalResults.international);

  const mainSearchSettings = { category: '', type: '' };
  const { category, type } = (props.location && props.location.state)? props.location.state : mainSearchSettings;

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(searchActions.setFinalResults({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { // console.log("Meow", key , type , display);
    if(category && type ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'final_search',
        location,
        category,
        type
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, category, type, location]);

  // if(!props.location || !props.location.state){
  //   return <Redirect to="/" />;
  // }

  return (
    <IonPage className="search-page">
      <IonContent>
        { localResults && localResults.length > 0 && <RegionResults btype={type} region="local" /> }
        { regionalResults && regionalResults.length > 0 && <RegionResults btype={type} region="regional" /> }
        { nationalResults && nationalResults.length > 0 && <RegionResults btype={type} region="national" /> }
        { internationalResults && internationalResults.length > 0 && <RegionResults btype={type} region="international" /> }
      </IonContent>
    </IonPage>
  );
};

export default FinalResults;
