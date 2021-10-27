import { 
  IonContent, 
  IonPage, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonIcon,
  IonText,
  IonLabel
} from '@ionic/react';
import React, { useState, useEffect, useCallback } from 'react';
import { call, mail, map } from 'ionicons/icons';
import { useDispatch } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';

import CoreService from '../../shared/services/CoreService';
import './ContactUs.scss';
import ContactMap from '../../components/Map/Map';
import ContactForm from './ContactForm';

const ContactUs: React.FC = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState({ 
    title: '', 
    content: '',  
    c_title: '',
    c_company_name: '',
    c_address_line_1: '',
    c_address_line_2: '',
    c_country: '',
    c_pincode: '',
    c_contact_no: '',
    c_support_email: '',
    c_lat: '',
    c_lng: ''
  });

  const onGetPageCb = useCallback((res: any) => {
    dispatch(uiActions.setShowLoading({ loading: false }));
    if(res.status === 'SUCCESS'){
      setPage(res.data);
    }
  }, [dispatch, setPage]);

  useEffect(() => {
    dispatch(uiActions.setShowLoading({ loading: true }));
    const data = {
      page: 'contact-us'
    };
    CoreService.onPostFn('getpage', data, onGetPageCb);
  }, [dispatch, onGetPageCb]); 

  return (
    <IonPage className="contact-page">
      { page.title && 
      <IonContent className="ion-padding">
        <IonRow>
          <IonCol sizeMd="6" sizeXs="12">
            <IonCard className="card-center mt-2">
              <IonCardHeader color="light">
                <IonCardTitle className="card-custom-title">{page.title}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent className="pt-3">
                <div className="external_text" dangerouslySetInnerHTML={{ __html: page.content }} ></div>
                <div className="mt-4">
                  <ContactForm />
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol sizeMd="6" sizeXs="12">
            <IonCard className="card-center mt-2">
              <IonCardHeader color="light">
                <IonCardTitle className="card-custom-title">{page.c_title}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent className="pt-3">
                <IonList>
                { page.c_company_name && 
                    <IonItem className="hydrated">
                      <IonIcon color="greenbg" icon={map} slot="start"></IonIcon>
                      <IonLabel className="md hydrated">
                        <h2><IonText color="greenbg" className="md hydrated">{page.c_company_name}</IonText></h2>
                        { page.c_address_line_1 && 
                          <h2 ><IonText color="dark" className="md hydrated">{page.c_address_line_1}</IonText></h2>
                        }
                        { page.c_address_line_2 && 
                          <h2 ><IonText color="dark" className="md hydrated">{page.c_address_line_2}</IonText></h2>
                        }
                        { page.c_country && 
                          <h2 ><IonText color="dark" className="md hydrated">{page.c_country + ' '+ page.c_pincode}</IonText></h2>
                        }
                      </IonLabel>
                    </IonItem>
                  }
                  { page.c_contact_no && 
                    <IonItem href={`tel:${page.c_contact_no}`} className="hydrated">
                      <IonIcon color="greenbg" icon={call} slot="start"></IonIcon>
                      <IonLabel className="md hydrated">
                        <p>
                          <IonText color="greenbg" className="md hydrated">Call to General Support</IonText>
                        </p>
                        <h2 ><IonText color="dark" className="md hydrated">+{page.c_contact_no}</IonText></h2>
                      </IonLabel>
                    </IonItem>
                  }
                  { page.c_support_email && 
                    <IonItem href={`mailto:${page.c_support_email}`} className="hydrated mb-4">
                      <IonIcon color="greenbg" icon={mail} slot="start"></IonIcon>
                      <IonLabel className="md hydrated">
                        <p>
                          <IonText color="greenbg" className="md hydrated">Email</IonText>
                        </p>
                        <h2 ><IonText color="dark" className="md hydrated">{page.c_support_email}</IonText></h2>
                      </IonLabel>
                    </IonItem>
                  }
                  <div>
                    <ContactMap lat={page.c_lat} lng={page.c_lng}/>
                  </div>
                  
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        
      </IonContent>
      }
    </IonPage>
  );
};

export default ContactUs;
