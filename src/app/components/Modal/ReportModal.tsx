import {
    IonItem, 
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonTextarea
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';

import CoreService from '../../shared/services/CoreService';
import { useDispatch } from 'react-redux';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../store/reducers/ui';

// Note 
/* isOpen: false,
    title: '', // Modal Title
    type: '', // 0 or 1 ==> (B2B or B2C)
    formType: '', //  Rep or Company or Resource
    actionType: '', // new or edit
    formId: '', // id or any resource id
    repId: '', // repprofile id 
    memId: '', // Member id
*/

interface Props {
    showReportModal: any,
    setShowReportModal: Function,
    //selectedItem: any
}

type FormInputs = {
    reason: string;
}


const ReportModal: React.FC<Props> = ({ showReportModal, setShowReportModal}) => {

    let { title, type, actionType, formType, formId, repId, memId } = showReportModal;
    // let { id, buscat_id: catId, catname, subBuscat_id: subcatId, sub_catname, keywords } = selectedItem || {};
    
    const dispatch = useDispatch();
    // const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [ category, setCategory ] = useState([]);
    const [ subCategory, setSubCategory ] = useState([]);
    let initialValues = {
        reason: ''
    };
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    
    // For Sub Category Change
    // const onSubCategoryChange = (st: number) => {
        // reset keywords if need
    // };

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowReportModal({ ...showReportModal, isOpen: false });
            if( formType === 'profile' ){
                
            }else if( formType === 'localDeal' ){
                
            }
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, showReportModal, setShowReportModal, formType, type]);
    const onSubmit = (data: any) => {
        if( data.reason ){
            dispatch(uiActions.setShowLoading({ loading: true }));
        
            const formData = {
                formId: formId,
                repId: repId,
                memId: memId,
                type: type,
                action: 'send_report',
                actionType: actionType,
                formType: formType,
                reason: data.reason
            }; //console.log(formData);
            CoreService.onPostFn('update_buscat', formData, onCallbackFn);
        }
    } 
    
    return (<>
    
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowReportModal({
                            ...showReportModal, 
                            isOpen: false
                        })}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (isPlatform('android') || isPlatform('ios')) &&  
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            <strong>Submit</strong>
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle> {title}</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent id="buscat-form-wrap" fullscreen className="ion-padding">
                <IonGrid>
                    <IonRow>    
                        <IonCol>
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Reason</IonLabel>
                                <Controller 
                                    name="reason"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonTextarea
                                            {...field}
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Reason is required"
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9,\- ]{2,250}$/i,
                                            message: "Invalid Keyword"
                                        }
                                    }}
                                />
                            </IonItem>
                            <p className="font-weight-light text-13">
                                <IonText color="medium">
                                    Reason must be less than 250 characters. 
                                </IonText>
                            </p>
                            <ErrorMessage
                                errors={errors}
                                name="reason"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                
                        </IonCol>
                    </IonRow>
                
                
                <div className="mt-4">           
                { (isPlatform('desktop')) && 
                    <>
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                            Submit
                        </IonButton>
                    </>
                }
                </div> 
                </IonGrid>
            </IonContent> 
        </form> 
    </>);
};
  
export default ReportModal;
  