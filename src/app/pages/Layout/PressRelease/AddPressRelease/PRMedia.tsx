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
import '../PressRelease.scss';

import * as uiActions from '../../../../store/reducers/ui';
import * as prActions from '../../../../store/reducers/dashboard/pr';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import ImageModal from '../../../../components/Image/ImageModal';
import PRStepInd from './PRStepInd';
import PRPreviewModal from './PRPreviewModal';

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
    prID: ''
}

const PRMedia: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const [showImageModal, setShowImageModal] = useState(initialValues);
    const [prPreviewModal, setPrPreviewModal] = useState(initPreviewValues);
    const [addPR, setAddPR] = useState({ status: false, memID: '', ID: '' });
    const { apiBaseURL, basename } = lfConfig;
    let { id } = useParams<any>();

    const imageModalFn = (title: string, actionType: string) => {
        setShowImageModal({ 
            ...showImageModal, 
            isOpen: true,
            title: title,
            actionType: actionType,
            memId: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            frmId: (pr && Object.keys(pr).length > 0)? pr.pr_id: ''
        });
    }
    const previewModalFn = () => {
        setPrPreviewModal({ 
            ...showImageModal,
            isOpen: true,
            memID: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            prID: (pr && Object.keys(pr).length > 0)? pr.pr_id: ''
        });
    }
    const prImage = ( pr && Object.keys(pr).length > 0 && pr.pr_image) ? `${apiBaseURL}uploads/member/${pr.pr_mem_id}/${pr.pr_image}` : `${basename}/assets/img/placeholder.png`;

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddPR({ status: true, memID: res.data.pr_mem_id, ID: res.data.pr_id  });
            dispatch(prActions.setPressRelease({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setAddPR]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'pr_update_activate',
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id,
            isActive: 1
        };
        CoreService.onPostFn('pr_update', fd, onCallbackFn);
    }

    if( addPR.status  ){
        return <Redirect to={`/layout/press-releases`} />;
    }

    return (<>
        { pr && Object.keys(pr).length > 0 &&
        <>
        <PRStepInd />
        <IonCard className="card-center mt-4">
            
            <IonCardContent>
                <IonRow>
                    <IonCol className="">
                        <IonCardTitle className="text-center fs-18">
                            <span>Upload Supporting Media</span>
                        </IonCardTitle>
                        <IonList>
                            <IonItem className="profile-logo-wrap p-0" lines="none" onClick={() => imageModalFn('Upload Supporting Media', 'press_release')}>
                                <div className="profile-logo">
                                    <img src={prImage} alt="Press Release Media"/>
                                    <i className="fa fa-pencil fa-lg edit green cursor" aria-hidden="true"></i>
                                </div>
                            </IonItem>
                        </IonList>
                    </IonCol>
                    
                </IonRow>
                { pr && Object.keys(pr).length > 0 && 
                <>
                    <IonButton color="warning" 
                        onClick={() => previewModalFn()}
                        className="ion-margin-top mt-4 mb-3 float-left">
                        Preview
                    </IonButton>
                    <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" onClick={onSubmit}>
                        Submit
                    </IonButton>
                </>    
                }
                
            </IonCardContent>
        </IonCard>
        </>}
        <IonModal backdropDismiss={false} isOpen={showImageModal.isOpen} cssClass='view-modal-wrap'>
            { pr && Object.keys(pr).length > 0 && showImageModal.isOpen === true &&  <ImageModal
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal} 
           /> }
        </IonModal>
        <IonModal backdropDismiss={false} isOpen={prPreviewModal.isOpen} cssClass='view-modal-wrap'>
            { pr && Object.keys(pr).length > 0 && prPreviewModal.isOpen === true &&  <PRPreviewModal
            prPreviewModal={prPreviewModal}
            setPrPreviewModal={setPrPreviewModal} 
           /> }
        </IonModal>
    </>);
};
  
export default PRMedia;
  