import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardContent,
  IonItem, 
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import React, {useCallback} from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/reducers/auth';
import * as uiActions from '../../store/reducers/ui';
import CoreService from '../../shared/services/CoreService';
import './EmailVerify.scss';

let initialValues = {
  pin: ""
};

const EmailVerify: React.FC = () => {
  console.log('Email Verify Page');
  const dispatch = useDispatch();
  const authValues = useSelector( (state:any) => state.auth.data); 
  
  const { control, errors, handleSubmit, formState } = useForm({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });

 /**
   *
   * @param _fieldName
   */
  const showError = (_fieldName: string, msg: string) => {
    let error = (errors as any)[_fieldName];
    return error ? (
      (error.ref.name === _fieldName)? (
        <div className="invalid-feedback">
        {error.message || `${msg} is required`}
      </div>
      ) : null
    ) : null;
  };

  const onEmailVerifyCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(authActions.onEmailVerify({data: res.user}));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  },[dispatch]);
  /**
   *
   * @param data
   */
  const onSubmit = (data: any) => {
    dispatch(uiActions.setShowLoading({ loading: true }));
    const user = {
      pin: data.pin,
      email: authValues.user.email
    };
    CoreService.onPostFn('email-verify', user, onEmailVerifyCb);
  }

  if( !authValues.authenticated && !authValues.isVerified && !authValues.user ){
    return <Redirect to="/login" />;
  }
  if( authValues.authenticated && authValues.isVerified  ){
    return <Redirect to="/layout/dashboard" />;
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2">
          <IonCardHeader>
            <IonCardSubtitle color="medium" className="ion-text-center">
            An authentication code has been sent to your email.<br />
            You have 30 minute to enter the code below and select Next.<br />
            On selecting Next you will be logged into your account.
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
          <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
              <IonGrid>
                <IonRow>
                  <IonCol sizeMd="12" sizeXs="12">
                    <IonItem>
                      <IonLabel color="medium" position="stacked">6 Digit Verification Pin</IonLabel>
                      <Controller
                        as={IonInput}
                        control={control}
                        onChangeName="onIonChange"
                        onChange={([selected]) => {
                          return selected.detail.value;
                        }}
                        name="pin"
                        rules={{
                          required: true,
                          pattern: {
                            value: /^[0-9]{6,6}$/i,
                            message: "Invalid Pin"
                          }
                        }}
                      />
                    </IonItem>
                    {showError("pin", "Verification Pin")}
                  </IonCol>
                </IonRow>  
                
              </IonGrid>
              <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit" disabled={formState.isValid === false}>
                Submit
              </IonButton>
            </form>  
            
          </IonCardContent>
        </IonCard>
      </IonContent> 
    </IonPage>
  );
};

export default EmailVerify;
