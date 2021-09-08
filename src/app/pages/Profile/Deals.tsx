import {
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonRouterLink
} from '@ionic/react';
import React from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';

const Deals: React.FC = () => {
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const dds = useSelector( (state:any) => state.deals.localDeals);
    const { basename } = lfConfig;

    return (<>
        { Object.keys(repProfile).length > 0 && dds && dds.length > 0 && 
        <IonCard className="buscat-section-wrap card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">
                    <span>Local Deals</span>
                </IonCardTitle>
            </IonCardHeader>
              
            <IonCardContent>
                <IonList className="buscat-section-content">
                    { dds.map((item: any)=> {
                        return (<div className="pl-3" key={item.id}>
                            <IonRouterLink color="greenbg" href={`${basename}/layout/deals/local-deal/${item.id}`} className="">
                            <IonText>
                                <i className="fa fa-image pr-2" aria-hidden="true"></i>
                                {item.name}
                            </IonText>
                            </IonRouterLink>
                        </div>)
                    })}
                </IonList>
                
            </IonCardContent>
        </IonCard>
        }
    </>);
};
  
export default Deals;
  