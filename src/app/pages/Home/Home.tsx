import { IonPage, IonContent, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import './Home.scss';
// import mixitup from 'mixitup';
import CoreService from '../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import * as searchActions from '../../store/reducers/search';
import * as uiActions from '../../store/reducers/ui';
import { lfConfig } from '../../../Constants';
import HomeItems from './HomeItems';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { basename } = lfConfig;
  const [filterData, setFilterData] = useState<any>({ filter: 'all', page: 1});
  const location = useSelector( (state:any) => state.auth.location);
  const homeResults = useSelector( (state:any) => state.search.homeResults.items);
  const homeResTotal = useSelector( (state:any) => state.search.homeResults.total);
  // const { LOCAL_DEAL, PRESS_RELEASE, RESOURCE } = lfConfig;
  
  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){ 
      dispatch(searchActions.setHomeResults({ data: res.data, total: res.total, actionFrom: res.actionFrom }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      action: 'home',
      filter: filterData.filter,
      location,
      page:filterData.page,
      platform: isPlatform('desktop')? 'desktop': 'mobile'
    };
    CoreService.onPostFn('search', data, onCallbackFn);
  }, [dispatch, onCallbackFn]);

  // const handleTakeVideo = () => {
  //   console.log('Meow');
  // }

  const handleLoadMore = useCallback((e: any, filter) => {
    const pageCount = filter.page + 1;
    setFilterData({...filter, page: pageCount});
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      action: 'home',
      filter: filter.filter,
      actionFrom: 'loadmore',
      location,
      page: pageCount,
      platform: isPlatform('desktop')? 'desktop': 'mobile'
    };
    CoreService.onPostFn('search', data, onCallbackFn);
    
  },[]);

  const handleFilter = useCallback((e: any) => {
    const fltr = e.detail.value;
    setFilterData({...filterData, filter: fltr, page: 1});
    dispatch(searchActions.setHomeResults({ data: [], actionFrom: '', total:0 }));
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      action: 'home',
      filter: fltr,
      location,
      page: 1,
      platform: isPlatform('desktop')? 'desktop': 'mobile'
    };
    CoreService.onPostFn('search', data, onCallbackFn);
  }, []);
  
  return (
    <IonPage className="homepage">
      <IonContent>
        <h3 className="ion-text-center fw-bold fs-20">Shop LocalFirst {location.city? `in ${location.city}`: ''}</h3>
        <IonToolbar className="p-3">
          <IonSegment mode="ios" className="filter-toolbar" scrollable value={filterData.filter} onIonChange={(e) => handleFilter(e)}>
            <IonSegmentButton className="tb-item" value="all" >
              <IonLabel className="ion-text-capitalize">All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton className="tb-item" value="localdeals">
              <IonLabel className="ion-text-capitalize">Local Deals</IonLabel>
            </IonSegmentButton>
            <IonButton className="tb-item" size={!(isPlatform('desktop'))? 'small': 'default'} color="greenbg" shape="round" fill="outline" routerLink={`${basename}/signup`}>Get Quotes</IonButton>
            <IonSegmentButton className="tb-item" value="pressreleases">
              <IonLabel className="ion-text-capitalize">{(isPlatform('desktop'))? `Business News`:`Bus. News`}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        <IonGrid className="pb-4 home-container ion-padding">
          <IonRow>
            <IonCol sizeXs="12" sizeSm="9">
              <div className="filter-container space-between">
                <HomeItems />
              </div>
              { homeResults.length < homeResTotal &&
              <div className="my-3 ion-text-center">
                <IonButton color="greenbg" className="ion-margin-top" type="button" onClick={(e) => handleLoadMore(e, filterData)}>
                  More Results
                </IonButton>
              </div>}
            </IonCol>
            <IonCol sizeXs="12" sizeSm="3">
              <p className="ion-text-center">Your Local-First Sponcers</p>
              <img src={`${basename}/assets/img/placeholder.png`} className="mb-2"/>
              <img src={`${basename}/assets/img/placeholder.png`} className="mb-2"/>
              <img src={`${basename}/assets/img/placeholder.png`} className="mb-2"/>
              <img src={`${basename}/assets/img/placeholder.png`} className="mb-2"/>
              <img src={`${basename}/assets/img/placeholder.png`} className="mb-2"/>
            </IonCol>
          </IonRow>
        </IonGrid>
        
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
