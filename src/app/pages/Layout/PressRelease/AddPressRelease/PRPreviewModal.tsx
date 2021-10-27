import { IonContent, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonButton, IonGrid, IonRow, IonCol, IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle } from '@ionic/react';
import React, {useCallback, useEffect} from 'react';
import { isPlatform } from '@ionic/react';
import { close } from 'ionicons/icons';
import '../PressRelease.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as prActions from '../../../../store/reducers/dashboard/pr';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import CommonService from '../../../../shared/services/CommonService';
import BuscatsList from '../../../../components/Common/BuscatsList';
import ContactsList from '../../../../components/Common/ContactsList';

interface Props {
    prPreviewModal: any,
    setPrPreviewModal: Function,
}

const PRPreviewModal: React.FC<Props> = ({ prPreviewModal, setPrPreviewModal }) => {
    const dispatch = useDispatch();
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const { apiBaseURL, basename } = lfConfig;
    let { memID, prID } = prPreviewModal;

    // Press Release deafult to load callback
    const onPrBuscatCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(prActions.setPressRelease({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch]);

    useEffect(() => {
        if( prID ){
        dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('pr_update', {
                action: 'get_press_release', 
                memID: memID,
                formID: prID
            }, onPrBuscatCb);
        }
    }, [dispatch, memID, prID, onPrBuscatCb]);

    const prImage = ( pr && Object.keys(pr).length > 0 && pr.pr_image) ? `${apiBaseURL}uploads/member/${pr.pr_mem_id}/${pr.pr_rep_id}/${pr.pr_image}` : `${basename}/assets/img/placeholder.png`;

    return (<>
        { pr && Object.keys(pr).length > 0 && 
        <>
        <IonHeader translucent>
            <IonToolbar color="greenbg">
                <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                    <IonButton onClick={() => setPrPreviewModal({
                        ...prPreviewModal, 
                        isOpen: false
                    })}>
                        <IonIcon icon={close} slot="icon-only"></IonIcon>
                    </IonButton>
                </IonButtons>
                <IonTitle>Press Release Preview</IonTitle>
            </IonToolbar>
            
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonCard className="preview-card card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title"> {pr.pr_name}</IonCardTitle>
                <IonText className="mt-2 fs-12" color="medium">{CommonService.dateFormat(pr.pr_date)}</IonText>
                <IonText className="fs-12" color={ +(pr.pr_active) === 1? 'success': 'danger'}> { +(pr.pr_active) === 1? '(Active)': '(Pending)'}</IonText>
            </IonCardHeader>
            <IonCardContent className="pt-3">
              <IonGrid>
                <IonRow>
                  { pr.pr_image && 
                  <IonCol sizeMd="4" sizeXl="4" sizeXs="12" className="">
                    <img src={prImage} alt="Press Release Media" />
                  </IonCol> }
                  <IonCol sizeMd={ pr.pr_image? "8": "12" } sizeXs="12" className="">
                    <div className="pl-3">  { /* pt-sm-3 mt-sm-4 */}
                    { pr.pr_overview && <h2 className="mb-4"><strong>{pr.pr_overview}</strong></h2> }
                    { pr.pr_quote && <div className="quote mb-3">" {pr.pr_quote} "</div> }
                    { pr.buscats && pr.buscats.length > 0 && <BuscatsList buscats={pr.buscats} />}
                    {/* { pr.buscats && pr.buscats.length > 0 &&  pr.buscats.map((item: any, index: number)=> { 
                      return (<IonItem lines="none" key={index}>
                        <IonAvatar slot="start" color="greenbg">
                            <i className="fa fa-chevron-right fa-lg green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <h2>{item.catname}</h2>
                            <h3><IonText color="medium">{item.sub_catname}</IonText></h3>
                            <p><strong>Keywords:</strong> {item.keywords}</p>
                        </IonLabel>
                    </IonItem>) }) } */}
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
            {/* <IonCardHeader color="titlebg"><strong>Contacts:</strong>  
            { pr.reps && pr.reps.length > 0 &&  pr.reps.map((item: any, index: number)=> { 
                return (
                  <IonText className="font-weight-bold" key={index}> {`${item.firstname} ${item.lastname} ${ (pr.reps.length > index+1)? ", ": "" } `}</IonText>
                ) }) }
            </IonCardHeader> */}
          </IonCard>  
        </IonContent> 
      </>}
    </>);
};
  
export default PRPreviewModal;
  