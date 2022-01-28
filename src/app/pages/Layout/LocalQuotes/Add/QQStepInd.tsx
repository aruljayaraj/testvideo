import { IonRouterLink } from '@ionic/react';
import React from 'react';
import { useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../LocalQuotes.scss';
import { lfConfig } from '../../../../../Constants';

const QQStepInd: React.FC = () => {
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const qq = useSelector( (state:any) => state.qq.localQuote);
  const { basename } = lfConfig;
  let { id, step } = useParams<any>();

  return (<>
      <div className="mb-4">
        <ol className="step-indicator">
            <li className={ (!step || (step && step === '1'))? 'active': (step && step > '1')? 'complete' : '' }>
              <IonRouterLink {... (id && step && qq && qq.p_title && qq.p_desc) ? {href: `${basename}/layout/add-localquote/${id}/${authUser.ID}/1`} : {}}>
                <div className={ `step ${(qq && !qq.p_title && !qq.p_descr)? 'no-cursor': ''}`} >
                  <i className="fa fa-th-list"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Create</span>
              </div>  
            </li>
            <li className={ (step && step === '2')? 'active': (step && step > '2')? 'complete' : '' }>
              <IonRouterLink {... (id && step && qq && qq.buscats && qq.buscats.length > 0) ? {href: `${basename}/layout/add-localquote/${id}/${authUser.ID}/2`} : {}}>
                <div className={ `step ${(qq && qq.buscats && qq.buscats.length === 0)? 'no-cursor': ''}`} >
                  <i className="fa fa-paper-plane"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Category</span>
              </div>
            </li>
            <li className={ (step && step === '3')? 'active': (step && step > '3')? 'complete' : '' }>
              <IonRouterLink {... (id && step && qq && qq.attachments && (qq.attachments.document.length > 0 || qq.attachments.audio.length > 0 || qq.attachments.video.length > 0)) ? {href: `${basename}/layout/add-localquote/${id}/${authUser.ID}/3`} : {}}>
                <div className={ `step ${(qq && qq.attachments && (qq.attachments.document.length === 0 && qq.attachments.audio.length === 0 && qq.attachments.video.length === 0))? 'no-cursor': ''}`} >
                  <i className="fa fa-picture-o"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Attach</span>
              </div>
            </li>
            <li className={ (step && step === '4')? 'active': (step && step > '4')? 'complete' : '' }>
              <IonRouterLink {... (id && step && qq && qq.quotation_req_date) ? {href: `${basename}/layout/add-localquote/${id}/${authUser.ID}/4`} : {}}>
                <div className={ `step ${(qq && !qq.quotation_req_date)? 'no-cursor': ''}`} >
                <i className="fa fa-user-circle-o"></i>
              </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Instructions</span>
              </div>
            </li>
            
        </ol>
      </div>
    </>);
  };
 
 export default QQStepInd;