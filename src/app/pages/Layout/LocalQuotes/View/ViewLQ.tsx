import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonGrid, IonRow, IonCol, IonButton} from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { isPlatform } from '@ionic/react';
import '../LocalQuotes.scss';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import CommonService from '../../../../shared/services/CommonService';
import  BuscatsList from '../../../../components/Common/BuscatsList';
import  HtmlText from '../../../../components/Common/HtmlText';
import  MediaList from '../../../../components/Common/MediaList';

const ViewLQ: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const loadingState = useSelector( (state:any) => state.ui.loading);
  const qq = useSelector( (state:any) => state.qq.localQuote);
  const { basename } = lfConfig;
  let { id, rfqType, mem_id, vfrom } = useParams<any>();

  // QQ deafult to load callback
  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(qqActions.setQQ({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('qq_update', {
            action: 'get_buyer_qq',
            rfqType: rfqType, 
            memID: mem_id,
            repID: authUser.repID,
            formID: id
        }, onCallbackFn);
    }
  }, [dispatch, id, authUser, onCallbackFn]);

  // const ResFile = ( qq && Object.keys(qq).length > 0 && qq.filename) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${resource.filename}` : `${basename}/assets/img/placeholder.png`;
  // console.log(ResFile);
  return (
    <IonPage className="rfq-page">
      
      { qq && Object.keys(qq).length > 0 && 
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol className="d-flex align-items-center" sizeMd="6" sizeXs="12">
                <IonButton fill="clear" 
                    routerLink={`${basename}/layout/${ vfrom === 'buyer'? 'buyer-request-center': 'seller-request-center' }/${rfqType}`}
                    className="ion-margin-top mt-3 mb-3">
                    {`<< Back`}
                </IonButton>
                <div className="page-title">View LocalQuote</div>
              </IonCol>
              { [1,2].includes(+(qq.is_active)) && vfrom === 'sellers' &&<IonCol sizeMd="6" sizeXs="12" className={ isPlatform('desktop')? '': 'ion-text-center' }>
                
                  <IonButton color="greenbg" 
                    routerLink={`${basename}/layout/quotation/${rfqType}/${qq.id}/${qq.mem_id}`}
                    className={`ion-margin-top mt-3 mb-2 ${ isPlatform('desktop')? 'float-right': '' }`}>
                    Complete Quotation Now
                  </IonButton>
                  
              </IonCol>}
            </IonRow>
          </IonGrid>
          
          <IonRow>
            <IonCol sizeMd="6" sizeXs="12">
              <IonCard className="card-center mt-3 mb-3">
                <IonCardHeader color="titlebg">
                    <IonCardTitle className="card-custom-title">LocalQuote Name and Service Description</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="pt-3">
                  { qq.p_title && <p><span className="fw-bold">Title : </span> {qq.p_title}</p>}
                  { qq.p_short_desc && <p><span className="fw-bold">Short Description : </span> {qq.p_short_desc}</p>}
                  { qq.p_quantity && <p><span className="fw-bold">Quantity Required : </span> {qq.p_quantity}</p>}
                  { qq.p_unit_measure && <p><span className="fw-bold">Unit Measure : </span> {qq.p_unit_measure}</p>}
                  { qq.order_frequency  && <p><span className="fw-bold">Estimated Order Frequency : </span> {qq.order_frequency }</p>}
                </IonCardContent>  
              </IonCard>  
              { qq.special_details && <IonCard className="card-center mt-4 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Ongoing Supply Special Details</p>
                  <HtmlText htmlText={qq.special_details} />
                </IonCardContent>  
              </IonCard>}
              <IonCard className="card-center mt-4 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Dates and Other Special Instructions</p>
                  {/* { qq.p_short_desc && <p><strong>Location of Member : </strong> {qq.p_short_desc}</p>} */}
                  { qq.quotation_req_date && <p><span className="fw-bold">Date of Quotation  : </span> {CommonService.dateFormat(qq.quotation_req_date)}</p>}
                  { qq.delivery_date && <p><span className="fw-bold">Requested Delivery Date : </span> {CommonService.dateFormat(qq.delivery_date)}</p>}
                  { qq.special_event_date  && <p><span className="fw-bold">Special Event Date : </span> {CommonService.dateFormat(qq.special_event_date)}</p>}
                </IonCardContent>  
              </IonCard>
              { qq.shipping_ins && <IonCard className="card-center mt-4 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Shipping Instructions</p>
                  <HtmlText htmlText={qq.shipping_ins} />
                </IonCardContent>  
              </IonCard>}
              {qq && qq.attachments && 
                (qq.attachments.document || qq.attachments.audio || qq.attachments.video) && 
                (Object.keys(qq.attachments.document).length > 0 || Object.keys(qq.attachments.audio).length > 0 || Object.keys(qq.attachments.video).length > 0) &&
                <IonCard className="card-center mt-3 mb-3">
                  <IonCardHeader color="titlebg">
                    <IonCardTitle className="card-custom-title">LocalQuote Supporting Medias</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                  {qq.attachments && qq.attachments.document && Object.keys(qq.attachments.document).length > 0 && <>
                    <p className="card-custom-title">Documents</p>
                    <MediaList attachments={qq.attachments.document} formType='localquote' />
                  </>}
                  {qq.attachments && qq.attachments.audio && Object.keys(qq.attachments.audio).length > 0 && <>
                    <p className="card-custom-title">Audios</p>
                    <MediaList attachments={qq.attachments.audio} formType='localquote' />
                  </>}
                  {qq.attachments && qq.attachments.video && Object.keys(qq.attachments.video).length > 0 && <>
                    <p className="card-custom-title">Videos</p>
                    <MediaList attachments={qq.attachments.video} formType='localquote' />
                  </>}
                  </IonCardContent>
                </IonCard>
              }
              {/* {qq.attachments && Object.keys(qq.attachments).length > 0 && <IonCard className="card-center mt-4 mb-3">
                <IonCardContent>
                  <p className="card-custom-title">Photos, Documents and other supporting information</p>
                  <MediaList attachments={qq.attachments} formType='localquote' />
                </IonCardContent>  
              </IonCard>} */}
            </IonCol>
            <IonCol sizeMd="6" sizeXs="12">
              {qq.buscats && Object.keys(qq.buscats).length > 0 && <IonCard className={ "card-center mb-3 " + ( (!isPlatform('desktop')) ? 'mt-1': 'mt-4' )}>
                <IonCardContent>
                  <p className="card-custom-title">Product or Service Category(s)</p>
                  <BuscatsList buscats={qq.buscats} />
                </IonCardContent>  
              </IonCard>}
              { qq.p_desc && <IonCard className="card-center mt-4 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Description</p>
                  <HtmlText htmlText={qq.p_desc} />
                </IonCardContent>  
              </IonCard>}
              
            </IonCol>
          </IonRow>
          { [1,2].includes(+(qq.is_active)) && vfrom === 'sellers' && <div className="d-flex align-items-center justify-content-center">
            <IonButton color="greenbg" 
                routerLink={`${basename}/layout/quotation/${rfqType}/${qq.id}/${qq.mem_id}`}
                className="ion-margin-top mt-4 mb-3">
                Complete Quotation Now
            </IonButton> 
          </div>} 
        </IonContent> 
      }
      { !qq && !loadingState.showLoading && 
        <p className="py-5 px-3">
          <IonText color="warning">No LocalQuote found.</IonText>
        </p>
      }
    </IonPage>
  );
};

export default ViewLQ;
