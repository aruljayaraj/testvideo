import {
    IonItem, 
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonText,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonTextarea,
    IonSpinner
} from '@ionic/react';
import { close, searchOutline } from 'ionicons/icons';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import Select from 'react-select';
import axios from 'axios';
import { nanoid } from 'nanoid';
import CoreService from '../../shared/services/CoreService';
import './Category.scss';
import { useDispatch } from 'react-redux';
import * as repActions from '../../store/reducers/dashboard/rep';
import * as uiActions from '../../store/reducers/ui';
import * as prActions from '../../store/reducers/dashboard/pr';
import * as resActions from '../../store/reducers/dashboard/resource';
import * as dealActions from '../../store/reducers/dashboard/deal';
import * as qqActions from '../../store/reducers/dashboard/qq';
import { DropDown } from '../../interfaces/Common';
import { lfConfig } from '../../../Constants';

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
    };
    subCategory: {
        value: number|string;
        label: string;
    };
    keywords: string;
    keyword: string;
}

const CategoryModal: React.FC<Props> = ({ showCategoryModal, setShowCategoryModal, selectedItem}) => {

    const dispatch = useDispatch();
    let listCategory: DropDown[]  = [];
    let listSubCategory: DropDown[] = [];
    let optionList; 
    const { ICONS  } = lfConfig;
    let { title, actionType, formType, formId, repId, memId } = showCategoryModal;
    // let { id, buscat_id: catId, catname, subBuscat_id: subcatId, sub_catname, keywords } = selectedItem || {};
    const [selectItem, setSelectedItem] = useState( selectedItem || {} );
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);

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
    
    // const repProfile = useSelector( (state:any) => state.rep.repProfile);
    
    let initialValues = {
        keyword: '',
        category: selectItem.buscat_id? { value: selectItem.buscat_id, label: selectItem.catname }  : { value: '', label: 'Select Category' },
        subCategory: selectItem.subBuscat_id? { value: selectItem.subBuscat_id, label: selectItem.sub_catname }: { value: '', label: 'Select Sub Category' },
        keywords: selectItem.keywords? selectItem.keywords: '',
    };
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: 'onChange'
    });

    const [ category, setCategory ] = useState([]);
    const [ subCategory, setSubCategory ] = useState([]);
    const [state, setState] = useState({
        activeOption: 0,
        filteredResults: [],
        showOptions: false
    });

    const onHandleChange = (e: any) => {
        const currentKeyword = (e.currentTarget.value).toLowerCase();
        setKeyword(currentKeyword);
    };

    const onListSelect = (item: any) => {
        setState( {
            ...state,
            showOptions: false
        });
        setSelectedItem({
            ...selectItem,
            buscat_id: item.buscat_id,
            catname: item.pcatname,
            subBuscat_id: item.sub_buscat_id,
            sub_catname: item.catname,
            keyword: item.keyword
        });
        setValue('category', { value: item.buscat_id, label: item.pcatname }, { shouldValidate: true });
        setValue('subCategory', { value: item.sub_buscat_id, label: item.catname }, { shouldValidate: true });
        setValue('keywords', item.keyword, { shouldValidate: true });
        const currentKeyword = keyword;
    }
    
    const clearSearch = () => {
        setValue('keyword', '', { shouldValidate: true });
        setKeyword('');
        setState({
          ...state,
          activeOption: 0,
          filteredResults: [],
          showOptions: false
        });
    } 

    useEffect(() => {
        let cancel: any;
        if( keyword.length > 2 ){
          setLoading(true);
          const data = {
            action: 'buscat_search',
            keyword: keyword
          }
          axios.post(`v2/search`, data, {
            cancelToken: new axios.CancelToken((c: any)=> cancel = c)
          })
          .then( (result: any) => { 
            const res = result.data;
            setLoading(false);
            if (result.status === 200 && res.status === 'SUCCESS') {
              setState( {
                  ...state,
                  activeOption: 0,
                  filteredResults: res.data,
                  showOptions: true
              });
            }
          })
          .catch( (error: any) => {
            if(axios.isCancel(error)) return; 
            setLoading(false);
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error }));
            console.error(error);
          });
        }  
        return () => {
          if( cancel ){
            cancel();
            setLoading(false);
          }
        };
      },[keyword]);
    
    // For Sub Category Change
    // const onSubCategoryChange = (st: number) => {
        // reset keywords if need
    // };

    // For Category Change Call Back to load States
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
            CoreService.onPostFn('get_buscat', {'action': 'get_buscat_sub_categories', pid: pid}, onCategoryChangeCb);
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
            if( selectItem.buscat_id ){
                CoreService.onPostFn('get_buscat', {'action': 'get_buscat_sub_categories', pid: selectItem.buscat_id}, onSubCategoryCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setCategory(res.data);
            
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setCategory, setSubCategory, selectItem.buscat_id, onSubCategoryCb]);

    // For Category default to load
    useEffect(() => {
        if( showCategoryModal.isOpen === true ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_buscat', {'action': 'get_buscat_categories'}, onCategoryCb);
        }
    }, [dispatch, onCategoryCb, showCategoryModal]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowCategoryModal({ ...showCategoryModal, isOpen: false });
            if( formType === 'repProfile' ){
                dispatch(repActions.setBuscats({ data: res.data }));
            }else if( formType === 'pressRelease' ){
                dispatch(prActions.setBuscat({ data: res.data }));
            }else if( ['document','article', 'audio', 'video'].includes(formType) ){
                dispatch(resActions.setBuscat({ data: res.data }));
            }else if( formType === 'localDeal' ){
                dispatch(dealActions.setBuscat({ data: res.data }));
            }else if( formType === 'localquote' ){
                dispatch(qqActions.setBuscat({ data: res.data }));
            }
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, showCategoryModal, setShowCategoryModal, formType]);

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
                id: selectItem.id? selectItem.id: '',
                category: data.category.value,
                subCategory: data.subCategory.value,
                keywords: data.keywords
            }; //console.log(formData);
            CoreService.onPostFn('update_buscat', formData, onCallbackFn);
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Category/Sub Category should not be empty!' }));
        }
    } 

    // Buscat Delete
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
            listCategory.push({ value: cat.id, label: cat.catname });
            return cat;
        });
    }
    if( subCategory.length > 0 ){
        subCategory.map((scat: any) => {
            listSubCategory.push({ value: scat.id, label: scat.catname });
            return scat;
        });
    }
 
    if (state.showOptions && keyword) {
      optionList = (
        <div className="suggestions-container">
          <ul className="options">
            {state.filteredResults.length > 0 && state.filteredResults.map((item: any, index: number) => { 
              const htmlCode = (item.keyword)? `${item.keyword} : ${item.pcatname} -> ${item.catname}` : `${item.pcatname} -> ${item.catname}`;  
              return (
                <li className="" key={nanoid()} onClick={(e: any) => onListSelect(item)} > {/* onClick={(e: any) => onClick(e, item)} */}
                  <p dangerouslySetInnerHTML={{ __html: htmlCode }}></p>
                </li>
              );
            })}
            {state.filteredResults.length === 0 && <li className="py-2 pr-3 error">No Results found.</li>}
          </ul>
        </div>
      );
    }
    
    return (<>
    
        <form  onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
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
                <IonRow className="catsearchbar">
                    <IonCol className="inner-form">
                        <div className="basic-search">
                            <div className="input-field mt-2">
                                <div className="icon-wrap">
                                    <IonIcon icon={searchOutline} slot="icon-only"></IonIcon>
                                </div>
                                <Controller 
                                    name="keyword"
                                    control={control}
                                    render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonInput type="text" placeholder="Search by keyword"
                                            onKeyUp={(e: any) => {
                                                var str = e.target.value;
                                                if( str.split(/\s+/).length > 10 ){
                                                    e.target.value = str.split(/\s+/).slice(0, 10).join(' ');
                                                }
                                            }} 
                                            onIonChange={(e: any) => {
                                                onChange(e.target.value);
                                                onHandleChange(e);
                                            }}
                                            onBlur={onBlur}
                                            // onKeyDown={onKeyDown}
                                            value={value}
                                        />
                                    }}
                                    rules={{
                                        required: {
                                            value: false,
                                            message: "Keyword is required"
                                        },
                                        // pattern: {
                                        //     value: /^\W*(\w+(\W+|$)){1,10}$/i,
                                        //     message: "Keyword should be valid"
                                        // }
                                    }}
                                />
                                <div className="spinner-wrap">
                                    {loading && <IonSpinner name="dots" /> }
                                    {keyword && keyword.length > 0 && !loading && <IonIcon icon={close} slot="icon-only" onClick={clearSearch}></IonIcon>}
                                </div>
                            </div>
                            {optionList}
                        </div>
                    </IonCol>
                </IonRow>
                
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
                                            onCategoryChange(selected.value);
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
                            {/* <Controller
                                as={IonTextarea}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]: any) => {
                                    return selected.detail.value;
                                }}
                                name="keywords"
                                rules={{
                                    required: false
                                }}
                            /> */}
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
                                        value: /^[a-zA-Z0-9,\-&(\) ]{2,100}$/i,
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
                        <IonButton color="medium" className="ion-margin-top mt-4 mb-3 float-left" onClick={() => deleteBuscatFn(selectItem.id, selectItem.buscat_id, selectItem.subBuscat_id)}>
                            Delete
                        </IonButton> }
                        <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                            Submit
                        </IonButton>
                    </>
                }
                { (!isPlatform('desktop')) &&  actionType === 'edit' &&
                    <IonButton expand="block" fill="clear" color="medium" 
                        className="ion-margin-top mt-5"
                        onClick={() => deleteBuscatFn(selectItem.id, selectItem.buscat_id, selectItem.subBuscat_id)}
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
  