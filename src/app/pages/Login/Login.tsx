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
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import AuthProfile from '../../shared/services/AuthProfile';
import AuthContext from '../../shared/context/AuthContext';
import './Login.scss';

let initialValues = {
  email: "",
  password: ""
};

const Login: React.FC = () => {
  console.log('Login Page');
  const { onLoginFn, authValues, setAuthValues, setShowToast, setShowLoading } = useContext(AuthContext);
  const { control, handleSubmit, formState, errors } = useForm({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });
  // const [data] = useState();
  // const [showLoading, setShowLoading] = useState(false);
  // const [showToast, setShowToast] = useState({status: false, type: '', msg: ''});
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
  // console.log(errors);

  
  const onLoginCb = (res: any) => {
    console.log(res);
    setShowLoading(false);
    if(res.status === 'SUCCESS'){
      const data = {
        authenticated: true, 
        user: res.user
      }
      setAuthValues(data);
      AuthProfile.setAuth(data);
      setShowToast({ isShow: true, status: res.status, message: res.message });
    }else{
      setShowToast({ isShow: true, status: res.status, message: res.message });
    }
  }
  /**
   *
   * @param data
   */
  const onSubmit = (data: any) => {
    setShowLoading(true);
    const user = {
      email: data.email,
      password: data.password
    };
    onLoginFn(user, onLoginCb);
  }

  if( authValues.authenticated  ){ // || localStorage.getItem('token')
    return <Redirect to={'/layout/dashboard'} />;
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
            <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
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
              
              <IonButton className="ion-margin-top mt-5" expand="block" type="submit" disabled={formState.isValid === false}>
                Submit
              </IonButton> 
              
            </form> 
            <IonRow className="ion-padding">
                <hr />
                <IonCol className="ion-text-start">
                  <IonRouterLink color="medium" href="/" className="text-left">Can't log in?</IonRouterLink>
                </IonCol>
                <IonCol className="ion-text-end">
                  <IonRouterLink color="medium" href="/signup" className="text-right">Sign up for an account</IonRouterLink>
                </IonCol>
            </IonRow>
            
          </IonCardContent>
        </IonCard>
      </IonContent>
    
    </IonPage>
  );
};

export default Login;
