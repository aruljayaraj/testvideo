import { IonContent, IonPage, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonRouterLink, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { isPlatform } from '@ionic/react';
import ReactPlayer from 'react-player';
// import { VideoPlayer } from '@ionic-native/video-player/ngx';
import './ResourceUpload.scss';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as resActions from '../../../store/reducers/dashboard/resource';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';

import VideoViewer from './Viewer/VideoViewer';
import DocumentViewer from './Viewer/DocumentViewer';
import AudioViewer from './Viewer/AudioViewer';
// import { Plugins } from '@capacitor/core';
// import * as PluginsLibrary from 'capacitor-video-player';
// const { CapacitorVideoPlayer, Device } = Plugins;

const Resource: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const loadingState = useSelector( (state:any) => state.ui.loading);
  const resource = useSelector( (state:any) => state.res.resource);
  const { apiBaseURL, basename } = lfConfig;
  let { id, res_type } = useParams();

  // Resource deafult to load callback
  const onPrBuscatCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(resActions.setResource({ data: res.data }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('res_update', {
            action: 'get_resource',
            resType: res_type, 
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id
        }, onPrBuscatCb);
    }
  }, [dispatch, id, authUser, onPrBuscatCb]);

  
  

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    sources: [{
      src: 'http://vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4'
    }]
  };

  const ResFile = ( resource && Object.keys(resource).length > 0 && resource.filename) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${resource.filename}` : `${basename}/assets/img/placeholder.png`;
  // console.log(ResFile);
  return (
    <IonPage className="resource-page">
      { resource && Object.keys(resource).length > 0 && 
        <IonContent>
          <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle > 
                  {resource.title}
                  { +(resource.status) === 0 && resource.mem_id === authUser.ID &&
                  <IonRouterLink color="greenbg" href={`${basename}/layout/add-resource/${resource.id}/${resource.mem_id}/1`} className="float-right router-link-anchor">
                    <i className="fa fa-pencil green cursor" aria-hidden="true"></i>
                  </IonRouterLink>}
                </IonCardTitle>
                <IonText className="mt-2 fs-12" color="medium">{ format(new Date(resource.added_date), 'MMM dd, yyyy') }</IonText>
                { authUser.ID === resource.mem_id && 
                  <IonText className="fs-12" color={ (+(resource.status) === 1 && +(resource.converted) === 1)? 'success': 'danger'}> { (+(resource.status) === 1 && +(resource.converted) === 1)? '(Active)': '(Pending)'}</IonText>
                }
            </IonCardHeader>
            { resource && +(resource.converted) === 1 && <>
            <IonCardContent className="pt-3">
              <IonGrid className="p-0">
                <IonRow>
                    { resource.filename && res_type && res_type === 'video' && 
                        <IonCol sizeMd="8" sizeXl="8" sizeXs="12" className="p-0"> 
                          <VideoViewer /> 
                        </IonCol>
                    }
                    { resource.filename && res_type && ['audio'].includes(res_type) &&
                        <IonCol sizeMd="6" sizeXl="6" sizeXs="12" className="pt-4"> 
                            <AudioViewer/> 
                        </IonCol>
                    }
                    { resource.filename && res_type && ['document', 'article'].includes(res_type) &&
                        <IonCol sizeMd="12" sizeXl="8" sizeXs="12" className="p-0"> 
                          <div style={{ width: "100%", minHeight: '200px'}}>
                            <DocumentViewer /> 
                          </div>
                        </IonCol>
                    }
                   
                  <IonCol sizeMd={ resource.filename? "4": "12" } sizeXl={ resource.filename? "4": "12" } sizeXs="12" className="">
                    <div className="pl-md-3 mt-3">  { /* pt-sm-3 mt-sm-4 */}
                    
                    { resource.buscats && resource.buscats.length > 0 &&  resource.buscats.map((item: any, index: number)=> { 
                      return (<IonItem lines="none" key={index}>
                        <IonAvatar slot="start" color="greenbg">
                            <i className="fa fa-chevron-right fa-lg green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <h2>{item.catname}</h2>
                            <h3><IonText color="medium">{item.sub_catname}</IonText></h3>
                            <p><strong>Keywords:</strong> {item.keywords}</p>
                        </IonLabel>
                    </IonItem>) }) }
                    </div>
                  </IonCol>
                </IonRow>
                { resource.description && <IonRow className="pt-3">
                  <IonCol>
                    <div className="external_text" dangerouslySetInnerHTML={{ __html: resource.description }} ></div>
                  </IonCol>
                </IonRow>}
              </IonGrid>    
            </IonCardContent>
            <IonCardHeader color="titlebg">
              <h3 className="mt-0 font-weight-bold fs-16">Contacts:</h3> 
              <div className="reps-container">
                { resource.reps && resource.reps.length > 0 &&  resource.reps.map((item: any, index: number)=> { 
                  const repImage = (item.profile_image) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${item.profile_image}` : `${basename}/assets/img/avatar.svg`;
                  return (
                    <div key={index}>
                      <IonRouterLink href={`${basename}/profile/${item.mem_id}/${item.rep_id}`}>
                        <IonAvatar color="greenbg">
                          <img src={repImage} alt={`${item.firstname} ${item.lastname}`}/>
                        </IonAvatar>
                        <p className="mb-0"><IonText color="dark" className="mt-2" key={index}> {`${item.firstname} ${item.lastname}`}</IonText></p>
                      </IonRouterLink>
                    </div>
                  ) 
                }) }
              </div>  
            </IonCardHeader>
            </>}
            { resource && +(resource.converted) === 0 && <div className="p-4">
                <p className="py-5">
                  <IonText color="danger">
                    { `Your ${res_type} is currently being converted for internet streaming.`} 
                    Go <IonRouterLink color="primary" href={`${basename}/layout/resources/${res_type}`}> back</IonRouterLink> and try your preview in a few minutes.
                  </IonText>
                  </p>
            </div>} 
          </IonCard>  
        </IonContent> 
      }
      { !resource && !loadingState.showLoading && 
        <p className="py-5 px-3">
          <IonText color="warning">No Resource found.</IonText>
        </p>
      }
    </IonPage>
  );
};

export default Resource;
