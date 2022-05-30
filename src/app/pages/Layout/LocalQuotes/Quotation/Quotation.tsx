import { IonContent, IonPage } from '@ionic/react';
import React, { useCallback, useEffect  } from 'react';
import { useParams } from "react-router-dom";

import '../LocalQuotes.scss'; 
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import CoreService from '../../../../shared/services/CoreService';

import CreateQuotation from './CreateQuotation';
import AssignRep from './AssignRep';
import QQMedia from './QQMedia';

const Quotation: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user );
  const qq = useSelector( (state:any) => state.qq.localQuote);
  let { id, mem_id, quote_id, step } = useParams<any>();

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
        memID: authUser.ID, // Seller QQ Mem ID
        formID: quote_id, // Seller QQ ID
        repID: authUser.repID,
        bqMemID: mem_id, // Buyer QQ Mem ID
        bqID: id, // Buyer QQ ID
      }, onCallbackFn);
    }
  }, [dispatch, authUser, id, quote_id, mem_id, onCallbackFn]);
  
  return (
    <IonPage className="rfq-page">
        <IonContent className="ion-padding">
          { ( (mem_id && id && !quote_id && !step) || (mem_id && id && quote_id && (!step || step === '1') && (qq && Object.keys(qq).length > 0)) ) && <CreateQuotation /> }
          { (qq && Object.keys(qq).length > 0) && mem_id && id && (step === '2') && <QQMedia /> }
          { (qq && Object.keys(qq).length > 0) && mem_id && id && (step === '3') && <AssignRep /> }
        </IonContent> 
    </IonPage>
  );
};

export default Quotation;