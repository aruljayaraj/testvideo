import { IonRouterLink } from '@ionic/react';
import React from 'react';
import { useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../ResourceUpload.scss';
import { lfConfig } from '../../../../../Constants';

const ResStepInd: React.FC = () => {
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const resource = useSelector( (state:any) => state.res.resource);
  const { basename } = lfConfig;
  let { id, res_type, step } = useParams();

  return (<>
      <div className="mb-4">
        <ol className="step-indicator">
            <li className={ (!step || (step && step === '1'))? 'active': (step && step > '1')? 'complete' : '' }>
              <IonRouterLink {... (id && step && resource && resource.title && resource.description) ? {href: `${basename}/layout/add-resource/${res_type}/${id}/${authUser.ID}/1`} : {}}>
                <div className={ `step ${(resource && !resource.title && !resource.description)? 'no-cursor': ''}`} >
                  <i className="fa fa-th-list"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Create</span>
              </div>  
            </li>
            <li className={ (step && step === '2')? 'active': (step && step > '2')? 'complete' : '' }>
              <IonRouterLink {... (id && step && resource && resource.buscats && resource.buscats.length > 0) ? {href: `${basename}/layout/add-resource/${res_type}/${id}/${authUser.ID}/2`} : {}}>
                <div className={ `step ${(resource && resource.buscats && resource.buscats.length === 0)? 'no-cursor': ''}`} >
                  <i className="fa fa-paper-plane"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Category</span>
              </div>
            </li>
            <li className={ (step && step === '3')? 'active': (step && step > '3')? 'complete' : '' }>
              <IonRouterLink {... (id && step && resource && resource.res_reps) ? {href: `${basename}/layout/add-resource/${res_type}/${id}/${authUser.ID}/3`} : {}}>
                <div className={ `step ${(resource && !resource.res_reps)? 'no-cursor': ''}`} >
                <i className="fa fa-user-circle-o"></i>
              </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Assign</span>
              </div>
            </li>
            <li className={ (step && step === '4')? 'active': (step && step > '4')? 'complete' : '' }>
              <IonRouterLink {... (id && step && resource && resource.filename) ? {href: `${basename}/layout/add-resource/${res_type}/${id}/${authUser.ID}/4`} : {}}>
                <div className={ `step ${(resource && !resource.filename)? 'no-cursor': ''}`} >
                  <i className="fa fa-picture-o"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Attach</span>
              </div>
            </li>
        </ol>
      </div>
    </>);
  };
 
 export default ResStepInd;