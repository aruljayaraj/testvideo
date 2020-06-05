import { 
  IonContent, 
  IonPage, 
  IonItem, 
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/react';
import React, { useState, useContext } from 'react';
// import { Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";


import AuthContext from '../../shared/context/AuthContext';
import './Login.css';

let initialValues = {
  email: "",
  password: ""
};

const Login: React.FC = () => {
  // console.log('I Love you');
  const { onLoginFn, setAuthValues, setShowToast, setShowLoading } = useContext(AuthContext);
  const { control, handleSubmit, formState, errors } = useForm({
    defaultValues: { ...initialValues },
    mode: "onChange"
  });
  const [data, setData] = useState();
  // const [showLoading, setShowLoading] = useState(false);
  // const [showToast, setShowToast] = useState({status: false, type: '', msg: ''});
  /**
   *
   * @param _fieldName
   */
  const showError = (_fieldName: string) => {
    let error = (errors as any)[_fieldName];
    return error ? (
      <div style={{ color: "red", fontWeight: "bold" }}>
        {error.message || "Field Is Required"}
      </div>
    ) : null;
  };

  
  const onLoginCb = (res: any) => {
    console.log("Meow",{res});
    setShowLoading(false);
    if(res.status && res.type === 'success'){
      setAuthValues(res.data);
      setShowToast({ status: true, type: 'success', msg: res.msg });
    }else{
        setShowToast({ status: true, type: 'error', msg: res.msg });
    }
  }
  /**
   *
   * @param data
   */
  const onSubmit = (data: any) => {
    setShowLoading(true);
    const user = {
      username: data.username,
      password: data.password
    };
    onLoginFn(user, onLoginCb);
  }

  /*if( isLoggedIn  ){ // || localStorage.getItem('token')
    return <Redirect to={'/layout/dashboard'} />;
  }*/


  return (
    <IonPage>
    
      {/* <IonToast
          isOpen={showToast.status}
          onDidDismiss={() => setShowToast({status: false, type: '', msg: '' })}
          message={showToast.msg}
          duration={5000}
          color={showToast.type === 'error'? 'danger': 'success'}
        />  */}
      <IonContent className="ion-padding">
        <form className="ion-padding" onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel>Username</IonLabel>
            <Controller
              as={IonInput}
              control={control}
              onChangeName="onIonChange"
              onChange={([selected]) => {
                return selected.detail.value;
              }}
              name="username"
              rules={{
                required: true,
                /*pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "invalid email address"
                }*/
              }}
            />
          </IonItem>
          {showError("username")}

          <IonItem>
            <IonLabel>Password</IonLabel>
            <Controller
              as={IonInput}
              control={control}
              onChangeName="onIonChange"
              onChange={([selected]) => {
                return selected.detail.value;
              }}
              name="password"
              rules={{
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]{4,15}$/i,
                  message: "Invalid Password"
                }
              }}
            />
          </IonItem>
          {showError("password")}
          
          

            {data && (
              <pre style={{ textAlign: "left" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            )}    
            <IonButton type="submit" disabled={formState.isValid === false}>
              submit
            </IonButton>
        </form>    
      </IonContent>
    </IonPage>
  );
};

export default Login;
