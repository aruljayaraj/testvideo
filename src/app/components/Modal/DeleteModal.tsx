import {
  IonItem, 
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonContent,
  IonHeader,
  IonTextarea
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';

import CoreService from '../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../store/reducers/ui';
import * as prActions from '../../store/reducers/dashboard/pr';
import * as resActions from '../../store/reducers/dashboard/resource';
import * as qqActions from '../../store/reducers/dashboard/qq';

type FormInputs = {
  reason: string;
}

interface Props {
  title: string,
  showDeleteModal: any,
  setShowDeleteModal: Function,
  action?: string
}
const DeleteModal: React.FC<Props> = ({ title, showDeleteModal, setShowDeleteModal, action }) => {
  const dispatch = useDispatch();
  let initialValues = {
    reason: ''
  };
  const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
      defaultValues: { ...initialValues },
      mode: "onChange"
  });

  const onCommonCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      setShowDeleteModal({ isOpen: false, id: null, mem_id: null, rfqType: '', qqType: ''});
      if( showDeleteModal.qqType === 'seller' ){
        dispatch(qqActions.setSQs({ data: res.data }));
      }else if( showDeleteModal.qqType === 'buyer' ){
        dispatch(qqActions.setQQs({ data: res.data }));
      }
    }
    // dispatch(uiActions.setShowSkeleton({ skeleton: false }));
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);
  
  const onSubmitFn = (data: any) => { // , id: number, mem_id: number
    // dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    dispatch(uiActions.setShowLoading({ loading: true }));
    const fd = {
        action: (action)? action: 'qq_delete',
        rfqType: showDeleteModal.rfqType,
        qqType: showDeleteModal.qqType, 
        memID: showDeleteModal.mem_id,
        formID: showDeleteModal.id,
        ...data
    };
    CoreService.onPostFn('qq_update', fd, onCommonCb);
  } 
  
  return (<>
    <form onSubmit={handleSubmit(onSubmitFn)}>
      <IonHeader translucent>
        <IonToolbar color="greenbg">
            <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                <IonButton onClick={() => setShowDeleteModal({isOpen: false, id: null, mem_id: null, rfqType: ''})}>
                    <IonIcon icon={close} slot="icon-only"></IonIcon>
                </IonButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem class="ion-no-padding">
                <IonLabel position="stacked">{title} Reason <IonText color="danger">*</IonText></IonLabel>
                <Controller 
                    name="reason"
                    control={control}
                    render={({ field: {onChange, onBlur, value} }) => {
                      return <IonTextarea rows={5} cols={20}
                          onKeyUp={(e: any) => {
                              var str = e.target.value;
                              if( str.split(/\s+/).length > 100 ){
                                  e.target.value = str.split(/\s+/).slice(0, 100).join(" ");
                              }
                          }}
                          onIonChange={(e: any) => onChange(e.target.value)}
                          onBlur={onBlur}
                          value={value}
                      />
                    }}
                    rules={{
                      required: {
                        value: true,
                        message: "Reason is required"
                      },
                      pattern: {
                          value: /^\W*(\w+(\W+|$)){1,100}$/i,
                          message: "Reason shoud be lessthan 100 words"
                      }
                    }}
                />
              </IonItem>
              <IonText color="medium" className="fs-12">Maximum of 100 Words</IonText>
              <ErrorMessage
                  errors={errors}
                  name="reason"
                  render={({ message }) => <div className="invalid-feedback">{message}</div>}
              />
              
              <div className="mt-4">           
              { (isPlatform('desktop')) && 
                <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                    Submit
                </IonButton>
              }
              </div> 
            </IonCol>
          </IonRow>     
        </IonGrid>
      </IonContent>
    </form>
  </>);
}

export default DeleteModal;
