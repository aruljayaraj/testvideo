import { IonContent, IonPage, IonList, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonItemSliding, IonItemOptions, IonThumbnail, IonRouterLink, IonAlert, IonItemOption} from '@ionic/react';
import React, {useCallback, useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { isPlatform } from '@ionic/react';
import './Deals.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as dealActions from '../../../store/reducers/dashboard/deal';
import * as authActions from '../../../store/reducers/auth';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import ListSkeleton from '../../../components/Skeleton/ListSkeleton';
import Status from '../../../components/Common/Status';
import { nanoid } from 'nanoid';
import LocalDealsUnpaid from './LocalDealsUnpaid';
import NoData from '../../../components/Common/NoData';

const LocalDeals: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const skeleton = useSelector( (state:any) => state.ui.skeleton);
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const memOpts = useSelector( (state:any) => state.auth.memOptions);
  const dds = useSelector( (state:any) => state.deals.localDeals.deals);
  const unpaid = useSelector( (state:any) => state.deals.localDeals.unpaid);
  const { apiBaseURL, basename } = lfConfig;
  const [showAlert, setShowAlert] = useState({status: false, id: '', mem_id: '' });

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      const cusData = {
        deals: res.data,
        unpaid: res.unpaid
      }
      dispatch(dealActions.setDeals({ data: cusData }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( authUser && authUser.ID ){
      dispatch(uiActions.setShowSkeleton({ skeleton: true }));
      const data = {
        action: 'get_deals',
        memID: authUser.ID,
        repID: authUser.repID,
        unpaid: true
      };
      CoreService.onPostFn('deal_update', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, authUser]); 

  const onDeleteCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(authActions.setDealsCountUpdate({ total: res.data.length }));
      const cusData = {
        deals: res.data,
        unpaid: res.unpaid
      }
      dispatch(dealActions.setDeals({ data: cusData }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);

  const onDeleteFn = (id: number, mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'dl_delete',
        memID: mem_id,
        repID: authUser.repID,
        formID: id
    };
    CoreService.onPostFn('deal_update', fd, onDeleteCb);
  }

  const setAlert = useCallback((item) => {
    setShowAlert({status: true, id: item.id, mem_id: item.mem_id })
    // setCounter((counter) => counter + 1);
  }, []);

  const slideEdit = (item: any) => {
    history.push(`/layout/deals/add-deal/${item.id}/${item.mem_id}/1`);
  }
  let noNameCount = 0;
  return (
    <IonPage className="deals-page">  
        <IonContent>
          <IonCard className="card-center my-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">Local Deals
                  { +(memOpts.localdeals!.total!) < +(memOpts.localdeals!.no_free_deals!) &&
                    <IonRouterLink color="greenbg" href={`${basename}/layout/deals/add-deal`} className="float-right router-link-anchor" title="Add a Deal">
                      <i className="fa fa-plus green cursor" aria-hidden="true"></i>
                    </IonRouterLink> 
                  } 
                  { +(memOpts.localdeals!.total!) >= +(memOpts.localdeals!.no_free_deals!) &&
                    <IonRouterLink color="greenbg" href={`${basename}/layout/deals/buy-deal`} className="float-right router-link-anchor" title="Buy a Deal">
                      <i className="fa fa-plus green cursor" aria-hidden="true"></i>
                    </IonRouterLink> 
                  }
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              { (dds && !skeleton.showSkeleton)  ? ( 
              <IonList className="buscat-section-content">
                { unpaid && unpaid.length > 0  && <LocalDealsUnpaid />}
                { dds.length > 0  &&  dds.map((item: any, index: number)=> {
                  // console.log(item.id+"==" + (!item.sdate || (item.sdate && new Date(Date.parse(item.sdate.replace(/[-]/g,'/'))).valueOf()/1000 > Date.now())));
                  const img = (item.image).split(".");
                  const ddImage = ( item && Object.keys(item).length > 0 && item.image) ? `${apiBaseURL}uploads/member/${item.mem_id}/${img[0]}-thumb.${img[1]}` : `${basename}/assets/img/placeholder.png`;
                  if(!item.name){
                    noNameCount++;
                  }
                  return (<div key={nanoid()}>
                    { (isPlatform('android') || isPlatform('ios')) &&   
                      <IonItemSliding >
                        <IonItem lines={ (dds.length === index+1)? "none": "inset" } routerLink={`${basename}/layout/deals/local-deal/${item.id}`}>
                          <IonAvatar slot="start" color="greenbg">
                            <img className="roundcorner" src={ddImage} alt="Local Deal Media"/>
                          </IonAvatar>
                          <IonLabel>
                            <h2>{item.name? item.name: `No Deal Name ${noNameCount}`}</h2>
                            <p><b>$</b> {item.price}</p>
                            { (item.sdate && item.edate) && <p>
                              <Status is_active={+(item.is_active)} type="local_deal" />
                              {` `+CommonService.dateReadFormat(item.sdate)} - {CommonService.dateReadFormat(item.edate)}
                            </p>} 
                          </IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                          { (!item.sdate || +(item.is_active) === 0 || (item.sdate && +(item.is_active) !== 0 && new Date(Date.parse(item.sdate.replace(/[-]/g,'/'))).valueOf()/1000 > Date.now())) &&
                            <IonItemOption className="px-2" color="greenbg" onClick={() => slideEdit(item) } title="Edit">Edit</IonItemOption>
                          }
                          <IonItemOption color="warning" onClick={() => setShowAlert({status: true, id: item.id, mem_id: item.mem_id })} title="Trash">Delete</IonItemOption>
                        </IonItemOptions>
                      </IonItemSliding>
                    }
                    { (isPlatform('desktop')) &&
                    <IonItem lines={ (dds.length === index+1)? "none": "inset" }>
                      <IonThumbnail slot="start" color="greenbg">
                        <IonRouterLink href={`${basename}/layout/deals/local-deal/${item.id}`}>
                          <img className="roundcorner" src={ddImage} alt="LocalDeal Media"/>
                        </IonRouterLink>
                      </IonThumbnail>
                      <IonLabel>
                        <IonRouterLink color="dark" href={`${basename}/layout/deals/local-deal/${item.id}`}>
                          <h2>{item.name? item.name: `No Deal Name ${noNameCount}` }</h2>
                        </IonRouterLink>
                        <p><b>$</b> {item.price}</p>
                        { (item.sdate && item.edate) && <p>
                          <Status is_active={+(item.is_active)} type="local_deal" />
                          {` `+CommonService.dateReadFormat(item.sdate)} - {CommonService.dateReadFormat(item.edate)}
                        </p>}
                      </IonLabel>
                    
                      { (!item.sdate || +(item.is_active) === 0 || (item.sdate && new Date(Date.parse(item.sdate.replace(/[-]/g,'/'))).valueOf()/1000 > Date.now())) &&
                      <IonRouterLink className="router-link-anchor" slot="end" color="greenbg" href={`${basename}/layout/deals/add-deal/${item.id}/${item.mem_id}/1`} title="Edit">
                        <i className="fa fa-pencil fa-lg green cursor" aria-hidden="true"></i>
                      </IonRouterLink>
                      }
                      <IonAvatar className="anchor-white-ellipsis" slot="end" color="greenbg" onClick={() => setAlert(item)} title="Trash">
                        <i className="fa fa-trash fa-lg green cursor" aria-hidden="true"></i>
                      </IonAvatar> { /*setShowAlert({status: true, id: item.id, mem_id: item.mem_id })*/}
        
                    </IonItem>
                    }
                  </div>)
                })} 
                </IonList>
                ) : ( <ListSkeleton /> )} 
                <NoData dataArr={dds} htmlText="No Local Deals added." />
            </IonCardContent>
          </IonCard>  
          
        </IonContent>
        <IonAlert
            isOpen={showAlert.status}
            onDidDismiss={() => setShowAlert({status: false, id: '', mem_id: '' })}
            header={'Confirm!'}
            message={'Are you sure want to delete this Local Deal?'}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'primary'
              },
              {
                text: 'Okay',
                cssClass: 'greenbg',
                handler: () => {
                  onDeleteFn( +(showAlert.id), +(showAlert.mem_id));
                }
              }
            ]}
          />
    </IonPage>
  );
};

export default LocalDeals;
