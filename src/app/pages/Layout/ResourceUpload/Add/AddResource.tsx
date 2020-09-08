import { IonContent, IonPage } from '@ionic/react';
import React, { useCallback, useEffect  } from 'react';
import { useParams } from "react-router-dom";

import '../ResourceUpload.scss'; 
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as resActions from '../../../../store/reducers/dashboard/resource';
import CoreService from '../../../../shared/services/CoreService';

import CreateResource from './CreateResource';
import BusinessCategory from './BusinessCategory';
import AssignRep from './AssignRep';
import ResMedia from './ResMedia';

interface Params {
  id: number
  mem_id: number,
  step: number
}

const AddResource: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user );
  const resource = useSelector( (state:any) => state.res.resource);
  let { id, mem_id, step, res_type } = useParams();

  // Press Release deafult to load callback
  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(resActions.setResource({ data: res.data }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('res_update', {
            action: 'get_resource', 
            resType: res_type,
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id
        }, onCallbackFn);
    }
}, [dispatch, authUser, id, res_type, onCallbackFn]);

  return (
    <IonPage className="addpr-page">
        <IonContent className="ion-padding">
          { ( (!mem_id && !id && !step) || (mem_id && id && step === '1' && (resource && Object.keys(resource).length > 0)) ) && <CreateResource /> }
          { (resource && Object.keys(resource).length > 0) && mem_id && id && (step === '2') && <BusinessCategory /> }
          { (resource && Object.keys(resource).length > 0) && mem_id && id && (step === '3') && <AssignRep /> }
          { (resource && Object.keys(resource).length > 0) && mem_id && id && (step === '4') && <ResMedia /> }
        </IonContent> 
    </IonPage>
  );
};

export default AddResource;