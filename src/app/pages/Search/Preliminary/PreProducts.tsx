import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList } from '@ionic/react'; 
import React, {useState} from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import { useSelector } from 'react-redux';
import NoData from '../../../components/Common/NoData';
import { Redirect } from 'react-router';

interface Props {
  filters: {
      filterBy: string
  }
}

const PreProducts: React.FC<Props> = ({ filters }) => {
  const preResults = useSelector( (state:any) => state.search.preResults.products);
  const [redirectData, setRedirectData] = useState({ status: false, data: {} });
  const onListSelect = (item: any) => {
    setRedirectData({ ...redirectData, status: true, data: { category: item.name, type: item.type } });
  }

  if( redirectData.status  ){
    if(redirectData.data && Object.keys(redirectData.data).length > 0){
        return <Redirect to={{ pathname: `/search-results`, state: redirectData.data }} />;
    }
  }

  return (<>
    { preResults && preResults.length > 0 && <IonCard className="card-center my-4">
    <IonCardHeader color="titlebg">
        <IonCardTitle className="card-custom-title">Available 
        { filters.filterBy === 'b2b' && ` Suppliers` }
        { filters.filterBy === 'b2c' && ` Consumers` }
        </IonCardTitle>
    </IonCardHeader>

    <IonCardContent>
        <IonList>
        { preResults.map((item: any) => { 
            let firstKey = Object.keys(item)[0]; // console.log(item[firstKey]);
            let subCats = item[firstKey] && item[firstKey].length > 0 && item[firstKey].map((subItem: any) => {
            return ( 
                <h5 className="ml-4 py-2 cursor" key={nanoid()} onClick={()=>onListSelect(subItem)}>
                {/* <IonRouterLink color="blackbg" href={`${process.env.REACT_APP_BASE_URL}/search-results`}> */}
                <i className="fa fa-chevron-right fa-lg green mr-2" aria-hidden="true"></i>
                {subItem.name}
                <span className="ml-3 gray">{subItem.type}</span>
                {/* </IonRouterLink> */}
                </h5>);
            }); 
            return (
            <IonItem lines="none" key={nanoid()}>
                {(isPlatform('desktop')) && <IonAvatar slot="start" color="greenbg">
                    <i className="fa fa-hand-o-right fa-lg green" aria-hidden="true"></i>
                </IonAvatar> }
                <IonLabel>
                    <h2 className="fw-bold">{firstKey}</h2>
                    {subCats}
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

export default PreProducts;
