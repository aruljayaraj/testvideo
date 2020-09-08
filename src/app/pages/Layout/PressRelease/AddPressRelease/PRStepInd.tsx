import { IonRouterLink } from '@ionic/react';
import React from 'react';
import { useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../PressRelease.scss';
import { lfConfig } from '../../../../../Constants';

const PRStepInd: React.FC = () => {
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const pr = useSelector( (state:any) => state.pr.pressRelease);
  const { basename } = lfConfig;
  let { id, step } = useParams();

  return (<>
    { pr && Object.keys(pr).length > 0 && 
      <div className="mb-4">
        <ol className="step-indicator">
            <li className={ (!step || (step && step === '1'))? 'active': (step && step > '1')? 'complete' : '' }>
              <IonRouterLink {... (id && step && pr.pr_name && pr.pr_desc) ? {href: `${basename}/layout/add-press-release/${id}/${authUser.ID}/1`} : {}}>
                <div className={ `step ${(!pr.pr_name && !pr.pr_desc)? 'no-cursor': ''}`} >
                  <i className="fa fa-th-list"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Create</span>
              </div>  
            </li>
            <li className={ (step && step === '2')? 'active': (step && step > '2')? 'complete' : '' }>
              <IonRouterLink {... (id && step && pr.buscats && pr.buscats.length > 0) ? {href: `${basename}/layout/add-press-release/${id}/${authUser.ID}/2`} : {}}>
                <div className={ `step ${(pr.buscats && pr.buscats.length === 0)? 'no-cursor': ''}`} >
                  <i className="fa fa-paper-plane"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Category</span>
              </div>
            </li>
            <li className={ (step && step === '3')? 'active': (step && step > '3')? 'complete' : '' }>
              <IonRouterLink {... (id && step && pr.pr_reps) ? {href: `${basename}/layout/add-press-release/${id}/${authUser.ID}/3`} : {}}>
                <div className={ `step ${(!pr.pr_reps)? 'no-cursor': ''}`} >
                <i className="fa fa-user-circle-o"></i>
              </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Assign</span>
              </div>
            </li>
            <li className={ (step && step === '4')? 'active': (step && step > '4')? 'complete' : '' }>
              <IonRouterLink {... (id && step && pr.pr_image) ? {href: `${basename}/layout/add-press-release/${id}/${authUser.ID}/4`} : {}}>
                <div className={ `step ${(!pr.pr_image)? 'no-cursor': ''}`} >
                  <i className="fa fa-picture-o"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Attach</span>
              </div>
            </li>
        </ol>
      </div>}
    </>);
  };
 
 export default PRStepInd;