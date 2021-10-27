import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react'; 
import React, {useCallback, useEffect} from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import { useDispatch, useSelector } from 'react-redux';
import * as searchActions from '../../../store/reducers/search';
import * as uiActions from '../../../store/reducers/ui';
import { SearchProps } from '../../../interfaces/Common';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';
import ViewRepresentatives from "./ViewRepresentatives";

const CompanyResults: React.FC<SearchProps> = (props: any) => {
  const dispatch = useDispatch();
  const { apiBaseURL, basename } = lfConfig;
  const location = useSelector( (state:any) => state.auth.location);
  const companyResults = useSelector( (state:any) => state.search.companyResults);

  const mainSearchSettings = { company_name: '' };
  const { company_name } = (props.location && props.location.state)? props.location.state : mainSearchSettings;
  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(searchActions.setCompanyResults({ data: res.data }));
    }else{
      dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }
    dispatch(uiActions.setShowLoading({ loading: false }));
  }, [dispatch]);

  useEffect(() => { // console.log("Meow", key , type , display);
    if(company_name ){
      dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'company_search',
        location,
        keyword: company_name
      };
      CoreService.onPostFn('search', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, company_name, location]);

  // if(!props.location || !props.location.state){
  //   return <Redirect to="/" />;
  // }

  return (
    <IonPage className="search-page">
      <IonContent>
      { companyResults && companyResults.length > 0 && <IonCard className="card-center my-4">
        <IonCardHeader color="titlebg">
            <IonCardTitle className="card-custom-title ion-text-capitalize">Company Search Results</IonCardTitle>
        </IonCardHeader>

        <IonCardContent className="px-0 px-sm-2">
        { companyResults.map((item: any) => { 
            const logoImage = (Object.keys(item).length > 0 && item.company_logo) ? `${apiBaseURL}uploads/member/${item.mem_id}/${CommonService.getThumbImg(item.company_logo)}` : `${basename}/assets/img/placeholder.png`;
            return (
            <IonCard className="mt-3" key={nanoid()}>
                <IonCardContent className="px-0 px-sm-2">
                <IonGrid className="mb-3 p-0">
                    <IonRow className="res-item">
                    <IonCol sizeSm="4" >
                        <div className="profile-logo mr-3 pb-2 pl-2">
                        <img src={logoImage} alt="Company Logo" />
                        </div>
                        { (!isPlatform('desktop')) && <>
                        < ViewRepresentatives reps={item.reps} />
                        </>}
                    </IonCol>
                    <IonCol sizeMd="4" sizeXl="4" className="px-3">
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
                    
                    { isPlatform('desktop') && <IonCol className="pl-3">
                        < ViewRepresentatives reps={item.reps} />
                    </IonCol> }
                    </IonRow>
                </IonGrid>
                </IonCardContent>
            </IonCard>)}
            )}
            <NoData dataArr={companyResults} htmlText="No results found." />
        </IonCardContent>
        </IonCard>}
      </IonContent>
    </IonPage>
  );
};

export default React.memo(CompanyResults);
