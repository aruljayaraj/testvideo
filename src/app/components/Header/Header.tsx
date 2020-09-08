import React, {useState} from 'react';
import { IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonContent,
  IonModal,
  IonChip,
  IonPopover,
  IonList,
  // IonListHeader,
  IonItem,
  IonBadge
} from '@ionic/react';
import {
  search,
  personCircleOutline,
  close,
  searchOutline,
  checkmarkOutline,
  notificationsOutline
} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import './Header.scss';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';

const Header: React.FC = () => {
  
  const authValues = useSelector( (state:any) => state.auth.data);
  const [showModal, setShowModal] = useState(false);
  const [basename] = useState(process.env.REACT_APP_BASENAME);
  const [showPopover, setShowPopover] = useState(false);

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
        <IonToolbar 
          color={ (authValues.authenticated && authValues.isVerified)? "blackbg": "greenbg" }
          mode="ios">
          
          <IonButtons slot="start">
            <IonMenuButton autoHide={false} onClick={(e) => toggleLeftOverlaySidebar(e)}/>
          </IonButtons>
          {/* <IonButtons slot="secondary">
            
            <IonButton>Default</IonButton>
          </IonButtons> */}
          
          <IonButtons slot="primary">
            <IonButton onClick={() => setShowModal(true)}>
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
            <IonButton className="notify-icon-wrap" onClick={() => setShowPopover(true)}>
              <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
              <IonBadge color="warning">25</IonBadge>
            </IonButton>
          </IonButtons>
          { (authValues.authenticated && authValues.isVerified &&  authValues.user) &&
            <IonButtons slot="end">
              <IonButton onClick={(e) => toggleRightOverlaySidebar(e)}>
                <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
              </IonButton>  
            </IonButtons>
          }
          
          <IonTitle>
            <img 
              src={ (authValues.authenticated && authValues.isVerified)? `${basename}/assets/img/Logo-WH.svg`: `${basename}/assets/img/Logo-BK.svg`} 
              title="Logo" alt="Logo" width="200" height="32"/>
          </IonTitle>
            
        </IonToolbar>

      </IonHeader>
      <div id="overlay" onClick={ (e) => removeOverlay(e) }></div>
      <div id="left-overlay-sidebar">
        <LeftMenu removeOverlay={removeOverlay} />
      </div>
      <div id="right-overlay-sidebar">
        
          <RightMenu removeOverlay={removeOverlay} />
        
      </div>

      <IonModal isOpen={showModal} cssClass='search-modal'>
        <IonContent fullscreen>
          <IonToolbar>
            <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                    <IonIcon icon={close} slot="icon-only"></IonIcon>
                </IonButton>
            </IonButtons>
          </IonToolbar>
          <form className="searchbar" >
            
            <div className="inner-form">
                <div className="basic-search">
                  <div className="input-field">
                      <div className="icon-wrap">
                        <IonIcon icon={searchOutline} slot="icon-only"></IonIcon>
                      </div>
                      <input id="search" type="text" placeholder="Search..." />
                  </div>
                </div>
                <div className="advance-search mt-3">
                  <div>
                    <IonChip color="primary" className="mr-3 my-3">
                      <IonIcon icon={checkmarkOutline}></IonIcon>
                      <IonLabel>Product & Service</IonLabel>
                    </IonChip>
                    <IonChip className="mr-3 my-3">
                      <IonLabel>Business Name</IonLabel>
                    </IonChip>
                    <IonChip className="mr-3 my-3">
                      <IonLabel>Current Deals</IonLabel>
                    </IonChip>
                    <IonChip className="mr-3 my-3">
                      <IonLabel>Events</IonLabel>
                    </IonChip>
                    <IonChip className="mr-3 my-3">
                      <IonLabel>Classifieds</IonLabel>
                    </IonChip>
                    <IonChip className="mr-3 my-3">
                      <IonLabel>Business News</IonLabel>
                    </IonChip>
                    <IonChip className="mr-3 my-3">
                      <IonLabel>Business Resources</IonLabel>
                    </IonChip>

                  </div>
                  <IonButton className="ion-margin-top mt-5" expand="block" type="submit">
                    Search
                  </IonButton>
                </div>
            </div>

          </form>      
        </IonContent>
      </IonModal>

      <IonPopover
        isOpen={showPopover}
        cssClass='my-custom-class'
        onDidDismiss={e => setShowPopover(false)}
        >
        <div className="arrow" style={{left: '124px'}}></div>  
        <IonList>
            {/* <IonListHeader>Ionic</IonListHeader> */}
            <IonItem button>Complete Rep Profile</IonItem>
            <IonItem lines="none" button>Complete Company Profile</IonItem>
            {/* <IonItem button>Showcase</IonItem>
            <IonItem button>GitHub Repo</IonItem>
            <IonItem lines="none" button >Close</IonItem> */}
        </IonList>
      </IonPopover>   
    </> 
  );
}

export default Header;
