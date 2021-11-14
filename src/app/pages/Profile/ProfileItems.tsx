import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import React, {memo} from 'react';
import './Profile.scss';
import { nanoid } from 'nanoid';
import { shuffle, spread } from 'lodash';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';
import { isPlatform } from '@ionic/react';

const ProfileItems: React.FC = () => {
  const { apiBaseURL, basename } = lfConfig;
  let profileItems: any = [];
  const dds = useSelector( (state:any) => state.deals.localDeals);
  const prs = useSelector( (state:any) => state.pr.pressReleases);
  if(dds && dds.length > 0){
    profileItems = [...profileItems, ...dds];
  }
  if(prs && prs.length > 0){
    profileItems = [...profileItems, ...prs];
  } console.log(profileItems);
  
  return (<IonCard>
    <IonCardHeader>
    <IonCardTitle className="card-custom-title">
          <span>Postings</span>
      </IonCardTitle>
      {/* <IonCardSubtitle className="fw-bold ion-text-capitalize"></IonCardSubtitle> */}
    </IonCardHeader>
    <IonCardContent className="ion-no-padding profile-items-container">
    {profileItems && profileItems.length > 0 && shuffle(profileItems).map((item: any, index: number)=> {
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
        typeItem = 'Business News';
        itemLink = `${basename}/press-release/${item.id}`;
      }
      return (<IonCard className="ion-no-padding" key={nanoid()} routerLink={itemLink}>
        <IonCardHeader>
          <IonCardSubtitle className="ion-text-center ion-text-capitalize">{typeItem}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent className="ion-no-padding">
          <img src={itemImage} alt={item.title}/>
          <p className="p-2 ion-text-capitalize">{item.title}</p>
          { item.price && <p className="px-2 pb-2 pt-0 fw-bold">$ {item.price}</p> }
        </IonCardContent>
      </IonCard>);
    })}
    </IonCardContent>
  </IonCard>);
};

export default memo(ProfileItems);
