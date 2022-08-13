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
    IonTextarea
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import Select from 'react-select';

import CoreService from '../../shared/services/CoreService';
import './Category.scss';
import { useDispatch } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';
import * as resActions from '../../store/reducers/dashboard/resource';
import { DropDown } from '../../interfaces/Common';

// Note 
/* isOpen: false,
    title: '', // Modal Title
    formType: '', //  Rep or Company or Resource
    actionType: '', // new or edit
    formId: '', // id or any resource id
    repId: '', // repprofile id 
    memId: '', // Member id
*/

interface Props {
    showCategoryModal: any,
    setShowCategoryModal: Function,
    selectedItem: any
}

type FormInputs = {
    category: {
        value: number|string;
        label: string;
        pid: number|string;
    };
    subCategory: {
        value: number|string;
        label: string;
    };
    keywords: string;
}

const ResCategoryModal: React.FC<Props> = ({ showCategoryModal, setShowCategoryModal, selectedItem}) => {
    let listCategory: DropDown[]  = [];
    let listSubCategory: DropDown[] = [];
    
    let { title, actionType, formType, formId, repId, memId } = showCategoryModal;
    let { id, buscat_id: catId, catname, subBuscat_id: subcatId, sub_catname, keywords } = selectedItem || {};

    const customStyles = {
        menu: (provided: any, state: any) => ({
            ...provided,
            // width: state.selectProps.width,
            // borderBottom: '1px dotted pink',
            color: state.selectProps.menuColor,
            padding: 20,
            zIndex: 1001
        })
    }
    
    const dispatch = useDispatch();
    const [ category, setCategory ] = useState([]);
    const [ subCategory, setSubCategory ] = useState([]);
    let initialValues = {
        category: catId? { value: catId, label: catname }  : { value: '', label: 'Select Category' },
        subCategory: subcatId? { value: subcatId, label: sub_catname }: { value: '', label: 'Select Sub Category' },
        keywords: keywords? keywords: '',
    };
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    // For Category Change Call Back to load subcats
    const onCategoryChangeCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){ 
            setSubCategory([]);
            setSubCategory(res.data);
            setValue('subCategory', { value: '', label: 'Select Sub Category' }, { shouldValidate: true });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setSubCategory, setValue]);
    const onCategoryChange = (pid: string) => {
        if( pid ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_buscat', {'action': 'get_resource_sub_categories', pid: pid}, onCategoryChangeCb);
        }
    };

    // For Sub Category default to load callback
    const onSubCategoryCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if(res.status === 'SUCCESS'){ 
                setSubCategory([]);
                setSubCategory(res.data);
            }
            dispatch(uiActions.setShowLoading({ loading: false }));
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setSubCategory]);
    // For Category default to load callback
    const onCategoryCb = useCallback((res: any) => {
        dispatch(uiActions.setShowLoading({ loading: false }));
        if(res.status === 'SUCCESS'){
            // For default values to load on Sub Category
            setCategory([]);
            setSubCategory([]);
            if( catId ){
                CoreService.onPostFn('get_buscat', {'action': 'get_resource_sub_categories', pid: catId}, onSubCategoryCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setCategory(res.data);
            
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setCategory, setSubCategory, catId, onSubCategoryCb]);
    // For Category default to load
    useEffect(() => {
        if( showCategoryModal.isOpen === true ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_buscat', {'action': 'get_resource_categories'}, onCategoryCb);
        }
    }, [dispatch, onCategoryCb, showCategoryModal]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowCategoryModal({ ...showCategoryModal, isOpen: false });
            dispatch(resActions.setBuscat({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, showCategoryModal, setShowCategoryModal]);
    const onSubmit = (data: any) => {
        if( data.category.value && data.subCategory.value ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const formData = {
                formId: formId,
                repId: repId,
                memId: memId,
                action: 'update_buscat',
                actionType: actionType,
                formType: formType,
                id: id,
                category: data.category.value,
                subCategory: data.subCategory.value,
                keywords: data.keywords
            }; //console.log(formData);
            CoreService.onPostFn('update_buscat', formData, onCallbackFn);
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: "Category/Sub Category should not be empty!" }));
        }
    } 

    const deleteBuscatFn = (did: number, dcatId: number, dsubcatId: number) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const formData = {
            formId: formId,
            repId: repId,
            memId: memId,
            action: 'delete_buscat',
            actionType: actionType,
            formType: formType,
            id: did,
            category: dcatId,
            subCategory: dsubcatId
        };
        CoreService.onPostFn('update_buscat', formData, onCallbackFn);
    }

    if( category.length > 0 ){
        category.map((cat: any) => {
            listCategory.push({ value: cat.id, label: cat.catname, pid: cat.parentid });
            return cat;
        });
    }
    if( subCategory.length > 0 ){
        subCategory.map((scat: any) => {
            listSubCategory.push({ value: scat.id, label: scat.catname });
            return scat;
        });
    }
    
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="appbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowCategoryModal({
                            ...showCategoryModal, 
                            isOpen: false
                        })}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (!isPlatform('desktop')) &&  
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            <strong>Save</strong>
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle> {title}</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent id="buscat-form-wrap" fullscreen className="ion-padding">
            <IonGrid>
                
                <IonRow>
                    <IonCol>
                        <IonLabel className="mb-2">Category <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-2">
                            <Controller 
                                name="category"
                                control={control}
                                render={({ field }) => {
                                    return <Select
                                        {...field}
                                        placeholder="Select Category"
                                        options={listCategory}
                                        onChange={(selected: any) =>{
                                            onCategoryChange(selected.pid);
                                            field.onChange(selected);
                                        }}
                                        styles={customStyles}
                                    />
                                }}
                                rules={{ 
                                    required: {
                                        value: true,
                                        message: "Category is required"
                                    }
                                }}
                            />
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="category"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                </IonRow> 
                { listSubCategory.length > 0 && <>
                <IonRow>    
                    <IonCol>
                    <IonLabel className="mb-2">Sub Category <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-2">
                            <Controller 
                                name="subCategory"
                                control={control}
                                render={({ field }) => {
                                    return <Select
                                        {...field}
                                        placeholder="Select Sub Category"
                                        options={listSubCategory}
                                        onChange={(selected: any) =>{
                                            field.onChange(selected);
                                        }}
                                        styles={customStyles}
                                    />
                                }}
                                rules={{ 
                                    required: {
                                        value: true,
                                        message: "Sub Category is required"
                                    }
                                }}
                            />
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="subCategory"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                  </IonCol>
                </IonRow>
                 
                <IonRow>    
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Keywords</IonLabel>
                            <Controller 
                                name="keywords"
                                control={control}
                                render={({ field }) => {
                                    return <IonTextarea
                                        {...field}
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    pattern: {
                                        value: /^[a-zA-Z0-9,\- ]{2,100}$/i,
                                        message: "Invalid Keyword"
                                    }
                                }}
                            />
                        </IonItem>
                        <p className="font-weight-light text-13">
                            <IonText color="medium">
                            Add keywords to describe your products and services. Keywords or sets of Keywords must be separated by a comma(),. eg: green football, red football, green footbal tape. 
                            </IonText>
                        </p>
                        <ErrorMessage
                            errors={errors}
                            name="keywords"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                
                  </IonCol>
                </IonRow>
                </>}
                
                <div className="mt-4">           
                { (isPlatform('desktop')) && 
                    <>
                        { actionType === 'edit' && 
                        <IonButton color="medium" className="ion-margin-top mt-4 mb-3 float-left" onClick={() => deleteBuscatFn(id, catId, subcatId)}>
                            Delete
                        </IonButton> }
                        <IonButton color="appbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                            Submit
                        </IonButton>
                    </>
                }
                { (!isPlatform('desktop')) &&  actionType === 'edit' &&
                    <IonButton expand="block" fill="clear" color="medium" 
                        className="ion-margin-top mt-5"
                        onClick={() => deleteBuscatFn(id, catId, subcatId)}
                        >
                        Delete
                    </IonButton>
                }
                </div> 
                </IonGrid>
            </IonContent> 
        </form> 
    </>);
};
  
export default ResCategoryModal;
  