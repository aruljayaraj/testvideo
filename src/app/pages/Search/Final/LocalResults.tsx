import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonItem, IonLabel, IonList, IonRouterLink, IonRow } from '@ionic/react'; 
import React from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';

const LocalResults: React.FC = () => {
  const localResults = useSelector( (state:any) => state.search.finalResults.local); console.log(localResults);
  const { apiBaseURL, basename } = lfConfig;
  const onListSelect = (item: any) => { console.log(item);
    /*if( currentKeyword.length > 2 ){
      setRedirectData({ ...redirectData, status: true, data: { ...searchFilter, keyword: currentKeyword, display: item.display, type: item.type } });
      setTimeout(() => {
        props.setSearchModal(false);
      }, 1000)
      
    }*/
  }
  return (<>
     { localResults && localResults.length > 0 && <IonCard className="card-center my-4">
    <IonCardHeader color="titlebg">
        <IonCardTitle className="fs-18">Local Supplier(s) 
        
        </IonCardTitle>
    </IonCardHeader>

    <IonCardContent>
        {/* <IonList> */}
        { localResults.map((item: any) => { 
            const logoImage = (Object.keys(item).length > 0 && item.company_logo) ? `${apiBaseURL}uploads/member/${item.mem_id}/${item.company_logo}` : `${basename}/assets/img/placeholder.png`;
            return (
            <IonCard className="mt-3" key={nanoid()}>
              <IonCardContent>
              <IonGrid className="mb-3">
                <IonRow>
                  <IonCol style={{ borderRight: "1px solid #ccc" }}>
                    <div className="profile-logo mr-3">
                      <img src={logoImage} alt="Company Logo"/>
                    </div>
                  </IonCol>
                  <IonCol sizeMd="4" sizeXl="4" className="px-3" style={{ borderRight: "1px solid #ccc" }}>
                    <p><strong>{item.company_name}</strong></p>
                    { item.address1 && <p><i className="fa fa-address-card-o fa-lg green" aria-hidden="true"></i> {item.address1},</p> }
                    { item.address2 && <p>{item.address2},</p> }
                    { item.city && <p>{`${item.city}, ${item.state},`}</p> }
                    { item.country && <p>{`${item.country} - ${item.postal}`}</p> }
                    { item.phone && <p> 
                      <i className="fa fa-phone fa-lg green" aria-hidden="true"></i> 
                      <a className="gray-medium" href={`tel:${item.phone_code}${item.phone}`}> {`${item.phone_code} ${item.phone}`}</a>
                      </p>}
                    { item.fax && <p className="gray-medium"><i className="fa fa-fax fa-lg green" aria-hidden="true"></i> {`${item.fax}`}</p> }
                  </IonCol>
                  <IonCol className="px-3" style={{ borderRight: "1px solid #ccc" }}>
                      <p>Resources: <span className="text-bold">{item.res_count}</span></p>
                      <p>Deals: <span className="text-bold">{item.deal_count}</span></p>
                  </IonCol>
                  <IonCol className="px-3">
                    <p>View Representatives</p>
                    <p><IonRouterLink href={`${basename}/profile/${item.mem_id}/${item.id}`}>{`${item.firstname} ${item.lastname}`}</IonRouterLink></p>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>)}
        )}
        {/* </IonList> */}
        <NoData dataArr={localResults} htmlText="No results found." />
    </IonCardContent> 
    </IonCard>}
    </>
  );
};

export default LocalResults;
