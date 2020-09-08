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
  IonItemGroup
} from '@ionic/react';
import { 
  peopleOutline,
  personOutline,
  speedometer,
  logOut,
  chevronUpOutline,
  chevronDownOutline,
  // alertCircleOutline,
  businessOutline,
  personAddOutline,
  listOutline,
  addOutline,
  newspaperOutline,
  fileTrayFullOutline,
  documentOutline,
  documentTextOutline,
  musicalNotesOutline,
  videocamOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router";
import './Header.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/reducers/auth';

interface Props{
    removeOverlay: Function
}

// type MenuItems = {
//     reps: []
// };

const RightMenu: React.FC<Props> = ({removeOverlay}) => {
    // console.log("Right Menu");
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const authValues = useSelector( (state:any) => state.auth.data); 
    const menuItems = useSelector( (state:any) => state.auth.menu);
    const memOpts = useSelector( (state:any) => state.auth.memOptions);
    
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    const [ showRepProfile, setShowRepProfile ] = useState(false); 
    const [ showPressRelease, setShowPressRelease ] = useState(false);
    const [ showResource, setShowResource ] = useState(false);

    function logout(e: any){
        removeOverlay(e);
        dispatch(authActions.logout({ logout: true }));
        history.push({
          pathname:  "/login"
        });
    }

    return (<>
      { authValues && authValues.authenticated && authValues.isVerified &&  
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
                  <IonText color="blackbg"><h3>{authValues.user.business_type}</h3></IonText>
                  
                  <IonButton color="greenbg" onClick={(e) => logout(e)}>
                    <IonIcon slot="icon-only" icon={logOut}></IonIcon>
                    <IonLabel>Logout</IonLabel>
                  </IonButton>
                </IonLabel>
              </IonItem>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList className="ion-no-padding">
              <IonItem className="cursor" button color={location.pathname === '/layout/dashboard'? 'menuhlbg': 'blackbg'} routerLink={`${basename}/layout/dashboard`} onClick={ (e) => removeOverlay(e) }>
                  <IonIcon slot="start" icon={speedometer}></IonIcon>
                <IonLabel>Dashboard</IonLabel>
              </IonItem>
              { authValues.user.accType === 'full' && memOpts && ([1,3].includes(parseInt(memOpts.profile))) === true  &&
                <IonItem className="cursor" button color={location.pathname.includes('/layout/company-profile')? 'menuhlbg': 'blackbg'} routerLink={`${basename}/layout/company-profile`} onClick={ (e) => removeOverlay(e) }>
                  <IonIcon slot="start" icon={businessOutline}></IonIcon>
                  <IonLabel>Company Profile</IonLabel>
              </IonItem>
              }
              { memOpts && ([2,3].includes(parseInt(memOpts.profile))) === true  && 
              <IonMenuToggle auto-hide="false" >
                <IonItem className="cursor" button color={location.pathname.includes('/layout/rep-profile/')? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowRepProfile(!showRepProfile) }>
                    <IonIcon slot="start" icon={peopleOutline}></IonIcon>
                    <IonIcon slot="end" icon={showRepProfile ? chevronUpOutline : chevronDownOutline}></IonIcon>
                    <IonLabel>{ parseInt(memOpts.profile) === 2? 'Profile': 'Rep Profile'}</IonLabel>
                </IonItem>
                { (menuItems && showRepProfile) && 
                  <IonItemGroup>
                    { authValues.user.accType === 'full' && memOpts && [3].includes(parseInt(memOpts.profile)) === true && 
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/add-newrep`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={personAddOutline}></IonIcon>
                        <IonLabel>Add Rep Profile</IonLabel>
                    </IonItem>}
                    {  menuItems!.reps.map((item: any, index: number) => {
                        return <IonItem className="cursor" key={index} button color="blackbg" routerLink={`${basename}/layout/rep-profile/${item.rep_id}/${item.mem_id}`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={personOutline}></IonIcon>
                        {/* {!item.is_updated  && 
                          <IonIcon slot="end" color="warning" icon={alertCircleOutline}></IonIcon>
                        } */}
                        <IonLabel>{item.firstname}</IonLabel>
                    </IonItem>
                    })}
                  </IonItemGroup>}
                </IonMenuToggle>} 
                
                { authValues.user.accType === 'full' && memOpts && ([2,3].includes(parseInt(memOpts.profile))) === true  && 
                <IonMenuToggle auto-hide="false" >
                  <IonItem className="cursor" button color={location.pathname.includes('/layout/press-release/')? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowPressRelease(!showPressRelease) }>
                      <IonIcon slot="start" icon={newspaperOutline}></IonIcon>
                      <IonIcon slot="end" icon={showPressRelease ? chevronUpOutline : chevronDownOutline}></IonIcon>
                      <IonLabel>Press Release</IonLabel>
                  </IonItem>
                  { (menuItems && showPressRelease) && 
                  <IonItemGroup>
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/add-press-release/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={addOutline}></IonIcon>
                        <IonLabel>Add Press Release</IonLabel>
                    </IonItem>
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/press-releases/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={listOutline}></IonIcon>
                        <IonLabel>Press Release Listing</IonLabel>
                    </IonItem>
                  </IonItemGroup>}
                </IonMenuToggle>}

                { authValues.user.accType === 'full' && 
                <IonMenuToggle auto-hide="false" >
                  <IonItem className="cursor" button color={location.pathname.includes('/layout/my-uploads/')? 'menuhlbg': 'blackbg'} onClick={ (e) => setShowResource(!showResource) }>
                      <IonIcon slot="start" icon={fileTrayFullOutline}></IonIcon>
                      <IonIcon slot="end" icon={showResource ? chevronUpOutline : chevronDownOutline}></IonIcon>
                      <IonLabel>My Uploads</IonLabel>
                  </IonItem>
                  { (menuItems && showResource) && 
                  <IonItemGroup>
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/add-resource/document/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={addOutline}></IonIcon>
                        <IonLabel>Add Document</IonLabel>
                    </IonItem>
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/resources/video/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={videocamOutline}></IonIcon>
                        <IonLabel>Video</IonLabel>
                    </IonItem>
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/resources/audio/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={musicalNotesOutline}></IonIcon>
                        <IonLabel>Audio</IonLabel>
                    </IonItem>
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/resources/document/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={documentOutline}></IonIcon>
                        <IonLabel>Documents</IonLabel>
                    </IonItem>
                    <IonItem className="cursor" button color="blackbg" routerLink={`${basename}/layout/resources/article/`} onClick={ (e) => removeOverlay(e) }>
                        <IonIcon slot="start" icon={documentTextOutline}></IonIcon>
                        <IonLabel>Articles</IonLabel>
                    </IonItem>
                  </IonItemGroup>}
                </IonMenuToggle>}

            </IonList>
          </IonContent>
        </>
      }
    </>);
}



export default RightMenu;
