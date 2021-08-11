import {useCallback, useEffect} from "react";
import { useParams } from 'react-router-dom';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import CcContainer from '../../../../components/Payment/CardContainer';
import CoreService from '../../../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as frmdataActions from '../../../../store/reducers/common';
import Paypal from "../../../../components/Payment/Paypal";

const DealPayment = () => {
  const dispatch = useDispatch();
  let { id } = useParams<any>();
  const authValues = useSelector( (state:any) => state.auth.data.user);
  const itemData = useSelector( (state:any) => state.formdata.item);

  // For Purchase log default to load
  const onPurCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(frmdataActions.setFormData({ data: res.data, key: 'item' }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
}, [dispatch]);

  useEffect(() => {
    if( authValues.ID ){
        dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('item_purchase', {'action': 'get_item_purchase', memID: authValues.ID, repID: authValues.repID, formID: id }, onPurCb);
    }
  }, [dispatch, authValues.ID, onPurCb ]);

  return (
    <IonCard className="general-card mt-4">
      <IonCardHeader color="titlebg">
          <IonCardTitle className="fs-18">
              <span>Deal Purchase Payment</span>
          </IonCardTitle>
      </IonCardHeader>
        
      <IonCardContent>
        {itemData && itemData.payment_type === "credit_card" && <CcContainer /> }
        {itemData && itemData.payment_type === "paypal" && <Paypal /> }
      </IonCardContent>
    </IonCard>
  );
};

export default DealPayment;