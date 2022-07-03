import React, {useState, useEffect} from 'react';
import { IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonModal,
  IonRouterLink,
  IonBadge
} from '@ionic/react';
import {
  search,
  personCircleOutline,
  notificationsOutline
} from 'ionicons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import './Header.scss';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../store/reducers/ui';
import { lfConfig } from '../../../Constants';
import CoreService from '../../shared/services/CoreService';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import SearchModal from '../Modal/SearchModal/SearchModal';
import NotificationModal from '../Modal/Notification/Notification';

const Header: React.FC = (props:any) => { // console.log(props.location.state);
  const dispatch = useDispatch();
  const authValues = useSelector( (state:any) => state.auth.data);
  const authUser = useSelector( (state:any) => state.auth.data.user);
  // const notifications = useSelector( (state:any) => state.rep.notifications);
  const notificationsCount = useSelector( (state:any) => state.rep.notificationsCount);
  const [searchModal, setSearchModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const { basename } = lfConfig;

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

  useEffect(() => {
    if(authUser.ID){
      let data = {
        action: 'get_notifications',
        memID: authUser.ID,
        repID: authUser.repID,
        prepID: authUser.prepID
      };
      // dispatch(uiActions.setShowLoading({ loading: true }));
      CoreService.onPostsFn('get_member', data).then((res:any) => {
          if(res.data.status === 'SUCCESS'){ 
            dispatch(repActions.setNotifications({ data: res.data.notifications }));
          }
          // dispatch(uiActions.setShowLoading({ loading: false }));
      }).catch((error) => {
        dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error.message }));
      });
    }
  },[]);

  useEffect(() => {
    if(authUser.ID){
      let live = true;
      const interval = setInterval(async () => {
        let data = {
          action: 'get_notifications',
          memID: authUser.ID,
          repID: authUser.repID,
          prepID: authUser.prepID
        };
        // dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostsFn('get_member', data).then((res:any) => {
            if(res.data.status === 'SUCCESS'){ 
              dispatch(repActions.setNotifications({ data: res.data.notifications }));
            }
            // dispatch(uiActions.setShowLoading({ loading: false }));
        }).catch((error) => {
          dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error.message }));
        });
      }, 60000);
      return () => {
        live = false;
        clearInterval(interval);
      }
    }
  },[]);
  
  // let totalCount = 0;
  // if(notifications){
  //   totalCount = Object.keys(notifications).reduce((prev, curr) => prev + notifications[curr].length, 0);
  //   // console.log(totalCount);
  //   // setTotalNotifyCount(()=> totalCount);
  // }

  // const totalProducts = notifications.reduce((count: number, current: any) => count + current.products.length, 0);

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
            { (authValues.authenticated && authValues.isVerified &&  authValues.user) &&
            <IonButton className="notify-icon-wrap" onClick={() => setNotificationModal(true)}>
              <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
              { notificationsCount > 0 && <IonBadge color="warning">{notificationsCount}</IonBadge> }
            </IonButton>}
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
                { isPlatform('desktop') && <span className='ion-float-left'>{`Hi ${authValues.user.firstname}`} </span>}
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
      <IonModal backdropDismiss={false} isOpen={notificationModal} className='notification-modal'>
          { notificationModal === true &&  <NotificationModal
            notificationModal={notificationModal}
            setNotificationModal={setNotificationModal} 
          /> }
      </IonModal>

      
    </> 
  );
}

export default Header;



