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
import './Login.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/reducers/auth';

let initialValues = {
  email: "",
  password: ""
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const authValues = useSelector( (state:any) => state.auth.data);
  const { control, handleSubmit, errors } = useForm({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });

  /**
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
  
  /**
   * @param data
   */
  const onSubmit = (data: any) => {
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
    <IonPage>
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
                <Controller
                  as={IonInput}
                  control={control}
                  onChangeName="onIonChange"
                  onChange={([selected]) => {
                    return selected.detail.value;
                  }}
                  name="email"
                  placeholder="Email *"
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid Email Address"
                    }
                  }}
                />
              </IonItem>
              {/* {errors.username && "Username is required"} */}
              {showError("email", "Email")}

              <IonItem>
                <Controller
                  as={IonInput}
                  control={control}
                  onChangeName="onIonChange"
                  onChange={([selected]) => {
                    return selected.detail.value;
                  }}
                  name="password"
                  type="password"
                  placeholder="Password *"
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
                />
              </IonItem>
              {/* {errors.password && "Password is required"} */}
              {showError("password", "Password")}
              
              <IonButton color="greenbg" className="ion-margin-top mt-5" expand="block" type="submit">
                Submit
              </IonButton> 
              
            </form> 
            <IonRow className="ion-padding">
                <hr />
                <IonCol className="ion-text-start">
                  <IonRouterLink color="blackbg" href={`${process.env.REACT_APP_BASE_URL}/forget-password`} className="text-left">Can't log in?</IonRouterLink>
                </IonCol>
                <IonCol className="ion-text-end">
                  <IonRouterLink color="blackbg" href={`${process.env.REACT_APP_BASE_URL}/signup`} className="text-right">Sign up for an account</IonRouterLink>
                </IonCol>
            </IonRow>
            
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
