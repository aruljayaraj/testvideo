import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react'; 
import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import CommonService from '../../../shared/services/CommonService';
import NoData from '../../../components/Common/NoData';
import ViewRepresentatives from "./ViewRepresentatives";
interface Props{
  btype: number,
  region: string
}

const RegionResults: React.FC<Props> = ({ btype, region }) => { 
  const localResults = useSelector( (state:any) => state.search.finalResults[region]);
  const { apiBaseURL, basename } = lfConfig;
  const [isLocalOpen, setIsLocalOpen] = useState(true);
  /*const onListSelect = (item: any) => { console.log(item);
    if( currentKeyword.length > 2 ){
      setRedirectData({ ...redirectData, status: true, data: { ...searchFilter, keyword: currentKeyword, display: item.display, type: item.type } });
      setTimeout(() => {
        props.setSearchModal(false);
      }, 1000)
      
    }
  }*/
  return (<>
    { localResults && localResults.length > 0 && <IonCard className="card-center my-4">
    <IonCardHeader color="titlebg">
        <IonCardTitle className="card-custom-title ion-text-capitalize">{`Your ${region} ${btype === 1 ? 'B2B Supplier': 'Consumer Supplier'}(s)`} 
          <i className={`ion-float-right gray cursor fa ${isLocalOpen? 'fa-chevron-down': 'fa-chevron-up'}`} aria-hidden="true" onClick={e => setIsLocalOpen(!isLocalOpen)}></i>
        </IonCardTitle>
    </IonCardHeader>

    { isLocalOpen && <IonCardContent className="px-0 px-sm-2">
      { localResults.map((item: any) => { 
          // console.log(item);
          const logoImage = (Object.keys(item).length > 0 && item.company_logo) ? `${apiBaseURL}uploads/member/${item.mem_id}/${CommonService.getThumbImg(item.company_logo)}` : `${basename}/assets/img/placeholder.png`;
          return (
          <IonCard className="mt-3" key={nanoid()}>
            <IonCardContent className="px-0 px-sm-2">
              <IonGrid className="mb-3 p-0">
                <IonRow className="res-item">
                  <IonCol sizeSm="3" >
                    <div className="profile-logo mr-3 pb-2 pl-2">
                      <img src={logoImage} alt="Company Logo"/>
                    </div>
                    { (!isPlatform('desktop')) && <>
                      < ViewRepresentatives reps={item.reps} />
                    </>}
                  </IonCol>
                  <IonCol sizeMd="5" sizeXl="5" className="px-3">
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
                  
                  { isPlatform('desktop') && <IonCol sizeSm="4" className="pl-3">
                    < ViewRepresentatives reps={item.reps} />
                  </IonCol> }
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>)}
        )}
        <NoData dataArr={localResults} htmlText="No results found." />
      </IonCardContent>} 
    </IonCard>}
    </>
  );
};

export default RegionResults;
