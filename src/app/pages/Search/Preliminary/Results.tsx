import { IonContent, IonPage } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { Redirect, useLocation } from "react-router-dom";
import CoreService from '../../../shared/services/CoreService';
import '../Search.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
import PreProducts from './PreProducts';
import PreDeals from './PreDeals';
import PreNews from './PreNews';

const PreliminaryResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const location = useSelector( (state:any) => state.auth.location);

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
  const searchSettings = { b2b: true, b2c: false, br: false, d: false, bn: false, keyword: '', display: '', type: '' };
  const { b2b, b2c, br, d, bn, keyword, display, type } = (props.location && props.location.state)? props.location.state : searchSettings;

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(searchActions.setPreResults({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch, b2b, b2c, br, d, bn, keyword]);

  useEffect(() => { // console.log("Meow", key , type , display);
    if(keyword || (type && display) ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'preliminery_search',
        filters: {b2b, b2c, br, d, bn},
        keyword,
        location,
        display,
        type
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, keyword, display, type]);

  if(!props.location || !props.location.state){
    return <Redirect to="/" />;
  }

  return (
    <IonPage className="search-page">
        <IonContent>
          { (b2b === true || b2c === true) && <PreProducts filters={{b2b, b2c}} /> }
          { d === true && <PreDeals /> }
          { bn === true && <PreNews /> }
        </IonContent>
    </IonPage>
  );
};

export default PreliminaryResults;
