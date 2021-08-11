import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonRouterLink } from '@ionic/react'; 
import React from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';

const PreDeals: React.FC = () => { 
  const preResults = useSelector( (state:any) => state.search.preResults.deals); 
  const { basename } = lfConfig;
  return (<>
     { preResults && preResults && preResults.length > 0 && <IonCard className="card-center my-4">
    <IonCardHeader color="titlebg">
        <IonCardTitle className="fs-18">Member Deals and Promotions</IonCardTitle>
    </IonCardHeader>

    <IonCardContent>
        <IonList>
        { preResults.map((item: any) => { 
            return (
            <IonItem lines="none" key={nanoid()} routerLink={`${basename}/local-deal/${item.mem_id}/${item.id}`}>
                {(isPlatform('desktop')) && <IonAvatar slot="start" color="greenbg">
                    <i className="fa fa-money fa-lg green" aria-hidden="true"></i>
                </IonAvatar> }
                <IonLabel>
                    <h2 className="fw-bold">{item.name}</h2>
                </IonLabel> 
            </IonItem>)}
        )}
        </IonList>
        <NoData dataArr={preResults} htmlText="No results found." />
    </IonCardContent> 
    </IonCard>}
    </>
  );
};

export default PreDeals;
