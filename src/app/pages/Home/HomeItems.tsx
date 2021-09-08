import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle } from '@ionic/react';
import React from 'react';
import './Home.scss';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';

const HomeItems: React.FC = () => {
  const { apiBaseURL, basename } = lfConfig;
  const homeResults = useSelector( (state:any) => state.search.homeResults.items);
  
  return (<>
    { homeResults && homeResults.length > 0 && homeResults.map((item: any)=> {
      let itemImage = `${basename}/assets/img/placeholder.png`;
      let typeItem = '';
      let itemLink = '';
      if( item.image && item.image !== '' ){
        itemImage = `${apiBaseURL}uploads/member/${item.mem_id}/${item.image}`;
      }
      if(item.type === 'localdeals'){
        typeItem = 'Local Deal';
        itemLink = `${basename}/local-deal/${item.id}`;
      }else if(item.type === 'pressreleases'){
        typeItem = 'Press Release';
        itemLink = `${basename}/press-release/${item.id}`;
      }
      
      // const prImage = ( item && Object.keys(item).length > 0 && item.pr_image) ? `${apiBaseURL}uploads/member/${item.pr_mem_id}/${item.pr_image}` : `${basename}/assets/img/placeholder.png`;
      return (<IonCard className={`home-item all ${item.type}`} data-order="1" key={nanoid()} routerLink={itemLink}>
        <IonCardHeader>
          <IonCardSubtitle className="ion-text-center">{typeItem}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="ion-no-padding">
          <img src={itemImage} alt={item.title} />
          <p className="p-2">{item.title}</p>
          { item.price && <p className="px-2 pb-2 pt-0 fw-bold">$ {item.price}</p> }
        </IonCardContent>
      </IonCard>);
    })}
  </>);
};

export default HomeItems;
