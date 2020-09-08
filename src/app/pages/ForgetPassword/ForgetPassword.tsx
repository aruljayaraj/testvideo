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
  IonRouterLink,
  IonRow,
  IonCol
} from '@ionic/react';
import React, { useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import { useDispatch } from 'react-redux';
// import * as authActions from '../../store/reducers/auth';
import * as uiActions from '../../store/reducers/ui';
import CoreService from '../../shared/services/CoreService';
import './ForgetPassword.scss';

let initialValues = {
  email: "",
  pin: "",
  password: "",
  confirm_password: ""
}

const ForgetPassword: React.FC = () => {
  console.log('Forget Password Page');
  const dispatch = useDispatch(); 
  const history = useHistory();
  // const authValues = useSelector( (state:any) => state.auth.data);
  const { control, handleSubmit, formState, errors, watch } = useForm({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });
  const [isForgetPwdSent, setIsForgetPwdSent] = useState(false); 
  const [regEmail, setRegEmail] = useState(''); 
  const password = useRef({});
  password.current = watch("password", "");
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

  // For Forget Success callback Function
  const onForgetCbFn = useCallback((res: any) => { console.log(res);
    if(res.status === 'SUCCESS'){
      setIsForgetPwdSent(true);
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch, setIsForgetPwdSent]);
  // For Reset Success callback Function
  const onResetCbFn = useCallback((res: any) => { console.log(res);
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    if(res.status === 'SUCCESS'){
      history.push({ pathname:  "/login" });
    }
  },[dispatch, history]);
  /**
   *
   * @param data
   */
  const onForgetSubmit = (data: any) => {
    dispatch(uiActions.setShowLoading({ loading: true }));
    const user = {
      email: data.email
    };
    setRegEmail(data.email);
    CoreService.onPostFn('forget-password', user, onForgetCbFn);
  }

  const onResetSubmit = (data: any) => {
    if( regEmail ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const user = {
        email: regEmail,
        password: data.password,
        pin: data.pin
      };
      CoreService.onPostFn('reset-password', user, onResetCbFn);
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Email should not be empty!' }));
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2">
          <IonCardHeader>
              { !isForgetPwdSent &&  
                <IonCardSubtitle color="medium" className="ion-text-center">
                  Enter your register email below and<br />
                  submit to get reset your password!
              </IonCardSubtitle> }
              { isForgetPwdSent &&  
                <IonCardSubtitle color="medium" className="ion-text-center">
                  An authentication code has been sent to your email.<br />
                  You have 30 minute to enter the code below and select Next.<br />
                  On selecting Next you will be logged into your account.
              </IonCardSubtitle> }  
          </IonCardHeader>

          <IonCardContent>
          { !isForgetPwdSent &&  
            <>
              <form className="ion-padding" onSubmit={handleSubmit(onForgetSubmit)}>
                <IonItem>
                  <IonLabel color="medium" position="stacked">Email</IonLabel>
                  <Controller
                    as={IonInput}
                    control={control}
                    onChangeName="onIonChange"
                    onChange={([selected]) => {
                      return selected.detail.value;
                    }}
                    name="email"
                    rules={{
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid Email Address"
                      }
                    }}
                  />
                </IonItem>
                {showError("email", "Email")}
                <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit" disabled={formState.isValid === false}>
                  Submit
                </IonButton>    
              </form> 
              <IonRow className="ion-padding">
                  <hr />
                  <IonCol className="ion-text-end">
                    <IonRouterLink color="medium" href={`${process.env.REACT_APP_BASE_URL}/login`} className="text-right">Login to the account</IonRouterLink>
                  </IonCol>
              </IonRow>
            </> 
          }

          { isForgetPwdSent &&  
            <>
              <form className="ion-padding" onSubmit={handleSubmit(onResetSubmit)}>
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

                <IonItem>
                  <IonLabel color="medium" position="stacked">Password</IonLabel>
                  <Controller
                    as={IonInput}
                    control={control}
                    onChangeName="onIonChange"
                    onChange={([selected]) => {
                      return selected.detail.value;
                    }}
                    name="password"
                    type="password"
                    rules={{
                      required: true,
                      minLength: {
                        value: 5,
                        message: "Password must have at least 5 characters"
                      },
                      maxLength: {
                        value: 15,
                        message: "Password must consist of at maximum 15 characters"
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-@!#$%^&*()]{5,15}$/i,
                        message: "Invalid Password"
                      }
                    }}
                  />
                </IonItem>
                {showError("password", "Password")}

                <IonItem>
                  <IonLabel color="medium" position="stacked">Confirm Password</IonLabel>
                  <Controller
                    as={IonInput}
                    control={control}
                    onChangeName="onIonChange"
                    onChange={([selected]) => {
                      return selected.detail.value;
                    }}
                    name="confirm_password"
                    type="password"
                    rules={{
                      required: true,
                      minLength: {
                        value: 5,
                        message: "Password must have at least 5 characters"
                      },
                      maxLength: {
                        value: 15,
                        message: "Password must consist of at maximum 15 characters"
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-@!#$%^&*()]{5,15}$/i,
                        message: "Invalid Confirm Password"
                      },
                      validate: value => ( value === password.current || "The passwords do not match" )
                    }}
                  />
                </IonItem>
                {showError("confirm_password", "Confirm Password")}

                <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit" disabled={formState.isValid === false}>
                  Submit
                </IonButton>    
              </form> 
              <IonRow className="ion-padding">
                  <hr />
                  <IonCol className="ion-text-end">
                    <IonRouterLink color="medium" href={`${process.env.REACT_APP_BASE_URL}/Login`} className="text-right">Login to the account</IonRouterLink>
                  </IonCol>
              </IonRow>
            </> 
          }
            
          </IonCardContent>
        </IonCard>
      </IonContent>

    </IonPage>
  );
};

export default ForgetPassword;
