import { IonContent, IonPage } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import CoreService from '../../../shared/services/CoreService';
import '../Search.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
import RegionResults from './RegionResults';
import RegionNonMemResults from './RegionNonMemResults';

const FinalResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const location = useSelector( (state:any) => state.auth.location);
  const localResults = useSelector( (state:any) => state.search.finalResults.local);
  const localNonMemResults = useSelector( (state:any) => state.search.finalResults.localNonMem);
  const regionalResults = useSelector( (state:any) => state.search.finalResults.regional);
  const nationalResults = useSelector( (state:any) => state.search.finalResults.national);
  const internationalResults = useSelector( (state:any) => state.search.finalResults.international);

  const mainSearchSettings = { category: '', keyword: '' };
  const { category, keyword } = (props.location && props.location.state)? props.location.state : mainSearchSettings;

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(searchActions.setFinalResults({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { // console.log("Meow", type , category);
    if(category){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'final_search',
        location,
        category
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, category, location]);

  // if(!props.location || !props.location.state){
  //   return <Redirect to="/" />;
  // }

  return (
    <IonPage className="search-page">
      <IonContent>
        <h4 className='ml-4 fs-18'>Search Result : {`${category} `}</h4>
        { localResults && localResults.length > 0 && <RegionResults region="local" /> }
        { localNonMemResults && localNonMemResults.length > 0 && <RegionNonMemResults results={localNonMemResults} title="Your Local-First Business Listing" /> }
        { regionalResults && regionalResults.length > 0 && <RegionResults region="regional" /> }
        { nationalResults && nationalResults.length > 0 && <RegionResults region="national" /> }
        { internationalResults && internationalResults.length > 0 && <RegionResults region="international" /> }
      </IonContent>
    </IonPage>
  );
};

export default FinalResults;
