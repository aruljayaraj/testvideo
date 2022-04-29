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
    IonTextarea
} from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Editor } from '@tinymce/tinymce-react';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as qqActions from '../../../../store/reducers/dashboard/qq';
import '../LocalQuotes.scss';
import CoreService from '../../../../shared/services/CoreService';
import { lfConfig } from '../../../../../Constants';
import QQStepInd from './QQStepInd';
import CommonService from '../../../../shared/services/CommonService';

type FormInputs = {
    qq_title: string;
    qq_short_desc: string;
    qq_quantity: string;
    qq_unit_measure: string;
    qq_order_frequency: string;
    qq_location: string;
    qq_special_details: string;
    qq_desc: string;
}

const CreateQQ: React.FC = () => {
    let listUnitsMeasure: any = [];
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user );
    const authValues = useSelector( (state:any) => state.auth.data.user); 
    const qq = useSelector( (state:any) => state.qq.localQuote); // console.log(qq);
    const units_measure = useSelector( (state:any) => state.qq.unit_measure);  // console.log(units_measure);
    const [addQQ, setAddQQ] = useState({ status: false, memID: '', ID: '' });
    let { id, step } = useParams<any>();

    let initialValues = {
        qq_title: (qq && Object.keys(qq).length > 0 && qq.p_title) ? qq.p_title : '',
        qq_short_desc: (qq && Object.keys(qq).length > 0 && qq.p_short_desc)? qq.p_short_desc: '',
        qq_quantity: (qq && Object.keys(qq).length > 0 && qq.p_quantity)? qq.p_quantity: '',
        qq_unit_measure: (qq && Object.keys(qq).length > 0 && qq.p_unit_measure)? qq.p_unit_measure: '',
        qq_order_frequency: (qq && Object.keys(qq).length > 0 && qq.order_frequency)? qq.order_frequency: 'One Time',
        qq_location: (qq && Object.keys(qq).length > 0 && qq.location)? qq.location: '1',
        qq_special_details: (qq && Object.keys(qq).length > 0 && qq.special_details)? qq.special_details: '',
        qq_desc: (qq && Object.keys(qq).length > 0) && qq.p_desc ? qq.p_desc : '',
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    // Units Measure Callback
    const onUnitsMeasureCBFn = useCallback((res:any)=> {
        if(res.status === 'SUCCESS'){
            dispatch(qqActions.setUnitMeasure({ data: res.data }));
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        }
    },[dispatch]);
    useEffect(() => {
        // dispatch(uiActions.setShowLoading({ loading: true }));
            if(units_measure.length <= 0) {
                CoreService.onPostFn('qq_update', {
                    action: 'get_units_measure',
                    memID: authUser.ID,
                    repID: authUser.repID
                }, onUnitsMeasureCBFn);
            }
    }, [onUnitsMeasureCBFn, units_measure, authUser]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(qqActions.setQQ({ data: res.data }));
            setAddQQ({ status: true, memID: res.data.mem_id, ID: res.data.id  });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [setAddQQ, dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: (id && step)? 'qq_update': 'qq_add',
            memID: authValues.ID,
            repID: authValues.repID,
            ...data
        }; 
        if( id && step ){
            fd.formID = id;
        }
        CoreService.onPostFn('qq_update', fd, onCallbackFn);
    }

    if( qq && (Object.keys(qq).length > 0 || Object.keys(qq).length === 0) && units_measure.length > 0 ){
        listUnitsMeasure = units_measure.map((item: any, index: number) => {
            return <IonSelectOption value={item.name} key={index}>{item.name}</IonSelectOption> }
        );
    }

    if( addQQ.status  ){
      return <Redirect to={`/layout/add-localquote/${addQQ.ID}/${addQQ.memID}/2`} />;
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <QQStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">Request Product or Service Quotation</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                { qq && (Object.keys(qq).length > 0 || Object.keys(qq).length === 0) && <>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Title of the Quotation <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="qq_title"
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
                                        message: "Title is required"
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
                                name="qq_title"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Short Description (Maximum of 10 Words)  <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="qq_short_desc"
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
                                        message: "Description is required"
                                    },
                                    pattern: {
                                        value: /^\W*(\w+(\W+|$)){1,10}$/i,
                                        message: "Short Description shoud be lessthan 10 words"
                                    }
                                }}
                            />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="qq_short_desc"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Quantity <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="qq_quantity"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput type="number"
                                        onIonChange={(e: any) => onChange(e.target.value)}
                                        onBlur={onBlur}
                                        value={value}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Quatity is required"
                                    },
                                    pattern: {
                                        value: /^[1-9][0-9]*$/,
                                        message: "Quantity should be valid Numberic value"
                                    }
                                }}
                            />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="qq_quantity"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Unit Measure <IonText color="danger">*</IonText></IonLabel>
                            {listUnitsMeasure && 
                                <Controller 
                                    name="qq_unit_measure"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonSelect
                                            placeholder="Select Unit Measure"
                                            onIonChange={(selected: any) =>{
                                                onChange(selected.detail.value);
                                            }}
                                            onBlur={onBlur}
                                            value={value}
                                            selectedText={value}
                                        >{listUnitsMeasure}</IonSelect>
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Unit Measure is required"
                                        }
                                    }}
                                />
                            }
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="qq_unit_measure"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonRow>
                                <IonCol>
                                    <IonItem class="ion-no-padding">
                                    <IonLabel position="stacked">Estimated Order Frequency <IonText color="danger">*</IonText></IonLabel>
                                    <Controller 
                                        name="qq_order_frequency"
                                        control={control}
                                        render={({ field: {onChange, onBlur, value} }) => {
                                            return <IonSelect
                                                placeholder="Select Order Freq."
                                                onIonChange={(selected: any) =>{
                                                    onChange(selected.detail.value);
                                                }}
                                                onBlur={onBlur}
                                                value={value}
                                            >
                                                <IonSelectOption value="One Time">One Time</IonSelectOption>
                                                <IonSelectOption value="Daily">Daily</IonSelectOption>
                                                <IonSelectOption value="Weekly">Weekly</IonSelectOption>
                                                <IonSelectOption value="Bi-weekly">Bi-weekly</IonSelectOption>
                                                <IonSelectOption value="Monthly">Monthly</IonSelectOption>
                                                <IonSelectOption value="Quarterly">Quarterly</IonSelectOption>
                                                <IonSelectOption value="Semi-annually">Semi-annually</IonSelectOption>
                                                <IonSelectOption value="Annually">Annually</IonSelectOption>
                                                <IonSelectOption value="Other">Other</IonSelectOption>
                                            </IonSelect>
                                        }}
                                        rules={{ 
                                            required: {
                                                value: true,
                                                message: "Order Frequency is required"
                                            }
                                        }}
                                    />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name="qq_order_frequency"
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                                <IonCol>
                                    <IonItem class="ion-no-padding">
                                    <IonLabel position="stacked">Distance From Location and Preferrence Settings <IonText color="danger">*</IonText></IonLabel>
                                    <Controller 
                                        name="qq_location"
                                        control={control}
                                        render={({ field: {onChange, onBlur, value} }) => {
                                            return <IonSelect
                                                placeholder="Select Location Pref."
                                                onIonChange={(selected: any) =>{
                                                    onChange(selected.detail.value);
                                                }}
                                                onBlur={onBlur}
                                                value={value}
                                            >
                                                <IonSelectOption value="1">Local</IonSelectOption>
                                                <IonSelectOption value="2">Regional</IonSelectOption>
                                                <IonSelectOption value="3">National</IonSelectOption>
                                                <IonSelectOption value="4">InterNational</IonSelectOption>
                                            </IonSelect>
                                        }}
                                        rules={{ 
                                            required: {
                                                value: true,
                                                message: "Location Preferrence is required"
                                            }
                                        }}
                                    />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name="qq_location"
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem class="ion-no-padding">
                                    <IonLabel position="stacked">Ongoing Supply Special Details (Maximum of 100 Words)</IonLabel>
                                    <Controller 
                                        name="qq_special_details"
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
                                                message: "Special Details shoud be lessthan 100 words"
                                            }
                                        }}
                                    />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name="qq_special_details"
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                            </IonRow>        
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem lines="none" class="ion-no-padding">
                                <IonLabel className="mb-3" position="stacked">Product or Service Detailed Description (Maximum of 500 Words) <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="qq_desc"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <Editor
                                            value={value}
                                            apiKey = {lfConfig.tinymceKey}
                                            initialValue={(qq && Object.keys(qq).length > 0) && qq.p_desc ? qq.p_desc : ''}
                                            init={CommonService.onEditorConfig(lfConfig.tinymceMaxLength)}
                                            // onEditorChange={handleEditorChange}
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
                                name="qq_desc"
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
export default CreateQQ;
  