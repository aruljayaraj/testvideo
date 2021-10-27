import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle } from '@ionic/react';
import React from 'react';
import './Home.scss';
import { nanoid } from 'nanoid';
import { shuffle } from 'lodash';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';
import { isPlatform } from '@ionic/react';
import PartnerAds from '../../components/Common/PartnerAds';

interface Props {
  dwidth: number
}

const HomeItems: React.FC<Props> = ({dwidth}) => {
  const { apiBaseURL, basename } = lfConfig;
  const homeResults = useSelector( (state:any) => state.search.homeResults.items);
  const adResults = useSelector( (state:any) => state.search.homeResults.pageAds);

  let items = '';
  let divider = 4; // For Mobile
  let noOfAds = 1; // For Mobile
  var rows = [];
  var cols = [];
  if( dwidth <= 576 ){
    divider = 4; // For Mobile
    noOfAds = 1;
  }else if( dwidth <= 768 ){
    divider = 6;
    noOfAds = 2;
  }else if( dwidth <= 992 ){
    divider = 8;
    noOfAds = 2;
  }else if( dwidth <= 1200 ){
    divider = 10;
    noOfAds = 2;
  }else if( dwidth <= 1400 || dwidth > 1400 ){
    divider = 12;
    noOfAds = 2;
  }
  
  if( homeResults && homeResults.length > 0 ){
    items = homeResults.map((item: any, index: number)=> {
      let itemImage = `${basename}/assets/img/placeholder.png`;
      let typeItem = '';
      let itemLink = '';
      if( item.image && item.image !== '' ){
        itemImage = `${apiBaseURL}uploads/member/${item.mem_id}/${item.rep_id}/${item.image}`;
      }
      if(item.type === 'localdeals'){
        typeItem = 'Local Deal';
        itemLink = `${basename}/local-deal/${item.id}`;
      }else if(item.type === 'pressreleases'){
        typeItem = 'Press Release';
        itemLink = `${basename}/press-release/${item.id}`;
      }
      return (<IonCard className={`home-item all ${item.type}`} key={nanoid()} routerLink={itemLink}>
          <IonCardHeader>
            <IonCardSubtitle className="ion-text-center ion-text-capitalize">{typeItem}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            <img src={itemImage} alt={item.title}/>
            <p className="p-2 ion-text-capitalize">{item.title}</p>
            { item.price && <p className="px-2 pb-2 pt-0 fw-bold">$ {item.price}</p> }
          </IonCardContent>
        </IonCard>
      );
    });

    for (let i = 0; i < items.length; i++) { 
      cols.push(<div key={nanoid()}>{items[i]}</div>); // console.log(items[i]);
      if ((i + 1) % divider === 0 || (i + 1) === items.length ) { 
        let contxt = (<div key={nanoid()} >
          <div className="filter-container space-between">
            {cols}
          </div>
          { (!isPlatform('desktop')) && (i + 1) % divider === 0 && 
            <div className="ads-container">
              <PartnerAds limit={noOfAds} />
            </div> }
        </div>);
        rows.push(<div key={nanoid()} >
          {contxt}
        </div>);
        cols = [];
      }
    }
  }

  return (<>{rows}</>);
};

export default HomeItems;
