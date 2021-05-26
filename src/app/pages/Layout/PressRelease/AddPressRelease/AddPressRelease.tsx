import { IonContent, IonPage } from '@ionic/react';
import React, { useCallback, useEffect  } from 'react';
import { useParams } from "react-router-dom";

import '../PressRelease.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as prActions from '../../../../store/reducers/dashboard/pr';
import CoreService from '../../../../shared/services/CoreService';

import CreatePressRelease from './CreatePressRelease';
import BusinessCategory from './BusinessCategory';
import AssignRep from './AssignRep';
import PRMedia from './PRMedia';

interface Params {
  id: number
  mem_id: number,
  step: number
}

const AddPressRelease: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user );
  const pr = useSelector( (state:any) => state.pr.pressRelease);
  let { id, mem_id, step } = useParams<any>();

  // Press Release deafult to load callback
  const onPrBuscatCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(prActions.setPressRelease({ data: res.data }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('pr_update', {
            action: 'get_press_release', 
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id
        }, onPrBuscatCb);
    }
}, [dispatch, authUser, id, onPrBuscatCb]);

  return (
    <IonPage className="addpr-page">
        <IonContent className="ion-padding">
          { ( (!mem_id && !id && !step) || (mem_id && id && step === '1' && (pr && Object.keys(pr).length > 0)) ) && <CreatePressRelease /> }
          { (pr && Object.keys(pr).length > 0) && mem_id && id && (step === '2') && <BusinessCategory /> }
          { (pr && Object.keys(pr).length > 0) && mem_id && id && (step === '3') && <AssignRep /> }
          { (pr && Object.keys(pr).length > 0) && mem_id && id && (step === '4') && <PRMedia /> }
        </IonContent> 
    </IonPage>
  );
};

export default AddPressRelease;