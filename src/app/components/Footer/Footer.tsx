import React, {useState, useContext} from 'react';
import { 
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonLoading,
  IonToast
} from '@ionic/react';
import { logOut, locate } from 'ionicons/icons';
import { Redirect } from 'react-router-dom';
// import AuthProfile from '../../shared/services/AuthProfile';
import AuthContext from '../../shared/context/AuthContext';
import './Footer.scss';
interface Props {
  // onLogin: Function
}

const Footer: React.FC<Props> = () => { // { onLogin }
  const { authValues, showToast, setShowToast, showLoading, setShowLoading, onLogoutFn } = useContext(AuthContext);
  //const token = AuthProfile.getToken();
  //const user = AuthProfile.getUser(); // console.log(user);
  const copyright = "Copyright ©"+new Date().getFullYear()+" Isondai Corporation - All Rights Reserved";
  const [isLoggedOut, setIsLoggedOut] = useState(false); 

  function logout(e: any){
    onLogoutFn();
    setIsLoggedOut(true);
  }

  function changeLocation(e: any){
    alert("change Location");
  }

  if( isLoggedOut &&  !authValues.authenticated ) {
    return <Redirect to={'/login'} />;
  }

  return (
    <>
      <IonFooter >
        <IonToolbar color="medium" mode="ios">
          { (authValues.authenticated &&  authValues.user) &&
            <IonButtons slot="start" >
              <IonButton onClick={(e) => logout(e)}>
                <IonIcon slot="icon-only"  icon={logOut}></IonIcon>
                <IonLabel>Logout</IonLabel>
              </IonButton> 
            </IonButtons>
          }

          <IonButtons slot="end"> 
            <IonButton onClick={(e) => changeLocation(e)}>
              <IonLabel slot="start">Change Location</IonLabel>
              <IonIcon slot="end" icon={locate}></IonIcon>
            </IonButton>
          </IonButtons>
          
        <IonTitle size="small" class="hidden-xs hidden-sm" >{copyright}</IonTitle>
          
        </IonToolbar>
        <IonToolbar color="medium" mode="ios" class="hidden-md hidden-lg hidden-xl">
          <IonTitle size="small" >{copyright}</IonTitle>
        </IonToolbar>
      </IonFooter>
      <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Please wait...'}
      />
      <IonToast
          isOpen={showToast.isShow}
          onDidDismiss={() => setShowToast({isShow: false, status: '', message: '' })}
          message={showToast.message}
          duration={5000}
          color={showToast.status === 'ERROR'? 'danger': 'success'}
      />
    </> 
  );
}


export default Footer;
