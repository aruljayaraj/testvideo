import { 
    IonCard, 
    IonCardHeader, 
    IonCardContent,
    IonItem, 
    IonLabel,
    IonInput,
    IonModal,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonText,
    IonRouterLink
} from '@ionic/react';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Editor } from '@tinymce/tinymce-react';
import { format, addYears, addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as dealActions from '../../../../store/reducers/dashboard/deal';
import * as authActions from '../../../../store/reducers/auth';
import '../Deals.scss';
import CoreService from '../../../../shared/services/CoreService';
import CommonService from '../../../../shared/services/CommonService';
import { lfConfig } from '../../../../../Constants';
import StepInd from './StepInd';
import { InitModalValues } from '../../../../shared/defaultValues/InitialValue';
import DateTimeModal from '../../../../components/Modal/DateTimeModal';

type FormInputs = {
    dd_name: string;
    dd_price: string;
    dd_start_date: string;
    dd_end_date: string;
    dd_desc: string;
}

const CreateDeals: React.FC = () => {
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const memOpts = useSelector( (state:any) => state.auth.memOptions);
    const dd = useSelector( (state:any) => state.deals.localDeal);
    const [addDeal, setAddDeal] = useState({ status: false, memID: '', id: '' });
    const [startDate, setStartDate] = useState<string>(dd.sdate);
    const [datePickerModal, setDatePickerModal] = useState(InitModalValues);
    let { id, step } = useParams<any>(); 
    const { basename } = lfConfig;
    let initialValues = {
        dd_name: (dd && Object.keys(dd).length > 0) ? dd.name : '',
        dd_price: (dd && Object.keys(dd).length > 0) ? dd.price: '',
        dd_start_date: (dd && Object.keys(dd).length > 0) ? dd.sdate : '',
        dd_end_date: (dd && Object.keys(dd).length > 0) ? dd.edate : '',
        dd_desc: (dd && Object.keys(dd).length > 0) ? dd.description : '',
    };
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });
    const maxDaysAllowed = (dd && Object.keys(dd).length > 0 && dd.days_allowed > 0) ? dd.days_allowed : +(memOpts.localdeals.no_days_allowed);
    let calEnddate = addDays(new Date(), maxDaysAllowed); 
    if( startDate && memOpts.localdeals && maxDaysAllowed ){
        // convert mysql date to javascript 
        const convStartDate = CommonService.mysqlToJsDateFormat(startDate);
        if( convStartDate ){
            calEnddate = addDays(convStartDate, maxDaysAllowed);
        }
    }
    
    useEffect(() => { // Only for Premium End date autoupdate.
        if( startDate && calEnddate && dd.days_allowed > 0){
            const newCalEndDate: any = format(new Date(calEnddate), 'yyyy-MM-dd'); 
            setValue("dd_end_date", newCalEndDate, { shouldValidate: true });
        }
    },[startDate, dd.days_allowed]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(authActions.setDealsCountUpdate({ total: res.total }));
            dispatch(dealActions.setDeal({ data: res.data }));
            setAddDeal({ status: true, memID: res.data.mem_id, id: res.data.id  });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [setAddDeal, dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: (id && step)? 'dl_update': 'dl_add',
            memID: authUser.ID,
            repID: authUser.repID,
            ...data
        };
        if( id && step ){
            fd.formID = id;
        }
        CoreService.onPostFn('deal_update', fd, onCallbackFn);
    }

    const updateDateHandler = (field: any, dateValue: any) => {
        if(field && dateValue){
            setValue(field, dateValue, { shouldValidate: true });
        }
    }

    if( addDeal.status  ){
      return <Redirect to={`/layout/deals/add-deal/${addDeal.id}/${addDeal.memID}/2`} />;
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <StepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">Create your Local Deal
                    <IonRouterLink color="greenbg" href={`${basename}/layout/deals/local-deals`} className="float-right router-link-anchor" title="Deal Listing">
                        <i className="fa fa-list green cursor" aria-hidden="true"></i>
                    </IonRouterLink>
                </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Deal Name (Maximum 10 Words)  <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="dd_name"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="text"
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 10 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 10).join(" ");
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
                                            message: "Name is required"
                                        },
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,10}$/i,
                                            message: "Name shoud be lessthan 10 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="dd_name"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Deal Price  <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="dd_price"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="text"
                                            placeholder="10.50"
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Price is required"
                                        },
                                        pattern: {
                                            value: /^[1-9]\d{0,7}(?:\.\d{1,4})?$/,
                                            message: "Price should be valid"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="dd_price"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>    
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Deal Start Date <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="dd_start_date"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput
                                            placeholder="YYYY-MM-DD" 
                                            // displayFormat="DD-MMM-YYYY"
                                            onClick={() => setDatePickerModal({ 
                                                ...datePickerModal,
                                                isOpen: true,
                                                fieldName: 'dd_start_date',
                                                title: 'Deal Start Date',
                                                presentation: 'date',
                                                dateValue: value,
                                                min: format(new Date(), 'yyyy-MM-dd'),
                                                max: format(new Date(addYears(new Date(), 3)), 'yyyy-MM-dd')
                                            })}
                                            onIonChange={(selected: any) => {
                                                if(selected.target.value){
                                                    const sDateChange = format(new Date(selected.target.value), 'yyyy-MM-dd');
                                                    onChange(selected.target.value);
                                                    setStartDate(sDateChange);
                                                    // const newCalEndDate: any = format(new Date(calEnddate), 'yyyy-MM-dd'); 
                                                    // console.log(calEnddate, newCalEndDate );
                                                    // setValue("dd_end_date", newCalEndDate, { shouldValidate: true });
                                                    // setValue("dd_end_date", newCalEndDate, { shouldValidate: true })

                                                }
                                            }}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Start Date is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="dd_start_date"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Deal End Date <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="dd_end_date"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput
                                            placeholder="YYYY-MM-DD"
                                            // displayFormat="DD-MMM-YYYY"
                                            onClick={() => setDatePickerModal({ 
                                                ...datePickerModal,
                                                isOpen: true,
                                                fieldName: 'dd_end_date',
                                                title: 'Deal End Date',
                                                presentation: 'date',
                                                dateValue: value,
                                                min: startDate? startDate : format(new Date(), 'yyyy-MM-dd'),
                                                max: format(calEnddate, 'yyyy-MM-dd')
                                            })} 
                                            // min={startDate? startDate : format(new Date(), 'yyyy-MM-dd')} 
                                            // max={format(calEnddate, 'yyyy-MM-dd')}
                                            // max={format(new Date(addYears(new Date(), 60)), 'mm')}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "End Date is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="dd_end_date"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    
                    <IonRow>
                        <IonCol>
                            <IonItem lines="none" class="ion-no-padding">
                                <IonLabel className="mb-3" position="stacked">Deal Description <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="dd_desc"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <Editor
                                            value={value}
                                            apiKey={lfConfig.tinymceKey}
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
                                            message: "Description is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="dd_desc"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        
                    </IonRow>
                    
                        
                </IonGrid>
                
                <IonButton color="greenbg" className="ion-margin-top mt-4 float-right  mb-3" type="submit">
                    Next
                </IonButton> 
                
            </IonCardContent>
        </IonCard>
        </form>
        <IonModal backdropDismiss={false} isOpen={datePickerModal.isOpen} className='view-modal-wrap'>
            { datePickerModal.isOpen === true &&  <DateTimeModal
                datePickerModal={datePickerModal}
                setDatePickerModal={setDatePickerModal}
                updateDateHandler={updateDateHandler}
        /> }
        </IonModal>
    </>);
};
export default CreateDeals;
  