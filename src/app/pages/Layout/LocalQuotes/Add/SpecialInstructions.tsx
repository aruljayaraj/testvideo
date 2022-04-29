import { 
    IonCard, 
    IonCardHeader, 
    IonCardContent,
    IonItem, 
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonText,
    IonInput,
    IonTextarea,
    IonCheckbox,
    IonModal
} from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { format, addYears, parseISO } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import '../LocalQuotes.scss';
import CoreService from '../../../../shared/services/CoreService';
import CommonService from '../../../../shared/services/CommonService';
import QQStepInd from './QQStepInd';
import Modal from '../../../../components/Modal/Modal';
import { lfConfig } from '../../../../../Constants';
import { InitModalValues } from '../../../../shared/defaultValues/InitialValue';
import DateTimeModal from '../../../../components/Modal/DateTimeModal';

type FormInputs = {
    qq_req_date: string;
    qq_qdate: string;
    qq_ddate: string;
    qq_sdate: string;
    qq_shipping_ins: string;
    qq_terms: boolean;
}

const SpecialInstructions: React.FC = () => {
    const dispatch = useDispatch();
    const { WPPAGES } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const qq = useSelector( (state:any) => state.qq.localQuote);
    const [addQQ, setAddQQ] = useState({ status: false, memID: '', ID: '' });
    const [showModal, setShowModal] = useState({status: false, title: ''});
    const [datePickerModal, setDatePickerModal] = useState(InitModalValues);
    let { id } = useParams<any>(); 
    const [quoDate, setQuoDate] = useState<any>();
    const [delDate, setDelDate] = useState<any>();

    async function closeModal() {
        await setShowModal({status: false, title: ''});
    }

    let initialValues = {
        qq_req_date: (qq && Object.keys(qq).length > 0 && qq.quotation_date) ? qq.quotation_date : "",
        qq_qdate: (qq && Object.keys(qq).length > 0 && qq.quotation_req_date) ? qq.quotation_req_date : "",
        qq_ddate: (qq && Object.keys(qq).length > 0 && qq.delivery_date) ? qq.delivery_date : "",
        qq_sdate: (qq && Object.keys(qq).length > 0 && qq.special_event_date) ? qq.special_event_date : "",
        qq_shipping_ins: (qq && Object.keys(qq).length > 0 && qq.shipping_ins) ? qq.shipping_ins : ""
    };
    const { control, handleSubmit, getValues, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    useEffect(()=>{
        if(qq.quotation_req_date){ console.log(qq.quotation_req_date);
            const QuoDateChange = format(new Date(CommonService.mysqlToJsDateFormat(qq.quotation_req_date)), 'yyyy-MM-dd');
            setQuoDate(QuoDateChange);
        }
        if(qq.delivery_date){
            const delDateChange = format(new Date(qq.delivery_date), 'yyyy-MM-dd');
            setDelDate(delDateChange);
        }
    },[qq.quotation_req_date, qq.delivery_date]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if( res.redirect === true ){
                setAddQQ({ status: true, memID: res.data.mem_id, ID: res.data.id  });
            }
            dispatch(qqActions.setQQ({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'qq_update_special_ins',
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id,
            isDraft: false,
            ...data
        };
        CoreService.onPostFn('qq_update', fd, onCallbackFn);
    }
    const onSave = () => {
        const data = getValues();
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'qq_update_special_ins',
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id,
            isDraft: true,
            ...data
        };
        CoreService.onPostFn('qq_update', fd, onCallbackFn);
    }

    const updateDateHandler = (field: any, dateValue: any) => {
        if(field && dateValue){
            setValue(field, dateValue, { shouldValidate: true });
        }
    }

    if( addQQ.status  ){
      return <Redirect to={`/layout/buyer-request-center`} />;
    }
    return (<>
        { qq && Object.keys(qq).length > 0 &&
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <QQStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">Special Instructions</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeLg="6" sizeXl="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Date of Request <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="qq_req_date"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput 
                                            placeholder="YYYY-MM-DD HH:mm:ss"
                                            // displayFormat="DD-MMM-YYYY" 
                                            // min={format(new Date(), 'yyyy-MM-dd')}
                                            // max={format(new Date(addYears(new Date(), 3)), 'yyyy')}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                            onClick={() => setDatePickerModal({ 
                                                ...datePickerModal,
                                                isOpen: true,
                                                fieldName: 'qq_req_date',
                                                title: 'Date of Request ',
                                                presentation: 'time-date',
                                                dateValue: value,
                                                min: format(new Date(), 'yyyy-MM-dd'),
                                                max: format(new Date(addYears(new Date(), 3)), 'yyyy-MM-dd')
                                            })}
                                        ></IonInput>
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Date of Request is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="qq_req_date"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Date and Time Quotation is Required by <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="qq_qdate"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput
                                            placeholder="YYYY-MM-DD HH:mm:ss"
                                            // displayFormat="DD-MMM-YYYY h:mm A" 
                                            min={format(new Date(), 'yyyy-MM-dd')} 
                                            max={format(new Date(addYears(new Date(), 3)), 'yyyy')}
                                            onIonChange={(selected: any) => { // console.log(selected.target.value);
                                                console.log("Welcome");
                                                setQuoDate(selected.target.value);
                                                if(selected.target.value){
                                                    console.log("Meow");
                                                    const QuoDateChange = format(new Date(selected.target.value), 'yyyy-MM-dd');
                                                    //console.log(QuoDateChange);
                                                    onChange(selected.target.value);
                                                    setQuoDate(QuoDateChange);
                                                }
                                                // onChange(selected.target.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}
                                            onClick={() => setDatePickerModal({ 
                                                ...datePickerModal,
                                                isOpen: true,
                                                fieldName: 'qq_qdate',
                                                title: 'Quotation is Required by',
                                                presentation: 'time-date',
                                                dateValue: value,
                                                min: format(new Date(), 'yyyy-MM-dd'),
                                                max: format(new Date(addYears(new Date(), 3)), 'yyyy-MM-dd')
                                            })}
                                        ></IonInput>
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Quotation Date is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="qq_qdate"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Requested Delivery Date <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="qq_ddate"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput 
                                            placeholder="YYYY-MM-DD"
                                            // min={quoDate} 
                                            // max={format(new Date(addYears(new Date(), 3)), 'yyyy')}
                                            onIonChange={(selected: any) =>{
                                                if(selected.target.value){
                                                    const delDateChange = format(new Date(selected.target.value), 'yyyy-MM-dd');
                                                    //console.log(QuoDateChange);
                                                    onChange(selected.target.value);
                                                    setDelDate(delDateChange);
                                                }
                                                // setDelDate(selected.target.value!);
                                                // onChange(selected.target.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}
                                            onClick={() => setDatePickerModal({ 
                                                ...datePickerModal,
                                                isOpen: true,
                                                fieldName: 'qq_ddate',
                                                title: 'Requested Delivery Date',
                                                presentation: 'date',
                                                dateValue: value,
                                                min: quoDate? quoDate: format(new Date(), 'yyyy-MM-dd'),
                                                max: format(new Date(addYears(new Date(), 3)), 'yyyy-MM-dd')
                                            })}
                                        ></IonInput>
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Requested Delivery Date is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="qq_ddate"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Special Event Date  if Required</IonLabel>
                                <Controller 
                                    name="qq_sdate"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput
                                            placeholder="YYYY-MM-DD"
                                            // displayFormat="DD-MMM-YYYY" 
                                            // max={format(new Date(addYears(new Date(), 2)), 'yyyy')}
                                            // min={delDate? delDate: format(new Date(), 'yyyy-MM-dd')} 
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                            onClick={() => setDatePickerModal({ 
                                                ...datePickerModal,
                                                isOpen: true,
                                                fieldName: 'qq_sdate',
                                                title: 'Special Event Date',
                                                presentation: 'date',
                                                dateValue: value,
                                                min: delDate? delDate: format(new Date(), 'yyyy-MM-dd'),
                                                max: format(new Date(addYears(new Date(), 3)), 'yyyy-MM-dd')
                                            })}
                                        ></IonInput>
                                    }}
                                />
                            </IonItem>
                            {/* <ErrorMessage
                                errors={errors}
                                name="qq_sdate"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            /> */}
                        </IonCol>
                    
                        <IonCol sizeMd="6" sizeLg="6" sizeXl="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Shipping Instructions <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="qq_shipping_ins"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonTextarea rows={5} cols={20}
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 100 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 100).join(" ");
                                                }
                                            }}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Shipping Instructions is required"
                                        },
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,100}$/i,
                                            message: "Shipping Instructions shoud be lessthan 100 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <IonText color="medium" className="fs-12">Maximum of 100 Words</IonText>
                            <ErrorMessage
                                errors={errors}
                                name="qq_shipping_ins"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    { (qq && +(qq.is_active) === 0) && <IonRow className="ion-justify-content-start">    
                        <IonCol size="1" sizeMd="0.5">
                            <div className="mt-2">
                                <Controller 
                                    name="qq_terms"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonCheckbox mode="md" slot="start"
                                            onIonChange={(selected: any) =>{
                                                onChange(selected.detail.checked);
                                            }}
                                            onBlur={onBlur}
                                            checked={value}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Agree Terms & Conditions is required"
                                        }
                                    }}
                                />
                            </div>
                            
                        </IonCol>
                        <IonCol>
                            <p className="mt-2 ml-2 cursor fs-16" onClick={() => setShowModal({status: true, title: WPPAGES.LQ_TC})}>
                                <IonText className="fs-13" color="primary">I Agree to the terms and conditions <i className="fa fa-question-circle-o" aria-hidden="true"></i></IonText>
                            </p>
                            <ErrorMessage
                                errors={errors}
                                name="qq_terms"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow> }
                </IonGrid>
                
                
                <IonButton slot="end" color="greenbg" className="ion-margin-top mt-4 float-right mb-3" type="submit">
                    Submit
                </IonButton> 
                { (qq && +(qq.is_active) === 0) && <IonButton slot="start" color="primary" className="ion-margin-top mt-4 mr-4 float-right mb-3" type="button" onClick={onSave}>
                    Save as Draft
                </IonButton> }
                
            </IonCardContent>
        </IonCard>
        </form>}
        <IonModal backdropDismiss={false} isOpen={showModal.status} className='my-custom-class'>
            <Modal title = {showModal.title} closeAction={closeModal} />
        </IonModal>
        <IonModal backdropDismiss={false} isOpen={datePickerModal.isOpen} className='view-modal-wrap'>
            { datePickerModal.isOpen === true &&  <DateTimeModal
                datePickerModal={datePickerModal}
                setDatePickerModal={setDatePickerModal}
                updateDateHandler={updateDateHandler}
           /> }
        </IonModal>
    </>);
};
 
export default SpecialInstructions;
  