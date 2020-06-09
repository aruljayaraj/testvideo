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
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import React, { useRef, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import AuthProfile from '../../shared/services/AuthProfile';
import AuthContext from '../../shared/context/AuthContext';
import './Signup.scss';

let initialValues = {
  firstname: "",
  lastname: "",
  business_name: "",
  email: "",
  password: "",
  confirm_password: ""
};

const Signup: React.FC = () => {
  console.log('Signup Page');
  const { authValues, setAuthValues, setShowToast, setShowLoading } = useContext(AuthContext);
  const { control, errors, handleSubmit, formState, watch } = useForm({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });
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

  const onSignupCb = (res: any) => {
    console.log(res);
    setShowLoading(false);
    if(res.status === 'SUCCESS'){
      const data = {
        authenticated: true, 
        user: res.user
      }
      setAuthValues(data);
      AuthProfile.setAuth(data);
    }
    setShowToast({ isShow: true, status: res.status, message: res.message });
    
  }
  /**
   *
   * @param data
   */
  const onSubmit = (data: any) => {
    setShowLoading(true);
    const user = {
      firstname: data.firstname,
      lastname: data.lastname,
      business_name: data.business_name,
      email: data.email,
      password: data.password,
      
    };
    AuthProfile.onSignup(user, onSignupCb);
  }

  if( authValues.authenticated  ){ // || localStorage.getItem('token')
    return <Redirect to={'/layout/dashboard'} />;
  }


  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2">
          <IonCardHeader>
            <IonCardSubtitle color="medium" className="ion-text-center">Signup for Local-First the ultimate<br/>
              business promotional tool - It's free!</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
          <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
              <IonGrid>
                <IonRow>
                  <IonCol sizeMd="6" sizeXs="12">
                    <IonItem>
                      <IonLabel color="medium" position="stacked">First Name</IonLabel>
                      <Controller
                        as={IonInput}
                        control={control}
                        onChangeName="onIonChange"
                        onChange={([selected]) => {
                          return selected.detail.value;
                        }}
                        name="firstname"
                        rules={{
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9 ]{2,25}$/i,
                            message: "Invalid Firstname"
                          }
                        }}
                      />
                    </IonItem>
                    {showError("firstname", "Firstname")}
                  </IonCol>
                  <IonCol>
                    <IonItem>
                        <IonLabel color="medium" position="stacked">Last Name</IonLabel>
                        <Controller
                          as={IonInput}
                          control={control}
                          onChangeName="onIonChange"
                          onChange={([selected]) => {
                            return selected.detail.value;
                          }}
                          name="lastname"
                          rules={{
                            required: true,
                            pattern: {
                              value: /^[A-Z0-9 ]{1,25}$/i,
                              message: "Invalid Lastname"
                            }
                          }}
                        />
                      </IonItem>
                      {showError("lastname", "Lastname")}
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol >
                    <IonItem>
                      <IonLabel color="medium" position="stacked">Business Name</IonLabel>
                      <Controller
                        as={IonInput}
                        control={control}
                        onChangeName="onIonChange"
                        onChange={([selected]) => {
                          return selected.detail.value;
                        }}
                        name="business_name"
                        rules={{
                          required: true,
                          minLength: {
                            value: 3,
                            message: "Invalid Business Name"
                          },
                          maxLength: {
                            value: 100,
                            message: "Business Name must consist of at maximum 100 characters"
                          }
                        }}
                      />
                    </IonItem>
                    {showError("business_name", "Business Name")}
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
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
                    {/* {errors.username && "Username is required"} */}
                    {showError("email", "Email")}
                  </IonCol>
                </IonRow>  
                <IonRow>
                  <IonCol sizeMd="6" sizeXs="12">
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
                  </IonCol>
                  <IonCol>
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
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonButton className="ion-margin-top mt-5" expand="block" type="submit" disabled={formState.isValid === false}>
                Submit
              </IonButton>
            </form>  
            <IonRow className="ion-padding">
                <hr />
                <IonCol className="ion-text-start">
                  <IonRouterLink color="medium" href="/forget-password" className="text-left">Can't log in?</IonRouterLink>
                </IonCol>
                <IonCol className="ion-text-end">
                  <IonRouterLink color="medium" href="/login" className="text-right">Login for an account</IonRouterLink>
                </IonCol>
            </IonRow>
            
          </IonCardContent>
        </IonCard>
      </IonContent>
    
    </IonPage>
  );
};

export default Signup;
