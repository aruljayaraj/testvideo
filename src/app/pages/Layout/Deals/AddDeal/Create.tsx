import { 
    IonCard, 
    IonCardHeader, 
    IonCardContent,
    IonItem, 
    IonLabel,
    IonInput,
    IonDatetime,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonText
} from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Editor } from '@tinymce/tinymce-react';
import { format, addYears } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as dealActions from '../../../../store/reducers/dashboard/deal';
import '../DailyDeal.scss';
import CoreService from '../../../../shared/services/CoreService';
import { lfConfig } from '../../../../../Constants';
import StepInd from './StepInd';

type FormInputs = {
    dd_name: string;
    dd_price: string;
    dd_start_date: string;
    dd_end_date: string;
    dd_desc: string;
}

const CreatePressRelease: React.FC = () => {
    const dispatch = useDispatch();
    const authValues = useSelector( (state:any) => state.auth.data.user);
    const dd = useSelector( (state:any) => state.deals.dailyDeal);
    const [addDeal, setAddDeal] = useState({ status: false, memID: '', id: '' });
    const [startDate, setStartDate] = useState<string>(dd.sdate);
    let { id, step } = useParams<any>(); 

    let initialValues = {
        dd_name: (dd && Object.keys(dd).length > 0) ? dd.name : '',
        dd_price: (dd && Object.keys(dd).length > 0) ? dd.price: '',
        dd_start_date: (dd && Object.keys(dd).length > 0) ? dd.sdate : '',
        dd_end_date: (dd && Object.keys(dd).length > 0) ? dd.edate : '',
        dd_desc: (dd && Object.keys(dd).length > 0) ? dd.description : '',
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
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
            memID: authValues.ID,
            ...data
        };
        if( id && step ){
            fd.formID = id;
        }
        CoreService.onPostFn('deal_update', fd, onCallbackFn);
    }

    if( addDeal.status  ){
      return <Redirect to={`/layout/deals/add-deal/${addDeal.id}/${addDeal.memID}/2`} />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <StepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">Create your Daily Deal</IonCardTitle>
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
                                        return <IonDatetime
                                            placeholder="DD-MMM-YYYY" 
                                            displayFormat="DD-MMM-YYYY" 
                                            min={format(new Date(), 'yyyy-MM-dd')}
                                            max={format(new Date(addYears(new Date(), 2)), 'yyyy')}
                                            onIonChange={(selected: any) => {
                                                if(selected.target.value){
                                                    const sDateChange = format(new Date(selected.target.value), 'yyyy-MM-dd');
                                                    onChange(selected.target.value);
                                                    setStartDate(sDateChange);
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
                                        return <IonDatetime
                                            placeholder="DD-MMM-YYYY"
                                            displayFormat="DD-MMM-YYYY" 
                                            min={startDate} 
                                            max={format(new Date(addYears(new Date(), 2)), 'yyyy')}
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
                                            initialValue=""
                                            init={{
                                                max_chars: lfConfig.tinymceMaxLength, // max. allowed chars
                                                
                                                init_instance_callback: function (editor: any) {
                                                    editor.on('change', function (e: Event) {
                                                        let content = editor.contentDocument.body.innerText;
                                                        // console.log(content.split(/[\w\u2019\'-]+/).length);
                                                        if(content.split(/[\w\u2019\'-]+/).length > lfConfig.tinymceMaxLength){
                                                            editor.contentDocument.body.innerText = content.split(/\s+/).slice(0, lfConfig.tinymceMaxLength).join(" ");
                                                        }
                                                    });
                                                },
                                                branding: false,
                                                height: 300,
                                                width: '100%',
                                                menubar: false,
                                                mobile: {
                                                    menubar: true
                                                },
                                                plugins: [
                                                    'advlist autolink lists link image charmap print preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime media table paste code help wordcount'
                                                ],
                                                toolbar:
                                                    'undo redo | formatselect | bold italic backcolor | \
                                                    alignleft aligncenter alignright alignjustify | \
                                                    bullist numlist outdent indent | removeformat | help'
                                            }}
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
    );
};
export default CreatePressRelease;
  