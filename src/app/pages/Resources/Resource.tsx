import { IonContent, IonPage, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonRouterLink, IonGrid, IonRow, IonCol } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './Resources.scss';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';
import * as resActions from '../../store/reducers/dashboard/resource';
import { lfConfig } from '../../../Constants';
import CoreService from '../../shared/services/CoreService';
import CommonService from '../../shared/services/CommonService';
import MediaList from '../../components/Common/MediaList';

const HomeResource: React.FC = () => {
  let attachments = [];
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const loadingState = useSelector( (state:any) => state.ui.loading);
  const resource = useSelector( (state:any) => state.res.resource);
  const { apiBaseURL, basename } = lfConfig;
  let { id, res_type } = useParams<any>();
  const resTypeText = res_type ? res_type.charAt(0).toUpperCase() + res_type.slice(1): '';

  // Resource deafult to load callback
  const onPrBuscatCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(resActions.setResource({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
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
  }, [dispatch, id, authUser, onPrBuscatCb, res_type]);

  if(resource && Object.keys(resource).length > 0){
     let attach = {
      title: '', 
      mem_id: resource.mem_id,
      filename: resource.filename,
      uploaded_name: resource.uploaded_name,
      form_id: resource.id,
      form_type: 'resource',
      upload_type: resource.res_type, 
      converted: resource.converted
     }
     attachments.push(attach);
  }

  return (
    <IonPage className="resource-page">
      { resource && Object.keys(resource).length > 0 && 
        <IonContent>
          <IonCard className="card-center mt-4 mb-3">
            <IonCardHeader color="titlebg">
              <IonCardTitle className="fs-18"> 
                {resource.title}
              </IonCardTitle>
              <IonText className="mt-2 fs-12" color="medium">{CommonService.dateFormat(resource.added_date)} </IonText>
            </IonCardHeader>
            { resource && <>
            <IonCardContent className="pt-3">
              <IonGrid className="p-0">
                <IonRow>
                  <IonCol sizeMd="6" sizeXl="6" sizeXs="12" className="py-0 pl-0">
                    { attachments && attachments.length > 0 && <>
                      <p className="card-custom-title">{`${resTypeText} and other supporting information`}</p>
                      { attachments[0].uploaded_name && <MediaList attachments={attachments} formType='resource' /> }
                      { !attachments[0].uploaded_name && <p className="mb-3">
                        <IonText className="fs-13 mr-3" color="warning">
                          No {`${resTypeText}`} added.   
                        </IonText>
                      </p> }
                    </> }
                    <div className="pl-md-3">  { /* pt-sm-3 mt-sm-4 */}
                      <p className="card-custom-title">Business Category</p>
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
                   
                  <IonCol sizeMd="6" sizeXl="6" sizeXs="12" className="">
                    { resource.description && <div>
                      <p className="card-custom-title">Description</p>
                      <div className="external_text" dangerouslySetInnerHTML={{ __html: resource.description }} ></div>
                    </div>}
                  </IonCol>
                </IonRow>
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

export default HomeResource;
