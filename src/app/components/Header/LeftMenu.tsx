import React, {useState} from 'react';
import { 
  IonIcon,
  IonLabel,
  IonContent, 
  IonList, 
  IonItem
} from '@ionic/react';
import { 
  home, 
  logIn,
  create, 
  //pricetag, 
  //pricetags, 
  //calendar, 
  //newspaper, 
  informationCircle,
  information,
  mail
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import './Header.scss';
import { lfConfig } from '../../../Constants';
interface Props{
    removeOverlay: Function 
}

const LeftMenu: React.FC<Props> = ({removeOverlay}) => {
  const location = useLocation();
  const authValues = useSelector( (state:any) => state.auth.data);
  const { basename, baseurl } = lfConfig;

  return (<>
    <IonContent>
      <IonList>
        <IonItem button color={location.pathname === '/'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/`} onClick={ (e) => removeOverlay(e) }>
          <IonIcon slot="start" icon={home}></IonIcon>
          <IonLabel>Home</IonLabel>
        </IonItem>
        { (authValues.authenticated && authValues.user && !authValues.isVerified ) &&
          <IonItem button color={location.pathname === '/email-verify'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/email-verify`} onClick={ (e) => removeOverlay(e) }>
            <IonIcon slot="start" icon={mail}></IonIcon>
            <IonLabel>Email Verify</IonLabel>
          </IonItem>
        }
        { !(isPlatform('desktop')) && (!authValues.authenticated || !authValues.isVerified) && 
          (<>
            <IonItem button color={location.pathname === '/login'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/login`} onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={logIn}></IonIcon>
          <IonLabel>Login</IonLabel>
            </IonItem>
            <IonItem button color={location.pathname === '/signup'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/signup`} onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={create}></IonIcon>
              <IonLabel>Signup</IonLabel>
            </IonItem>
          </>)
        }
        {/* 
        <IonItem button color={location.pathname === '/events'? 'menuhlbg': 'blackbg'} routerLink="/events" onClick={ (e) => removeOverlay(e) }>
          <IonIcon slot="start" icon={calendar}></IonIcon>
          <IonLabel>Events</IonLabel>
        </IonItem>
        <IonItem button color={location.pathname === '/business-news'? 'menuhlbg': 'blackbg'} routerLink="/busines-news" onClick={ (e) => removeOverlay(e) }>
          <IonIcon slot="start" icon={newspaper}></IonIcon>
          <IonLabel>Business News</IonLabel>
        </IonItem>  */}
        <IonItem button color={location.pathname === '/about-us'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/about-us`} onClick={ (e) => removeOverlay(e) }>
          <IonIcon slot="start" icon={informationCircle}></IonIcon>
          <IonLabel>About</IonLabel>
        </IonItem>
        <IonItem button color={location.pathname === '/privacy-policy'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/privacy-policy`} onClick={ (e) => removeOverlay(e) }>
          <IonIcon slot="start" icon={information}></IonIcon>
          <IonLabel>Privacy</IonLabel>
        </IonItem>
        <IonItem button color={location.pathname === '/contact-us'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/contact-us`} onClick={ (e) => removeOverlay(e) }>
          <IonIcon slot="start" icon={mail}></IonIcon>
          <IonLabel>Contact Us</IonLabel>
        </IonItem>
        
                      { /* 
                      <Route
        exact
        path="/dashboard"
        render={props => {
          return isAuthed ? <DashboardPage {...props} /> : <LoginPage />;
        }}
      />
                      */ }
      </IonList>
    </IonContent> 
  </>);
}



export default LeftMenu;
