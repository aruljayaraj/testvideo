import {
    IonItem, 
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonNote
  } from '@ionic/react';
  import { close } from 'ionicons/icons';
import React, { useCallback } from 'react';
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { isPlatform } from '@ionic/react';
import { Editor } from '@tinymce/tinymce-react';

import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';

interface Props {
    showAboutProfileModal: boolean
    setShowAboutProfileModal: Function
}

const AboutProfileModal: React.FC<Props> = ({showAboutProfileModal, setShowAboutProfileModal}) => {
    let { repid,memid } = useParams();
    const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    let initialValues = {
        profileDesc: (repProfile)? repProfile.profile_description: ''
    };
    const { control, errors, handleSubmit } = useForm({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

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
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        if(res.status === 'SUCCESS'){
            dispatch(repActions.setRepProfile({ data: res.data }));
            window.location.reload();
            setShowAboutProfileModal(false);
        }
    }, [dispatch, setShowAboutProfileModal]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const user = {
            action: 'profile_desc_update',
            memID: memid,
            repID: repid,
            ...data
        };
        CoreService.onPostFn('member_update', user, onCallbackFn);
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop') || isPlatform('tablet')? 'end': 'start' }>
                        <IonButton onClick={() => setShowAboutProfileModal(false)}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (isPlatform('android') || isPlatform('ios')) &&  
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            Save
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle>Edit Rep Profile Description</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen>
            <IonGrid>
                
                <IonRow>
                    <IonCol>
                        <IonItem lines="none" class="ion-no-padding">
                            <IonLabel className="mb-3" position="stacked">Profile Description <IonText color="danger">*</IonText></IonLabel>
                            { showAboutProfileModal === true && <Controller
                                as={
                                    <Editor
                                    apiKey="p5k59vuava18l9axn125wa4fl2qsmhmwsxfs6krrtffntke8"
                                    initialValue=""
                                    init={{
                                        max_chars: lfConfig.tinymceMaxLength, // max. allowed chars
                                        /*setup: function(editor: any) {
                                            editor.on('click', function(e: any) {
                                              console.log('Editor was clicked');
                                            });
                                          },*/
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
                                name="profileDesc"
                                rules={{
                                    required: true
                                }}
                            />}
                            <IonNote className="mt-2">Write a profile of your skills that will be seen on our system: (maximum 500 words)</IonNote><br />
                        </IonItem>
                        {showError("profileDesc", "Profile Description")}
                    </IonCol>
                    
                </IonRow>

                { (isPlatform('desktop') || isPlatform('tablet')) && 
                    <IonButton color="greenbg" className="ion-margin-top mt-5 mb-3 float-right" type="submit" >
                        Submit
                    </IonButton>
                }
                
                </IonGrid>
            </IonContent>
        </form>  
    </>);
};
  
export default AboutProfileModal;