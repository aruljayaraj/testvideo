import { IonRouterLink } from '@ionic/react';
import React from 'react';
import { useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../DailyDeal.scss';
import { lfConfig } from '../../../../../Constants';

const StepInd: React.FC = () => {
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const dd = useSelector( (state:any) => state.deals.dailyDeal);
  const { basename } = lfConfig;
  let { id, step } = useParams<any>();

  return (<>
    { dd && Object.keys(dd).length > 0 && 
      <div className="mb-4">
        <ol className="step-indicator">
            <li className={ (!step || (step && step === '1'))? 'active': (step && step > '1')? 'complete' : '' }>
              <IonRouterLink {... (id && step && dd.name && dd.description) ? {href: `${basename}/layout/deals/add-deal/${id}/${authUser.ID}/1`} : {}}>
                <div className={ `step ${(!dd.name && !dd.description)? 'no-cursor': ''}`} >
                  <i className="fa fa-th-list"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Create</span>
              </div>  
            </li>
            <li className={ (step && step === '2')? 'active': (step && step > '2')? 'complete' : '' }>
              <IonRouterLink {... (id && step && dd.buscats && dd.buscats.length > 0) ? {href: `${basename}/layout/deals/add-deal/${id}/${authUser.ID}/2`} : {}}>
                <div className={ `step ${(dd.buscats && dd.buscats.length === 0)? 'no-cursor': ''}`} >
                  <i className="fa fa-paper-plane"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Category</span>
              </div>
            </li>
            <li className={ (step && step === '3')? 'active': (step && step > '3')? 'complete' : '' }>
              <IonRouterLink {... (id && step && dd.reps) ? {href: `${basename}/layout/deals/add-deal/${id}/${authUser.ID}/3`} : {}}>
                <div className={ `step ${(!dd.reps)? 'no-cursor': ''}`} >
                <i className="fa fa-user-circle-o"></i>
              </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Assign</span>
              </div>
            </li>
            <li className={ (step && step === '4')? 'active': (step && step > '4')? 'complete' : '' }>
              <IonRouterLink {... (id && step && dd.image) ? {href: `${basename}/layout/deals/add-deal/${id}/${authUser.ID}/4`} : {}}>
                <div className={ `step ${(!dd.image)? 'no-cursor': ''}`} >
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
 
 export default StepInd;