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
    IonDatetime,
    IonTextarea,
    IonCheckbox
} from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { format, addYears } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import '../LocalQuotes.scss';
import CoreService from '../../../../shared/services/CoreService';
import QQStepInd from './QQStepInd';

type FormInputs = {
    qq_qdate: string;
    qq_ddate: string;
    qq_sdate: string;
    qq_shipping_ins: string;
    qq_terms: boolean;
}

const SpecialInstructions: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const qq = useSelector( (state:any) => state.qq.localQuote);
    const [addQQ, setAddQQ] = useState({ status: false, memID: '', ID: '' });
    let { id, rfqType } = useParams<any>(); 
    const [quoDate, setQuoDate] = useState<string>();
    const [delDate, setDelDate] = useState<string>();

    let initialValues = {
        qq_qdate: (qq && Object.keys(qq).length > 0 && qq.quotation_req_date) ? qq.quotation_req_date : "",
        qq_ddate: (qq && Object.keys(qq).length > 0 && qq.delivery_date) ? qq.delivery_date : "",
        qq_sdate: (qq && Object.keys(qq).length > 0 && qq.special_event_date) ? qq.special_event_date : "",
        qq_shipping_ins: (qq && Object.keys(qq).length > 0 && qq.shipping_ins) ? qq.shipping_ins : ""
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddQQ({ status: true, memID: res.data.mem_id, ID: res.data.id  });
            dispatch(qqActions.setQQ({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'qq_update_special_ins',
            rfqType: rfqType,
            memID: authUser.ID,
            repID: authUser.repID,
            formID: id,
            ...data
        };
        CoreService.onPostFn('qq_update', fd, onCallbackFn);
    }

    if( addQQ.status  ){
      return <Redirect to={`/layout/buyer-request-center/${rfqType}`} />;
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
                                <IonLabel position="stacked">Quotation Date and Time <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="qq_qdate"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonDatetime 
                                            placeholder="DD-MMM-YYYY h:mm A"
                                            displayFormat="DD-MMM-YYYY h:mm A" 
                                            min={format(new Date(), 'yyyy-MM-dd')} 
                                            max={format(new Date(addYears(new Date(), 2)), 'yyyy')}
                                            onIonChange={(selected: any) => { // console.log(selected.target.value);
                                                // setQuoDate(selected.target.value);
                                                if(selected.target.value){
                                                    const QuoDateChange = format(new Date(selected.target.value), 'yyyy-MM-dd');
                                                    //console.log(QuoDateChange);
                                                    onChange(selected.target.value);
                                                    setQuoDate(QuoDateChange);
                                                }
                                                // onChange(selected.target.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}
                                        ></IonDatetime>
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
                                {/* <Controller
                                    as={
                                        <IonDatetime displayFormat="DD-MMM-YYYY" min={quoDate} max={format(new Date(addYears(new Date(), 1)), 'yyyy')}></IonDatetime>
                                    }
                                    control={control}
                                    onChangeName="onIonChange"
                                    onChange={([selected]) => {
                                        setDelDate(selected.detail.value);
                                        return selected.detail.value;
                                    }}
                                    name="qq_ddate"
                                    rules={{
                                        required: true
                                    }}
                                /> */}
                                <Controller 
                                    name="qq_ddate"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => { // console.log(quoDate);
                                        return <IonDatetime 
                                            placeholder="DD-MMM-YYYY"
                                            displayFormat="DD-MMM-YYYY" 
                                            min={quoDate} 
                                            max={format(new Date(addYears(new Date(), 1)), 'yyyy')}
                                            onIonChange={(selected: any) =>{ 
                                                // setDelDate(selected.target.value!);
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
                                        ></IonDatetime>
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
                                        return <IonDatetime
                                            placeholder="DD-MMM-YYYY"
                                            displayFormat="DD-MMM-YYYY" 
                                            min={delDate} 
                                            max={format(new Date(addYears(new Date(), 2)), 'yyyy')}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        ></IonDatetime>
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
                    <IonRow>    
                        <IonCol>
                            <IonItem lines="none">
                                <IonLabel className="fs-13">I Agree to the terms and conditions <IonText color="danger">*</IonText></IonLabel>
                                {/* <Controller
                                    as={
                                        <IonCheckbox slot="start" />
                                    }
                                    control={control}
                                    onChangeName="onIonChange"
                                    onChange={([selected]) => {
                                        return selected.detail.checked;
                                    }}
                                    name="qq_terms"
                                    rules={{
                                        required: true
                                    }}
                                /> */}
                                <Controller 
                                    name="qq_terms"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonCheckbox slot="start"
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
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="qq_terms"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                
                <IonButton color="greenbg" className="ion-margin-top mt-4 float-right mb-3" type="submit">
                    Submit
                </IonButton> 
                
            </IonCardContent>
        </IonCard>
        </form>}
    </>);
};
 
export default SpecialInstructions;
  