import { 
    IonPage,
    IonContent,
    // IonItem, 
    // IonLabel,
    // IonText,
    // IonSelect,
    IonButton,
    // IonGrid,
    // IonRow,
    // IonCol,
    // IonSelectOption,
    // IonModal
  } from '@ionic/react';
  import React, { useState, useRef } from 'react';
  // import { useForm, Controller } from "react-hook-form";
  // import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  // import RecordAudio from '../../components/Modal/Record/RecordAudio';
  import { MediaCapture, MediaFile,  CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture';

  const TestingVideo: React.FC = () => {
    
    const [video] = useState<any>({});
    const videoRef = useRef<any>();

    const onRecord = async() => { alert("meow");
        let options: CaptureVideoOptions = { limit: 1, duration: 30 };
        let capture:any = await MediaCapture.captureVideo(options);
        alert((capture[0] as MediaFile).fullPath);
    }

    // const onStop = () => { console.log("stop");
        
    // }

    // const onPlay = async() => {
    //     console.log(video);
        
    // }
  
    return (<>
    <IonPage className="contact-page">
      <IonContent className="ion-padding">
        { video.base64Sound && <video controls ref={videoRef}>
            <source src={video.base64Sound} type="audio/ogg" />
        </video> }
        <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="button" onClick={onRecord}>
            Record
        </IonButton>
        {/* <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="button" onClick={onStop}>
            Stop
        </IonButton>
        <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="button" onClick={onPlay}>
            Play
        </IonButton>
            
            <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="submit">
                Submit
            </IonButton> */}
        {/* <IonModal backdropDismiss={false} isOpen={showRecordAudioModal.isOpen} className='view-modal-wrap'>
            { showRecordAudioModal.isOpen === true &&  <RecordAudio
            showRecordAudioModal={showRecordAudioModal}
            setShowRecordAudioModal={setShowRecordAudioModal} 
           /> }
        </IonModal> */}
        </IonContent>
        </IonPage>
    </>);
  };
  
  export default TestingVideo;
  