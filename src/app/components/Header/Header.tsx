import React, {useState, useContext} from 'react';
import { IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonMenuButton,
} from '@ionic/react';
import { IonContent, IonList, IonItem } from '@ionic/react';
import { 
  home, 
  logIn,
  speedometer,
  create, 
  pricetag, 
  pricetags, 
  calendar, 
  newspaper, 
  informationCircle,
  information,
  search,
  mail
} from 'ionicons/icons';
// import AuthProfile from '../../shared/services/AuthProfile';
import AuthContext from '../../shared/context/AuthContext';
import './Header.scss';

const Header: React.FC = () => {
  
  const { authValues } = useContext(AuthContext);
  const [hSidemenu] = useState({
    pushRightClass: 'main-push-right',
    pushLeftClass: 'main-push-left'
  });

  function removeOverlay (e: any) {
      const ldom: any = document.getElementById('left-overlay-sidebar');
      ldom.classList.remove(hSidemenu.pushRightClass);
      const rdom: any = document.getElementById('right-overlay-sidebar');
      rdom.classList.remove(hSidemenu.pushLeftClass);

      const ldom1: any = document.getElementById('overlay');
      ldom1.classList.remove(hSidemenu.pushRightClass, hSidemenu.pushLeftClass);
  }

  function toggleLeftOverlaySidebar(e: any) {
      const ldom: any = document.getElementById('left-overlay-sidebar');
      ldom.classList.toggle(hSidemenu.pushRightClass);

      const ldom1: any = document.getElementById('overlay');
      ldom1.classList.toggle(hSidemenu.pushRightClass);
      if(ldom1.classList.contains(hSidemenu.pushLeftClass)){
        const rdom: any = document.getElementById('right-overlay-sidebar');
        rdom.classList.remove(hSidemenu.pushLeftClass);

        const ldom1: any = document.getElementById('overlay');
        ldom1.classList.remove(hSidemenu.pushLeftClass);
      }
  }
  function toggleRightOverlaySidebar(e: any) {
    const rdom: any = document.getElementById('right-overlay-sidebar');
    rdom.classList.toggle(hSidemenu.pushLeftClass);

    const rdom1: any = document.getElementById('overlay');
    rdom1.classList.toggle(hSidemenu.pushLeftClass);
    if(rdom1.classList.contains(hSidemenu.pushRightClass)){
      const rdom: any = document.getElementById('left-overlay-sidebar');
      rdom.classList.remove(hSidemenu.pushRightClass);

      const ldom1: any = document.getElementById('overlay');
      ldom1.classList.remove(hSidemenu.pushRightClass);
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary" mode="ios">
          
          <IonButtons slot="start">
            <IonMenuButton autoHide={false} onClick={(e) => toggleLeftOverlaySidebar(e)}/>
          </IonButtons>
          <IonButtons slot="secondary">
            
            <IonButton>Default</IonButton>
          </IonButtons>
          
          <IonButtons slot="primary">
            <IonButton onClick={(e) => toggleRightOverlaySidebar(e)}>
              <IonIcon slot="icon-only" icon={search}></IonIcon>
              </IonButton>
          </IonButtons>
          
          <IonTitle>Local <IonIcon icon={search}></IonIcon> First</IonTitle>
            
        </IonToolbar>
      </IonHeader>
      <div id="overlay" onClick={ (e) => removeOverlay(e) }></div>
      <div id="left-overlay-sidebar">
      
        <IonContent>
          <IonList>
            <IonItem button color="medium" routerLink="/" onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={home}></IonIcon>
              <IonLabel>Home</IonLabel>
            </IonItem>
            { !authValues.authenticated && 
              (<>
                <IonItem button color="medium" routerLink="/login" onClick={ (e) => removeOverlay(e) }>
                  <IonIcon slot="start" icon={logIn}></IonIcon>
                  <IonLabel>Login</IonLabel>
                </IonItem>
                <IonItem button color="medium" routerLink="/signup" onClick={ (e) => removeOverlay(e) }>
                  <IonIcon slot="start" icon={create}></IonIcon>
                  <IonLabel>Signup</IonLabel>
                </IonItem>
              </>)
            }
            { authValues.authenticated &&
              <IonItem button color="medium" routerLink="/layout/dashboard" onClick={ (e) => removeOverlay(e) }>
                <IonIcon slot="start" icon={speedometer}></IonIcon>
                <IonLabel>Dashboard</IonLabel>
              </IonItem>
            }
            <IonItem button color="medium" routerLink="/layout/dailydeals" onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={pricetag}></IonIcon>
              <IonLabel>Daily Deals</IonLabel>
            </IonItem>
            <IonItem button color="medium" routerLink="/layout/onlydeals" onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={pricetags}></IonIcon>
              <IonLabel>Only Deals</IonLabel>
            </IonItem>
            <IonItem button color="medium" routerLink="/layout/events" onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={calendar}></IonIcon>
              <IonLabel>Events</IonLabel>
            </IonItem>
            <IonItem button color="medium" routerLink="/layout/busines-news" onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={newspaper}></IonIcon>
              <IonLabel>Business News</IonLabel>
            </IonItem>
            <IonItem button color="medium" routerLink="/layout/about" onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={informationCircle}></IonIcon>
              <IonLabel>About</IonLabel>
            </IonItem>
            <IonItem button color="medium" routerLink="/layout/privacy" onClick={ (e) => removeOverlay(e) }>
              <IonIcon slot="start" icon={information}></IonIcon>
              <IonLabel>Privacy</IonLabel>
            </IonItem>
            <IonItem button color="medium" routerLink="/layout/contact-us" onClick={ (e) => removeOverlay(e) }>
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
            
            {/* <IonItem color="medium">Local-First Deals</IonItem>
            <IonItem color="medium">Business Events</IonItem>
            <IonItem color="medium">Business News</IonItem>
            <IonItem color="medium">About Local-First</IonItem>
            <IonItem color="medium">Privacy</IonItem>
            <IonItem color="medium">Contact Us</IonItem> */}
          </IonList>
        </IonContent>
      
      </div>
      <div id="right-overlay-sidebar">
        <p>
          <span className="p-0 m-0">LocalFirst right</span>
        </p>
      </div>
    </> 
  );
}



export default Header;
