import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonText,
  IonTextarea
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import './Notification.scss';

import { useDispatch, useSelector } from 'react-redux';
import CoreService from '../../../shared/services/CoreService';
import { lfConfig } from '../../../../Constants';
import * as uiActions from '../../../store/reducers/ui';
import * as repActions from '../../../store/reducers/dashboard/rep';
import { isPlatform } from '@ionic/react';
import NotifyContent from './NotifyContent';

interface Props {
  // title: string,
  notificationModal: boolean,
  setNotificationModal: Function
}

const NotificationModal: React.FC<Props> = ({ notificationModal, setNotificationModal }) => {
  const dispatch = useDispatch();
  const [basename] = useState(process.env.REACT_APP_BASENAME);
  // let { title, qq_type, bid, sid, mem_id, receiver_id} = setNotificationModal;
  // const qq = useSelector( (state:any) => state.qq.localQuote);
  const { apiBaseURL } = lfConfig;
  const authUser = useSelector( (state:any) => state.auth.data.user);

  useEffect(() => {
      let data = {
          action: 'get_notifications',
          memID: authUser.ID,
          repID: authUser.repID,
          prepID: authUser.prepID
      };
      // dispatch(uiActions.setShowLoading({ loading: true }));
      CoreService.onPostsFn('get_member', data).then((res:any) => {
          if(res.data.status === 'SUCCESS'){ 
              dispatch(repActions.setNotifications({ data: res.data.notifications }));
          }
          // dispatch(uiActions.setShowLoading({ loading: false }));
      }).catch((error) => {
        dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error.message }));
    });
      
  },[]);

  // const onCallbackFn = useCallback((res: any) => {
  //     if(res.status === 'SUCCESS'){
  //         dispatch(qqActions.setMessages({ data: res.data }));
  //         // setValue('message', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
  //         reset({...initialValues});
  //     }
  //     dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  //     dispatch(uiActions.setShowLoading({ loading: false }));
  // }, [dispatch]);
  // const onSubmit = (data: any) => {
  //     if( data.message ){
  //         dispatch(uiActions.setShowLoading({ loading: true }));
  //         const formData = {
  //             action: 'send_message',
  //             bid,
  //             sid,
  //             mem_id,
  //             receiver_id,
  //             qq_type,
  //             message: data.message
  //         };
  //         CoreService.onPostFn('qq_message', formData, onCallbackFn);
  //     }
  // }

  return (<>
      <IonHeader translucent>
          <IonToolbar color="greenbg">
              <IonButtons slot='end'>
                  <IonButton onClick={() => { setNotificationModal(false); }}>
                      <IonIcon icon={close} slot="icon-only"></IonIcon>
                  </IonButton>
              </IonButtons>
              <IonTitle>All Notifications</IonTitle>
          </IonToolbar>
          
      </IonHeader>
      <IonContent fullscreen className="notification-container">
          <NotifyContent />
      </IonContent>
  </>);
};

//export default NotificationModal;

export default React.memo(NotificationModal);
