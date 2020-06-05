import React from 'react';
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
import { home, logIn, searchOutline } from 'ionicons/icons';
import './Header.scss';

interface HeaderState {
  pushRightClass: string; //replace any with suitable type
  pushLeftClass: string;
}
class Header extends React.Component<{}, HeaderState> {
  state: HeaderState;
  constructor(props: any) {
    super(props);

    this.state = {
      pushRightClass: 'main-push-right',
      pushLeftClass: 'main-push-left'
    }
  }

  removeOverlay(e: any) {
      const ldom: any = document.getElementById('left-overlay-sidebar');
      ldom.classList.remove(this.state.pushRightClass);
      const rdom: any = document.getElementById('right-overlay-sidebar');
      rdom.classList.remove(this.state.pushLeftClass);

      const ldom1: any = document.getElementById('overlay');
      ldom1.classList.remove(this.state.pushRightClass, this.state.pushLeftClass);
  }

  toggleLeftOverlaySidebar(e: any) {
      const ldom: any = document.getElementById('left-overlay-sidebar');
      ldom.classList.toggle(this.state.pushRightClass);

      const ldom1: any = document.getElementById('overlay');
      ldom1.classList.toggle(this.state.pushRightClass);
      if(ldom1.classList.contains(this.state.pushLeftClass)){
        const rdom: any = document.getElementById('right-overlay-sidebar');
        rdom.classList.remove(this.state.pushLeftClass);

        const ldom1: any = document.getElementById('overlay');
        ldom1.classList.remove(this.state.pushLeftClass);
      }
  }
  toggleRightOverlaySidebar(e: any) {
    const rdom: any = document.getElementById('right-overlay-sidebar');
    rdom.classList.toggle(this.state.pushLeftClass);

    const rdom1: any = document.getElementById('overlay');
    rdom1.classList.toggle(this.state.pushLeftClass);
    if(rdom1.classList.contains(this.state.pushRightClass)){
      const rdom: any = document.getElementById('left-overlay-sidebar');
      rdom.classList.remove(this.state.pushRightClass);

      const ldom1: any = document.getElementById('overlay');
      ldom1.classList.remove(this.state.pushRightClass);
    }
  }


  render() {
      return (
        <>
          <IonHeader>
            <IonToolbar color="primary" mode="ios">
              
              <IonButtons slot="start">
                <IonMenuButton autoHide={false} onClick={(e) => this.toggleLeftOverlaySidebar(e)}/>
              </IonButtons>
              <IonButtons slot="secondary">
                
                <IonButton>Default</IonButton>
              </IonButtons>
              
              <IonButtons slot="primary">
                <IonButton onClick={(e) => this.toggleRightOverlaySidebar(e)}>
                  <IonIcon slot="icon-only" icon={searchOutline}></IonIcon>
                  </IonButton>
              </IonButtons>
              
              <IonTitle>Local <IonIcon icon={searchOutline}></IonIcon> First</IonTitle>
                
            </IonToolbar>
          </IonHeader>
          <div id="overlay" onClick={ (e) => this.removeOverlay(e) }></div>
          <div id="left-overlay-sidebar">
          
            <IonContent>
              <IonList>
                <IonItem button color="medium" routerLink="/home" onClick={ (e) => this.removeOverlay(e) }>
                  <IonIcon slot="start" icon={home}></IonIcon>
                  <IonLabel>Home</IonLabel>
                </IonItem>
                <IonItem button color="medium" routerLink="/login" onClick={ (e) => this.removeOverlay(e) }>
                  <IonIcon slot="start" icon={logIn}></IonIcon>
                  <IonLabel>Login</IonLabel>
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
                <IonItem color="medium">Signup</IonItem>
                <IonItem color="medium">Local-First Deals</IonItem>
                <IonItem color="medium">Business Events</IonItem>
                <IonItem color="medium">Business News</IonItem>
                <IonItem color="medium">About Local-First</IonItem>
                <IonItem color="medium">Privacy</IonItem>
                <IonItem color="medium">Contact Us</IonItem>
              </IonList>
            </IonContent>
         
          </div>
          <div id="right-overlay-sidebar">
            <p>
              <span className="p-0 m-0">Isondai right</span>
            </p>
          </div>
        </> 
      );
  }
}



export default Header;
