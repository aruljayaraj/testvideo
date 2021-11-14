import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonFooter, IonGrid, IonModal, IonRouterLink, IonRow } from '@ionic/react'; 
import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';
import ReportModal from '../../../components/Modal/ReportModal';
interface Props{
  region: string
}

const RegionNonMemResults: React.FC<Props> = ({ region }) => {
  const nonMemResults = useSelector( (state:any) => state.search.finalResults[region]); console.log(nonMemResults);
  const { apiBaseURL, basename } = lfConfig;
  const [isLocalOpen, setIsLocalOpen] = useState(true);
  const [showReportModal, setShowReportModal] = useState({isOpen: false, memID: '', formID: '', type: 'nonMember' });
  /*const onListSelect = (item: any) => { console.log(item);
    if( currentKeyword.length > 2 ){
      setRedirectData({ ...redirectData, status: true, data: { ...searchFilter, keyword: currentKeyword, display: item.display, type: item.type } });
      setTimeout(() => {
        props.setSearchModal(false);
      }, 1000)
      
    }
  }*/
  return (<>
    { nonMemResults && nonMemResults.length > 0 && <IonCard className="card-center my-4">
    <IonCardHeader color="titlebg">
        <IonCardTitle className="card-custom-title ion-text-capitalize">{`${region === 'localNonMem'? 'Your Local-First Business Listing':'Your Regional Supplier' }(s)`} 
          <i className={`ion-float-right gray cursor fa ${isLocalOpen? 'fa-chevron-down': 'fa-chevron-up'}`} aria-hidden="true" onClick={e => setIsLocalOpen(!isLocalOpen)}></i>
        </IonCardTitle>
    </IonCardHeader>

    { isLocalOpen && <IonCardContent className="px-0 px-sm-2 nm-container-wrap">
      { nonMemResults.map((item: any) => {  
          return (
          <IonCard className="nm-item mt-3" key={nanoid()}>
            <IonCardContent className="px-0 px-sm-2">
              <p><strong>{item.company_name}</strong></p> 
              { item.address1 && <p><i className="fa fa-address-card-o fa-lg green" aria-hidden="true"></i> {item.address1},</p> }
              { item.address2 && <p>{item.address2},</p> }
              { item.city && <p>{`${item.city}, ${item.state},`}</p> }
              { item.country && <p>{`${item.country} - ${item.postal}`}</p> }
              { item.phone && <p> 
                <i className="fa fa-phone fa-lg green" aria-hidden="true"></i> 
                <a className="gray-medium" href={`tel:${item.phone}`}> {`${item.phone}`}</a>
                </p>}
              { item.fax && <p className="gray-medium"><i className="fa fa-fax fa-lg green" aria-hidden="true"></i> {`${item.fax}`}</p> }
              <p className="mt-2"><IonRouterLink className="cursor" onClick={() => setShowReportModal({ ...showReportModal, isOpen: true, memID: item.mem_id, formID:item.id })}>Report Profile</IonRouterLink></p>
            </IonCardContent>
          </IonCard>)}
        )}
        <NoData dataArr={nonMemResults} htmlText="No results found." />
      </IonCardContent>} 
    </IonCard>}
    <IonModal backdropDismiss={false} isOpen={showReportModal.isOpen} cssClass='my-custom-class'>
        { Object.keys(nonMemResults).length > 0 && <ReportModal
          showReportModal={showReportModal}
          setShowReportModal={setShowReportModal} />}
      </IonModal>
    </>
  );
};

export default RegionNonMemResults;
