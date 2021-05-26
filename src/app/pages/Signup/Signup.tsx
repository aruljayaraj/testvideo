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
  IonCol,
  IonRadioGroup,
  IonRadio,
  IonList,
  IonModal
} from '@ionic/react';
import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/reducers/auth';
import Modal from '../../components/Modal/Modal';
import './Signup.scss';
import { lfConfig } from '../../../Constants';

type FormInputs = {
  firstname: string;
  lastname: string;
  business_name: string;
  email: string;
  password: string;
  confirm_password: string;
  business_type: string;
}

let initialValues = {
  firstname: "",
  lastname: "",
  business_name: "",
  email: "",
  password: "",
  confirm_password: "",
  business_type: 'Seller'
};

const Signup: React.FC = () => {
  console.log('Signup Page');
  const dispatch = useDispatch();
  const { baseurl } = lfConfig;
  // const token = useSelector( (state:any) => state.auth.token);
  const authValues = useSelector( (state:any) => state.auth.data);
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormInputs>({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });
  const password = useRef({});
  password.current = watch("password", "");
  const [showModal, setShowModal] = useState({status: false, title: ''});

  async function closeModal() {
    await setShowModal({status: false, title: ''});
  }

  /*const onSignupCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      const data = {
        authenticated: true, 
        isVerified: false,
        user: res.user
      }
      setAuthValues(data);
      AuthService.setAuth(data);
    }else{
      loaderRef.current.setShowLoading(false);
      toastRef.current.setShowToast({ isShow: true, status: res.status, message: res.message });
    }
    
  }, [loaderRef, toastRef, setAuthValues]); */
  /**
   *
   * @param data
   */
  const onSubmit = (data: any) => { console.log(data);
    // loaderRef.current.setShowLoading(true);
    dispatch(authActions.signIn({ data: data}));
    // AuthService.onSignup(data, onSignupCb);
  }

  if( authValues.authenticated && authValues.isVerified  ){
    return <Redirect to="/layout/dashboard" />;
  }
  if( authValues.authenticated && authValues.user && !authValues.isVerified  ){
    return <Redirect to="/email-verify" />;
  }

  return (
    <IonPage className="signup-page">
      <IonContent className="ion-padding">
        <IonCard className="card-center mt-2">
          <IonCardHeader>
            <IonCardSubtitle color="medium" className="ion-text-center">Signup for Local-First the ultimate<br/>
              business promotional tool - It's free!</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <IonGrid>
                <IonRow>
                  <IonCol sizeMd="6" sizeXs="12">
                    <IonItem class="ion-no-padding">
                      <Controller 
                        name="firstname"
                        control={control}
                        render={({ field: {onChange, onBlur} }) => {
                          return <IonInput 
                            type="text"
                            placeholder="First Name *"
                            onIonChange={onChange} 
                            onBlur={onBlur} />
                        }}
                        rules={{
                          required: {
                            value: true,
                            message: "First Name is required"
                          },
                            pattern: {
                                value: /^[A-Z0-9 ]{2,25}$/i,
                                message: "Invalid First Name"
                            }
                        }}
                      />
                    </IonItem>
                    <ErrorMessage
                        errors={errors}
                        name="firstname"
                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                    />
                  </IonCol>
                  <IonCol>
                    <IonItem class="ion-no-padding">
                      <Controller 
                        name="lastname"
                        control={control}
                        render={({ field: {onChange, onBlur} }) => {
                          return <IonInput 
                            type="text"
                            placeholder="Last Name *"
                            onIonChange={onChange} 
                            onBlur={onBlur} />
                        }}
                        rules={{
                            required: {
                              value: true,
                              message: "Lastname is required"
                            },
                            pattern: {
                                value: /^[A-Z0-9 ]{2,25}$/i,
                                message: "Invalid Last Name"
                            }
                        }}
                      />
                    </IonItem>
                    <ErrorMessage
                      errors={errors}
                      name="lastname"
                      render={({ message }) => <div className="invalid-feedback">{message}</div>}
                    />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol >
                    <IonItem class="ion-no-padding">
                      <Controller 
                        name="business_name"
                        control={control}
                        render={({ field: {onChange, onBlur} }) => {
                          return <IonInput 
                            type="text"
                            placeholder="Business Name (if applicable)"
                            onIonChange={onChange} 
                            onBlur={onBlur} />
                        }}
                        rules={{
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
                    <ErrorMessage
                      errors={errors}
                      name="business_name"
                      render={({ message }) => <div className="invalid-feedback">{message}</div>}
                    />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem class="ion-no-padding">
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
                    <ErrorMessage
                      errors={errors}
                      name="email"
                      render={({ message }) => <div className="invalid-feedback">{message}</div>}
                    />
                  </IonCol>
                </IonRow>  
                <IonRow>
                  <IonCol sizeMd="6" sizeXs="12">
                    <IonItem class="ion-no-padding">
                      {/* <Controller
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
                  </IonCol>
                  <IonCol sizeMd="6" sizeXs="12">
                    <IonItem class="ion-no-padding">
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
                    
                  </IonCol>
                </IonRow>
                    
              </IonGrid>
              <IonList lines="none">
                {/* <Controller
                  as={
                    <IonRadioGroup>
                      <IonItem>
                        <IonLabel color="medium">I sell products or services</IonLabel>
                        <IonRadio slot="start" value="Seller" />
                      </IonItem>
                      <IonItem>
                        <IonLabel color="medium">I only want to buy product or services</IonLabel>
                        <IonRadio slot="start" value="Buyer" />
                      </IonItem>
                    </IonRadioGroup>
                  }
                  control={control}
                  name="business_type"
                  rules={{ required: true }}
                  onChangeName="onIonChange"
                  onChange={([selected]) => {
                    console.log(selected.detail.value);
                    return selected.detail.value;
                  }}
                /> */}
                <Controller 
                    name="business_type"
                    control={control}
                    render={({ field: {onChange, onBlur, value} }) => {
                      return <IonRadioGroup
                        onIonChange={onChange} 
                        onBlur={onBlur}
                        value={value}>
                          <IonItem>
                            <IonLabel color="medium">I sell products or services</IonLabel>
                            <IonRadio slot="start" value="Seller" />
                          </IonItem>
                          <IonItem>
                            <IonLabel color="medium">I only want to buy product or services</IonLabel>
                            <IonRadio slot="start" value="Buyer" />
                          </IonItem>
                        </IonRadioGroup>
                    }}
                    rules={{ 
                      required: {
                        value: true,
                        message: "Business Type is required"
                      }
                     }}
                />
              </IonList>
              <IonRow>
                <IonCol>
                  <div color="medium" className="ion-text-center">
                    <small>By clicking Agree & Join, You agree to the Local-First App User 
                      <IonRouterLink onClick={() => setShowModal({status: true, title: 'user-agreement'})} color="tertiary"> Agreement</IonRouterLink>, 
                      <IonRouterLink onClick={() => setShowModal({status: true, title: 'privacy-policy'})} color="tertiary"> Privacy Policy</IonRouterLink> and 
                      <IonRouterLink onClick={() => setShowModal({status: true, title: 'cookie-policy'})} color="tertiary"> Cookie Policy</IonRouterLink>.</small></div>
                </IonCol>  
              </IonRow>
              <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="submit">
                Submit
              </IonButton>
            </form>  
            <IonRow className="ion-padding">
                <hr />
                <IonCol className="ion-text-start">
                  <IonRouterLink color="blackbg" href={`${baseurl}/forget-password`} className="text-left">Can't log in?</IonRouterLink>
                </IonCol>
                <IonCol className="ion-text-end">
                  <IonRouterLink color="blackbg" href={`${baseurl}/login`} className="text-right">Login for an account</IonRouterLink>
                </IonCol>
            </IonRow>
            
          </IonCardContent>
        </IonCard>
        
      </IonContent>

      <IonModal isOpen={showModal.status} cssClass='my-custom-class'>
        <Modal title = {showModal.title} closeAction={closeModal} />
      </IonModal>
 
    </IonPage>
  );
};

export default Signup;
