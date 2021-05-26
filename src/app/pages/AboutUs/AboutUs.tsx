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
import './AboutUs.scss';
import { useDispatch } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';

type PageProps = {
  title: string,
  content: string
}

const AboutUs: React.FC = () => {
  console.log('About Us Page');
  const dispatch = useDispatch();
  const [page, setPage] = useState<PageProps>({ title: '', content: '' });

  const onGetPageCb = useCallback((res: any) => { 
    if(res.status === 'SUCCESS'){
      setPage(res.data);
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch, setPage]);

  useEffect(() => {
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      page: 'about-us'
    };
    CoreService.onPostFn('getpage', data, onGetPageCb);
  }, [dispatch, onGetPageCb]); // Pass empty array, tell to hooks there is no state changes.


  return (
    <IonPage className="aboutus-page">
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

export default AboutUs;
