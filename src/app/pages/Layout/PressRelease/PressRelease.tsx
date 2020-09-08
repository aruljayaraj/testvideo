import { IonContent, IonPage, IonAvatar, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText, IonRouterLink, IonGrid, IonRow, IonCol } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns'
import './PressRelease.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as prActions from '../../../store/reducers/dashboard/pr';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';

const PressRelease: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const loadingState = useSelector( (state:any) => state.ui.loading);
  const pr = useSelector( (state:any) => state.pr.pressRelease);
  const { apiBaseURL, basename } = lfConfig;
  let { id } = useParams();

  // Press Release deafult to load callback
  const onPrBuscatCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
        dispatch(prActions.setPressRelease({ data: res.data }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => {
    if( id ){
      dispatch(uiActions.setShowLoading({ loading: true }));
        CoreService.onPostFn('pr_update', {
            action: 'get_press_release', 
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id
        }, onPrBuscatCb);
    }
  }, [dispatch, id, authUser, onPrBuscatCb]);

  const prImage = ( pr && Object.keys(pr).length > 0 && pr.pr_image) ? `${apiBaseURL}uploads/member/${pr.pr_mem_id}/${pr.pr_image}` : `${basename}/assets/img/placeholder.png`;

  return (
    <IonPage className="press-release-page">
      { pr && Object.keys(pr).length > 0 && 
        <IonContent>
          <IonCard className="card-center mt-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle > 
                  {pr.pr_name}
                  { +(pr.pr_active) === 0 && pr.pr_mem_id === authUser.ID &&
                  <IonRouterLink color="greenbg" href={`${basename}/layout/add-press-release/${pr.pr_id}/${pr.pr_mem_id}/1`} className="float-right router-link-anchor">
                    <i className="fa fa-pencil green cursor" aria-hidden="true"></i>
                  </IonRouterLink>}
                </IonCardTitle>
                <IonText className="mt-2 fs-12" color="medium">{ format(new Date(pr.pr_date), 'MMM dd, yyyy') }</IonText>
                { authUser.ID === pr.pr_mem_id && 
                  <IonText className="fs-12" color={ +(pr.pr_active) === 1? 'success': 'danger'}> { +(pr.pr_active) === 1? '(Active)': '(Pending)'}</IonText>
                }
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
                    { pr.buscats && pr.buscats.length > 0 &&  pr.buscats.map((item: any, index: number)=> { 
                      return (<IonItem lines="none" key={index}>
                        <IonAvatar slot="start" color="greenbg">
                            <i className="fa fa-chevron-right fa-lg green" aria-hidden="true"></i>
                        </IonAvatar>
                        <IonLabel>
                            <h2>{item.catname}</h2>
                            <h3><IonText color="medium">{item.sub_catname}</IonText></h3>
                            <p><strong>Keywords:</strong> {item.keywords}</p>
                        </IonLabel>
                    </IonItem>) }) }
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
              <div className="reps-container">
                { pr.reps && pr.reps.length > 0 &&  pr.reps.map((item: any, index: number)=> { 
                  const repImage = (item.profile_image) ? `${apiBaseURL}uploads/member/${pr.pr_mem_id}/${item.profile_image}` : `${basename}/assets/img/avatar.svg`;
                  return (
                    <div key={index}>
                      <IonRouterLink href={`${basename}/profile/${item.mem_id}/${item.rep_id}`}>
                        <IonAvatar color="greenbg">
                          <img src={repImage} alt={`${item.firstname} ${item.lastname}`}/>
                        </IonAvatar>
                        <p className="mb-0"><IonText color="dark" className="mt-2" key={index}> {`${item.firstname} ${item.lastname}`}</IonText></p>
                      </IonRouterLink>
                    </div>
                  ) 
                }) }
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
      }
      { !pr && !loadingState.showLoading && 
        <p className="py-5 px-3">
          <IonText color="warning">No Press Release found.</IonText>
        </p>
      }
    </IonPage>
  );
};

export default PressRelease;
