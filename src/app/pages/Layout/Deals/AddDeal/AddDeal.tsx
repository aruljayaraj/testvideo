import { IonContent, IonPage } from '@ionic/react';
import React, { useCallback, useEffect  } from 'react';
import { useParams } from "react-router-dom";

import '../DailyDeal.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as dealActions from '../../../../store/reducers/dashboard/deal';
import CoreService from '../../../../shared/services/CoreService';

import Create from './Create';
import BusinessCategory from './BusinessCategory';
import AssignRep from './AssignRep';
import Media from './Media';

const AddDeal: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user );
  const dd = useSelector( (state:any) => state.deals.dailyDeal);
  let { id, mem_id, step } = useParams<any>();

  // Press Release deafult to load callback
  const onPrBuscatCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(dealActions.setDeal({ data: res.data }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('deal_update', {
            action: 'get_deal', 
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id
        }, onPrBuscatCb);
    }
}, [dispatch, authUser, id, onPrBuscatCb]);

  return (
    <IonPage className="deals-page">
        <IonContent className="ion-padding">
          { ( (!mem_id && !id && !step) || (mem_id && id && step === '1' && (dd && Object.keys(dd).length > 0)) ) && <Create /> }
          { (dd && Object.keys(dd).length > 0) && mem_id && id && (step === '2') && <BusinessCategory /> }
          { (dd && Object.keys(dd).length > 0) && mem_id && id && (step === '3') && <AssignRep /> }
          { (dd && Object.keys(dd).length > 0) && mem_id && id && (step === '4') && <Media /> }
        </IonContent> 
    </IonPage>
  );
};

export default AddDeal;