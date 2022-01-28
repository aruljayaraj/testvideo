import {
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonLabel,
    IonListHeader
} from '@ionic/react';
import React from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';

const Buscats: React.FC = () => {
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const busCategory = useSelector( (state:any) => state.rep.buscats);

    return (<>
        { Object.keys(repProfile).length > 0 && ( (busCategory && busCategory.length > 0)) && 
        <IonCard className="buscat-section-wrap card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">
                    <span>Product & Services</span>
                </IonCardTitle>
            </IonCardHeader>
              
            <IonCardContent>
                { busCategory && busCategory.length > 0 && <IonList className="buscat-section-content">
                    <IonListHeader>
                        <IonLabel className="fs-16">Categories</IonLabel>
                    </IonListHeader>
                    { busCategory.map((item: any)=> {
                        return (<div className="pl-3" key={item.id}>
                            <IonText>
                                {item.catname} {`->`} {item.sub_catname}
                            </IonText>
                        </div>)
                    })}
                </IonList>}
            </IonCardContent>
        </IonCard>
        }
    </>);
};
  
export default Buscats;
  