import { IonContent, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useCallback, useEffect  } from 'react';
import { useParams } from "react-router-dom";

import '../LocalQuotes.scss'; 
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import CoreService from '../../../../shared/services/CoreService';

import CreateQQ from './CreateQQ';
import BusinessCategory from './BusinessCategory';
import SpecialInstructions from './SpecialInstructions';
import QQMedia from './QQMedia';

const AddLQ: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user );
  const qq = useSelector( (state:any) => state.qq.localQuote);
  let { id, mem_id, step } = useParams<any>();

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
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id
      }, onCallbackFn);
    }
}, [dispatch, authUser, id, onCallbackFn]);

  return (
    <IonPage className="rfq-page">
      <IonToolbar>
        <IonTitle className="page-title">Request a Quote</IonTitle>
      </IonToolbar>
        <IonContent className="ion-padding">
          { ( (!mem_id && !id && !step) || (mem_id && id && step === '1' && (qq && Object.keys(qq).length > 0)) ) && <CreateQQ /> }
          { (qq && Object.keys(qq).length > 0) && mem_id && id && (step === '2') && <BusinessCategory /> }
          { (qq && Object.keys(qq).length > 0) && mem_id && id && (step === '3') && <QQMedia /> }
          { (qq && Object.keys(qq).length > 0) && mem_id && id && (step === '4') && <SpecialInstructions /> }
        </IonContent> 
    </IonPage>
  );
};

export default AddLQ;