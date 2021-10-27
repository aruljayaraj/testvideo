import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRouterLink, IonAlert } from '@ionic/react';
import React, {useCallback, useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './ResourceUpload.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as resActions from '../../../store/reducers/dashboard/resource';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import Documents from './Documents'; 
import Articles from './Articles';
import Video from './Video';
import Audio from './Audio';
import ListSkeleton from '../../../components/Skeleton/ListSkeleton';

const Resources: React.FC = () => {
  const dispatch = useDispatch();
  const skeleton = useSelector( (state:any) => state.ui.skeleton);
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const resources = useSelector( (state:any) => state.res.resources);
  const { basename } = lfConfig;
  const [showAlert, setShowAlert] = useState({status: false, id: '', mem_id: '' });
  let { res_type } = useParams<any>();
  const resTypeText = res_type ? res_type.charAt(0).toUpperCase() + res_type.slice(1): '';

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(resActions.setResources({ data: res.data }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( authUser && authUser.ID ){
      dispatch(uiActions.setShowSkeleton({ skeleton: true }));
      const data = {
        action: 'get_resources',
        resType: res_type,
        memID: authUser.ID,
        repID: authUser.prepID
      };
      CoreService.onPostFn('res_update', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, authUser, res_type]); 

  const onDeleteCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(resActions.setResources({ data: res.data }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);

  const onDeleteFn = (id: number, mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'res_delete',
        resType: res_type,
        memID: mem_id,
        formID: id
    };
    CoreService.onPostFn('res_update', fd, onDeleteCb);
  }

  return (
    <IonPage className="resource-page">
      { !skeleton.showSkeleton && resources ? ( 
        <IonContent>
          <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">
                  { res_type && res_type === 'document'? 'Documents': '' }
                  { res_type && res_type === 'article'? 'Articles': '' }
                  { res_type && res_type === 'audio'? 'Audio': '' }
                  { res_type && res_type === 'video'? 'Video': '' }
                  <IonRouterLink color="greenbg" href={`${basename}/layout/add-resource/${res_type}/`} className="float-right router-link-anchor">
                    <i className="fa fa-plus green cursor" aria-hidden="true"></i>
                  </IonRouterLink>  
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {res_type && res_type === 'document' && <Documents res_type={res_type} setShowAlert={setShowAlert} />}
              {res_type && res_type === 'article' && <Articles res_type={res_type} setShowAlert={setShowAlert} />}
              {res_type && res_type === 'audio' && <Audio res_type={res_type} setShowAlert={setShowAlert} />}
              {res_type && res_type === 'video' && <Video res_type={res_type} setShowAlert={setShowAlert} />}
            </IonCardContent>
          </IonCard>  
          <IonAlert
            isOpen={showAlert.status}
            onDidDismiss={() => setShowAlert({status: false, id: '', mem_id: '' })}
            header={'Confirm!'}
            message={`Are you sure want to delete this ${resTypeText}?`}
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
      <ListSkeleton />
  
    </IonPage>
  );
};

export default Resources;
