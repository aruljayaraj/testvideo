import { IonAvatar, IonItem, IonLabel, IonText, IonItemSliding, IonItemOptions, IonThumbnail, IonRouterLink, IonAlert, IonItemOption} from '@ionic/react';
import React, {useCallback, useState} from 'react';
import { useHistory } from "react-router-dom";
import { isPlatform } from '@ionic/react';
import './Deals.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../store/reducers/ui';
import * as dealActions from '../../../store/reducers/dashboard/deal';
import * as authActions from '../../../store/reducers/auth';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import { nanoid } from 'nanoid';

const LocalDealsUnpaid: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const unpaid = useSelector( (state:any) => state.deals.localDeals.unpaid);
  const { basename, LOCAL_DEAL } = lfConfig;
  const [showAlert, setShowAlert] = useState({status: false, id: '', mem_id: '' });

  const onDeleteCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(authActions.setDealsCountUpdate({ total: res.data.length }));
      const cusData = {
        deals: res.data,
        unpaid: res.unpaid
      }
      dispatch(dealActions.setDeals({ data: cusData }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);

  const onDeleteFn = (id: number, mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'delete_item_purchase',
        memID: mem_id,
        repID: authUser.repID,
        formID: id,
        action_type: LOCAL_DEAL
    };
    CoreService.onPostFn('item_purchase', fd, onDeleteCb);
  }

  const setAlert = useCallback((item) => {
    setShowAlert({status: true, id: item.id, mem_id: item.mem_id })
    // setCounter((counter) => counter + 1);
  }, []);

  const slideEdit = (item: any) => {
    history.push(`/layout/deals/buy-deal/${item.id}`);
  }

  return (<>
    { unpaid && unpaid.length > 0  &&  unpaid.map((item: any, index: number)=> {
        const ddImage = `${basename}/assets/img/placeholder.png`;
        return (<div key={nanoid()}>
            { (!isPlatform('desktop')) && 
            <IonItemSliding >
                <IonItem lines="inset" routerLink={`${basename}/layout/deals/buy-deal/${item.id}`}>
                    <IonAvatar slot="start" color="greenbg">
                        <img className="roundcorner" src={ddImage} alt="Local Deal Media"/>
                    </IonAvatar>
                    <IonLabel>
                        <h2>No Deal Name {index+1}</h2>
                        <p><b>$</b> {item.price}</p>
                        <p><IonText color="warning">Payment Pending</IonText></p>
                    </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                    <IonItemOption className="px-2" color="greenbg" onClick={() => slideEdit(item) } title="Buy">
                        <i className="fa fa-shopping-cart fa-lg green cursor" aria-hidden="true"></i>
                    </IonItemOption>
                    <IonItemOption color="warning" onClick={() => setShowAlert({status: true, id: item.id, mem_id: item.mem_id })}  title="Delete">
                        <i className="fa fa-trash fa-lg green cursor" aria-hidden="true"></i>
                    </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
            }
            { (isPlatform('desktop')) &&
            <IonItem lines="inset">
                <IonThumbnail slot="start" color="greenbg">
                    <IonRouterLink href={`${basename}/layout/deals/buy-deal/${item.id}`}>
                      <img className="roundcorner" src={ddImage} alt="LocalDeal Media"/>
                    </IonRouterLink>
                </IonThumbnail>
                <IonLabel>
                    <IonRouterLink color="dark" href={`${basename}/layout/deals/buy-deal/${item.id}`}>
                      <h2>{item.name? item.name: `No Deal Name ${index+1}`}</h2>
                    </IonRouterLink>
                    <p><b>$</b> {item.price}</p>
                    <IonText color="warning">Payment Pending</IonText>
                </IonLabel>

                <IonRouterLink className="router-link-anchor" slot="end" color="greenbg" onClick={() => slideEdit(item) } title="Buy">
                    <i className="fa fa-shopping-cart fa-lg green cursor" aria-hidden="true"></i>
                </IonRouterLink>
                <IonAvatar className="anchor-white-ellipsis" slot="end" color="greenbg" onClick={() => setAlert(item)} title="Trash">
                    <i className="fa fa-trash fa-lg green cursor" aria-hidden="true"></i>
                </IonAvatar>
            
            </IonItem>}
        </div>)
        })}  
        <IonAlert
            isOpen={showAlert.status}
            onDidDismiss={() => setShowAlert({status: false, id: '', mem_id: '' })}
            header={'Confirm!'}
            message={'Are you sure want to delete this Unpaid Deal?'}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'primary'
              },
              {
                text: 'Okay',
                cssClass: 'greenbg',
                handler: () => {
                  onDeleteFn( +(showAlert.id), +(showAlert.mem_id));
                }
              }
            ]}
          />
    </>
  );
};

export default LocalDealsUnpaid;
