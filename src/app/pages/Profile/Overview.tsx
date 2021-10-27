import {
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonCardHeader
} from '@ionic/react';
import React from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';

const Overview: React.FC = () => {
    const comProfile = useSelector( (state:any) => state.rep.comProfile);

    return (<>
        { Object.keys(comProfile).length > 0 &&
        <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">
                    <span>{comProfile.company_name} - Overview</span>
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonText>
                    { comProfile.description && <div className="external_text pt-3" dangerouslySetInnerHTML={{ __html: comProfile.description }} ></div>}
                </IonText>
            </IonCardContent>
        </IonCard>}
    </>);
};
  
export default Overview;
  