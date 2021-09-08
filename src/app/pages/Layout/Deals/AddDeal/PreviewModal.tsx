import { IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonButton, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle } from '@ionic/react';
import React from 'react';
import { isPlatform } from '@ionic/react';
import { close } from 'ionicons/icons';
import '../Deals.scss';
import { useDispatch, useSelector } from 'react-redux';
import { lfConfig } from '../../../../../Constants';
import CommonService from '../../../../shared/services/CommonService';
import Status from '../../../../components/Common/Status';
import BuscatsList from '../../../../components/Common/BuscatsList';
import ContactsList from '../../../../components/Common/ContactsList';

interface Props {
    previewModal: any,
    setPreviewModal: Function,
}

const PreviewModal: React.FC<Props> = ({ previewModal, setPreviewModal }) => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const dd = useSelector( (state:any) => state.deals.localDeal);
    const { apiBaseURL, basename } = lfConfig;

    const ddImage = ( dd && Object.keys(dd).length > 0 && dd.image) ? `${apiBaseURL}uploads/member/${dd.mem_id}/${dd.image}` : `${basename}/assets/img/placeholder.png`;

    return (<>
        { dd && Object.keys(dd).length > 0 && 
        <>
        <IonHeader translucent>
            <IonToolbar color="greenbg">
                <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                    <IonButton onClick={() => setPreviewModal({
                        ...previewModal, 
                        isOpen: false
                    })}>
                        <IonIcon icon={close} slot="icon-only"></IonIcon>
                    </IonButton>
                </IonButtons>
                <IonTitle>Deal Preview</IonTitle>
            </IonToolbar>
            
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonCard className="preview-card card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18"> {dd.name}</IonCardTitle>
                <IonText className="mt-2 fs-12" color="medium">{CommonService.dateFormat(dd.added_date)} </IonText>
                { authUser.ID === dd.mem_id && 
                  <Status is_active={+(dd.is_active)} type="local_deal" />
                }
            </IonCardHeader>
            <IonCardContent className="pt-3">
              <IonGrid>
                <IonRow>
                  { dd.image && 
                  <IonCol sizeMd="4" sizeXl="4" sizeXs="12" className="">
                    <img src={ddImage} alt="Press Release Media" />
                  </IonCol> }
                  <IonCol sizeMd={ dd.image? "8": "12" } sizeXs="12" className="">
                    <div className="pl-3">  { /* pt-sm-3 mt-sm-4 */}
                      { dd.price && <h2 className="mb-2"><strong>Price: {`$${dd.price}`}</strong></h2> }
                      { dd.sdate && <div className="quote mb-2">{CommonService.dateFormat(dd.sdate)} - {CommonService.dateFormat(dd.edate)}</div> }
                      { dd.buscats && dd.buscats.length > 0 && <BuscatsList buscats={dd.buscats} />}
                    </div>
                  </IonCol>
                </IonRow>
                { dd.description && <IonRow className="pt-3">
                  <IonCol>
                    <div className="external_text" dangerouslySetInnerHTML={{ __html: dd.description }} ></div>
                  </IonCol>
                </IonRow>}
              </IonGrid>    
            </IonCardContent>
            <IonCardHeader color="titlebg">
              <h3 className="mt-0 font-weight-bold fs-16">Contacts:</h3> 
              <div className="d-flex flex-row reps-container">
                { dd.reps && dd.reps.length > 0 && <ContactsList contacts={dd.reps} />}
              </div>  
            </IonCardHeader>
          </IonCard>  
        </IonContent> 
      </>}
    </>);
};
  
export default PreviewModal;
  