import React, {useState, useCallback, useEffect} from 'react';
import { 
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel, IonModal
} from '@ionic/react';
import { eyeOutline, locate } from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import { useLocation } from 'react-router-dom'
import { Geolocation} from '@ionic-native/geolocation';
import './Footer.scss';
import CoreService from '../../shared/services/CoreService';
import * as authActions from '../../store/reducers/auth';
import * as uiActions from '../../store/reducers/ui';
import Loader from '../Loader';
import Toast from '../Toast';
import LocationModal from '../Location';
import { lfConfig } from '../../../Constants';

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const { basename } = lfConfig;
  const geolocation = useSelector( (state:any) => state.auth.location);
  const copyright = "Copyright ©"+new Date().getFullYear()+" Isondai Corporation - All Rights Reserved";
  const [showLocationModal, setShowLocationModal] = useState(false);
  const location = useLocation();

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(authActions.setLocation({ location: res.data })); 
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);

  const getLocation = async () => { // console.log(geolocation);
    if( geolocation && !geolocation.city){
      dispatch(uiActions.setShowLoading({ loading: true }));
      try {
        const position = await Geolocation.getCurrentPosition(); console.log(position);
        if( position && position.coords ){
          const user = {
              action: 'get_location_by_latlng',
              lat: position.coords.latitude,
              lng: position.coords.longitude
              // lat: 3.1358976,
              // lng: 101.73480959999999
          };
          CoreService.onPostFn('get_location', user, onCallbackFn);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
      } catch (e: any) {
        let errMsg = e.message;
        if( +(e.code) === 1 ){
          errMsg = `Location is mandatory for this app to serve you better. Please select your Location.`;
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: errMsg }));
        dispatch(uiActions.setShowLoading({ loading: false }));
        setTimeout(()=>{
          setShowLocationModal(true);
        },1000);
       
      }
    }
  }
  useEffect(() => {
    if(['/', '/about-us','/contact-us', '/privacy-policy'].includes(location.pathname) === false){
      // console.log(location.pathname);
      // console.log(geolocation, geolocation.city, showLocationModal);
      if( geolocation && !geolocation.city && !showLocationModal ){ //console.log("I'm executed");
        setTimeout(()=>{
          getLocation();
        },1000);
        
      }
    }
  }, [geolocation, showLocationModal, location]);

  return (
    <>
      <IonFooter>
        <IonToolbar color="footerbg" mode="ios">
          { geolocation && geolocation.city && <IonButtons slot="start"> 
            <IonButton routerLink={`${basename}/signup`}>
              <IonIcon slot="start" icon={eyeOutline}></IonIcon>
              <IonLabel slot="end" className="fs-13">LocalQuote Requests</IonLabel>
            </IonButton>
          </IonButtons>}

          <IonButtons slot="end"> 
            <IonButton onClick={() => setShowLocationModal(true)}>
              <IonLabel slot="start" className="fs-13">Change Location</IonLabel>
              <IonIcon slot="end" icon={locate}></IonIcon>
            </IonButton>
          </IonButtons>
          
          { isPlatform('desktop') && <IonTitle size="small" >{copyright}</IonTitle> }
          
        </IonToolbar>
        {/* { isPlatform('desktop') &&  <IonToolbar color="footerbg" mode="ios">
          <IonTitle size="small" >{copyright}</IonTitle>
        </IonToolbar> } */}
      </IonFooter>
      <Loader />
      <Toast />
      <IonModal backdropDismiss={false} isOpen={showLocationModal} cssClass='my-custom-class'>
          <LocationModal
            showLocationModal={showLocationModal}
            setShowLocationModal={setShowLocationModal} />
        </IonModal>
    </> 
  );
}


export default Footer;
