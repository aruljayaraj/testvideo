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
  title: string,
  results: any
}

const RegionNonMemResults: React.FC<Props> = ({ title, results }) => {
  // const nonMemResults = useSelector( (state:any) => state.search.finalResults[region]);
  const [isLocalOpen, setIsLocalOpen] = useState(true);
  const [showReportModal, setShowReportModal] = useState({isOpen: false, memID: '', formID: '', type: 'nonMember' });
  
  return (<>
    { results && results.length > 0 && <IonCard className="card-center my-4">
    <IonCardHeader color="titlebg">
        <IonCardTitle className="card-custom-title ion-text-capitalize">{title} 
          <i className={`ion-float-right gray cursor fa ${isLocalOpen? 'fa-chevron-down': 'fa-chevron-up'}`} aria-hidden="true" onClick={e => setIsLocalOpen(!isLocalOpen)}></i>
        </IonCardTitle>
    </IonCardHeader>

    { isLocalOpen && <IonCardContent className="px-0 px-sm-2 nm-container-wrap">
      { results.map((item: any) => {  
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
        <NoData dataArr={results} htmlText="No results found." />
      </IonCardContent>} 
    </IonCard>}
    <IonModal backdropDismiss={false} isOpen={showReportModal.isOpen} className='my-custom-class'>
        { Object.keys(results).length > 0 && <ReportModal
          showReportModal={showReportModal}
          setShowReportModal={setShowReportModal} />}
      </IonModal>
    </>
  );
};

export default RegionNonMemResults;
