import { 
    IonCard, 
    IonCardHeader, 
    IonCardContent,
    IonItem, 
    IonLabel,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonText,
    IonSelect, 
    IonSelectOption, 
    IonTextarea, 
    IonDatetime
} from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { format, addYears } from 'date-fns';
import { Editor } from '@tinymce/tinymce-react';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import '../LocalQuotes.scss';
import CoreService from '../../../../shared/services/CoreService';
import CommonService from '../../../../shared/services/CommonService';
import { lfConfig } from '../../../../../Constants';
import QuotationStepInd from './QuotationStepInd';
import HtmlText from '../../../../components/Common/HtmlText';
import BuscatsList from '../../../../components/Common/BuscatsList';

type FormInputs = {
    s_title: string;
    s_percentage: string;
    s_country_currency: string;
    s_sup_products: string;
    s_order_frq_details: string;
    s_ongoing_order_date: string;
    s_spev_date_notes: string;
}

const CreateQuotation: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user );
    const qq = useSelector( (state:any) => state.qq.localQuote);
    const quote = useSelector( (state:any) => state.qq.quotation); 
    const [addQuote, setAddQuote] = useState({ status: false, memID: '', ID: '' });
    let { id, quote_id, step } = useParams<any>();

    let initialValues = {
        s_title: (quote && Object.keys(quote).length > 0 && quote.s_title) ? quote.s_title : '',
        s_percentage: (quote && Object.keys(quote).length > 0 && quote.expected_percentage)? quote.expected_percentage: '',
        s_country_currency: (quote && Object.keys(quote).length > 0 && quote.country_currency)? quote.country_currency: 'CA',
        s_sup_products: (quote && Object.keys(quote).length > 0 && quote.s_product)? quote.s_product: '',
        s_order_frq_details: (quote && Object.keys(quote).length > 0 && quote.order_frq_details)? quote.order_frq_details: '',
        s_ongoing_order_date: (quote && Object.keys(quote).length > 0 && quote.ongoing_order_date)? quote.ongoing_order_date: '',
        s_spev_date_notes: (quote && Object.keys(quote).length > 0 && quote.req_delivery_notes)? quote.req_delivery_notes: ''
    }; // console.log(initialValues);
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(qqActions.setSQ({ data: res.data }));
            setAddQuote({ status: true, memID: res.data.mem_id, ID: res.data.id  });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [setAddQuote, dispatch, setAddQuote]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: (id && step)? 'quotation_update': 'quotation_add',
            memID: authUser.ID, // Seller QQ Mem ID
            repID: authUser.repID,
            bqMemID: qq.mem_id, // Buyer QQ Mem ID
            bqID: qq.id, // Buyer QQ ID
            ...data
        }; 
        if( quote_id && step ){
            fd.formID = quote_id; // Seller QQ ID
        }
        CoreService.onPostFn('qq_update', fd, onCallbackFn);
    }

    if( addQuote.status  ){
      return <Redirect to={`/layout/quotation/${qq.id}/${qq.mem_id}/${addQuote.ID}/2`} />;
    } 

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <QuotationStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
            <IonCardTitle className="card-custom-title">Complete Your Quotation in the Appropriate Areas Below</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                { qq && Object.keys(qq).length > 0 && quote && ((!quote_id && Object.keys(quote).length === 0) || (quote_id && Object.keys(quote).length > 0)) && <>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            { qq.p_title && <p><span className="fw-bold">Buyers LocalQuote Name : </span>{qq.p_title}</p>}
                            { qq.p_short_desc && <p><span className="fw-bold">Short Description : </span>{qq.p_short_desc}</p>}
                            {qq.buscats && Object.keys(qq.buscats).length > 0 && 
                            <div><span className="fw-bold">Product or Service Category(s)</span>
                                <BuscatsList buscats={qq.buscats} />
                            </div>}
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            { qq.p_desc && <div><span className="fw-bold">Buyers Desciption : </span><HtmlText htmlText={qq.p_desc} /></div>}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Enter Your Quotation Title  <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="s_title"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="text" 
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Quotation Title is required"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Title should be minimum 3 characters'
                                        },
                                        maxLength: {
                                            value: 150,
                                            message: 'Title should be lessthan 150 characters'
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="s_title"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />

                            { qq.p_quantity && <p className="mt-3"><span className="fw-bold">Quantity Required  : </span>{qq.p_quantity}</p>}
                            <IonItem class="ion-no-padding">
                                <IonLabel className="ion-text-wrap" position="stacked">The expected percentage over or under run will be <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="s_percentage"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="text" 
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Expected percentage is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="s_percentage"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />

                            { qq.p_unit_measure && <p className="mt-3"><span className="fw-bold">Unit Measure : </span> {qq.p_unit_measure}</p>}
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Country of Currency : <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="s_country_currency"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonSelect 
                                            placeholder="Select Currency"
                                            onIonChange={(selected: any) =>{
                                                onChange(selected.detail.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}
                                            selectedText={value}
                                        >
                                            <IonSelectOption value="CA">Canada</IonSelectOption>
                                            <IonSelectOption value="US">United States</IonSelectOption>
                                        </IonSelect>
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Country of Currency is required"
                                        }
                                    }}
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name="s_country_currency"
                                    render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                />
                            </IonItem>
                            { qq.p_unit_measure && <p className="mt-3"><span className="fw-bold">Estimated Order Frequency  : </span> {qq.order_frequency}</p>}
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem lines="none" class="ion-no-padding">
                                <IonLabel className="mb-3 ew-100 ion-text-wrap" position="stacked">Supplier Product or Services Details (Maximum of 500 Words) <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="s_sup_products"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <Editor
                                            value={value}
                                            apiKey={lfConfig.tinymceKey}
                                            initialValue={(quote && Object.keys(quote).length > 0) && quote.s_product ? quote.s_product : ''}
                                            init={CommonService.onEditorConfig(lfConfig.tinymceMaxLength)}
                                            onEditorChange={(val: any) =>{
                                                onChange(val);
                                            }}
                                            onBlur={onBlur}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Supplier Product Detail is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="s_sup_products"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            { qq.special_details && <p className="mt-3"><span className="fw-bold">Buyers Frequency Comments : </span> {qq.special_details}</p>}
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel className="ion-text-wrap" position="stacked">Enter Supplier notes about order frequency if requested (Maximum of 500 Words)</IonLabel>
                                {/* <Controller
                                    as={<IonTextarea rows={5} cols={20} />}
                                    control={control}
                                    onChangeName="onIonChange"
                                    onChange={([selected]) => {
                                        return selected.detail.value
                                    }}
                                    onKeyUp={(e: any) => {
                                        var str = e.target.value;
                                        if( str.split(/\s+/).length > 500 ){
                                            e.target.value = str.split(/\s+/).slice(0, 500).join(" ");
                                        }
                                    }}
                                    name="s_order_frq_details"
                                    rules={{
                                        required: false,
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,500}$/i,
                                            message: "Supplier notes shoud be lessthan 500 words"
                                        }
                                    }}
                                /> */}
                                <Controller 
                                    name="s_order_frq_details"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonTextarea rows={5} cols={20}
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 500 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 500).join(" ");
                                                }
                                            }}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,500}$/i,
                                            message: "Supplier notes shoud be lessthan 500 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="s_order_frq_details"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel className="ion-text-wrap" position="stacked">Price on ongoing orders is valid until: </IonLabel>
                                {/* <Controller
                                    as={<IonDatetime displayFormat="DD-MMM-YYYY" min={qq.delivery_date} max={format(new Date(addYears(new Date(), 1)), 'yyyy')}></IonDatetime>}
                                    control={control}
                                    onChangeName="onIonChange"
                                    onChange={([selected]) => {
                                        // setOnGoingDate(selected.detail.value);
                                        return selected.detail.value;
                                    }}
                                    name="s_ongoing_order_date"
                                    rules={{
                                        required: true
                                    }}
                                /> */}
                                <Controller 
                                    name="s_ongoing_order_date"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonDatetime 
                                            // displayFormat="DD-MMM-YYYY" 
                                            // min={format(new Date(qq.delivery_date), 'yyyy-MM-dd')} 
                                            min={format(new Date(), 'yyyy-MM-dd')}
                                            max={format(new Date(addYears(new Date(), 3)), 'yyyy')} 
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        ></IonDatetime>
                                    }}
                                    rules={{ 
                                        required: {
                                            value: qq.order_frequency !== 'One Time'? true: false,
                                            message: "Ongoing orders valid date is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="s_ongoing_order_date"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                            { qq.delivery_date && <p className="mt-3"><span className="fw-bold">Requested Delivery Date : </span> {CommonService.dateFormat(qq.delivery_date)}</p>}
                            { qq.special_event_date  && <p className="mt-3"><span className="fw-bold">Special Event Date : </span> {CommonService.dateFormat(qq.special_event_date)}</p>}
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                                <IonLabel className="ion-text-wrap" position="stacked">If the Requested Delivery or Special Event Date can not be met, explain here (Maximum of 500 Words)</IonLabel>
                                <Controller 
                                    name="s_spev_date_notes"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonTextarea rows={5} cols={20}
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 500 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 500).join(" ");
                                                }
                                            }} 
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,500}$/i,
                                            message: "Reason shoud be lessthan 500 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="s_spev_date_notes"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                        
                </IonGrid>
                </>}
                <IonButton color="greenbg" className="ion-margin-top mt-4 float-right  mb-3" type="submit">
                    Next
                </IonButton> 
                
            </IonCardContent>
        </IonCard>
        </form>
    );
};
export default CreateQuotation;
  