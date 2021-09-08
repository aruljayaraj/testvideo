import { IonContent, IonPage, IonList, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonItemSliding, IonItemOptions, IonThumbnail, IonRouterLink, IonAlert, IonItemOption} from '@ionic/react';
import React, {useCallback, useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { isPlatform } from '@ionic/react';
import './PressRelease.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as prActions from '../../../store/reducers/dashboard/pr';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import ListSkeleton from '../../../components/Skeleton/ListSkeleton';
import Status from '../../../components/Common/Status';
import { nanoid } from 'nanoid';

const PressReleases: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const skeleton = useSelector( (state:any) => state.ui.skeleton);
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const prs = useSelector( (state:any) => state.pr.pressReleases);
  const { apiBaseURL, basename } = lfConfig;
  const [showAlert, setShowAlert] = useState({status: false, id: '', mem_id: '' });

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(prActions.setPressReleases({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( authUser && authUser.ID ){
      dispatch(uiActions.setShowSkeleton({ skeleton: true }));
      const data = {
        action: 'get_press_releases',
        memID: authUser.ID
      };
      CoreService.onPostFn('pr_update', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, authUser]); 

  const onDeleteCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(prActions.setPressReleases({ data: res.data }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);

  const onDeleteFn = (id: number, mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'pr_delete',
        memID: mem_id,
        formID: id
    };
    CoreService.onPostFn('pr_update', fd, onDeleteCb);
  }

  const slideEdit = (item: any) => {
    history.push(`/layout/add-press-release/${item.pr_id}/${item.pr_mem_id}/1`);
  }
  
  // console.log(getPlatforms());

  return (
    <IonPage className="press-release-page">
      { !skeleton.showSkeleton && prs ? ( 
        <IonContent>
          <IonCard className="card-center my-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">Press Releases
                  <IonRouterLink color="greenbg" href={`${basename}/layout/add-press-release`} className="float-right router-link-anchor">
                    <i className="fa fa-plus green cursor" aria-hidden="true"></i>
                  </IonRouterLink>  
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
            <IonList className="buscat-section-content">
              { prs.length > 0  &&  prs.map((item: any, index: number)=> {
                const prImage = ( item && Object.keys(item).length > 0 && item.pr_image) ? `${apiBaseURL}uploads/member/${item.pr_mem_id}/${item.pr_image}` : `${basename}/assets/img/placeholder.png`;
                return (<div key={nanoid()}>
                  { (isPlatform('android') || isPlatform('ios')) &&   
                    <IonItemSliding >
                      <IonItem lines={ (prs.length === index+1)? "none": "inset" } routerLink={`${basename}/layout/press-release/${item.pr_id}`}>
                        <IonAvatar slot="start" color="greenbg">
                          <img src={prImage} alt="Press Release Media"/>
                        </IonAvatar>
                        <IonLabel>
                          <h2>{item.pr_name} </h2>
                          { item.pr_quote && <h3><IonText color="medium">{item.pr_quote}</IonText></h3> }
                          <p>
                          <Status is_active={+(item.pr_active)} type="press_release" />
                          {` `+CommonService.dateFormat(item.pr_date)} 
                          </p>
                        </IonLabel>
                      </IonItem>
                      <IonItemOptions side="end">
                        <IonItemOption className="px-2" color="greenbg" onClick={() => slideEdit(item) } >Edit</IonItemOption>
                        <IonItemOption color="warning" onClick={() => setShowAlert({status: true, id: item.pr_id, mem_id: item.pr_mem_id })}>Delete</IonItemOption>
                      </IonItemOptions>
                    </IonItemSliding>
                  }
                  { (isPlatform('desktop')) &&
                  <IonItem lines={ (prs.length === index+1)? "none": "inset" }>
                    <IonThumbnail slot="start" color="greenbg">
                      <IonRouterLink href={`${basename}/layout/press-release/${item.pr_id}`}>
                        <img src={prImage} alt="Press Release Media"/>
                      </IonRouterLink>
                    </IonThumbnail>
                    <IonLabel>
                      <IonRouterLink color="dark" href={`${basename}/layout/press-release/${item.pr_id}`}>
                      <h2>{item.pr_name} </h2>
                      </IonRouterLink>
                      { item.pr_quote && <h3><IonText color="medium">{item.pr_quote}</IonText></h3> }
                      <p>
                        <Status is_active={+(item.pr_active)} type="press_release" />
                        {` `+CommonService.dateFormat(item.pr_date)} 
                      </p>
                    </IonLabel>
                    
                    <IonRouterLink className="router-link-anchor" slot="end" color="greenbg" href={`${basename}/layout/add-press-release/${item.pr_id}/${item.pr_mem_id}/1`}>
                      <i className="fa fa-pencil fa-lg green cursor" aria-hidden="true"></i>
                    </IonRouterLink>
                    <IonAvatar className="anchor-white-ellipsis" slot="end" color="greenbg" onClick={() => setShowAlert({status: true, id: item.pr_id, mem_id: item.pr_mem_id })}>
                      <i className="fa fa-trash fa-lg green cursor" aria-hidden="true"></i>
                    </IonAvatar>
                
                    
                  </IonItem>
                  }
                </div>)
              })} 
              { prs && prs.length === 0 &&  
                <IonItem lines="none" >
                  <IonText className="fs-13 mr-3" color="warning">
                    No Press Release added.   
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
            message={'Are you sure want to delete this Press Release?'}
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

export default PressReleases;
