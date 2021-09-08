import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonGrid, IonRow, IonCol } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './LocalDeals.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';
import * as dealActions from '../../store/reducers/dashboard/deal';
import { lfConfig } from '../../../Constants';
import CoreService from '../../shared/services/CoreService';
import CommonService from '../../shared/services/CommonService';
import BuscatsList from '../../components/Common/BuscatsList';
import ContactsList from '../../components/Common/ContactsList';
import NoData from '../../components/Common/NoData';

const LocalDeal: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const dd = useSelector( (state:any) => state.deals.localDeal);
  const { apiBaseURL, basename } = lfConfig;
  let { id } = useParams<any>();

  // LocalDeal deafult to load callback
  const onCbFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(dealActions.setDeal({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('deal_update', {
            action: 'get_deal',
            actionFrom: 'home',
            formID: id
        }, onCbFn);
    }
  }, [dispatch, id, authUser, onCbFn]);

  const ddImage = ( dd && Object.keys(dd).length > 0 && dd.image) ? `${apiBaseURL}uploads/member/${dd.mem_id}/${dd.image}` : `${basename}/assets/img/placeholder.png`;
  return (
    <IonPage className="deals-page">
      
      { dd && Object.keys(dd).length > 0 && 
        
        <IonContent>
          <IonCard className="card-center my-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18"> 
                  {dd.name}
                </IonCardTitle>
                <IonText className="mt-2 fs-12" color="medium">{CommonService.dateFormat(dd.sdate)} </IonText> 
              </IonCardHeader>
            <IonCardContent className="pt-3">
              <IonGrid>
                <IonRow>
                  { dd.image && 
                  <IonCol sizeMd="4" sizeXl="4" sizeXs="12" className="">
                    <img src={ddImage} alt="LocalDeal Media" className="rounded" />
                  </IonCol> }
                  <IonCol sizeMd={ dd.image? "8": "12" } sizeXs="12" className="">
                    <div className="pl-3">  { /* pt-sm-3 mt-sm-4 */}
                      { dd.price && <h2 className="mb-2"><strong>Price: {`$${dd.price}`}</strong></h2> }
                      { dd.sdate && <div className="quote mb-2">{CommonService.dateFormat(dd.sdate)} - {CommonService.dateFormat(dd.edate)}</div> }
                      { dd.buscats && dd.buscats.length > 0 && <BuscatsList buscats={dd.buscats} />}
                    </div>
                  </IonCol>
                </IonRow>
                { dd.description && <IonRow className="pt-3">
                  <IonCol>
                    <div className="external_text" dangerouslySetInnerHTML={{ __html: dd.description }} ></div>
                  </IonCol>
                </IonRow>}
              </IonGrid>    
            </IonCardContent>
            <IonCardHeader color="titlebg">
              <h3 className="mt-0 font-weight-bold fs-16">Contacts:</h3> 
              <div className="d-flex flex-row reps-container">
                { dd.reps && dd.reps.length > 0 && <ContactsList contacts={dd.reps} />}
              </div>  
            </IonCardHeader>
          </IonCard>  
        </IonContent> 
      }
      <NoData dataArr={dd} htmlText="No Local Deal found." />
    </IonPage>
  );
};

export default LocalDeal;
