import React, {useState} from 'react';
import { IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonLabel,
  IonContent, 
  IonList, 
  IonItem,
  IonAvatar,
  IonText,
  IonMenuToggle,
  IonItemGroup,
  IonListHeader
} from '@ionic/react';
import { 
  peopleOutline,
  personOutline,
  speedometer,
  logOut,
  chevronUpOutline,
  chevronDownOutline,
  businessOutline,
  personAddOutline,
  listOutline,
  addOutline,
  newspaperOutline,
  fileTrayFullOutline,
  documentOutline,
  documentTextOutline,
  musicalNotesOutline,
  videocamOutline,
  archiveOutline,
  listCircleOutline,
  notificationsCircleOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router";
import './Header.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/reducers/auth';
import { lfConfig } from '../../../Constants';

interface Props{
    removeOverlay: Function
}

// type MenuItems = {
//     reps: []
// };

const RightMenu: React.FC<Props> = ({removeOverlay}) => {
    let repNotify = false;
    let comNotify = false;
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const authValues = useSelector( (state:any) => state.auth.data); 
    const menuItems = useSelector( (state:any) => state.auth.menu); // console.log(menuItems.menuOpts);
    const memOpts = useSelector( (state:any) => state.auth.memOptions);
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    
    const { basename } = lfConfig;
    const [showRepProfile, setShowRepProfile] = useState(false); 
    const [showPressRelease, setShowPressRelease] = useState(false);
    const [showResource, setShowResource] = useState(false);
    const [showLocalDeal, setShowLocalDeal] = useState(false);
    const [showBusinessQQ, setShowBusinessQQ] = useState(false);
    const reps = useSelector( (state:any) => state.rep.reps);
    // const [showBusinessSellerQQ, setShowBusinessSellerQQ] = useState(false);
    const [showConsumerQQ, setShowConsumerQQ] = useState(false);
    // const [showConsumerSellerQQ, setShowConsumerSellerQQ] = useState(false);
    // const tt = menuItems?.menuOpts?.some((value: any) => value.menu_key === 'get_quotes');

    if(reps && reps.length > 0){
      repNotify =  reps.every((item: any) => {
        return (!item.address1 || !item.country || !item.phone || !item.profile_description)
      });
      comNotify = comProfile && (!comProfile.address1 || !comProfile.country || !comProfile.description) && authValues.user.accType === 'full' && [1,2,3].includes(+(comProfile.mem_level));
    }
    // console.log(repNotify, comNotify);

    function logout(e: any){
        removeOverlay(e);
        dispatch(authActions.logout({ logout: true }));
        history.push({
          pathname:  "/login"
        });
    }

    return (<>
      { authValues &&  authValues.user &&
        <>
          <IonHeader>
            <IonToolbar>
              <IonItem color="blackbg">
                <IonAvatar className="user-avatar md hydrated" slot="start">
                  <img src={`${basename}/assets/img/avatar.svg`} alt="Avatar" title="Avatar" />
                </IonAvatar>
                <IonLabel>
                  <IonText>
                    <h2><strong>{authValues.user.firstname+" "+authValues.user.lastname}</strong></h2>
                  </IonText>
                  <IonText><h3>
                    {authValues.user.business_type === 'Seller'? 'Provider': authValues.user.business_type}
                    {`${authValues.user.accType==='sub'? ' (Sub)': ' (Primary)'}`}</h3></IonText>
                  
                  <IonButton color="greenbg" onClick={(e) => logout(e)}>
                    <IonIcon slot="icon-only" icon={logOut}></IonIcon>
                    <IonLabel>Logout</IonLabel>
                  </IonButton>
                </IonLabel>
              </IonItem>
            </IonToolbar>
          </IonHeader>
          { authValues.authenticated && authValues.isVerified && <IonContent>
            <IonList className="ion-no-padding">
              <IonItem className="cursor" button color={location.pathname === '/layout/dashboard'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/layout/dashboard`} onClick={ (e) => removeOverlay(e) }>
                  <IonIcon className="mr-3" slot="start" icon={speedometer}></IonIcon>
                <IonLabel>Dashboard</IonLabel>
              </IonItem>
              { authValues.user.accType === 'full' && memOpts && ([1,3].includes(parseInt(memOpts.profile))) === true  &&
                <IonItem className="cursor" button color={location.pathname.includes('/layout/company-profile')? 'menuhlbg': 'blackbg'} routerLink={`${basename}/layout/company-profile`} onClick={ (e) => removeOverlay(e) }>
                  <IonIcon className="mr-3" slot="start" icon={businessOutline}></IonIcon>
                  <IonLabel>Company Profile</IonLabel>
              </IonItem>
              }
              { memOpts && ([2,3].includes(parseInt(memOpts.profile))) === true  && 
              <IonMenuToggle auto-hide="false" >
                <IonItem className="cursor" button color={location.pathname.includes('/layout/rep-profile/')? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowRepProfile(!showRepProfile) }>
                    <IonIcon className="mr-3" slot="start" icon={peopleOutline}></IonIcon>
                    <IonIcon className="hidden-xs hidden-sm" slot="end" icon={showRepProfile ? chevronUpOutline : chevronDownOutline}></IonIcon>
                    <IonLabel>{ parseInt(memOpts.profile) === 2? 'Profile': 'Rep Profile'}</IonLabel>
                </IonItem>
                { (menuItems && showRepProfile) && 
                  <IonItemGroup className="custom-list-sidemenu">
                    { authValues.user.accType === 'full' && memOpts && [3].includes(parseInt(memOpts.profile)) === true && 
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/add-newrep`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={personAddOutline}></IonIcon>
                        <IonLabel>Add Rep Profile</IonLabel>
                    </IonItem>}
                    {  menuItems && menuItems.reps && menuItems.reps.map((item: any, index: number) => {
                        return <IonItem className="cursor custom-list-item" key={index} button color="menu-sub-item" routerLink={`${basename}/layout/rep-profile/${item.mem_id}/${item.rep_id}`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={personOutline}></IonIcon>
                        {/* {!item.is_updated  && 
                          <IonIcon slot="end" color="warning" icon={alertCircleOutline}></IonIcon>
                        } */}
                        <IonLabel>{item.firstname}</IonLabel>
                      </IonItem>
                    })}
                  </IonItemGroup>}
                </IonMenuToggle>}

                { authValues.user.accType === 'full' && menuItems?.menuOpts?.some((value: any) => (value.menu_key === 'press_release' && value.menu_value === 'yes')) 
                    && ((memOpts && [3].includes(parseInt(memOpts.profile)) === true && (!repNotify && !comNotify))
                    || ( memOpts && [2].includes(parseInt(memOpts.profile)) === true && !repNotify)
                ) &&
                <IonMenuToggle auto-hide="false" >
                  <IonItem className="cursor" button color={['/layout/add-press-release/', '/layout/press-releases/'].includes(location.pathname)? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowPressRelease(!showPressRelease) }>
                      <IonIcon className="mr-3" slot="start" icon={newspaperOutline}></IonIcon>
                      <IonIcon className="hidden-xs hidden-sm" slot="end" icon={showPressRelease ? chevronUpOutline : chevronDownOutline}></IonIcon>
                      <IonLabel>Press Release</IonLabel>
                  </IonItem>
                  { (menuItems && showPressRelease) && 
                  <IonItemGroup className="custom-list-sidemenu"> 
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/add-press-release/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={addOutline}></IonIcon>
                        <IonLabel>Add Press Release</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/press-releases/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={listOutline}></IonIcon>
                        <IonLabel>Press Release Listing</IonLabel>
                    </IonItem>
                  </IonItemGroup>}
                </IonMenuToggle>}
                  
                { authValues.user.accType === 'full' && menuItems?.menuOpts?.some((value: any) => (value.menu_key === 'resources' && value.menu_value === 'yes')) 
                    && ((memOpts && [3].includes(parseInt(memOpts.profile)) === true && (!repNotify && !comNotify))
                    || ( memOpts && [2].includes(parseInt(memOpts.profile)) === true && !repNotify)
                ) && 
                <IonMenuToggle auto-hide="false" >
                  <IonItem className="cursor" button color={['/layout/my-uploads/', '/layout/add-resource/document/', '/layout/resources/video/', '/layout/resources/audio/', '/layout/resources/document/'].includes(location.pathname)? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowResource(!showResource) }>
                      <IonIcon className="mr-3" slot="start" icon={fileTrayFullOutline}></IonIcon>
                      <IonIcon className="hidden-xs hidden-sm" slot="end" icon={showResource ? chevronUpOutline : chevronDownOutline}></IonIcon>
                      <IonLabel>My Uploads</IonLabel>
                  </IonItem>
                  { (menuItems && showResource) && 
                  <IonItemGroup className="custom-list-sidemenu">
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/add-resource/document/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={addOutline}></IonIcon>
                        <IonLabel>Add Document</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/resources/video/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={videocamOutline}></IonIcon>
                        <IonLabel>Video</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/resources/audio/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={musicalNotesOutline}></IonIcon>
                        <IonLabel>Audio</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/resources/document/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={documentOutline}></IonIcon>
                        <IonLabel>Documents</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/resources/article/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={documentTextOutline}></IonIcon>
                        <IonLabel>Articles</IonLabel>
                    </IonItem>
                  </IonItemGroup>}
                </IonMenuToggle>}
                { authValues.user.accType === 'full' && menuItems?.menuOpts?.some((value: any) => (value.menu_key === 'local_deals' && value.menu_value === 'yes')) 
                    && ((memOpts && [3].includes(parseInt(memOpts.profile)) === true && (!repNotify && !comNotify))
                    || ( memOpts && [2].includes(parseInt(memOpts.profile)) === true && !repNotify)
                ) && 
                <IonMenuToggle auto-hide="false" >
                  <IonItem className="cursor" button color={['/layout/deals/local-deal','/layout/deals/add-deal', '/layout/deals/local-deals'].includes(location.pathname)? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowLocalDeal(!showLocalDeal) }>
                      <IonIcon className="mr-3" slot="start" icon={newspaperOutline}></IonIcon>
                      <IonIcon className="hidden-xs hidden-sm" slot="end" icon={showLocalDeal ? chevronUpOutline : chevronDownOutline}></IonIcon>
                      <IonLabel>Local Deals</IonLabel>
                  </IonItem>
                  { menuItems && showLocalDeal  &&
                  <IonItemGroup className="custom-list-sidemenu"> 
                    { (+(memOpts.localdeals.total) < +(memOpts.localdeals.no_free_deals)) && 
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/deals/add-deal/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={addOutline}></IonIcon>
                        <IonLabel>Add Deal</IonLabel>
                    </IonItem> }
                    { (+(memOpts.localdeals.total) >= +(memOpts.localdeals.no_free_deals)) && 
                      <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/deals/buy-deal/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={addOutline}></IonIcon>
                        <IonLabel>Purchase a Deal</IonLabel>
                    </IonItem> }
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/deals/local-deals`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={listOutline}></IonIcon>
                        <IonLabel>Local Deals Listing</IonLabel>
                    </IonItem>
                  </IonItemGroup>}
                </IonMenuToggle>}

                { authValues.user.accType === 'full' && menuItems?.menuOpts?.some((value: any) => (value.menu_key === 'get_quotes' && value.menu_value === 'yes')) 
                    && ((memOpts && [3].includes(parseInt(memOpts.profile)) === true && (!repNotify && !comNotify))
                    || ( memOpts && [2].includes(parseInt(memOpts.profile)) === true && !repNotify)
                ) && 
                <IonMenuToggle auto-hide="false" >
                  <IonItem className="cursor" button color={['/layout/add-localquote/', '/layout/buyer-request-center', '/layout/my-localquotes-archive'].includes(location.pathname)? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowBusinessQQ(!showBusinessQQ) }>
                      <IonIcon className="mr-3" slot="start" icon={fileTrayFullOutline}></IonIcon>
                      <IonIcon className="hidden-xs hidden-sm" slot="end" icon={showBusinessQQ ? chevronUpOutline : chevronDownOutline}></IonIcon>
                      <IonLabel>Quotes</IonLabel>
                  </IonItem>
                  { (menuItems && showBusinessQQ) && <>
                  <IonItemGroup className="custom-list-sidemenu">
                    <IonListHeader className="custom-list-header">
                      Get Quotes
                    </IonListHeader>
                    <IonItem className="cursor custom-list-item" color="menu-sub-item" button routerLink={`${basename}/layout/add-localquote/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={addOutline}></IonIcon>
                        <IonLabel>Submit RFQ</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" color="menu-sub-item" button routerLink={`${basename}/layout/buyer-request-center`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={listOutline}></IonIcon>
                        <IonLabel>My RFQ's</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" color="menu-sub-item" button routerLink={`${basename}/layout/my-localquotes-archive`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={archiveOutline}></IonIcon>
                        <IonLabel>My Archive</IonLabel>
                    </IonItem>
                  </IonItemGroup>  
                  { authValues.user.accType === 'full' && ([1,2,3].includes(+(authValues.user.mem_level)) )  && menuItems?.menuOpts?.some((value: any) => (value.menu_key === 'submit_quotes' && value.menu_value === 'yes')) &&
                  <IonItemGroup className="custom-list-sidemenu">  
                    <IonListHeader className="custom-list-header">
                      Submit Quotes
                    </IonListHeader>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/seller-request-center`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={listOutline}></IonIcon>
                        <IonLabel>View Requests</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/my-quotations`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={listCircleOutline}></IonIcon>
                        <IonLabel>Quotes Sent</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/my-quotations-archive`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={archiveOutline}></IonIcon>
                        <IonLabel>Quotes Archive</IonLabel>
                    </IonItem>
                    <IonItem className="cursor custom-list-item" button color="menu-sub-item" routerLink={`${basename}/layout/notification-settings`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon className="mr-2 fs-20" slot="start" icon={notificationsCircleOutline}></IonIcon>
                        <IonLabel>Notify Settings</IonLabel>
                    </IonItem>
                  </IonItemGroup>}
                  </>}
                  
                </IonMenuToggle>}

            </IonList>
          </IonContent> }
        </>
      }
    </>);
}



export default RightMenu;
