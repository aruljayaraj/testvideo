import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent
} from '@ionic/react';
import React, { useState, useEffect, useCallback} from 'react';

import CoreService from '../../shared/services/CoreService';
import './PrivacyPolicy.scss';
import { useDispatch } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';

const PrivacyPolicy: React.FC = () => {
  console.log('Privacy Policy Page');
  const dispatch = useDispatch();
  const [page, setPage] = useState({ title: '', content: '' });

  const onGetPageCb = useCallback((res: any) => {
    dispatch(uiActions.setShowLoading({ loading: false }));
    if(res.status === 'SUCCESS'){
      setPage(res.data);
    }
  }, [dispatch, setPage]);

  useEffect(() => {
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      page: 'privacy-policy'
    };
    CoreService.onPostFn('getpage', data, onGetPageCb);
  }, [dispatch, onGetPageCb]); 


  return (
    <IonPage className="privacy-page">
      { page.title && 
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2 mb-4">
          <IonCardHeader>
            <IonCardTitle className="fs-18">{page.title}</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <div className="external_text" dangerouslySetInnerHTML={{ __html: page.content }} ></div>
          </IonCardContent>
        </IonCard>
      </IonContent>
      }
    </IonPage>
  );
};

export default PrivacyPolicy;
