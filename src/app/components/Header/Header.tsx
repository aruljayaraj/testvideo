import React, {useState} from 'react';
import { IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonModal,
  IonPopover,
  IonList,
  IonItem,
  IonRouterLink
} from '@ionic/react';
import {
  search,
  personCircleOutline,
  notificationsOutline
} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import './Header.scss';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import SearchModal from '../Modal/SearchModal/SearchModal';
import { Redirect } from 'react-router';

const Header: React.FC = (props:any) => { // console.log(props.location.state);
  
  const authValues = useSelector( (state:any) => state.auth.data);
  const [searchModal, setSearchModal] = useState(false);
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
          
          <IonButtons slot="end">
            <IonButton onClick={() => setSearchModal(true)} className="mr-3">
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
            {/* <IonButton className="notify-icon-wrap" onClick={() => setShowPopover(true)}>
              <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
              <IonBadge color="warning">25</IonBadge>
            </IonButton> */}
          </IonButtons>
             
          { (isPlatform('desktop')) && (!authValues.authenticated || !authValues.isVerified) &&
            <IonButtons className="mr-2" slot="primary">
              <IonRouterLink slot="start" href={`${basename}/login`} > Login</IonRouterLink> 
              <span className="px-2"> | </span>
              <IonRouterLink slot="start" href={`${basename}/signup`} > Signup </IonRouterLink>
          </IonButtons>}
          <IonButtons slot="end">
            { (authValues.authenticated && authValues.isVerified &&  authValues.user) &&
              <IonButton onClick={(e) => toggleRightOverlaySidebar(e)}>
                <span className='ion-float-left'>{`Hi ${authValues.user.firstname}`} </span>
                <IonIcon slot="start" icon={personCircleOutline}></IonIcon>
              </IonButton>  
            }
          </IonButtons> 
          
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

      <IonModal backdropDismiss={false} isOpen={searchModal} className='search-modal'>
          { searchModal === true &&  <SearchModal
            searchModal={searchModal}
            setSearchModal={setSearchModal} 
          /> }
      </IonModal>

      <IonPopover
        isOpen={showPopover}
        className='my-custom-class'
        onDidDismiss={e => setShowPopover(false)}
        >
        <div className="arrow" style={{left: '124px'}}></div>  
        <IonList>
            {/* <IonListHeader>Ionic</IonListHeader> */}
            <IonItem button>Complete Rep Profile</IonItem>
            <IonItem lines="none" button>Complete Company Profile</IonItem>
        </IonList>
      </IonPopover>   
    </> 
  );
}

export default Header;
