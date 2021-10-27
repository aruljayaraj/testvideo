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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonCheckbox
} from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import '../LocalQuotes.scss';
import CoreService from '../../../../shared/services/CoreService';
import QuotationStepInd from './QuotationStepInd';
import HtmlText from '../../../../components/Common/HtmlText';

type FormInputs = {
    quotation_provideby: string;
    upload_notes: string;
    supplier_shipping_notes: string;
    qq_terms: boolean;
}

const AssignRep: React.FC = () => {
    let listReps: any = [];
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const qq = useSelector( (state:any) => state.qq.localQuote);
    const quote = useSelector( (state:any) => state.qq.quotation);
    const [addQQ, setAddQQ] = useState({ status: false, memID: '', ID: '' });
    let { rfqType} = useParams<any>(); 
    const [ reps, setReps ] = useState([]);

    let initialValues = {
        quotation_provideby: (quote && Object.keys(quote).length > 0 && quote.quotation_provided_by  !== '0') ? quote.quotation_provided_by : "",
        upload_notes: (quote && Object.keys(quote).length > 0 && quote.s_upload_notes) ? quote.s_upload_notes : "",
        supplier_shipping_notes: (quote && Object.keys(quote).length > 0 && quote.s_shipping_notes ) ? quote.s_shipping_notes  : "",
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    // For Reps default to load
    const onProfileCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setReps([]);
            setReps(res.reps);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setReps]);
    useEffect(() => {
        if( quote ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_member', {'action': 'get_reps', memID: quote.mem_id }, onProfileCb);
        }
    }, [dispatch, onProfileCb, quote]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddQQ({ status: true, memID: res.data.mem_id, ID: res.data.id  });
            dispatch(qqActions.setSQ({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: 'quotation_update_rep',
            rfqType: rfqType,
            memID: authUser.ID, // Seller QQ Mem ID
            repID: authUser.repID,
            formID: quote.id, // Seller QQ ID
            bqMemID: qq.mem_id, // Buyer QQ Mem ID
            bqID: qq.id, // Buyer QQ ID
            ...data
        };
        CoreService.onPostFn('qq_update', fd, onCallbackFn);
    }

    if( quote && Object.keys(quote).length > 0 && reps && reps.length > 0 ){
        listReps = reps.map((rep: any) =>
            <IonSelectOption value={rep.rep_id} key={rep.rep_id}>{ `${rep.firstname} ${rep.lastname}`}</IonSelectOption>
        );
    }
    if( addQQ.status  ){
      return <Redirect to={`/layout/seller-request-center/${rfqType}`} />;
    }
    return (<>
        { quote && Object.keys(quote).length > 0 &&
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <QuotationStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">Assign Representative Profile</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeLg="6" sizeXl="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Quotation Provided By <IonText color="danger">*</IonText></IonLabel>
                                { quote && Object.keys(quote).length > 0 && listReps && 
                                    <Controller 
                                        name="quotation_provideby"
                                        control={control}
                                        render={({ field: {onChange, onBlur, value} }) => {
                                            return <IonSelect
                                                placeholder="Select Rep Profile"
                                                onIonChange={(selected: any) =>{
                                                    onChange(selected.detail.value);
                                                }}
                                                onBlur={onBlur}
                                                value={value}
                                            >{listReps}</IonSelect>
                                        }}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Quotation Provided By is required"
                                            }
                                        }}
                                    />
                                } 
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="quotation_provideby"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />

                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Supplier Upload Notes</IonLabel>
                                <Controller 
                                    name="upload_notes"
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
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,100}$/i,
                                            message: "Supplier Upload Notes shoud be lessthan 100 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <IonText color="medium" className="fs-12">Maximum of 100 Words</IonText>
                            <ErrorMessage
                                errors={errors}
                                name="upload_notes"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    
                        <IonCol sizeMd="6" sizeLg="6" sizeXl="6" sizeXs="12">
                            { qq.p_desc && <div><span className="fw-bold">Buyer Shipping Instructions : </span><HtmlText htmlText={qq.shipping_ins} /></div>}
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Supplier Shipping Notes</IonLabel>
                                <Controller 
                                    name="supplier_shipping_notes"
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
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,100}$/i,
                                            message: "Shipping Notes shoud be lessthan 100 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <IonText color="medium" className="fs-12">Maximum of 100 Words</IonText>
                            <ErrorMessage
                                errors={errors}
                                name="supplier_shipping_notes"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>    
                        <IonCol>
                            <IonItem lines="none">
                                <IonLabel className="fs-13">I Agree to the terms and conditions <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="qq_terms"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonCheckbox slot="start"
                                            onIonChange={(e: any) =>{
                                                onChange(e.detail.checked);
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
 
export default AssignRep;
  