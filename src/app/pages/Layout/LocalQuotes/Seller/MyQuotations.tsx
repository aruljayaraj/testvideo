import { IonContent, IonPage, IonActionSheet, IonText, IonPopover, IonIcon, IonButtons, IonButton, IonToolbar, IonTitle, IonModal} from '@ionic/react';
import React, {useCallback, useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { close, pencilOutline, archiveOutline, trashOutline, removeCircleOutline } from 'ionicons/icons';
import { isPlatform } from '@ionic/react';
import '../LocalQuotes.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import CoreService from '../../../../shared/services/CoreService';
import QuotationContent from './QuotationContent'; 
import ListSkeleton from '../../../../components/Skeleton/ListSkeleton';
import NoData from '../../../../components/Common/NoData';
import DeleteModal from '../../../../components/Modal/DeleteModal';

const MyQuotations: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const skeleton = useSelector( (state:any) => state.ui.skeleton);
  const authUser = useSelector( (state:any) => state.auth.data.user);
  const qts = useSelector( (state:any) => state.qq.quotations);
  // const [showAlert, setShowAlert] = useState({status: false, id: '', mem_id: '' });
  const [showActionSheet, setShowActionSheet] = useState<any>({status: false, qt: null});
  const [showPopover, setShowPopover] = useState<any>({status: false, qq: null});
  const [showDeleteModal, setShowDeleteModal] = useState({isOpen: false, id: null, mem_id: null, rfqType: '', qqType: ''});
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
        action: 'get_seller_quotations',
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
  // For Delete
  const onDeleteFn = (id: number, mem_id: number) => {
    dispatch(uiActions.setShowSkeleton({ skeleton: true }));
    const fd = {
        action: 'qq_delete',
        rfqType: rfqType,
        memID: mem_id,
        formID: id,
        qqType: 'seller'
    };
    CoreService.onPostFn('qq_update', fd, onCommonCb);
  }
  if(
    showActionSheet.qt && 
    Object.keys(showActionSheet.qt).length > 0 && 
    ![3,4,5,6].includes(parseInt(showActionSheet.qt.is_active)) &&
    showActionSheet.qt.localquote && 
    Object.keys(showActionSheet.qt.localquote).length > 0 &&
    ![3,4,5,6].includes(parseInt(showActionSheet.qt.localquote.is_active)) &&
    +(showActionSheet.qt.localquote?.is_deleted) === 0
  ){
    actionsheetButtons.push({
      text: 'Edit',
      icon: pencilOutline,
      handler: () => {
        console.log('Edit clicked');
        history.push(`/layout/quotation/${rfqType}/${showActionSheet.qt.localquote.id}/${showActionSheet.qt.localquote.mem_id}/${showActionSheet.qt.id}/1`);
      }
    }, {
      text: 'Withdraw',
      role: 'destructive',
      icon: removeCircleOutline,
      handler: () => {
        setShowDeleteModal({isOpen: true, id: showActionSheet.qt.id, mem_id: showActionSheet.qt.mem_id, rfqType: rfqType, qqType: 'seller'});
      }
    });
  }
  if(showActionSheet.qt && Object.keys(showActionSheet.qt).length > 0 && ([3,4,5,6].includes(parseInt(showActionSheet.qt.is_active)) || +(showActionSheet.qt.localquote?.is_deleted) === 1)){
    actionsheetButtons.push({
      text: 'Move to Archive',
      icon: archiveOutline,
      handler: () => {
        onMoveArchiveFn( +(showActionSheet.qt.id), +(showActionSheet.qt.mem_id));
      }
    });
  }
  if(showActionSheet.qt && Object.keys(showActionSheet.qt).length > 0 && ([0,6].includes(parseInt(showActionSheet.qt.is_active)) || +(showActionSheet.qt.localquote?.is_deleted) === 1)){
    actionsheetButtons.push({
      text: 'Delete',
      icon: trashOutline,
      handler: () => {
        onDeleteFn( +(showActionSheet.qt.id), +(showActionSheet.qt.mem_id));
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
        <IonTitle className="page-title">My Quotations</IonTitle>
      </IonToolbar>
      { !skeleton.showSkeleton && qts ? ( 
        <IonContent>
          { qts.map((qt: any, index: number) => {
            return (<QuotationContent 
              qt={qt} 
              key={index} 
              setShowActionSheet={setShowActionSheet} 
              setShowPopover={setShowPopover}
              setShowDeleteModal={setShowDeleteModal}
              />)
          })} 
          <NoData dataArr={qts} htmlText={`No quotations found.`} />
          
          <IonActionSheet
            isOpen={showActionSheet.status}
            onDidDismiss={() => setShowActionSheet({status: false, qt: null})}
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

      <IonModal isOpen={showDeleteModal.isOpen} cssClass='my-custom-class'>
          { qts && Object.keys(qts).length > 0 && showDeleteModal.isOpen === true &&  <DeleteModal
            title="Withdraw Quotation"
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal} 
            action="quotation_withdrawn"
          /> }
      </IonModal>
    </IonPage>
  );
};

export default MyQuotations;
