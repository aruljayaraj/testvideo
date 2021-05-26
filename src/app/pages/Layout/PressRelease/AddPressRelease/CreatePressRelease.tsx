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
    IonTextarea,
    IonText
} from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Editor } from '@tinymce/tinymce-react';
import { format } from 'date-fns';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as prActions from '../../../../store/reducers/dashboard/pr';
import '../PressRelease.scss';
import CoreService from '../../../../shared/services/CoreService';
import { lfConfig } from '../../../../../Constants';
import PRStepInd from './PRStepInd';

type FormInputs = {
    pr_headline: string;
    pr_date: string;
    pr_overview: string;
    pr_quote: string;
    pr_desc: string;
}

const CreatePressRelease: React.FC = () => {
    const dispatch = useDispatch();
    const authValues = useSelector( (state:any) => state.auth.data.user);
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const [addPR, setAddPR] = useState({ status: false, memID: '', ID: '' });
    let { id, step } = useParams<any>(); 

    let initialValues = {
        pr_headline: (pr && Object.keys(pr).length > 0) ? pr.pr_name : '',
        pr_date: (pr && Object.keys(pr).length > 0) ? pr.pr_date : '',
        pr_overview: (pr && Object.keys(pr).length > 0) ? pr.pr_overview : '',
        pr_quote: (pr && Object.keys(pr).length > 0) ? pr.pr_quote : '',
        pr_desc: (pr && Object.keys(pr).length > 0) ? pr.pr_desc : '',
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(prActions.setPressRelease({ data: res.data }));
            setAddPR({ status: true, memID: res.data.pr_mem_id, ID: res.data.pr_id  });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [setAddPR, dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: (id && step)? 'pr_update': 'pr_add',
            memID: authValues.ID,
            ...data
        }; 
        if( id && step ){
            fd.formID = id;
        }
        CoreService.onPostFn('pr_update', fd, onCallbackFn);
    }

    if( addPR.status  ){
      return <Redirect to={`/layout/add-press-release/${addPR.ID}/${addPR.memID}/2`} />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <PRStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">Create a Press Release</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Headline (Maximum 10 Words)  <IonText color="danger">*</IonText></IonLabel>
                        <Controller 
                            name="pr_headline"
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
                                    message: "Headline is required"
                                },
                                pattern: {
                                    value: /^\W*(\w+(\W+|$)){1,10}$/i,
                                    message: "Headline shoud be lessthan 10 words"
                                }
                            }}
                        />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="pr_headline"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Date (Enter Actual Release Date)</IonLabel>
                                <Controller 
                                    name="pr_date"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonDatetime
                                            displayFormat="DD-MMM-YYYY" 
                                            min={format(new Date(), 'yyyy-MM-dd')}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Date is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <IonText>Your release will not be live until the selected date</IonText>
                            <ErrorMessage
                                errors={errors}
                                name="pr_date"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Overview (Maximum 50 Words)</IonLabel>
                                <Controller 
                                    name="pr_overview"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonTextarea 
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 50 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 50).join(" ");
                                                }
                                            }}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,50}$/i,
                                            message: "Overview shoud be lessthan 50 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="pr_overview"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Quote (Maximum 25 Words)</IonLabel>
                                <Controller 
                                    name="pr_quote"
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonTextarea 
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 25 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 25).join(" ");
                                                }
                                            }}
                                            onIonChange={(e: any) => onChange(e.target.value)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    defaultValue=""
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,25}$/i,
                                            message: "Quote shoud be lessthan 25 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="pr_quote"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem lines="none" class="ion-no-padding">
                                <IonLabel className="mb-3" position="stacked">Press Release Description <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="pr_desc"
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
                                            message: "Press Release Description is required"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="pr_desc"
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
  