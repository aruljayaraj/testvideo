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
import { logOutOutline, locateOutline } from 'ionicons/icons';
import { Redirect } from 'react-router-dom';
import AuthProfile from '../../shared/services/AuthProfile';
import AuthContext from '../../shared/context/AuthContext';
import './Footer.scss';
interface Props {
  // onLogin: Function
}

const Footer: React.FC<Props> = () => { // { onLogin }
  const { showToast, setShowToast, showLoading, setShowLoading } = useContext(AuthContext);
  const [isLogout, setIsLogout] = useState(false);
  const token = AuthProfile.getToken();
  const user = AuthProfile.getUser(); // console.log(user);

  function logout(e: any){
    // onLogin(false);
    //localStorage.clear();
    //setIsLogout(true);
  }

  function changeLocation(e: any){
    alert("change Location");
  }

  /*if( isLogout ){
    return <Redirect to={'/login'} />;
  }*/

  return (
    <>
      <IonFooter >
        <IonToolbar color="medium" mode="ios">
          { token && user && 
            <IonButtons slot="start" >
              <IonButton onClick={(e) => logout(e)}>
                <IonIcon slot="icon-only"  icon={logOutOutline}></IonIcon>
                <IonLabel>Logout</IonLabel>
              </IonButton> 
            </IonButtons>
          }

          <IonButtons slot="end"> 
            <IonButton onClick={(e) => changeLocation(e)}>
              <IonLabel slot="start">Change Location</IonLabel>
              <IonIcon slot="end" icon={locateOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          
          <IonTitle size="small" class="hidden-xs hidden-sm" >Copyright ©2020 Isondai Corporation - All Rights Reserved</IonTitle>
          
        </IonToolbar>
        <IonToolbar color="medium" mode="ios" class="hidden-md hidden-lg hidden-xl">
          <IonTitle size="small" >Copyright ©2020 Isondai Corporation - All Rights Reserved</IonTitle>
        </IonToolbar>
      </IonFooter>
      <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={'Please wait...'}
      />
      <IonToast
          isOpen={showToast.status}
          onDidDismiss={() => setShowToast({status: false, type: '', msg: '' })}
          message={showToast.msg}
          duration={5000}
          color={showToast.type === 'error'? 'danger': 'success'}
      />
    </> 
  );
}


export default Footer;
