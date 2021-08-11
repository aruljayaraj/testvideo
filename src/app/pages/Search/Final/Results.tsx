import { IonContent, IonPage } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { Redirect, useLocation } from "react-router-dom";
import CoreService from '../../../shared/services/CoreService';
import '../Search.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
// import PreProducts from './PreProducts';
// import PreDeals from './PreDeals';
// import PreNews from './PreNews';
import LocalResults from './LocalResults';

const FinalResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const location = useSelector( (state:any) => state.auth.location);
  const localResults = useSelector( (state:any) => state.search.finalResults.local);

  // function useQuery() {
  //   return new URLSearchParams(useLocation().search);
  // }
  // console.log(props.location);

  /*let query = useQuery(); // console.log(query);
  const b2b = query.get("b2b");
  const b2c = query.get("b2c");
  const br = query.get("br");
  const d = query.get("d");
  const bn = query.get("bn");
  const key = query.get("key");
  const display = query.get("display");
  const type = query.get("type");*/
  const mainSearchSettings = { category: '', type: '' };
  const { category, type } = (props.location && props.location.state)? props.location.state : mainSearchSettings; console.log(props.location.state);

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
  }, [dispatch, onCallbackFn, category, type]);

  // if(!props.location || !props.location.state){
  //   return <Redirect to="/" />;
  // }

  return (
    <IonPage className="search-page">
        <IonContent>
          { localResults && localResults.length > 0 && <LocalResults /> }
          { /*{ d === true && <PreDeals /> }
          { bn === true && <PreNews /> } */}
        </IonContent>
    </IonPage>
  );
};

export default FinalResults;
