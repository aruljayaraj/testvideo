import {
    IonItem, 
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonSelect,
    IonSelectOption,
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
import { isPlatform } from '@ionic/react';

import CoreService from '../../shared/services/CoreService';
import './Category.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../store/reducers/ui';
import * as prActions from '../../store/reducers/dashboard/pr';
import * as resActions from '../../store/reducers/dashboard/resource';

// Note 
/* isOpen: false,
    title: '', // Modal Title
    type: '', // 0 or 1 ==> (B2B or B2C)
    formType: '', //  Rep or Company or Resource
    actionType: '', // new or edit
    formId: '', // id or resource id
    repId: '', // repprofile id 
    memId: '', // Member id
*/
interface Props {
    showCategoryModal: any,
    setShowCategoryModal: Function,
    selectedItem: any
}
const CategoryModal: React.FC<Props> = ({ showCategoryModal, setShowCategoryModal, selectedItem}) => {

    let listCategory = null;
    let listSubCategory = null;
    
    let { title, type, actionType, formType, formId, repId, memId } = showCategoryModal;
    let { id, buscat_id: catId, subBuscat_id: subcatId, keywords } = selectedItem || {};
    
    const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [ category, setCategory ] = useState([]);
    const [ subCategory, setSubCategory ] = useState([]);
    let initialValues = {
        category: catId? catId : '',
        subCategory: subcatId? subcatId: '',
        keywords: keywords? keywords: '',
    };
    const { control, errors, handleSubmit } = useForm({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    
    // For Sub Category Change
    // const onSubCategoryChange = (st: number) => {
        // reset keywords if need
    // };

    // For Country Change Call Back to load States
    const onCategoryChangeCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setSubCategory([]);
            setSubCategory(res.data);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setSubCategory]);
    const onCategoryChange = (pid: string) => {
        if( pid ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_buscat', {'action': 'get_buscat_sub_categories', pid: pid}, onCategoryChangeCb);
        }
    };

    // For Category default to load callback
    const onCategoryCb = useCallback((res: any) => {
        dispatch(uiActions.setShowLoading({ loading: false }));
        if(res.status === 'SUCCESS'){
            // For default values to load on Sub Category
            setCategory([]);
            setSubCategory([]);
            if( catId ){
                CoreService.onPostFn('get_buscat', {'action': 'get_buscat_sub_categories', pid: catId}, onCategoryChangeCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setCategory(res.data);
            
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setCategory, setSubCategory, catId, onCategoryChangeCb]);
    // For Category default to load
    useEffect(() => {
        if( showCategoryModal.isOpen === true ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_buscat', {'action': 'get_buscat_categories', type: type}, onCategoryCb);
        }
    }, [dispatch, onCategoryCb, type, showCategoryModal]);

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
            setShowCategoryModal({ ...showCategoryModal, isOpen: false });
            if( formType === 'repProfile' ){
                if( parseInt(type) === 1 ){
                    dispatch(repActions.setB2C({ data: res.data })); 
                }else{
                    dispatch(repActions.setB2B({ data: res.data }));
                }
            }else if( formType === 'pressRelease' ){
                dispatch(prActions.setBuscat({ data: res.data }));
            }else if( ['document','article', 'audio', 'video'].includes(formType) ){
                dispatch(resActions.setBuscat({ data: res.data }));
            }
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, showCategoryModal, setShowCategoryModal, formType, type]);
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        // console.log(showCategoryModal);
        const formData = {
            formId: formId,
            repId: repId,
            memId: memId,
            type: type,
            action: 'update_buscat',
            actionType: actionType,
            formType: formType,
            id: id,
            ...data
        }; //console.log(formData);
        CoreService.onPostFn('update_buscat', formData, onCallbackFn);
    } 

    // Buscat Delete
    /*const deleteBuscatFnCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowCategoryModal({ ...showCategoryModal, isOpen: false });
            if( type === 1 ){
                dispatch(repActions.setB2C({ data: res.data })); 
            }else{
                dispatch(repActions.setB2B({ data: res.data }));
            }
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, showCategoryModal, setShowCategoryModal, type]); */
    const deleteBuscatFn = (did: number, dcatId: number, dsubcatId: number) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        // console.log(showCategoryModal);
        const formData = {
            formId: formId,
            repId: repId,
            memId: memId,
            type: type,
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
        listCategory = category.map((cat: any) =>
            <IonSelectOption value={cat.id} key={cat.id}>{cat.catname}</IonSelectOption> 
        );
    }
    if( subCategory.length > 0 ){
        listSubCategory = subCategory.map((scat: any) =>
            <IonSelectOption value={scat.id} key={scat.id}>{scat.catname}</IonSelectOption> 
        );
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop') || isPlatform('tablet')? 'end': 'start' }>
                        <IonButton onClick={() => setShowCategoryModal({
                            ...showCategoryModal, 
                            isOpen: false
                        })}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (isPlatform('android') || isPlatform('ios')) &&  
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            <strong>Save</strong>
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle> {title}</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
            <IonGrid>

                <IonRow>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Category <IonText color="danger">*</IonText></IonLabel>
                            { repProfile && listCategory && 
                                <Controller
                                as={
                                    <IonSelect name="country" placeholder="Select Category">
                                        {listCategory}
                                    </IonSelect>
                                }
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    onCategoryChange(selected.detail.value);
                                    return selected.detail.value;
                                }}
                                name="category"
                                rules={{
                                    required: true
                                }}
                            />}
                            
                        </IonItem>
                        {showError("category", "Category")}
                    </IonCol>
                </IonRow>
                { listSubCategory && <>
                <IonRow>    
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Sub Category <IonText color="danger">*</IonText></IonLabel>
                            <Controller
                                as={
                                    <IonSelect name="state" placeholder="Select Sub Category">
                                        {listSubCategory}
                                    </IonSelect>
                                }
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    // onStateChange(selected.detail.value);
                                    return selected.detail.value;
                                }}
                                name="subCategory"
                                rules={{
                                    required: true
                                }}
                            />
                        </IonItem>
                        {showError("subCategory", "Sub Category")}
                  </IonCol>
                </IonRow>
                 
                <IonRow>    
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Keywords</IonLabel>
                            <Controller
                                as={IonTextarea}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    // onSubCategoryChange(selected.detail.value);
                                    return selected.detail.value;
                                }}
                                name="keywords"
                                rules={{
                                    required: false
                                }}
                            />
                        </IonItem>
                        <p className="font-weight-light text-13">
                            <IonText color="medium">
                            Add keywords to describe your products and services. Keywords or sets of Keywords must be separated by a comma(),. eg: green football, red football, green footbal tape. 
                            </IonText>
                        </p>
                        {showError("keywords", "Keywords")}
                
                  </IonCol>
                </IonRow>
                </>}
                
                <div className="mt-4">           
                { (isPlatform('desktop') || isPlatform('tablet')) && 
                    <>
                        { actionType === 'edit' && 
                        <IonButton color="medium" className="ion-margin-top mt-4 mb-3 float-left" onClick={() => deleteBuscatFn(id, catId, subcatId)}>
                            Delete
                        </IonButton> }
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                            Submit
                        </IonButton>
                    </>
                }
                { (!isPlatform('desktop') || !isPlatform('tablet')) &&  actionType === 'edit' &&
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
  
export default CategoryModal;
  