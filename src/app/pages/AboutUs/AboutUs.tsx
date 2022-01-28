import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonButton
} from '@ionic/react';
import React, { useState, useEffect, useCallback} from 'react';
import CoreService from '../../shared/services/CoreService';
import './AboutUs.scss';
import { useDispatch } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';

import {
  MediaCapture,
  MediaFile,
  CaptureVideoOptions,
} from "@ionic-native/media-capture";

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
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch, setPage]);

  useEffect(() => {
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      page: 'about-us'
    };
    CoreService.onPostFn('getpage', data, onGetPageCb);
  }, [dispatch, onGetPageCb]); // Pass empty array, tell to hooks there is no state changes.

  // const doMediaCapture = async () => { console.log('Meow');
  //   let options: CaptureVideoOptions = { limit: 1, duration: 30 };
  //   let capture:any = await MediaCapture.captureVideo(options);
  //   console.log((capture[0] as MediaFile).fullPath)
  // };

  return (
    <IonPage className="aboutus-page">
      {/* <IonButton onClick={doMediaCapture} >Record</IonButton> */}
      { page.title &&
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2 mb-4">
          <IonCardHeader>
            <IonCardTitle className="card-custom-title">{page.title}</IonCardTitle>
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
