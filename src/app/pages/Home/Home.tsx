import { IonPage, IonContent, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonSlide, IonSlides, IonCol, IonImg, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import './Home.css';
// import { Geolocation, Geoposition } from '@ionic-native/geolocation';
// import CoreService from '../../shared/services/CoreService';
// import { useDispatch, useSelector } from 'react-redux';
// import * as authActions from '../../store/reducers/auth';
// import * as uiActions from '../../store/reducers/ui';


import { XMasonry, XBlock } from "react-xmasonry";

interface LocationError {
  showError: boolean;
  message?: string;
}

const Home: React.FC = () => {
  // const dispatch = useDispatch();
  const slideOpts = {
    // initialSlide: 1,
    speed: 400,
    slidesPerView: 'auto', 
    zoom: false, 
    grabCursor: true
  };
  const [activeSegment, setActiveSegment] = useState<string | undefined>('all');

  const handleTakeVideo = () => {
    console.log('Meow');
  }
  
  
  return (
    <IonPage >
      <IonContent className="ion-padding">
        
        <IonToolbar>
          <IonSegment scrollable value={activeSegment} onIonChange={(e) => setActiveSegment(e.detail.value)}>
            <IonSegmentButton value="all" >
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="resources">
              <IonLabel>Resources</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pressrelease">
              <IonLabel>Press Release</IonLabel>
            </IonSegmentButton>
            {/* <IonSegmentButton value="events">
              <IonLabel>Events</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="classifieds">
              <IonLabel>Classifieds</IonLabel>
            </IonSegmentButton> */}
            {/* <IonSegmentButton value="localquotes">
              <IonLabel>LocalQuotes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="testing1">
              <IonLabel>Testing 1</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="testing2">
              <IonLabel>Testing 2</IonLabel>
            </IonSegmentButton> */}
          </IonSegment>
        </IonToolbar>

        { activeSegment === 'all' && <IonSlides pager={false} options={slideOpts}>
          <IonSlide style={{ width: '150px', height: '200px', border: '2px solid #f8f8f8'}}>
            <IonCol>
              <IonLabel>Card 1</IonLabel>
              <IonImg style={{ pointerEvents: 'none'}} src="https://via.placeholder.com/150"></IonImg>
            </IonCol>
          </IonSlide>
          <IonSlide style={{ width: '150px', height: '200px', border: '2px solid #f8f8f8'}}>
            <IonCol>
              <IonLabel>Card 2</IonLabel>
              <IonImg style={{ pointerEvents: 'none'}} src="https://via.placeholder.com/150"></IonImg>
            </IonCol>
          </IonSlide>
          <IonSlide style={{ width: '150px', height: '200px', border: '2px solid #f8f8f8'}}>
            <IonCol>
              <IonLabel>Card 3</IonLabel>
              <IonImg style={{ pointerEvents: 'none'}} src="https://via.placeholder.com/150"></IonImg>
            </IonCol>
          </IonSlide>
          <IonSlide style={{ width: '150px', height: '200px', border: '2px solid #f8f8f8'}}>
            <IonCol>
              <IonLabel>Card 4</IonLabel>
              <IonImg style={{ pointerEvents: 'none'}} src="https://via.placeholder.com/150"></IonImg>
            </IonCol>
          </IonSlide>
          <IonSlide style={{ width: '150px', height: '200px', border: '2px solid #f8f8f8'}}>
            <IonCol>
              <IonLabel>Card 5</IonLabel>
              <IonImg style={{ pointerEvents: 'none'}} src="https://via.placeholder.com/150"></IonImg>
            </IonCol>
          </IonSlide>
        </IonSlides>}
        { activeSegment === 'pressrelease' && <IonSlides pager={true} options={slideOpts}>
          <IonSlide style={{ width: '150px', height: '200px', border: '2px solid #f8f8f8'}}>
            <IonCol>
              <IonLabel>Press 1</IonLabel>
              <IonImg style={{ pointerEvents: 'none'}} src="https://via.placeholder.com/150"></IonImg>
            </IonCol>
          </IonSlide>
        </IonSlides>}
        { activeSegment === 'resources' && <IonSlides pager={true} options={slideOpts}>
          <IonSlide style={{ width: '150px', height: '200px', border: '2px solid #f8f8f8'}}>
            <IonCol>
              <IonLabel>Resource 1</IonLabel>
              <IonImg style={{ pointerEvents: 'none'}} src="https://via.placeholder.com/150"></IonImg>
            </IonCol>
          </IonSlide>
        </IonSlides>}

        <IonButton onClick={handleTakeVideo}>Take Video</IonButton>

        {/* <IonSlides [options]="{  }">
          <ion-slide *ngFor="let card of [0,1,2,3,4,5,6]" style="width: 150px; height: 200px; border: 2px solid #f8f8f8">
            <ion-col>
              <ion-label>Card #{{ card }}</ion-label>
              <ion-img style="pointer-events:none" src="https://via.placeholder.com/150"></ion-img>
            </ion-col>
          </ion-slide>
        </ion-slides> */}

        <XMasonry>
                <XBlock>
                    <div className="card">
                        <h1>Simple Card</h1>
                        <p>Any text!</p>
                    </div>
                </XBlock>
                <XBlock width={ 2 }>
                    <div className="card">
                        <h1>Wider card</h1>
                        <p>Any text!</p>
                    </div>
                </XBlock>
            </XMasonry>
      </IonContent>
    </IonPage>
  );
};

export default Home;
