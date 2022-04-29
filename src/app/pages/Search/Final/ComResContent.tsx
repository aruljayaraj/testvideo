import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react'; 
import React from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import CommonService from '../../../shared/services/CommonService';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';
import ViewRepresentatives from "./ViewRepresentatives";

interface Props {
    title: string,
    type: string,
    results: any 
}

const ComResResults: React.FC<Props> = ({title, type, results}) => {
  const { apiBaseURL, basename } = lfConfig;  // console.log(results);

  return (
    <IonPage className="search-page">
      <IonContent>
      { results && results.length > 0 && <IonCard className="card-center my-4">
        <IonCardHeader color="titlebg">
            <IonCardTitle className="card-custom-title ion-text-capitalize">{title}</IonCardTitle>
        </IonCardHeader>

        <IonCardContent className="px-0 px-sm-2">
        { results.map((item: any) => { 
            const logoImage = (Object.keys(item).length > 0 && item.company_logo) ? `${apiBaseURL}uploads/member/${item.mem_id}/${item.company_logo}` : `${basename}/assets/img/placeholder.png`;
            return (
            <IonCard className="mt-3" key={nanoid()}>
                <IonCardContent className="px-0 px-sm-2">
                <IonGrid className="mb-3 p-0">
                    <IonRow className="res-item">
                    <IonCol sizeSm="4" >
                        <div className="profile-logo mr-3 pb-2 pl-2">
                        <img src={logoImage} alt="Company Logo" />
                        </div>
                        { (!isPlatform('desktop')) && <>
                          <ViewRepresentatives reps={item.reps} />
                        </>}
                    </IonCol>
                    <IonCol sizeMd="5" sizeXl="5" className="px-3">
                        <IonRow class="ion-justify-content-center">
                          <IonCol sizeMd="6">
                            <p><strong>{item.company_name}</strong></p>
                            { item.address1 && <p><i className="fa fa-address-card-o fa-lg green" aria-hidden="true"></i> {item.address1},</p> }
                            { item.address2 && <p>{item.address2},</p> }
                            { item.city && <p>{`${item.city}, ${item.state},`}</p> }
                            { item.country && <p>{`${item.country} - ${item.postal}`}</p> }
                            { item.phone && <p> 
                            <i className="fa fa-phone fa-lg green" aria-hidden="true"></i> 
                            <a className="gray-medium" href={`tel:${item.phone_code}${item.phone}`}> {`${item.phone_code} ${item.phone}`}</a>
                            </p>}
                            { item.fax && <p className="gray-medium"><i className="fa fa-fax fa-lg green" aria-hidden="true"></i> {`${item.fax}`}</p> }
                          </IonCol>
                          <IonCol sizeMd="6">
                            { item.short_desc && <>
                              <p className='fw-bold'>Overview</p>
                              <div>{item.short_desc}</div> 
                            </>}
                          </IonCol>
                        </IonRow>
                    </IonCol>
                    
                    { isPlatform('desktop') && <IonCol className="pl-3">
                        < ViewRepresentatives reps={item.reps} />
                    </IonCol> }
                    </IonRow>
                </IonGrid>
                </IonCardContent>
            </IonCard>)}
            )}
            <NoData dataArr={results} htmlText="No results found." />
        </IonCardContent>
        </IonCard>}
      </IonContent>
    </IonPage>
  );
};

export default React.memo(ComResResults);
