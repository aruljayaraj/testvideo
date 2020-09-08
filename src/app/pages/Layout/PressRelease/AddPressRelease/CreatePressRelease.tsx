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
import { Editor } from '@tinymce/tinymce-react';

import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as prActions from '../../../../store/reducers/dashboard/pr';
import '../PressRelease.scss';
import CoreService from '../../../../shared/services/CoreService';
import { lfConfig } from '../../../../../Constants';
import PRStepInd from './PRStepInd';

const CreatePressRelease: React.FC = () => {
    const dispatch = useDispatch();
    const authValues = useSelector( (state:any) => state.auth.data.user);
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const [addPR, setAddPR] = useState({ status: false, memID: '', ID: '' });
    let { id, step } = useParams(); 

    let initialValues = {
        pr_headline: (pr && Object.keys(pr).length > 0) ? pr.pr_name : '',
        pr_date: (pr && Object.keys(pr).length > 0) ? pr.pr_date : '',
        pr_overview: (pr && Object.keys(pr).length > 0) ? pr.pr_overview : '',
        pr_quote: (pr && Object.keys(pr).length > 0) ? pr.pr_quote : '',
        pr_desc: (pr && Object.keys(pr).length > 0) ? pr.pr_desc : '',
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
                <IonCardTitle >Create a Press Release</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Headline (Maximum 10 Words)  <IonText color="danger">*</IonText></IonLabel>
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
                            name="pr_headline"
                            rules={{
                                required: true,
                                pattern: {
                                    value: /^\W*(\w+(\W+|$)){1,10}$/i,
                                    message: "Headline shoud be lessthan 10 words"
                                }
                            }}
                        />
                        </IonItem>
                        {showError("pr_headline", "Headline")}
                    </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Date (Enter Actual Release Date)</IonLabel>
                                <Controller
                                as={IonDatetime}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                name="pr_date"
                                rules={{
                                    required: true
                                }}
                                />
                            </IonItem>
                            <IonText>Your release will not be live until the selected date</IonText>
                            {showError("pr_date", "Date")}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Overview (Maximum 50 Words)</IonLabel>
                                <Controller
                                as={IonTextarea}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                onKeyUp={(e: any) => {
                                    var str = e.target.value;
                                    if( str.split(/\s+/).length > 50 ){
                                        e.target.value = str.split(/\s+/).slice(0, 50).join(" ");
                                    }
                                }}
                                name="pr_overview"
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^\W*(\w+(\W+|$)){1,50}$/i,
                                        message: "Overview shoud be lessthan 50 words"
                                    }
                                }}
                                />
                            </IonItem>
                            {showError("pr_overview", "Overview")}
                        </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Quote (Maximum 25 Words)</IonLabel>
                                <Controller
                                as={IonTextarea}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                onKeyUp={(e: any) => {
                                    var str = e.target.value;
                                    if( str.split(/\s+/).length > 25 ){
                                        e.target.value = str.split(/\s+/).slice(0, 25).join(" ");
                                    }
                                }}
                                name="pr_quote"
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^\W*(\w+(\W+|$)){1,25}$/i,
                                        message: "Quote shoud be lessthan 25 words"
                                    }
                                }}
                                />
                            </IonItem>
                            {showError("pr_quote", "Quote")}
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem lines="none" class="ion-no-padding">
                                <IonLabel className="mb-3" position="stacked">Press Release Description <IonText color="danger">*</IonText></IonLabel>
                                <Controller
                                    as={
                                        <Editor
                                        apiKey="p5k59vuava18l9axn125wa4fl2qsmhmwsxfs6krrtffntke8"
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
                                        // onEditorChange={handleEditorChange}
                                    />
                                    }
                                    className="mt-3"
                                    control={control}
                                    onChange={([cdata]) => {
                                        return cdata.level.content;
                                    }}
                                    name="pr_desc"
                                    rules={{
                                        required: true
                                    }}
                                />
                            </IonItem>
                            {showError("pr_desc", "Press Release Description")}
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
  