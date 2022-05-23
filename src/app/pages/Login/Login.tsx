import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardHeader, 
  IonCardSubtitle, 
  IonCardContent,
  IonItem, 
  IonInput,
  IonButton,
  IonRouterLink,
  IonRow,
  IonCol
} from '@ionic/react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
// import { ErrorMessage } from "@hookform/error-message";
import './Login.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/reducers/auth';
import { lfConfig } from '../../../Constants';

type FormInputs = {
  email: string;
  password: string
}

let initialValues = {
  email: "",
  password: ""
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { baseurl } = lfConfig;
  const authValues = useSelector( (state:any) => state.auth.data);
  const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });
  
  /**
   * @param data
   */
  const onSubmit = (data: any) => { // console.log(JSON.stringify(data));
    const user = {
      // JWT Only accepts username not email for login
      username: data.email,
      password: data.password,
      action: 'login'
    };
    dispatch(authActions.getToken({data: user}));
  }

  if( authValues.authenticated && authValues.isVerified  ){
     return <Redirect to="/layout/dashboard" />;
  }
  if( authValues.authenticated && authValues.user && !authValues.isVerified  ){
    return <Redirect to="/email-verify" />;
  }

  return (
    <IonPage className="login-page">
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2">
          <IonCardHeader>
            <IonCardSubtitle color="medium" className="ion-text-center">Login for Local-First the ultimate<br/>
              business promotional tool - It's free!</IonCardSubtitle>
            {/* <IonCardTitle>Card Title</IonCardTitle> */}
          </IonCardHeader>

          <IonCardContent>
            <form className="ion-padding" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <IonItem>
                {/* <Controller
                  as={IonInput}
                  control={control}
                  // onChangeName="onIonChange"
                  onChange={([selected]: any) => {
                    return selected.detail.value;
                  }}
                  name="email"
                  // placeholder="Email *"
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid Email Address"
                    }
                  }}
                /> */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field: {onChange, onBlur} }) => {
                    return <IonInput 
                      type="email"
                      placeholder="Email *"
                      onIonChange={onChange} 
                      onBlur={onBlur} />
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
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}

              <IonItem>
                {/* <Controller
                  as={IonInput}
                  control={control}
                  onChangeName="onIonChange"
                  onChange={([selected]) => {
                    return selected.detail.value;
                  }}
                  name="password"
                  // type="password"
                  // placeholder="Password *"
                  rules={{
                    required: true,
                    minLength: {
                      value: 5,
                      message: "Password must consist of at least 5 characters"
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
                /> */}
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
                        // validate: {
                        //   beginSpace: (value) => /^\S/.test(value)
                        // },
                        required: {
                          value: true,
                          message: "Password is required"
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-@!#$%^&*()]{5,15}$/i,
                          message: "Invalid Password"
                        }
                    }}
                />
              </IonItem>
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              
              <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit">
                Submit
              </IonButton> 
              
            </form> 
            <IonRow className="ion-padding">
                <hr />
                <IonCol className="ion-text-start">
                  <IonRouterLink color="blackbg" href={`${baseurl}/forget-password`} className="text-left">Can't log in?</IonRouterLink>
                </IonCol>
                <IonCol className="ion-text-end">
                  <IonRouterLink color="blackbg" href={`${baseurl}/signup`} className="text-right">Sign up for an account</IonRouterLink>
                </IonCol>
            </IonRow>
            
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;