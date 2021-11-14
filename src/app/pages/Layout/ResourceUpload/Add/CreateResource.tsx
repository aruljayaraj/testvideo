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
    IonCheckbox
} from '@ionic/react';
import React, { useState, useCallback } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Editor } from '@tinymce/tinymce-react';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as resActions from '../../../../store/reducers/dashboard/resource';
import '../ResourceUpload.scss';
import CoreService from '../../../../shared/services/CoreService';
import { lfConfig } from '../../../../../Constants';
import ResStepInd from './ResStepInd';
import CommonService from '../../../../shared/services/CommonService';

type FormInputs = {
    res_title: string;
    res_embed: boolean;
    res_shared: boolean;
    res_make_public: boolean;
    res_desc: string;
}

const CreateResource: React.FC = () => {
    const dispatch = useDispatch();
    const authValues = useSelector( (state:any) => state.auth.data.user);
    const resource = useSelector( (state:any) => state.res.resource); //console.log(resource);
    const [addRes, setAddRes] = useState({ status: false, memID: '', ID: '' });
    let { res_type, id, step } = useParams<any>();
    const resTypeText = res_type ? res_type.charAt(0).toUpperCase() + res_type.slice(1): '';

    let initialValues = {
        res_title: (resource && Object.keys(resource).length > 0) ? resource.title : '',
        res_embed: (resource && Object.keys(resource).length > 0)? ((resource.embed === 'Yes')? true: false): true,
        res_shared: (resource && Object.keys(resource).length > 0)? ((resource.shared === 'Yes')? true: false): true,
        res_make_public: (resource && Object.keys(resource).length > 0)? ((resource.make_public === 'Yes')? true: false): true,
        res_desc: (resource && Object.keys(resource).length > 0) ? resource.description : '',
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(resActions.setResource({ data: res.data }));
            setAddRes({ status: true, memID: res.data.mem_id, ID: res.data.id  });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [setAddRes, dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: (id && step)? 'res_update': 'res_add',
            resType: res_type,
            memID: authValues.ID,
            repID: authValues.repID,
            ...data
        }; 
        if( id && step ){
            fd.formID = id;
        }
        CoreService.onPostFn('res_update', fd, onCallbackFn);
    }

    if( addRes.status  ){
      return <Redirect to={`/layout/add-resource/${res_type}/${addRes.ID}/${addRes.memID}/2`} />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ResStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
            <IonCardTitle className="card-custom-title">Create a {resTypeText}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">{resTypeText} Title (Maximum 10 Words)  <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="res_title"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="text"
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 10 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 10).join(" ");
                                                }
                                            }}
                                            onIonChange={(val: any) => onChange(val)}
                                            onBlur={onBlur}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Title is required"
                                        },
                                        pattern: {
                                            value: /^\W*(\w+(\W+|$)){1,10}$/i,
                                            message: "Title shoud be lessthan 10 words"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="res_title"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller 
                                name="res_embed"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonCheckbox color="greenbg" slot="start"
                                        checked={value}
                                        onIonChange={(e: any) =>{
                                            onChange(e.detail.checked);
                                        }}
                                        onBlur={onBlur}
                                    />
                                }}
                            />
                            <IonLabel position="stacked">Allow others to embed your resource</IonLabel>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller 
                                name="res_shared"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonCheckbox color="greenbg" slot="start"
                                        checked={value}
                                        onIonChange={(e: any) =>{
                                            onChange(e.detail.checked);
                                        }}
                                        onBlur={onBlur}
                                    />
                                }}
                            />
                            <IonLabel position="stacked">Share your resource in the Public</IonLabel>
                            </IonItem>
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                           <Controller 
                                name="res_make_public"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonCheckbox color="greenbg" slot="start"
                                        checked={value}
                                        onIonChange={(e: any) =>{
                                            onChange(e.detail.checked);
                                        }}
                                        onBlur={onBlur}
                                    />
                                }}
                            />
                            <IonLabel position="stacked">Make Public</IonLabel>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem lines="none" class="ion-no-padding">
                                <IonLabel className="mb-3" position="stacked">{resTypeText} Description <IonText color="danger">*</IonText></IonLabel>
                                <Controller 
                                    name="res_desc"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <Editor
                                            value={value}
                                            apiKey={lfConfig.tinymceKey}
                                            init={CommonService.onEditorConfig(lfConfig.tinymceResourceMaxLength)}
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
                                name="res_desc"
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
export default CreateResource;
  