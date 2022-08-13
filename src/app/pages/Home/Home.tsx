import { IonPage, IonContent,  IonRouterLink, IonRow, IonCol, IonButton } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { File, DirectoryEntry } from "@ionic-native/file";



import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import './Home.scss';
import CoreService from '../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import * as commonActions from '../../store/reducers/common';
import * as uiActions from '../../store/reducers/ui';
import { lfConfig } from '../../../Constants';
import axios from 'axios';

const Home: React.FC = () => { 
  const dispatch = useDispatch();
  const { basename} = lfConfig;
  const location = useSelector( (state:any) => state.auth.location); 

  const takePhoto = async (callbackFn: any) => { 
    try {
      const cameraPhoto = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        correctOrientation: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      })
      if( cameraPhoto && cameraPhoto.webPath ){
        console.log(cameraPhoto.webPath);
        return cameraPhoto.webPath;
      }else{
        console.log("PHoto Error");
      }
    } catch (e) { console.log(e);
      console.log('No photo');
    }
  };
  const uploadCameraPhotoFn = (webpath: any) => {
    console.log(webpath);
  }

  const uploadRecoredVideoFn = async () => { 
    console.log(Capacitor.getPlatform());
    // alert("Meow");
    if(Capacitor.isNativePlatform()){ // For ios, android
      let capturedFile: any;
      let options: CaptureVideoOptions = { limit: 1, duration: 600 };
      await MediaCapture.captureVideo(options).then(
          (data: any) => {
              console.log(data);
              capturedFile = data[0];
          },
          (err: CaptureError) => {
              console.error(err);
          }
      ); console.log(capturedFile);
      let media: any = (capturedFile as MediaFile);
      // alert((capture[0] as MediaFile).fullPath);
      let resolvedPath: DirectoryEntry;
      let path = media.fullPath.substring(0, media.fullPath.lastIndexOf("/"));
      if (Capacitor.getPlatform() === "ios") {
          resolvedPath = await File.resolveDirectoryUrl("file://" + path);
      } else {
          resolvedPath = await File.resolveDirectoryUrl(path);
      }
      console.log(resolvedPath);
      console.log(media);
      return File.readAsArrayBuffer(resolvedPath.nativeURL, media.name).then(
          (buffer: any) => { console.log(buffer);
              // get the buffer and make a blob to be saved
              let imgBlob = new Blob([buffer], {
                type: media.type,
              });
              console.log(imgBlob);
              const fd = new FormData();
              fd.append("dataFile", imgBlob, media.name);
              console.log(fd);
          },
          (error: any) => {
              console.log(error);
          }
      );
    }  
  };
  
  return (
    <IonPage className="homepage" color="mainbg">
      <IonContent>
        <IonRow class="ion-justify-content-between mx-2 ion-hide-sm-up">
          <IonCol size="6">
            
          </IonCol>
          <IonCol size="6">
            <div className='ion-float-right pt-3'>
              <IonRouterLink slot="end" className="btn-round" color="appbg" href={`${basename}/signup`} > Get Local Quotes</IonRouterLink>
            </div>
          </IonCol>
        </IonRow>
              
        <IonRow>
          <IonCol>
            <IonButton onClick={() => takePhoto(uploadCameraPhotoFn)}>Take Photo</IonButton>
          </IonCol>
          <IonCol>
            <IonButton onClick={() => uploadRecoredVideoFn()}>Take Video</IonButton>
          </IonCol>
        </IonRow>  
        

      </IonContent>  
    </IonPage>
  );
};

export default Home;
