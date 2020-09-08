import React from 'react';
import { 
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { locate } from 'ionicons/icons';
import './Footer.scss';
// import { useSelector } from 'react-redux';
import Loader from '../Loader';
import Toast from '../Toast';


interface Props {
  // onLogin: Function
}

const Footer: React.FC<Props> = () => { // { onLogin }
  const copyright = "Copyright ©"+new Date().getFullYear()+" Isondai Corporation - All Rights Reserved";
  // const loading = useSelector( (state:any) => state.ui.loading);
  // const showToast = useSelector( (state:any) => state.ui.toast);

  function changeLocation(e: any){
    alert("change Location");
  }

  return (
    <>
      <IonFooter >
        <IonToolbar color="blackbg" mode="ios">

          <IonButtons slot="end"> 
            <IonButton onClick={(e) => changeLocation(e)}>
              <IonLabel slot="start">Change Location</IonLabel>
              <IonIcon slot="end" icon={locate}></IonIcon>
            </IonButton>
          </IonButtons>
          
          <IonTitle size="small" class="hidden-xs hidden-sm" >{copyright}</IonTitle>
          
        </IonToolbar>
        <IonToolbar color="blackbg" mode="ios" class="hidden-md hidden-lg hidden-xl">
          <IonTitle size="small" >{copyright}</IonTitle>
        </IonToolbar>
      </IonFooter>
      <Loader />
      <Toast />
    </> 
  );
}


export default Footer;
