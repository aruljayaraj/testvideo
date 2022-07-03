import { IonPage, IonContent, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonGrid, IonRow, IonCol, IonButton,
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  useIonViewWillEnter,
  IonList,
  IonItem,
  IonCard,
  IonSpinner
} from '@ionic/react';
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import './Home.scss';
import CoreService from '../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
// import * as searchActions from '../../store/reducers/search';
import * as commonActions from '../../store/reducers/common';
import * as uiActions from '../../store/reducers/ui';
import { lfConfig } from '../../../Constants';
import HomeItems from './HomeItems';
import PartnerAds from '../../components/Common/PartnerAds';
import axios from 'axios';
import { getPlatforms } from '@ionic/react';
import { Capacitor } from "@capacitor/core";

const Home: React.FC = () => { 
  const dispatch = useDispatch();
  const { basename, ADS } = lfConfig;
  const [filter, setFilter] = useState<any>('all');
  const [page, setPage] = useState<number>(1);
  const location = useSelector( (state:any) => state.auth.location);
  const [loading, setLoading] = useState(false);
  // const homeResults = useSelector( (state:any) => state.search.homeResults.items);
  // const homeResTotal = useSelector( (state:any) => state.search.homeResults.total); // console.log(homeResTotal);
  const [width, setWidth] = useState(0);
  //const [data, setData] = useState<string[]>([]);
  //const [total, setTotal] = useState<number>(0);
  //const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);

  const [homeResults, setHomeResults] = useState<string[]>([]);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

  

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const onCbAdsFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){ 
      dispatch(commonActions.setAds({ ads: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
  }, [dispatch]);
  useEffect(() => { 
      const data = {
        action: 'ads',
        location
      };
      CoreService.onPostFn('search', data, onCbAdsFn);
  }, [onCbAdsFn]);
  
  /*const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){ 
      if( res.actionFrom !== 'loadmore' ){ 
        // setTotal(res.total);
        dispatch(searchActions.setHomeResults({ data: res.data, total: res.total, actionFrom: res.actionFrom }));
      }
      setData( prevdata => [ ...prevdata, ...res.data ]);
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    if(width > 0){ console.log('One');
      setData([]);
      setInfiniteDisabled(false);
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'home',
        filter,
        location,
        page,
        pagewidth: width
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, width]);

  const handleLoadMore = useCallback((e: any) => { console.log('two'); console.log(filter);
      const pageCount = page + 1;
    
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'home',
        filter,
        actionFrom: 'loadmore',
        location,
        page: pageCount,
        pagewidth: window.innerWidth
      };
      CoreService.onPostFn('search', data, onCallbackFn);
      e.target.complete();
      console.log(pageCount * 2, homeResTotal);
      if( page * 2 >= homeResTotal ){
        setInfiniteDisabled(true);
      }
      setPage((prevPage:number) => prevPage + 1);
    // e.target.complete();
  },[]);*/

  /*useEffect(() => {
    if(width > 0){
      fetchData(true);
    }
  }, [width]);*/
  useEffect(() => {
    // if(width > 0){
      // setPage(1);
      setHomeResults([]);
      fetchData(true);
    // }
  }, [filter]);
  const handleFilter = useCallback((e: any) => { // console.log('Frome Filter');
    const fltr = e.detail.value;
    setPage(1);
    setFilter(fltr);
    //fetchData(true);
    /*dispatch(searchActions.setHomeResults({ data: [], actionFrom: '', total:0 }));
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      action: 'home',
      filter: fltr,
      location,
      page: 1,
      pagewidth: window.innerWidth
    };
    
    CoreService.onPostFn('search', data, onCallbackFn);*/
    
  }, []);

  async function fetchData(reset?: boolean, $event?:any) {
    if(page == 1){ setLoading(true); }
    const homeData: any[] = reset ? [] : homeResults;
    const data = {
      action: 'home',
      filter,
      location,
      page,
      pagewidth: width
    };
    axios.post(`v2/search`, data )
      .then( (res: any) => { // console.log(res);
        if (res.status === 200 && res.data.data && res.data.data.length > 0) { // console.log('True section');
          setHomeResults([...homeData, ...res.data.data]);
          setPage(prevPage => prevPage+1);
          setDisableInfiniteScroll(res.data.data.length < 2);
        } else { // console.log('False section');
            // dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message })); 
            setDisableInfiniteScroll(true);
        }
        if($event){
          // ($event.target as HTMLIonInfiniteScrollElement).complete();
          ($event.target).complete();
        }
        if(page == 1){ setLoading(false); }
      })
      .catch( (error: any) => { // console.log(error);
        dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error }));
        console.error(error);
        if(page == 1){ setLoading(false); }
      });
  }

  async function searchNext($event: CustomEvent<void>) {
      await fetchData(false, $event);
      // ($event.target as HTMLIonInfiniteScrollElement).complete();
  }
  
  return (
    <IonPage className="homepage">
      <IonContent>
        <h3 className="ion-text-center fw-bold fs-20">Shop LocalFirst {location.city? `in ${location.city}`: ''}</h3>
        <IonToolbar className="p-3">
          <IonSegment mode="ios" className="filter-toolbar" scrollable value={filter} onIonChange={(e) => handleFilter(e)}>
            <IonSegmentButton className="tb-item" value="all" >
              <IonLabel className="ion-text-capitalize fs-14">All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton className="tb-item" value="localdeals">
              <IonLabel className="ion-text-capitalize fs-14">Local Deals</IonLabel>
            </IonSegmentButton>
            <IonButton className="tb-item fs-14" size={!(isPlatform('desktop'))? 'small': 'default'} color="greenbg" shape="round" fill="outline" routerLink={`${basename}/signup`}>Get Quotes</IonButton>
            <IonSegmentButton className="tb-item" value="pressreleases">
              <IonLabel className="ion-text-capitalize fs-14">{(isPlatform('desktop'))? `Business News`:`Bus. News`}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>

        <IonGrid className="pb-4 home-container ion-padding" >
          <IonRow>
            <IonCol sizeXs="12" sizeMd="9" sizeXl="9">
              {/* <HomeItems dwidth={width}/>
              { homeResults.length < homeResTotal &&
              <div className="my-3 ion-text-center">
                <IonButton color="greenbg" className="ion-margin-top" type="button" onClick={(e) => handleLoadMore(e, filter)}>
                  More Results
                </IonButton>
              </div>} */}
              {loading && <div className="d-flex justify-content-center my-3"><IonSpinner name="dots" /></div> }
              { !loading && filter === 'localdeals' && homeResults.length === 0 && <div className="d-flex justify-content-center my-3 red">No Localdeals found.</div> }
              { !loading && filter === 'pressreleases' && homeResults.length === 0 && <div className="d-flex justify-content-center my-3 red">No Business News found.</div> }
              <HomeItems dwidth={width} homeResults={homeResults} />
              <IonRow>
                <IonCol>
                  <IonInfiniteScroll 
                    threshold="100px" 
                    disabled={disableInfiniteScroll}
                    onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                      <IonInfiniteScrollContent
                        loadingSpinner="dots"
                        loadingText="Loading more data..."
                      ></IonInfiniteScrollContent>
                  </IonInfiniteScroll>
                </IonCol>
              </IonRow>    

            </IonCol>
            { (isPlatform('desktop')) && 
            <IonCol sizeXs="12" sizeMd="3" sizeXl="3" className="side-ads-container">
              <PartnerAds limit={ADS.HOME} />
            </IonCol>
            }
          </IonRow>
        </IonGrid>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
