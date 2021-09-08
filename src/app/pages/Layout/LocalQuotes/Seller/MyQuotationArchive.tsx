import { IonContent, IonPage, IonActionSheet, IonText, IonPopover, IonIcon, IonButtons, IonButton, IonToolbar, IonTitle } from '@ionic/react';
import React, {useCallback, useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { close, pencilOutline, archiveOutline, trashOutline } from 'ionicons/icons';
import { isPlatform } from '@ionic/react';
import '../LocalQuotes.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import CoreService from '../../../../shared/services/CoreService';
import QuotationContent from './QuotationContent'; 
import ListSkeleton from '../../../../components/Skeleton/ListSkeleton';
import NoData from '../../../../components/Common/NoData';
import { nanoid } from 'nanoid';

const MyQuotationArchive: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const skeleton = useSelector( (state:any) => state.ui.skeleton);
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const qts = useSelector( (state:any) => state.qq.quotations);
  const [showActionSheet, setShowActionSheet] = useState<any>({status: false, qq: null});
  const [showPopover, setShowPopover] = useState<any>({status: false, qq: null});
  const [showDeleteModal, setShowDeleteModal] = useState({isOpen: false, id: null, mem_id: null, rfqType: ''});
  let { rfqType } = useParams<any>();
  let actionsheetButtons: any = [];

  const onCallbackFn = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(qqActions.setSQs({ data: res.data }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
  }, [dispatch]);

  useEffect(() => { 
    if( authUser && authUser.ID ){
      dispatch(uiActions.setShowSkeleton({ skeleton: true }));
      // dispatch(uiActions.setShowLoading({ loading: true }));
      const data = {
        action: 'get_seller_quotations_archive',
        rfqType: rfqType,
        memID: authUser.ID
      };
      CoreService.onPostFn('qq_update', data, onCallbackFn);
    }
  }, [dispatch, onCallbackFn, authUser, rfqType]); 

  const onCommonCb = useCallback((res: any) => {
    if(res.status === 'SUCCESS'){
      dispatch(qqActions.setSQs({ data: res.data }));
    }
    dispatch(uiActions.setShowSkeleton({ skeleton: false }));
    dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
  }, [dispatch]);

  // For Archive
  const onMoveArchiveFn = (id: number, mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'quotation_move_archive',
        rfqType: rfqType,
        memID: mem_id,
        formID: id
    };
    CoreService.onPostFn('qq_update', fd, onCommonCb);
  } 
  // For Awarded
  const onAwardedFn = (id: number, mem_id: number, qq_id: number, qq_mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'quotation_awarded',
        rfqType: rfqType,
        memID: mem_id, // Seller QQ Mem ID
        formID: id, // Seller QQ ID
        bqMemID: qq_mem_id, // Buyer QQ Mem ID
        bqID: qq_id, // Buyer QQ ID
    };
    CoreService.onPostFn('qq_update', fd, onCommonCb);
  } 
  if(showActionSheet.qq && Object.keys(showActionSheet.qq).length > 0 && ![3,4,5,6].includes(parseInt(showActionSheet.qq.is_active))){
    actionsheetButtons.push({
      text: 'Edit',
      icon: pencilOutline,
      handler: () => {
        console.log('Edit clicked');
        history.push(`/layout/add-localquote/${rfqType}/${showActionSheet.qq.id}/${showActionSheet.qq.mem_id}/1`);
      }
    }, {
      text: 'Delete',
      role: 'destructive',
      icon: trashOutline,
      handler: () => {
        setShowDeleteModal({isOpen: true, id: showActionSheet.qq.id, mem_id: showActionSheet.qq.mem_id, rfqType: rfqType});
      }
    });
  }else if(showActionSheet.qq && Object.keys(showActionSheet.qq).length > 0 && [3,4,5,6].includes(parseInt(showActionSheet.qq.is_active))){
    actionsheetButtons.push({
      text: 'Move to Archive',
      icon: archiveOutline,
      handler: () => {
        onMoveArchiveFn( +(showActionSheet.qq.id), +(showActionSheet.qq.mem_id));
      }
    });
  }

  actionsheetButtons.push({
    text: 'Cancel',
    icon: close,
    role: 'cancel',
    handler: () => {}
  });

  return (
    <IonPage className="rfq-page mb-4">
      <IonToolbar>
        <IonTitle className="page-title">My Quotations Archive</IonTitle>
      </IonToolbar>
      { !skeleton.showSkeleton && qts ? ( 
        <IonContent>
          { qts.map((qt: any, index: number) => {
            return (<QuotationContent 
              qt={qt} 
              key={nanoid()} 
              // setShowActionSheet={setShowActionSheet} 
              setShowPopover={setShowPopover}
              // setShowDeleteModal={setShowDeleteModal}
              />)
          })} 
          <NoData dataArr={qts} htmlText={`No archive found.`} />
          
          <IonActionSheet
            isOpen={showActionSheet.status}
            onDidDismiss={() => setShowActionSheet({status: false, qq: null})}
            cssClass='my-custom-class'
            buttons={actionsheetButtons}
          >
        </IonActionSheet>
        <IonPopover
            isOpen={showPopover.status}
            cssClass='my-custom-class'
            onDidDismiss={e => setShowPopover({status: false, qq: null})}
          >
            <IonContent className="ion-padding">
              <IonToolbar color="greenbg">
                <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                  <IonButton onClick={() => setShowPopover({status: false, qq: null})}>
                    <IonIcon icon={close} slot="icon-only"></IonIcon>
                  </IonButton>
                </IonButtons> 
                <IonTitle>Rep Profile</IonTitle>
              </IonToolbar>
              {showPopover.qq && showPopover.qq.firstname && 
              <p>
                <IonText className="popover-text fw-bold">Supplier Name : </IonText> 
                <IonText className="popover-text">{`${showPopover.qq.firstname} ${showPopover.qq.lastname}`}</IonText>
              </p>}
              {showPopover.qq && showPopover.qq.company_name && 
              <p> 
                <IonText className="popover-text fw-bold">Company Name : </IonText> 
                <IonText className="popover-text">{showPopover.qq.company_name}</IonText>
              </p>}
            {showPopover.qq && showPopover.qq.address1 && 
              <p><IonText className="popover-text fw-bold">Address : </IonText> <IonText className="popover-text">{showPopover.qq.address1}
                {showPopover.qq.address2? `, ${showPopover.qq.address2}`: ''}
                {showPopover.qq.city? `, ${showPopover.qq.city}`: ''}
                {showPopover.qq.state? `, ${showPopover.qq.state}`: ''}
                {showPopover.qq.country? `, ${showPopover.qq.country}`: ''}</IonText></p>
              }
            {showPopover.qq && showPopover.qq.phone && 
              <p>
                <IonText className="popover-text fw-bold">Telephone : </IonText> 
                <IonText className="popover-text">{showPopover.qq.phone}</IonText>
              </p>}
            {showPopover.qq && showPopover.qq.fax && 
              <p>
                <IonText className="popover-text fw-bold">Fax : </IonText> 
                <IonText className="popover-text">{showPopover.qq.fax}</IonText>
              </p>}
            </IonContent>
          </IonPopover>
          
      </IonContent>) : ( <ListSkeleton /> )}

    </IonPage>
  );
};

export default MyQuotationArchive;
