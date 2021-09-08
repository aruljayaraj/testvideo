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
    const b2bCategory = useSelector( (state:any) => state.rep.b2b);
    const b2cCategory = useSelector( (state:any) => state.rep.b2c);

    return (<>
        { Object.keys(repProfile).length > 0 && ( (b2bCategory && b2bCategory.length > 0) || (b2cCategory && b2cCategory.length > 0)) && 
        <IonCard className="buscat-section-wrap card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">
                    <span>Product & Services</span>
                </IonCardTitle>
            </IonCardHeader>
              
            <IonCardContent>
                { b2bCategory && b2bCategory.length > 0 && <IonList className="buscat-section-content">
                    <IonListHeader>
                        <IonLabel>B2B Category</IonLabel>
                    </IonListHeader>
                    { b2bCategory.map((item: any)=> {
                        return (<div className="pl-3" key={item.id}>
                            <IonText>
                                {item.catname} {`->`} {item.sub_catname}
                            </IonText>
                        </div>)
                    })}
                </IonList>}
                { b2cCategory && b2cCategory.length > 0 && <IonList className="buscat-section-content">
                    <IonListHeader>
                        <IonLabel>B2C Category</IonLabel>
                    </IonListHeader>
                    { b2cCategory.map((item: any)=> {
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
  