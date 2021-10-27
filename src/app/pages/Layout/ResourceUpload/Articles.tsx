import { IonList, IonAvatar, IonItem, IonLabel, IonText, IonItemSliding, IonItemOptions, IonRouterLink, IonItemOption, IonIcon, IonThumbnail } from '@ionic/react';
import React from 'react';
import { useHistory } from "react-router-dom";
import { isPlatform } from '@ionic/react';
import { nanoid } from 'nanoid';
import './ResourceUpload.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import { documentTextOutline } from 'ionicons/icons';
import CommonService from '../../../shared/services/CommonService';
import Status from '../../../components/Common/Status';

interface Props {
  res_type: string,
  setShowAlert: Function
}

const Articles: React.FC<Props> = ({res_type, setShowAlert}) => {
  const history = useHistory();
  const resources = useSelector( (state:any) => state.res.resources);
  const { apiBaseURL, basename } = lfConfig;

  const slideEdit = (item: any) => {
    history.push(`/layout/add-resource/${res_type}/${item.id}/${item.mem_id}/1`);
  }

  return (<>
    { resources &&
      <IonList className="buscat-section-content">
        { resources && resources.length > 0 &&  resources.map((item: any, index: number)=> {
          let resImage = '';
          if( +(item.converted) === 1){
            resImage = ( item && Object.keys(item).length > 0 && item.filename) ? `${apiBaseURL}uploads/member/${item.mem_id}/${item.rep_id}/${item.filename.split(/\.(?=[^\.]+$)/)[0]}.png` : ``;
          }
          return (<div key={nanoid()}>
            { (!isPlatform('desktop')) &&    
              <IonItemSliding > 
                <IonItem lines={ (resources.length === index+1)? "none": "inset" } routerLink={`${basename}/layout/resources/${res_type}/${item.id}`}>
                  <IonThumbnail slot="start">
                    { resImage && <img className="pr-2" src={resImage} alt={item.title} /> }
                    { !resImage && <IonIcon className="pt-2" color="greenbg" size="large" icon={documentTextOutline}></IonIcon>}
                  </IonThumbnail>
                  <IonLabel>
                    <h2>{item.title} </h2>
                    <p>
                      <Status is_active={+(item.status)} converted={+(item.converted)} type="resources" />
                      {' '+CommonService.dateFormat(item.added_date)}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption className="px-2" color="greenbg" onClick={() => slideEdit(item) } >Edit</IonItemOption>
                  <IonItemOption color="warning" onClick={() => setShowAlert({status: true, id: item.id, mem_id: item.mem_id })}>Delete</IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            }
            { (isPlatform('desktop')) &&
            <IonItem lines={ (resources.length === index+1)? "none": "inset" }>
              <IonThumbnail slot="start">
                <IonRouterLink href={`${basename}/layout/resources/${res_type}/${item.id}`}>
                  { resImage && <img className="pr-2" src={resImage} alt={item.title} /> }
                  { !resImage && <IonIcon className="pt-2" color="greenbg" size="large" icon={documentTextOutline}></IonIcon>}
                </IonRouterLink> 
              </IonThumbnail>
              <IonLabel>
                <IonRouterLink color="dark" href={`${basename}/layout/resources/${res_type}/${item.id}`}>
                <h2>{item.title} </h2>
                </IonRouterLink>
                <p>
                  <Status is_active={+(item.status)} converted={+(item.converted)} type="resources" />
                  {' '+CommonService.dateFormat(item.added_date)}
                </p>
              </IonLabel>
              
              <IonRouterLink className="router-link-anchor" slot="end" color="greenbg" href={`${basename}/layout/add-resource/${res_type}/${item.id}/${item.mem_id}/1`}>
                <i className="fa fa-pencil fa-lg green cursor" aria-hidden="true"></i>
              </IonRouterLink>
              <IonAvatar className="anchor-white-ellipsis" slot="end" color="greenbg" onClick={() => setShowAlert({status: true, id: item.id, mem_id: item.mem_id })}>
                <i className="fa fa-trash fa-lg green cursor" aria-hidden="true"></i>
              </IonAvatar>
            </IonItem>
            }
          </div>)
        })} 
        { resources && resources.length === 0 &&  
          <IonItem lines="none" >
            <IonText className="fs-13 mr-3" color="warning">
              No Articles added.   
            </IonText>
          </IonItem>
        }
    </IonList> }   
  </>);
};

export default Articles;
