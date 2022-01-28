import { IonCardHeader, IonCardSubtitle, IonRouterLink } from '@ionic/react'; 
import React, {memo} from 'react';
import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import {shuffle} from 'lodash';
interface PropsInterface{
    limit: number
}

const PatnerAds: React.FC<PropsInterface> = ({limit}) => {
    let adResults = useSelector( (state:any) => state.formdata.ads);
    adResults = shuffle(adResults);
    if(limit && limit > 0){
        adResults = adResults.slice(0,limit);
    }

    return (<>
        {adResults && adResults.length > 0 && (adResults).map((adItem: any) => { 
           return (<div className="aditem" key={nanoid()} >
               <IonRouterLink href={adItem.banner_link} target="_blank">
                    <IonCardHeader className="adheader">
                        <IonCardSubtitle className="ion-text-left ion-text-capitalize">Local First Sponsor</IonCardSubtitle>
                    </IonCardHeader>
                    <div className="ion-no-padding">
                        <img src={adItem.image} alt="Banner Ads" />
                    </div>
            </IonRouterLink>
          </div>)} 
        )}
    </>);
};

export default memo(PatnerAds);
