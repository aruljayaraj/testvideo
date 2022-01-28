import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardContent,
  IonItem, 
  IonLabel,
  IonNote,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/reducers/auth';
import * as uiActions from '../../store/reducers/ui';
import CoreService from '../../shared/services/CoreService';
import './EmailVerify.scss';

type FormInputs = {
  pin: string;
}

let initialValues = {
  pin: ""
};
const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
}

const EmailVerify: React.FC = () => {
  const dispatch = useDispatch();
  const INITIAL_COUNT = 1800;
  const authValues = useSelector( (state:any) => state.auth.data); 
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [status, setStatus] = useState(STATUS.STOPPED);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;

  const onCallbackFn = useCallback((res: any) => { console.log(res);
    if(res.status === 'SUCCESS'){
      if( +(res.data.remaining_seconds) > 0 ){
        setStatus(STATUS.STARTED);
        setSecondsRemaining(+(res.data.remaining_seconds));
      }
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { 
    
    dispatch(uiActions.setShowLoading({ loading: true }));
    const fd = {
        action: 'get_verify_pin_details',
        email: authValues.user.email,
        memID: authValues.user.ID
    };
    CoreService.onPostFn('email-verify', fd, onCallbackFn);
  },[]);

  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1)
      } else {
        setStatus(STATUS.STOPPED)
      }
    },
    status === STATUS.STARTED ? 1000 : null,
    // passing null stops the interval
  )
  
  const { control, handleSubmit, formState, formState: { errors } } = useForm<FormInputs>({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });

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
      action: 'email_verify',
      pin: data.pin,
      email: authValues.user.email,
      memID: authValues.user.ID
    };
    CoreService.onPostFn('email-verify', user, onEmailVerifyCb);
  }

  const onResendPinCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      setSecondsRemaining(+(res.data.remaining_seconds));
      setStatus(STATUS.STARTED);
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  },[dispatch]);

  const onResendPin = () => {
    dispatch(uiActions.setShowLoading({ loading: true }));
    const user = {
      action: 'resend_pin',
      email: authValues.user.email,
      memID: authValues.user.ID
    };
    CoreService.onPostFn('email-verify', user, onResendPinCb);
  }

  if( !authValues.authenticated && !authValues.isVerified && !authValues.user ){
    return <Redirect to="/login" />;
  }
  if( authValues.authenticated && authValues.isVerified  ){
    return <Redirect to="/layout/dashboard" />;
  }

  return (
    <IonPage className="email-verify-page">
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2">
          <IonCardHeader>
            <IonCardSubtitle color="medium" className="ion-text-center">
            An authentication code has been sent to your email ({authValues.user.email}). If you do not receive a verification code check your junk mail folder.<br /><br />
            You have 30 minute to enter the code below and select Verify.<br />
            On selecting Verify you will be logged into your account.
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
                          name="pin"
                          control={control}
                          render={({ field: {onChange, onBlur} }) => {
                            return <IonInput 
                              maxlength={6}
                              type="text"
                              onIonChange={onChange} 
                              onBlur={onBlur} />
                          }}
                          rules={{
                            required: {
                              value: true,
                              message: "Verification Pin is required"
                            },
                            pattern: {
                              value: /^[0-9]{6,6}$/i,
                              message: "Invalid Verification Pin"
                            }
                          }}
                      />
                    </IonItem>
                    {errors.pin && <div className="invalid-feedback">{errors.pin.message}</div>}
                  </IonCol>
                </IonRow>  
                
              </IonGrid>
              <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit">
                Verify
              </IonButton>
              <p className='mt-4 ion-text-center'>
                <IonNote>Resend PIN in 
                <span className='fw-bold pl-2'>
                  {twoDigits(minutesToDisplay)}:
                  {twoDigits(secondsToDisplay)}
                </span>
                </IonNote>
              </p>
              {status === 'Stopped' && <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="button" onClick={onResendPin}>
                Resend Pin
              </IonButton>}
              <p className="mt-3"><q>If you are still not receiving a verification code you may have entered your email incorrectly. To sign up again close this browser window and try the signup again.</q></p>
            </form>  
            
          </IonCardContent>
        </IonCard>
      </IonContent> 
    </IonPage>
  );
};

function useInterval(callback: any, delay: any) {
  const savedCallback: any = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const twoDigits = (num: number) => String(num).padStart(2, '0')

export default EmailVerify;
