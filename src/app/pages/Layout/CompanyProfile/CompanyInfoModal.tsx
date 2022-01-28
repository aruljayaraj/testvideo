import {
    IonItem, 
    IonLabel,
    IonInput,
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
    IonTextarea,
    IonNote
  } from '@ionic/react';
  import { close } from 'ionicons/icons';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import Select from 'react-select';

import CoreService from '../../../shared/services/CoreService';
import './CompanyProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';
import * as frmdataActions from '../../../store/reducers/common';
import { DropDown } from '../../../interfaces/Common';

type FormInputs = {
    company_name: string;
    short_desc: string;
    email: string;
    firstname: string;
    lastname: string;
    address1: string;
    address2: string;
    country: {
        value: string; 
        label: string
    };
    state: {
        value: string; 
        label: string
    };
    city: {
        value: string; 
        label: string
    };
    postal: string;
    phone_code: {
        value: string; 
        label: string
    };
    phone: string;
    fax: string;
    mobile_code: {
        value: string; 
        label: string
    };
    mobile: string;
    website: string;
}

interface Props {
    showCompanyModal: boolean,
    setShowCompanyModal: Function
}

const CompanyInfoModal: React.FC<Props> = ({showCompanyModal, setShowCompanyModal}) => {

    let listCountry: DropDown[] = [];
    let listState: DropDown[] = [];
    let listCity: DropDown[] = []; 
    let listCodes: DropDown[] = [];
    const customStyles = {
        menu: (provided: any, state: any) => ({ 
            ...provided,
            // width: state.selectProps.width,
            // borderBottom: '1px dotted pink',
            boxShadow: "none !important",
            color: state.selectProps.menuColor,
            padding: "0 10 10 10",
            zIndex: 1001
        })
    }
    
    const dispatch = useDispatch();
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const isdCodes = useSelector( (state:any) => state.formdata.isdCodes);
    const [ country, setCountry ] = useState([]);
    const [ state, setState ] = useState([]);
    const [ city, setCity ] = useState([]);
    let initialValues = {
        company_name: (Object.keys(comProfile).length > 0)? comProfile.company_name: '',
        short_desc: (Object.keys(comProfile).length > 0)? comProfile.short_desc: '',
        email: (Object.keys(comProfile).length > 0)? comProfile.email: '',
        firstname: (Object.keys(comProfile).length > 0)? comProfile.firstname: '',
        lastname: (Object.keys(comProfile).length > 0)? comProfile.lastname: '',
        address1: (Object.keys(comProfile).length > 0)? comProfile.address1: '',
        address2: (Object.keys(comProfile).length > 0)? comProfile.address2: '',
        country: (Object.keys(comProfile).length > 0 && comProfile.country_code)? { value: comProfile.country_code, label: comProfile.country }: { value: '', label: 'Select Country' },
        state: (Object.keys(comProfile).length > 0 && comProfile.state_code)? { value: comProfile.state_code, label: comProfile.state }: { value: '', label: 'Select State' },
        city: (Object.keys(comProfile).length > 0 && comProfile.city)? { value: comProfile.city, label: comProfile.city }: { value: '', label: 'Select City' },
        postal: (Object.keys(comProfile).length > 0)? comProfile.postal: '',
        phone_code: (Object.keys(comProfile).length > 0 && comProfile.phone_code)? { value: comProfile.phone_code, label: comProfile.phone_code_label } : { value: '', label: 'Select Code' },
        phone: (Object.keys(comProfile).length > 0)? comProfile.phone: '',
        fax: (Object.keys(comProfile).length > 0)? comProfile.fax: '',
        mobile_code: (Object.keys(comProfile).length > 0 && comProfile.mobile_code)? { value: comProfile.mobile_code, label: comProfile.mobile_code_label } : { value: '', label: 'Select Code' },
        mobile: (comProfile)? comProfile.mobile: '',
        website: (Object.keys(comProfile).length > 0)? comProfile.website: '',
    };
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onComCbFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(frmdataActions.setFormData({ data: res.data.isd_codes, key: 'isdCodes' }));
        }else{
          dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch]);
    
    useEffect(() => { 
        if( isdCodes.length === 0  ){
          dispatch(uiActions.setShowLoading({ loading: true }));
          const data = {
            action: 'get_isd_codes'
          };
          CoreService.onPostFn('get_formdata', data, onComCbFn);
        }
    }, [dispatch, onComCbFn, isdCodes]);

    const onStateChangeCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setValue('city', { value: '', label: 'Select City' }, { shouldValidate: true });
            setCity(res.data);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setCity]);
    // For State Change
    const onStateChange = (st: string) => {
        if( st ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_location', {'action': 'get_all_cities', state_code: st}, onStateChangeCb);
        }
    };

    // For Country Change Call Back to load States
    const onCountryChangeCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setValue('state', { value: '', label: 'Select State' }, { shouldValidate: true });
            setValue('city', { value: '', label: 'Slect City' }, { shouldValidate: true });
            setState([]);
            setState(res.data);
            setCity([]);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setState]);
    const onCountryChange = (ctry: string) => {
        if( ctry ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_location', {'action': 'get_all_states', country_code: ctry}, onCountryChangeCb);
        }
    };

    // For Cities default to load
    const onStateChangedCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setCity(res.data);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setCity]);
    const onStateCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if(comProfile.state_code){
                CoreService.onPostFn('get_location', {'action': 'get_all_cities', state_code: comProfile.state_code}, onStateChangedCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setState(res.data);
            setCity([]);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setState, comProfile, onStateChangedCb]);

    // For State default to load
    const onCountryCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            // For default values to load Country
            setCountry([]);
            if( comProfile.country_code ){
                CoreService.onPostFn('get_location', {'action': 'get_all_states', country_code: comProfile.country_code}, onStateCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setCountry(res.data);
            setState([]);
            setCity([]);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setCountry, setState, comProfile, onStateCb]);
    // For Country default to load
    useEffect(() => {
        if( showCompanyModal === true ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_location', {'action': 'get_all_countries'}, onCountryCb);
        }
    }, [dispatch, onCountryCb, showCompanyModal]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowCompanyModal(false);
            dispatch(repActions.setCompanyProfile({ data: res.data })); 
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setShowCompanyModal]);
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const user = {
            action: 'company_info_update',
            memID: comProfile.mem_id,
            formID: comProfile.id,
            ...data
        };
        CoreService.onPostFn('company_update', user, onCallbackFn);
    }

    // if( country.length > 0 ){
    //     listCountry = country.map((ctry: any) =>
    //         <IonSelectOption value={ctry.Country_str_code} key={ctry.Country_str_code}>{ctry.Country_str_name}</IonSelectOption> 
    //     );
    // }
    // if( state.length > 0 ){
    //     listState = state.map((st: any) =>
    //         <IonSelectOption value={st.Admin1_str_code} key={st.Admin1_str_code}>{st.Admin1_str_name}</IonSelectOption> 
    //     );
    // }
    // if( city.length > 0 ){
    //     listCity = city.map((ct: any, index) =>
    //         <IonSelectOption value={ct.Feature_str_name} key={index}>{ct.Feature_str_name}</IonSelectOption> 
    //     );
    // }
    if( country.length > 0 ){
        country.map((ctry: any) => {
            listCountry.push({ value: ctry.Country_str_code, label: ctry.Country_str_name });
            // <IonSelectOption value={ctry.Country_str_code} key={ctry.Country_str_code}>{ctry.Country_str_name}</IonSelectOption> 
        });
    }
    if( state.length > 0 ){
        state.map((st: any) => {
            listState.push({ value: st.Admin1_str_code, label: st.Admin1_str_name });
            // <IonSelectOption value={st.Admin1_str_code} key={st.Admin1_str_code}>{st.Admin1_str_name}</IonSelectOption> 
        });
    }
    if( city.length > 0 ){
        city.map((ct: any) => {
            listCity.push({ value: ct.Feature_str_name, label: ct.Feature_str_name });
            // <IonSelectOption value={ct.Feature_str_name} key={index}>{ct.Feature_str_name}</IonSelectOption> 
        });
    }

    if( isdCodes.length > 0 ){ 
        isdCodes.map((cd: any) => {
            listCodes.push({ value: cd.isd_code, label: cd.display_name });
        });
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowCompanyModal(false)}>
                            <IonIcon icon={close} slot="icon-only"></IonIcon>
                        </IonButton>
                    </IonButtons>
                    { (!isPlatform('desktop')) &&   
                    <IonButtons slot="end">
                        <IonButton color="blackbg" type="submit">
                            Save
                        </IonButton>
                    </IonButtons>
                    }
                    <IonTitle>Edit Company Info</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen>
            <IonGrid>
                <IonRow>
                  <IonCol sizeMd="6" sizeXs="12">
                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Company Name <IonText color="danger">*</IonText></IonLabel>   
                        <Controller 
                            name="company_name"
                            control={control}
                            render={({ field }) => {
                                return <IonInput 
                                    {...field}
                                    type="text"
                                    onIonChange={(e: any) => field.onChange(e.target.value)}
                                />
                            }}
                            rules={{
                                required: {
                                    value: true,
                                    message: "Company Name is required"
                                },
                                pattern: {
                                    value: /^[A-Z0-9!@#$&-_() ]{2,100}$/i,
                                    message: "Invalid Company Name"
                                }
                            }}
                        />
                    </IonItem>
                    <ErrorMessage
                        errors={errors}
                        name="company_name"
                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                    />

                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Website</IonLabel>
                        <Controller 
                            name="website"
                            control={control}
                            render={({ field }) => {
                                return <IonInput 
                                    {...field}
                                    type="text"
                                    onIonChange={(e: any) => field.onChange(e.target.value)}
                                />
                            }}
                            rules={{
                                pattern: {
                                    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/g,
                                    // value: /^(http://)?(www\.)?[A-Za-z0-9]+\.[a-z]{2,3}/g,
                                    message: "Invalid Website"
                                }
                            }}
                        />
                    </IonItem>
                    <ErrorMessage
                        errors={errors}
                        name="website"
                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                    />
                  </IonCol>
                  <IonCol sizeMd="6" sizeXs="12">
                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Short Description</IonLabel>
                        <Controller 
                            name="short_desc"
                            control={control}
                            render={({ field }) => {
                                return <IonTextarea
                                    {...field}
                                    onKeyUp={(e: any) => {
                                        var str = e.target.value;
                                        if( str.split(/\s+/).length > 20 ){
                                            e.target.value = str.split(/\s+/).slice(0, 20).join(" ");
                                        }
                                    }}
                                    onIonChange={(e: any) => field.onChange(e.target.value)}
                                />
                            }}
                            rules={{
                                required: {
                                    value: true,
                                    message: "Short Description is required"
                                },
                                pattern: {
                                    value: /^\W*(\w+(\W+|$)){1,20}$/i,
                                    message: "Short Description shoud be lessthan 20 words"
                                }
                            }}
                        />
                        
                    </IonItem>
                    <IonNote className="mt-2 fs-14">Provide a short description of you company that will be seen in search results (maximum 20 words)</IonNote><br />
                    <ErrorMessage
                        errors={errors}
                        name="short_desc"
                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                    />

                        
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">First Name <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="firstname"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="text"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Firstname is required"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9 ]{2,25}$/i,
                                        message: "Invalid Firstname"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="firstname"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Last Name <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="lastname"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="text"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Lastname is required"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9 ]{2,25}$/i,
                                        message: "Invalid Last Name"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="lastname"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Address Line 1 <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="address1"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="text"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Address1 is required"
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "Address1 minlength should be 3 characters"
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Address1 maxlength should be less than 100 characters"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="address1"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Address Line 2</IonLabel>
                            <Controller 
                                name="address2"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="text"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    minLength: {
                                        value: 3,
                                        message: "Address2 minlength should be 3 characters"
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Address2 maxlength should be less than 100 characters"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="address2"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonLabel className="fs-12" position="stacked">Country <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-1">
                            { comProfile && listCountry.length > 0 &&
                                <Controller 
                                    name="country"
                                    control={control}
                                    render={({ field }) => {
                                        return <Select
                                            {...field}
                                            placeholder="Select Country"
                                            options={listCountry}
                                            onChange={(selected: any) =>{
                                                onCountryChange(selected.value);
                                                field.onChange(selected);
                                            }}
                                            styles={customStyles}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Country is required"
                                        }
                                    }}
                                />
                            }
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="country"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                    <IonCol>
                        <IonLabel className="fs-12" position="stacked">State/Province <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-1">
                            {/* { listState.length > 0 && */}
                                <Controller 
                                    name="state"
                                    control={control}
                                    render={({ field }) => {
                                        return <Select
                                            {...field}
                                            placeholder="Select State/Province"
                                            options={listState}
                                            onChange={(selected: any) =>{
                                                onStateChange(selected.value);
                                                field.onChange(selected);
                                            }}
                                            styles={customStyles}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "State/Province is required"
                                        }
                                    }}
                                />
                            {/* } */}
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="state"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonLabel className="fs-12" position="stacked">City <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-1">
                            <Controller 
                                name="city"
                                control={control}
                                render={({ field }) => {
                                    return <Select
                                        {...field}
                                        placeholder="Select City"
                                        options={listCity}
                                        onChange={(selected: any) =>{
                                            field.onChange(selected);
                                        }}
                                        styles={customStyles}
                                    />
                                }}
                                rules={{ 
                                    required: {
                                        value: true,
                                        message: "City is required"
                                    }
                                }}
                            />
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="city"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Postal/ZipCode <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="postal"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="text"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Postal is required"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9 ]{1,10}$/i,
                                        message: "Invalid Postal"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="postal"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonLabel className="fs-12" position="stacked">Phone Code <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-1">
                            { comProfile && listCodes.length > 0 &&
                                <Controller 
                                    name="phone_code"
                                    control={control}
                                    render={({ field }) => {
                                        return <Select
                                            {...field}
                                            placeholder="Select Code"
                                            options={listCodes}
                                            onChange={(selected: any) =>{
                                                field.onChange(selected);
                                            }}
                                            styles={customStyles}
                                        />
                                    }}
                                    rules={{ 
                                        required: {
                                            value: true,
                                            message: "Phone Code is required"
                                        }
                                    }}
                                />
                            }
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="phone_code"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                    <IonCol sizeMd="6" sizeXs="12">    
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Phone <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="tel"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Phone No is required"
                                    },
                                    pattern: {
                                        value: /^[0-9 ]{5,15}$/i,
                                        message: "Invalid Phone No"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="phone"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonLabel className="fs-12" position="stacked">Mobile Code </IonLabel>
                        <div className="mt-1">
                            { comProfile && listCodes.length > 0 &&
                                <Controller 
                                    name="mobile_code"
                                    control={control}
                                    render={({ field }) => {
                                        return <Select
                                            {...field}
                                            placeholder="Select Code"
                                            options={listCodes}
                                            onChange={(selected: any) =>{
                                                field.onChange(selected);
                                            }}
                                            styles={customStyles}
                                        />
                                    }}
                                />
                            }
                        </div>
                    </IonCol>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Mobile No </IonLabel>
                                <Controller 
                                    name="mobile"
                                    control={control}
                                    render={({ field }) => {
                                        return <IonInput 
                                            {...field}
                                            type="tel"
                                            onIonChange={(e: any) => field.onChange(e.target.value)}
                                        />
                                    }}
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]{7,12}$/i,
                                            message: "Invalid Mobile No"
                                        }
                                    }}
                                />
                            </IonItem>
                            <ErrorMessage
                                errors={errors}
                                name="mobile"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Fax</IonLabel>
                            <Controller 
                                name="fax"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="tel"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    pattern: {
                                        value: /^[0-9 ]{3,15}$/i,
                                        message: "Invalid Fax"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="fax"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                </IonRow>
                { (isPlatform('desktop')) && 
                    <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                        Submit
                    </IonButton>
                }
                
                </IonGrid>
            </IonContent>
        </form> 
    </>);
};
  
export default CompanyInfoModal;
  