import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList } from '@ionic/react'; 
import React from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';
import { Link } from 'react-router-dom';

const PreCompany: React.FC = () => {
    const { ICONS  } = lfConfig;
    const preResults = useSelector( (state:any) => state.search.preResults.company);
  
    return (<>
    { preResults && preResults && preResults.length > 0 && <IonCard className="card-center my-4">
        <IonCardHeader color="titlebg">
            <IonCardTitle className="card-custom-title">Business Names</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
        <IonList>
        { preResults.map((item: any) => { 
            return (
            <IonItem lines="none" key={nanoid()}>
                <IonLabel>
                    <Link to={{ pathname: `/company-results`, state: { company_name: item.name } }} >
                    <h2 className="fw-bold py-1"> 
                        <i className={`fa ${ICONS.ICON_COMPANY} fa-lg green ${ isPlatform('desktop')? 'mr-3': 'mr-2' }`} aria-hidden="true"></i>
                        {item.name}
                    </h2></Link>
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

export default PreCompany;
