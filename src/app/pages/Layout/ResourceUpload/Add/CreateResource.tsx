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
import { Editor } from '@tinymce/tinymce-react';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as resActions from '../../../../store/reducers/dashboard/resource';
import '../ResourceUpload.scss';
import CoreService from '../../../../shared/services/CoreService';
import { lfConfig } from '../../../../../Constants';
import ResStepInd from './ResStepInd';

const CreateResource: React.FC = () => {
    const dispatch = useDispatch();
    const authValues = useSelector( (state:any) => state.auth.data.user);
    const resource = useSelector( (state:any) => state.res.resource); //console.log(resource);
    const [addRes, setAddRes] = useState({ status: false, memID: '', ID: '' });
    let { res_type, id, step } = useParams();
    const resTypeText = res_type ? res_type.charAt(0).toUpperCase() + res_type.slice(1): '';

    let initialValues = {
        res_title: (resource && Object.keys(resource).length > 0) ? resource.title : '',
        res_embed: (resource && resource.embed === 'Yes')? true: false,
        res_shared: (resource && resource.shared === 'Yes')? true: false,
        res_make_public: (resource && resource.make_public === 'Yes')? true: false,
        res_desc: (resource && Object.keys(resource).length > 0) ? resource.description : '',
    };
    const { control, errors, handleSubmit } = useForm({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    /**
     *
     * @param _fieldName
     */
    const showError = (_fieldName: string, msg: string) => {
        let error = (errors as any)[_fieldName];
        return error ? (
        (error.ref.name === _fieldName)? (
            <div className="invalid-feedback">
            {error.message || `${msg} is required`}
        </div>
        ) : null
        ) : null;
    };

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
            <IonCardTitle >Create a {resTypeText}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">{resTypeText} Title (Maximum 10 Words)  <IonText color="danger">*</IonText></IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value
                                }}
                                onKeyUp={(e: any) => {
                                    var str = e.target.value;
                                    if( str.split(/\s+/).length > 10 ){
                                        e.target.value = str.split(/\s+/).slice(0, 10).join(" ");
                                    }
                                }}
                                name="res_title"
                                rules={{
                                    required: true,
                                    pattern: {
                                        value: /^\W*(\w+(\W+|$)){1,10}$/i,
                                        message: "Title shoud be lessthan 10 words"
                                    }
                                }}
                            />
                            </IonItem>
                            {showError("res_title", "Title")}
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={<IonCheckbox color="greenbg" checked slot="start"></IonCheckbox>}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([e]) => {
                                    return e.detail.checked;
                                }}
                                name="res_embed"
                            />
                            <IonLabel position="stacked">Allow others to embed your resource</IonLabel>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={<IonCheckbox color="greenbg" checked slot="start"></IonCheckbox>}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([e]) => {
                                    return e.detail.checked;
                                }}
                                name="res_shared"
                            />
                            <IonLabel position="stacked">Share your resource in the Public</IonLabel>
                            </IonItem>
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                            <Controller
                                as={<IonCheckbox color="greenbg" checked slot="start"></IonCheckbox>}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([e]) => {
                                    return e.detail.checked;
                                }}
                                name="res_make_public"
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
                                    as={
                                        <Editor
                                        apiKey="p5k59vuava18l9axn125wa4fl2qsmhmwsxfs6krrtffntke8"
                                        initialValue=""
                                        init={{
                                            max_chars: lfConfig.tinymceResourceMaxLength, // max. allowed words
                                            
                                            init_instance_callback: function (editor: any) {
                                                editor.on('change', function (e: Event) {
                                                    let content = editor.contentDocument.body.innerText;
                                                    // console.log(content.split(/[\w\u2019\'-]+/).length);
                                                    if(content.split(/[\w\u2019\'-]+/).length > lfConfig.tinymceResourceMaxLength){
                                                        editor.contentDocument.body.innerText = content.split(/\s+/).slice(0, lfConfig.tinymceResourceMaxLength).join(" ");
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
                                        // onEditorChange={handleEditorChange}
                                    />
                                    }
                                    className="mt-3"
                                    control={control}
                                    onChange={([cdata]) => {
                                        return cdata.level.content;
                                    }}
                                    name="res_desc"
                                    rules={{
                                        required: true
                                    }}
                                />
                            </IonItem>
                            {showError("res_desc",  "Description")}
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
  