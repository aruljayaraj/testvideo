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
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch } from 'react-redux';
// import * as authActions from '../../store/reducers/auth';
import * as uiActions from '../../store/reducers/ui';
import CoreService from '../../shared/services/CoreService';
import './ForgetPassword.scss';
import { lfConfig } from '../../../Constants';


type FormInputs = {
  email: string;
  pin: string;
  password: string;
  confirm_password: string;
}

let initialValues = {
  email: "",
  pin: "",
  password: "",
  confirm_password: ""
}

const ForgetPassword: React.FC = () => {
  const dispatch = useDispatch(); 
  const history = useHistory();
  const { baseurl } = lfConfig;
  // const authValues = useSelector( (state:any) => state.auth.data);
  const { control, handleSubmit, formState, watch, formState: { errors } } = useForm<FormInputs>({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });
  const [isForgetPwdSent, setIsForgetPwdSent] = useState(false); 
  const [regEmail, setRegEmail] = useState(''); 
  const password = useRef({});
  password.current = watch("password", "");

  // For Forget Success callback Function
  const onForgetCbFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      setIsForgetPwdSent(true);
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch, setIsForgetPwdSent]);
  // For Reset Success callback Function
  const onResetCbFn = useCallback((res: any) => { 
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
    <IonPage className="forget-password-page">
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
                      name="email"
                      control={control}
                      render={({ field: {onChange, onBlur, value} }) => {
                        return <IonInput 
                          type="email"
                          onIonChange={(e: any) => onChange(e.target.value)}
                          onBlur={onBlur}
                          value={value} />
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: "Email is required"
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Invalid Email Address"
                        }
                      }}
                  />
                </IonItem>
                <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                />
                <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit">
                  Submit
                </IonButton>    
              </form> 
              <IonRow className="ion-padding">
                  <hr />
                  <IonCol className="ion-text-end">
                    <IonRouterLink color="medium" href={`${baseurl}/login`} className="text-right">Login to the account</IonRouterLink>
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
                      name="pin"
                      control={control}
                      render={({ field: {onChange, onBlur, value} }) => {
                        return <IonInput 
                          type="number"
                          onIonChange={(e: any) => onChange(e.target.value)}
                          onBlur={onBlur}
                          value={value} />
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
                <ErrorMessage
                    errors={errors}
                    name="pin"
                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                />

                <IonItem>
                  <IonLabel color="medium" position="stacked">Password</IonLabel>
                  <Controller 
                      name="password"
                      control={control}
                      render={({ field: {onChange, onBlur} }) => {
                        return <IonInput 
                          type="password"
                          placeholder="Password *"
                          onIonChange={onChange} 
                          onBlur={onBlur} />
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: "Password is required"
                        },
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
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => <div className="invalid-feedback">{message}</div>}
                />

                <IonItem>
                  <IonLabel color="medium" position="stacked">Confirm Password</IonLabel>
                  <Controller 
                      name="confirm_password"
                      control={control}
                      render={({ field: {onChange, onBlur} }) => {
                        return <IonInput 
                          type="password"
                          placeholder="Confirm Password *"
                          onIonChange={onChange} 
                          onBlur={onBlur} />
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: "Confirm Password is required"
                        },
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
                <ErrorMessage
                  errors={errors}
                  name="confirm_password"
                  render={({ message }) => <div className="invalid-feedback">{message}</div>}
                />

                <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit">
                  Submit
                </IonButton>    
              </form> 
              <IonRow className="ion-padding">
                  <hr />
                  <IonCol className="ion-text-end">
                    <IonRouterLink color="medium" href={`${baseurl}/Login`} className="text-right">Login to the account</IonRouterLink>
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
