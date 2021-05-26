import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonRow, IonCol, IonButton, IonToolbar, IonButtons, IonTitle, IonIcon } from '@ionic/react'; 
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
import { alertCircleOutline } from 'ionicons/icons';

const ViewQuotation: React.FC = () => {
  const dispatch = useDispatch();
  //const authUser = useSelector( (state:any) => state.auth.data.user);
  const loadingState = useSelector( (state:any) => state.ui.loading);
  const qq = useSelector( (state:any) => state.qq.localQuote);
  const qt = useSelector( (state:any) => state.qq.quotation);
  const { basename } = lfConfig;
  let { id, mem_id, rfqType, qq_id, qq_mem_id, vfrom } = useParams<any>();

  // QQ deafult to load callback
  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(qqActions.setSQ({ data: res.data.seller }));
      dispatch(qqActions.setQQ({ data: res.data.buyer }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
     dispatch(uiActions.setShowLoading({ loading: true }));
     CoreService.onPostFn('qq_update', {
       action: 'get_seller_buyer_qq', 
       rfqType: rfqType,
       memID: mem_id, // Seller QQ Mem ID
       formID: id, // Seller QQ ID
       bqMemID: qq_mem_id, // Buyer QQ Mem ID
       bqID: qq_id, // Buyer QQ ID
     }, onCallbackFn);
   }
  }, [dispatch, id, rfqType, onCallbackFn]);

  return (
    <IonPage className="rfq-page">
      {/* <IonToolbar>
        <IonTitle size="large">View Quotation</IonTitle>
      </IonToolbar> */}
      { qq && Object.keys(qq).length > 0 && 
        <IonContent>
          <IonToolbar>
              <IonButtons slot="start">
                  <IonButton color="greenbg" 
                    routerLink={`${basename}/layout/${ vfrom === 'buyer'? 'buyer-request-center': 'seller-request-center' }/${rfqType}`}
                    className="ion-margin-top mt-3 mb-3">
                    {`<< Back`}
                </IonButton>
              </IonButtons>
              <IonTitle className="page-title">View Quotation</IonTitle>
          </IonToolbar>
          { +(qt.is_active) === 6 && qt.withdraw_reason && 
            <IonRow>
              <IonCol>
                <IonCard className="card-center mt-2 mb-2">
                  <IonCardContent className="pt-3">
                    <p className="card-custom-title error"> 
                    <IonIcon icon={alertCircleOutline} slot="start"></IonIcon> Withdraw Reason</p>
                    <HtmlText htmlText={qt.withdraw_reason} />
                  </IonCardContent>  
                </IonCard>
              </IonCol>
            </IonRow>   
          }
          <IonRow>
            <IonCol sizeMd="6" sizeXs="12">
              <IonCard className="card-center mt-3 mb-3">
                <IonCardHeader color="titlebg">
                    <IonCardTitle className="card-custom-title">LocalQuote Name and Service Description</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="pt-3">
                  { qq.p_title && <p><span className="fw-bold">LocalQuote Title : </span> {qq.p_title}</p>}
                  { qt.s_title && <p><span className="fw-bold">Quotation Title : </span> {qt.s_title}</p>}
                  { qq.p_short_desc && <p><span className="fw-bold">Short Description : </span> {qq.p_short_desc}</p>}
                  { qt.s_product && <div><span className="fw-bold">Product or Services Details  : </span> 
                    <HtmlText htmlText={qt.s_product} /></div>}

                  { qq.p_quantity && <p><span className="fw-bold">Quantity Required : </span> {qq.p_quantity}</p>}
                  { qt.expected_percentage && <p><span className="fw-bold">The expected percentage over or under run will be : </span> {qt.expected_percentage}</p>}
                  
                  { qq.p_unit_measure && <p><span className="fw-bold">Unit Measure : </span> {qq.p_unit_measure}</p>}
                  { qt.country_currency && <p><span className="fw-bold">Country of Currency : </span> {qt.country_currency}</p>}
                  
                  { qq.order_frequency  && <p><span className="fw-bold">Estimated Order Frequency : </span> {qq.order_frequency }</p>}
                  
                  { qt.order_frq_details && <div className="mb-2">
                    <p className="card-custom-title">Supplier Estimated Order Frequency Details and Terms</p>
                    <HtmlText htmlText={qt.order_frq_details} />
                  </div>}

                  
                </IonCardContent>  
              </IonCard>  
              { qq.special_details && <IonCard className="card-center mt-3 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Ongoing Supply Special Details</p>
                  <HtmlText htmlText={qq.special_details} />
                </IonCardContent>  
              </IonCard>}
              <IonCard className="card-center mt-3 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Dates and Other Special Instructions</p>
                  { qq.ongoing_order_date && <p><strong>Price on ongoing orders is valid until : </strong> {CommonService.dateFormat(qt.ongoing_order_date)}</p>} 
                  { qq.quotation_req_date && <p><span className="fw-bold">Date of Quotation  : </span> {CommonService.dateFormat(qq.quotation_req_date)}</p>}
                  { qq.delivery_date && <p><span className="fw-bold">Requested Delivery Date : </span> {CommonService.dateFormat(qq.delivery_date)}</p>}
                  { qq.special_event_date  && <p><span className="fw-bold">Special Event Date : </span> {CommonService.dateFormat(qq.special_event_date)}</p>}
                  { qt.req_delivery_notes && <div className="mb-2">
                    <p className="card-custom-title">If the Requested Delivery or Special Event Date can not be met, explain here :</p>
                    <HtmlText htmlText={qt.req_delivery_notes} />
                  </div>}
                  
                </IonCardContent>  
              </IonCard>
              
            </IonCol>
            <IonCol sizeMd="6" sizeXs="12">
              {qq.buscats && Object.keys(qq.buscats).length > 0 && <IonCard className={ "card-center mb-3 " + ((isPlatform('android') || isPlatform('ios'))? 'mt-1': 'mt-3' )}>
                <IonCardContent>
                  <p className="card-custom-title">Product or Service Category(s)</p>
                  <BuscatsList buscats={qq.buscats} />
                </IonCardContent>  
              </IonCard>}
              { qq.p_desc && <IonCard className="card-center mt-3 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Description</p>
                  <HtmlText htmlText={qq.p_desc} />
                </IonCardContent>  
              </IonCard>}  
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol sizeMd="6" sizeXs="12">
              <IonCard className="card-center mt-3 mb-3">  
                <IonCardContent className="pt-3">
                { qq.shipping_ins && <div className="mb-2">
                  <p className="card-custom-title">Buyer Shipping Instructions</p>
                  <HtmlText htmlText={qq.shipping_ins} />
                </div>}
                { qt.s_shipping_notes && <div className="mb-2">
                  <p className="card-custom-title">Supplier Shipping Notes</p>
                  <HtmlText htmlText={qt.s_shipping_notes} />
                </div>}
                { qt.s_upload_notes && <div className="mb-2">
                  <p className="card-custom-title">Supplier Quotation Notes</p>
                  <HtmlText htmlText={qt.s_upload_notes} />
                </div>}
                </IonCardContent>  
              </IonCard>
            </IonCol>
            {qq.memProfile && <IonCol sizeMd="6" sizeXs="12">
              <IonCard className="card-center mt-3 mb-3">
                <IonCardContent className="pt-3">
                  <p className="card-custom-title">Supplier Contact Details</p>
                  { qq.memProfile.firstname && <p><span className="fw-bold">Representative Name : </span> {`${qq.memProfile.firstname} ${qq.memProfile.lastname}`}</p>}
                  { qq.memProfile.company_name && <p><span className="fw-bold">Company Name : </span> {qq.memProfile.company_name}</p>}
                  { qq.memProfile.address1 && <p><span className="fw-bold">Address : </span> 
                    {qq.memProfile.suite? `${qq.memProfile.suite}, `: ''}
                    {qq.memProfile.address1? `${qq.memProfile.address1}, `: ''}
                    {qq.memProfile.address2? `${qq.memProfile.address2}, `: ''}
                    {`${qq.memProfile.city}, ${qq.memProfile.state}, ${qq.memProfile.country}`}
                  </p>}
                  { qq.memProfile.phone && <p><span className="fw-bold">Phone : </span> {qq.memProfile.phone}</p>}
                  { qq.memProfile.fax && <p><span className="fw-bold">Fax : </span> {qq.memProfile.fax}</p>}
                  
                </IonCardContent>  
              </IonCard>
            </IonCol>}
          </IonRow>  
          <IonRow>
            <IonCol sizeMd="6" sizeXs="12">
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
            </IonCol>
            <IonCol sizeMd="6" sizeXs="12">
            {qt && qt.attachments && 
                (qt.attachments.document || qt.attachments.audio || qt.attachments.video) && 
                (Object.keys(qt.attachments.document).length > 0 || Object.keys(qt.attachments.audio).length > 0 || Object.keys(qt.attachments.video).length > 0) &&
                <IonCard className="card-center mt-3 mb-3">
                  <IonCardHeader color="titlebg">
                    <IonCardTitle className="card-custom-title">Quotation Supporting Medias</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                  {qt.attachments && qt.attachments.document && Object.keys(qt.attachments.document).length > 0 && <>
                    <p className="card-custom-title">Documents</p>
                    <MediaList attachments={qq.attachments.document} formType='localquote' />
                  </>}
                  {qt.attachments && qt.attachments.audio && Object.keys(qt.attachments.audio).length > 0 && <>
                    <p className="card-custom-title">Audios</p>
                    <MediaList attachments={qt.attachments.audio} formType='localquote' />
                  </>}
                  {qt.attachments && qt.attachments.video && Object.keys(qt.attachments.video).length > 0 && <>
                    <p className="card-custom-title">Videos</p>
                    <MediaList attachments={qt.attachments.video} formType='localquote' />
                  </>}
                  </IonCardContent>
                </IonCard>
              }
            </IonCol>
          </IonRow>
          
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

export default ViewQuotation;
