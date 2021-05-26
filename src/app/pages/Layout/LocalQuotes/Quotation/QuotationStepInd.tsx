import { IonRouterLink } from '@ionic/react';
import React from 'react';
import { useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../LocalQuotes.scss';
import { lfConfig } from '../../../../../Constants';

const QuotationStepInd: React.FC = () => {
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const quote = useSelector( (state:any) => state.qq.quotation);
  const { basename } = lfConfig;
  let { id, mem_id, quote_id, step, rfqType } = useParams<any>();

  return (<>
      <div className="mb-4">
        <ol className="step-indicator">
            <li className={ (!step || (step && step === '1'))? 'active': (step && step > '1')? 'complete' : '' }>
              <IonRouterLink {... (id && step && quote && quote.s_title && quote.s_product) ? {href: `${basename}/layout/quotation/${rfqType}/${id}/${mem_id}/${quote_id}/1`} : {}}>
                <div className={ `step ${(quote && !quote.s_title && !quote.s_product)? 'no-cursor': ''}`} >
                  <i className="fa fa-th-list"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Create</span>
              </div>  
            </li>
            <li className={ (step && step === '2')? 'active': (step && step > '2')? 'complete' : '' }>
              <IonRouterLink {... (id && step && quote && quote.attachments && (quote.attachments.document.length > 0 || quote.attachments.audio.length > 0 || quote.attachments.video.length > 0)) ? {href: `${basename}/layout/quotation/${rfqType}/${id}/${mem_id}/${quote_id}/2`} : {}}>
                <div className={ `step ${(quote && quote.attachments && (quote.attachments.document.length === 0 && quote.attachments.audio.length === 0 && quote.attachments.video.length === 0))? 'no-cursor': ''}`} >
                  <i className="fa fa-picture-o"></i>
                </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Attach</span>
              </div>
            </li>
            <li className={ (step && step === '3')? 'active': (step && step > '3')? 'complete' : '' }>
              <IonRouterLink {... (id && step && quote && quote.quotation_provided_by) ? {href: `${basename}/layout/quotation/${rfqType}/${id}/${mem_id}/${quote_id}/3`} : {}}>
                <div className={ `step ${(quote && !quote.quotation_provided_by)? 'no-cursor': ''}`} >
                <i className="fa fa-user-circle-o"></i>
              </div>
              </IonRouterLink>
              <div className="caption hidden-xs hidden-sm">
                <span>Assign</span>
              </div>
            </li>
            
        </ol>
      </div>
    </>);
  };
 
 export default QuotationStepInd;