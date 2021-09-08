import { IonContent, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonButton, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle, IonRouterLink } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { isPlatform } from '@ionic/react';
import { close } from 'ionicons/icons';
import '../LocalQuotes.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../../Constants';
import CommonService from '../../../../shared/services/CommonService';

interface Props {
    resPreviewModal: any,
    setResPreviewModal: Function,
}

const QQPreviewModal: React.FC<Props> = ({ resPreviewModal, setResPreviewModal }) => {
    const resource = useSelector( (state:any) => state.res.resource);
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const { apiBaseURL, basename } = lfConfig;
    let { res_type } = useParams<any>();

    // const ResFile = ( resource && Object.keys(resource).length > 0 && resource.filename) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${resource.filename}` : ``;
    const notifyText = `Your ${res_type} is currently being converted for internet streaming. You can try your preview in a few minutes.`;

    return (<div className="resource-preview-modal">
      { resource && Object.keys(resource).length > 0 && <>
        <IonHeader translucent>
            <IonToolbar color="greenbg">
                <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                    <IonButton onClick={() => setResPreviewModal({
                        ...resPreviewModal, 
                        isOpen: false
                    })}>
                        <IonIcon icon={close} slot="icon-only"></IonIcon>
                    </IonButton>
                </IonButtons>
                <IonTitle>Resource Preview</IonTitle>
            </IonToolbar>
            
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18"> 
                  {resource.title}
                  { +(resource.status) === 0 && resource.mem_id === authUser.ID &&
                  <IonRouterLink color="greenbg" href={`${basename}/layout/add-resource/${resource.id}/${resource.mem_id}/1`} className="float-right router-link-anchor">
                    <i className="fa fa-pencil green cursor" aria-hidden="true"></i>
                  </IonRouterLink>}
                </IonCardTitle>
                <IonText className="mt-2 fs-12" color="medium">{CommonService.dateFormat(resource.added_date)}</IonText>
                { authUser.ID === resource.mem_id && 
                  <IonText className="fs-12" color={ (+(resource.status) === 1 && +(resource.converted) === 1)? 'success': 'danger'}> { (+(resource.status) === 1 && +(resource.converted) === 1)? '(Active)': '(Pending)'}</IonText>
                }
            </IonCardHeader>
            { resource && <>
            <IonCardContent className="pt-3">
              <IonGrid className="p-0">
                <IonRow>
                  { resource && +(resource.converted) === 0 && <IonCol className="p-4">
                    <p className="py-5">
                      <IonText color="danger">{notifyText}</IonText>
                    </p>
                  </IonCol>}
                  {/* { resource && +(resource.converted) === 1 && resource.filename && res_type && res_type === 'video' && 
                      <IonCol sizeMd="8" sizeXl="8" sizeXs="12" className="p-0"> 
                        <VideoViewer /> 
                      </IonCol>
                  }
                  { resource && +(resource.converted) === 1 && resource.filename && res_type && ['audio'].includes(res_type) &&
                      <IonCol sizeMd="6" sizeXl="6" sizeXs="12" className="pt-4"> 
                          <AudioViewer/> 
                      </IonCol>
                  }
                  { resource && +(resource.converted) === 1 && resource.filename && res_type && ['document', 'article'].includes(res_type) &&
                      <IonCol sizeMd="12" sizeXl="8" sizeXs="12" className="p-0"> 
                        <div style={{ width: "100%", minHeight: '200px'}}>
                          <DocumentViewer /> 
                        </div>
                      </IonCol>
                  } */}
                   
                  <IonCol sizeMd={ (resource.filename && +(resource.converted) === 1)? "4": "12" } sizeXl={ (resource.filename && +(resource.converted) === 1)? "4": "12" } sizeXs="12" className="">
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
             
          </IonCard>  
        </IonContent>
      </>}
    </div>);
};
  
export default QQPreviewModal;
  