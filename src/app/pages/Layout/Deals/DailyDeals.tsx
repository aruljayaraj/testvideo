import { IonContent, IonPage, IonList, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonItemSliding, IonItemOptions, IonThumbnail, IonRouterLink, IonAlert, IonItemOption} from '@ionic/react';
import React, {useCallback, useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { isPlatform, getPlatforms } from '@ionic/react';
import './DailyDeal.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as dealActions from '../../../store/reducers/dashboard/deal';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import ListSkeleton from '../../../components/Skeleton/ListSkeleton';
import Status from '../../../components/Common/Status';

const DailyDeals: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const skeleton = useSelector( (state:any) => state.ui.skeleton);
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const dds = useSelector( (state:any) => state.deals.dailyDeals);
  const { apiBaseURL, basename } = lfConfig;
  const [showAlert, setShowAlert] = useState({status: false, id: '', mem_id: '' });

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(dealActions.setDeals({ data: res.data }));
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
        memID: authUser.ID
      };
      CoreService.onPostFn('deal_update', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, authUser]); 

  const onDeleteCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(dealActions.setDeals({ data: res.data }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);

  const onDeleteFn = (id: number, mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'dl_delete',
        memID: mem_id,
        formID: id
    };
    CoreService.onPostFn('deal_update', fd, onDeleteCb);
  }

  const slideEdit = (item: any) => {
    history.push(`/layout/deals/add-deal/${item.id}/${item.mem_id}/1`);
  }

  return (
    <IonPage className="deals-page">
      { !skeleton.showSkeleton && dds ? ( 
        <IonContent>
          <IonCard className="card-center my-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">DailyDeals
                  <IonRouterLink color="greenbg" href={`${basename}/layout/deals/add-deal`} className="float-right router-link-anchor">
                    <i className="fa fa-plus green cursor" aria-hidden="true"></i>
                  </IonRouterLink>  
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
            <IonList className="buscat-section-content">
              { dds.length > 0  &&  dds.map((item: any, index: number)=> {
                const ddImage = ( item && Object.keys(item).length > 0 && item.image) ? `${apiBaseURL}uploads/member/${item.mem_id}/${item.image}` : `${basename}/assets/img/placeholder.png`;
                return (<div key={item.id}>
                  { (isPlatform('android') || isPlatform('ios')) &&   
                    <IonItemSliding >
                      <IonItem lines={ (dds.length === index+1)? "none": "inset" } routerLink={`${basename}/layout/deals/daily-deal/${item.id}`}>
                        <IonAvatar slot="start" color="greenbg">
                          <img className="roundcorner" src={ddImage} alt="DailyDeal Media"/>
                        </IonAvatar>
                        <IonLabel>
                          <h2>{item.name}</h2>
                          <p><b>$</b> {item.price}</p>
                          <p>
                            <Status is_active={+(item.is_active)} type="daily_deal" />
                            {` `+CommonService.dateReadFormat(item.sdate)} - {CommonService.dateReadFormat(item.edate)}
                          </p> 
                        </IonLabel>
                      </IonItem>
                      <IonItemOptions side="end">
                        <IonItemOption className="px-2" color="greenbg" onClick={() => slideEdit(item) } >Edit</IonItemOption>
                        <IonItemOption color="warning" onClick={() => setShowAlert({status: true, id: item.id, mem_id: item.mem_id })}>Delete</IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  }
                  { (isPlatform('desktop')) &&
                  <IonItem lines={ (dds.length === index+1)? "none": "inset" }>
                    <IonThumbnail slot="start" color="greenbg">
                      <IonRouterLink href={`${basename}/member/${item.mem_id}/${item.id}`}>
                        <img className="roundcorner" src={ddImage} alt="DailyDeal Media"/>
                      </IonRouterLink>
                    </IonThumbnail>
                    <IonLabel>
                      <IonRouterLink color="dark" href={`${basename}/layout/deals/daily-deal/${item.id}`}>
                        <h2>{item.name} </h2>
                      </IonRouterLink>
                      <p><b>$</b> {item.price}</p>
                      <p>
                        <Status is_active={+(item.is_active)} type="daily_deal" />
                        {` `+CommonService.dateReadFormat(item.sdate)} - {CommonService.dateReadFormat(item.edate)}
                      </p>
                    </IonLabel>
                    
                    <IonRouterLink className="router-link-anchor" slot="end" color="greenbg" href={`${basename}/layout/deals/add-deal/${item.id}/${item.mem_id}/1`}>
                      <i className="fa fa-pencil fa-lg green cursor" aria-hidden="true"></i>
                    </IonRouterLink>
                    <IonAvatar className="anchor-white-ellipsis" slot="end" color="greenbg" onClick={() => setShowAlert({status: true, id: item.id, mem_id: item.mem_id })}>
                      <i className="fa fa-trash fa-lg green cursor" aria-hidden="true"></i>
                    </IonAvatar>
                
                    
                  </IonItem>
                  }
                </div>)
              })} 
              { dds && dds.length === 0 &&  
                <IonItem lines="none" >
                  <IonText className="fs-13 mr-3" color="warning">
                    No Daily Deals added.   
                  </IonText>
                </IonItem>
              }
              </IonList>
            </IonCardContent>
          </IonCard>  
          <IonAlert
            isOpen={showAlert.status}
            onDidDismiss={() => setShowAlert({status: false, id: '', mem_id: '' })}
            header={'Confirm!'}
            message={'Are you sure want to delete this Daily Deal?'}
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
        </IonContent>) : ( <ListSkeleton /> )} 
    </IonPage>
  );
};

export default DailyDeals;
