import { IonContent, IonPage } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import CoreService from '../../../shared/services/CoreService';
import '../Search.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
import PreProducts from './PreProducts';
import PreListItems from './PreListItems';
import { lfConfig } from '../../../../Constants';
import PreCompany from './PreCompany';

const PreliminaryResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const location = useSelector( (state:any) => state.auth.location);
  const { LOCAL_DEAL, PRESS_RELEASE, RESOURCE } = lfConfig;
  // const searchSettings = { b2b: true, b2c: false, br: false, d: false, bn: false, keyword: '', display: '', type: '' };
  // const { b2b, b2c, br, d, bn, cn, keyword, display, type } = (props.location && props.location.state)? props.location.state : searchSettings;
  const searchSettings = { filterBy: 'b2b', keyword: '', display: '', type: '' };
  const { filterBy, keyword, display, type } = (props.location && props.location.state)? props.location.state : searchSettings;

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(searchActions.setPreResults({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch, filterBy, keyword]);

  useEffect(() => { // console.log("Meow", key , type , display);
    if(keyword || (type && display) ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'preliminary_search',
        filters: {filterBy},
        keyword,
        location,
        display,
        type
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, filterBy, keyword, location, display, type]);

  if(!props.location || !props.location.state){
    return <Redirect to="/" />;
  }

  return (
    <IonPage className="search-page">
        <IonContent>
          { (filterBy === 'b2b' || filterBy === 'b2c') && <PreProducts filters={{filterBy}} /> }
          { filterBy === 'd' === true && <PreListItems itemType={LOCAL_DEAL} /> }
          { filterBy === 'bn' && <PreListItems itemType={PRESS_RELEASE} /> }
          { filterBy === 'br' && <PreListItems itemType={RESOURCE} /> }
          { filterBy === 'cn' && <PreCompany /> }
        </IonContent>
    </IonPage>
  );
};

export default PreliminaryResults;
