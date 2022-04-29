import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/react'; 
import React, {useCallback, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import './PressReleases.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';
import * as prActions from '../../store/reducers/dashboard/pr';
import { lfConfig } from '../../../Constants';
import CoreService from '../../shared/services/CoreService';
import CommonService from '../../shared/services/CommonService';
import BuscatsList from '../../components/Common/BuscatsList';
import ContactsList from '../../components/Common/ContactsList';

const HomePR: React.FC = () => {
  const dispatch = useDispatch();
  const loadingState = useSelector( (state:any) => state.ui.loading);
  const pr = useSelector( (state:any) => state.pr.pressRelease);
  const { apiBaseURL, basename } = lfConfig;
  let { id } = useParams<any>();
  const [imgloading, setImgLoading] = useState(true);

  // Press Release deafult to load callback
  const onPrBuscatCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(prActions.setPressRelease({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('pr_update', {
            action: 'get_press_release',
            actionFrom: 'home',
            formID: id
        }, onPrBuscatCb);
    }
  }, [dispatch, id, onPrBuscatCb]);

  const imageLoaded = () => {
      setImgLoading(false);
  }

  const prImage = ( pr && Object.keys(pr).length > 0 && pr.pr_image) ? `${apiBaseURL}uploads/member/${pr.pr_mem_id}/${pr.pr_rep_id}/${pr.pr_image}` : `${basename}/assets/img/placeholder.png`;

  return (
    <IonPage className="press-release-page">
      { pr && Object.keys(pr).length > 0 && 
        <IonContent>
          <IonCard className="card-center my-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title"> 
                  {pr.pr_name}
                </IonCardTitle>
                <IonText className="mt-2 fs-12" color="medium">{CommonService.dateFormat(pr.pr_date)} </IonText>
            </IonCardHeader>
            <IonCardContent className="pt-3">
              <IonGrid>
                <IonRow>
                  { pr.pr_image && 
                  <IonCol sizeMd="4" sizeXl="4" sizeXs="12" className="">
                    { imgloading && <IonSpinner name="dots" /> }
                    <img src={prImage} alt="Press Release Media" onLoad={imageLoaded} />
                  </IonCol> }
                  <IonCol sizeMd={ pr.pr_image? "8": "12" } sizeXs="12" className="">
                    <div className="pl-3">  { /* pt-sm-3 mt-sm-4 */}
                      { pr.pr_overview && <h2 className="mb-4"><strong>{pr.pr_overview}</strong></h2> }
                      { pr.pr_quote && <div className="quote mb-3">" {pr.pr_quote} "</div> }
                      { pr.buscats && pr.buscats.length > 0 && <BuscatsList buscats={pr.buscats} />}
                    </div>
                  </IonCol>
                </IonRow>
                { pr.pr_desc && <IonRow className="pt-3">
                  <IonCol>
                    <div className="external_text" dangerouslySetInnerHTML={{ __html: pr.pr_desc }} ></div>
                  </IonCol>
                </IonRow>}
              </IonGrid>    
            </IonCardContent>
            <IonCardHeader color="titlebg">
              <h3 className="mt-0 font-weight-bold fs-16">Contacts:</h3> 
              <div className="d-flex flex-row reps-container">
                { pr.reps && pr.reps.length > 0 && <ContactsList contacts={pr.reps} />}
              </div>  
            </IonCardHeader>
          </IonCard>  
        </IonContent> 
      }
      { !pr && !loadingState.showLoading && 
        <p className="py-5 px-3">
          <IonText color="warning">No Press Release found.</IonText>
        </p>
      }
    </IonPage>
  );
};

export default HomePR;
