import {
    IonItem,
    IonModal,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonRow,
    IonCol,
    IonButton
  } from '@ionic/react';
  
import React, { useState, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../Deals.scss';

import * as uiActions from '../../../../store/reducers/ui';
import * as dealActions from '../../../../store/reducers/dashboard/deal';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import ImageModal from '../../../../components/Image/ImageModal';
import StepInd from './StepInd';
import PreviewModal from './PreviewModal';

let initialValues = {
    isOpen: false,
    title: '',
    actionType: '', // new or edit
    memId: '',
    frmId: ''
};

let initPreviewValues ={
    isOpen: false,
    memID: '',
    ddID: ''
}

const DDMedia: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const dd = useSelector( (state:any) => state.deals.localDeal);
    const [showImageModal, setShowImageModal] = useState(initialValues);
    const [previewModal, setPreviewModal] = useState(initPreviewValues);
    const [addDeal, setAddDeal] = useState({ status: false, memID: '', id: '' });
    const { apiBaseURL, basename } = lfConfig;
    let { id } = useParams<any>();

    const imageModalFn = (title: string, actionType: string) => {
        setShowImageModal({ 
            ...showImageModal, 
            isOpen: true,
            title: title,
            actionType: actionType,
            memId: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            frmId: (dd && Object.keys(dd).length > 0)? dd.id: ''
        });
    }
    const previewModalFn = () => {
        setPreviewModal({ 
            ...showImageModal,
            isOpen: true,
            memID: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            ddID: (dd && Object.keys(dd).length > 0)? dd.id: ''
        });
    }
    const ddImage = ( dd && Object.keys(dd).length > 0 && dd.image) ? `${apiBaseURL}uploads/member/${dd.mem_id}/${dd.image}` : `${basename}/assets/img/placeholder.png`;

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddDeal({ status: true, memID: res.data.mem_id, id: res.data.id  });
            dispatch(dealActions.setDeal({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setAddDeal]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'dl_update_activate',
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id,
            isActive: true
        };
        CoreService.onPostFn('deal_update', fd, onCallbackFn);
    }

    if( addDeal.status  ){
        return <Redirect to={`/layout/deals/local-deals`} />;
    }

    return (<>
        { dd && Object.keys(dd).length > 0 &&
        <>
        <StepInd />
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <IonRow>
                    <IonCol className="">
                        <IonCardTitle className="text-center mb-3 fs-18">
                            <span>Upload Supporting Media</span>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-logo-wrap p-0" lines="none" onClick={() => imageModalFn('Upload Supporting Media', 'local_deal')}>
                                <div className="profile-logo">
                                    <img src={ddImage} alt="Deal Media"/>
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>
                            </IonItem>
                        </IonList>
                    </IonCol>
                    
                </IonRow>
                { dd && Object.keys(dd).length > 0 && 
                <>
                    <IonButton color="warning" 
                        onClick={() => previewModalFn()}
                        className="ion-margin-top mt-4 mb-3 float-left">
                        Preview
                    </IonButton>
                    { dd.image && 
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" onClick={onSubmit}>
                            Submit
                        </IonButton>
                    }
                </>    
                }
                
            </IonCardContent>
        </IonCard>
        </>}
        <IonModal backdropDismiss={false} isOpen={showImageModal.isOpen} cssClass='view-modal-wrap'>
            { dd && Object.keys(dd).length > 0 && showImageModal.isOpen === true &&  <ImageModal
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal} 
           /> }
        </IonModal>
        <IonModal backdropDismiss={false} isOpen={previewModal.isOpen} cssClass='view-modal-wrap'>
            { dd && Object.keys(dd).length > 0 && previewModal.isOpen === true &&  <PreviewModal
            previewModal={previewModal}
            setPreviewModal={setPreviewModal} 
           /> }
        </IonModal>
    </>);
};
  
export default DDMedia;
  