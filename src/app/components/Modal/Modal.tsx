import React, { useState, useEffect, useCallback } from 'react';
import { IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon
} from '@ionic/react';
import { 
    close
} from 'ionicons/icons';
import { useDispatch } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';
import CoreService from '../../shared/services/CoreService';

interface Props {
    title: string,
    closeAction: Function
}
const Modal: React.FC<Props> = ({ title, closeAction }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState({ title: '', content: '' });

  const onGetPageCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      setPage(res.data);
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch, setPage]);

  useEffect(() => {
    if( title ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        page: title
      };
      CoreService.onPostFn('getpage', data, onGetPageCb);
    }
  }, [title, dispatch, onGetPageCb]); 
  
  return (
    <>
      <IonHeader translucent>
        <IonToolbar>
            <IonTitle>{page.title}</IonTitle>
            <IonButtons slot="end">
                <IonButton onClick={() => closeAction()}>
                    <IonIcon icon={close} slot="icon-only"></IonIcon>
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="external_text" dangerouslySetInnerHTML={{ __html: page.content }} ></div>
      </IonContent>
    </> 
  );
}

export default Modal;
