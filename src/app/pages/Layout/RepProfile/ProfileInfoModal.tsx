import {
    IonItem, 
    IonLabel,
    IonInput,
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
    IonHeader
  } from '@ionic/react';
  import { close } from 'ionicons/icons';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import Select from 'react-select';

import CoreService from '../../../shared/services/CoreService';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';
import { DropDown } from '../../../interfaces/Common';

type FormInputs = {
    company_name: string;
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
    website: string;
}

type LocationType = {
    value: number|string;
    label: string;
}

interface Props {
    showProfileModal: boolean,
    setShowProfileModal: Function
}

const ProfileInfoModal: React.FC<Props> = ({showProfileModal, setShowProfileModal}) => {

    let listCountry: DropDown[] = [];
    let listState: DropDown[] = [];
    let listCity: DropDown[] = []; 
    let { repid, memid } = useParams<any>();
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
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const [ country, setCountry ] = useState([]);
    const [ state, setState ] = useState([]);
    const [ city, setCity ] = useState([]);
    let initialValues = {
        company_name: Object.keys(repProfile).length > 0? repProfile.company_name: '',
        email: Object.keys(repProfile).length > 0? repProfile.email: '',
        firstname: Object.keys(repProfile).length > 0? repProfile.firstname: '',
        lastname: Object.keys(repProfile).length > 0? repProfile.lastname: '',
        address1: Object.keys(repProfile).length > 0? repProfile.address1: '',
        address2: Object.keys(repProfile).length > 0? repProfile.address2: '',
        country: (Object.keys(repProfile).length > 0 && repProfile.country_code)? { value: repProfile.country_code, label: repProfile.country }: { value: '', label: 'Select Country' },
        state: (Object.keys(repProfile).length > 0 && repProfile.state_code)? { value: repProfile.state_code, label: repProfile.state }: { value: '', label: 'Select State' },
        city: (Object.keys(repProfile).length > 0 && repProfile.city)? { value: repProfile.city, label: repProfile.city }: { value: '', label: 'Select City' },
        postal: Object.keys(repProfile).length > 0? repProfile.postal: '',
        website: Object.keys(repProfile).length > 0? repProfile.website: '',
    };
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

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
            if(repProfile.state_code){
                CoreService.onPostFn('get_location', {'action': 'get_all_cities', state_code: repProfile.state_code}, onStateChangedCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setState(res.data);
            setCity([]);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setState, repProfile, onStateChangedCb]);

    // For State default to load
    const onCountryCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            // For default values to load Country
            setCountry([]);
            if( repProfile.country_code ){
                CoreService.onPostFn('get_location', {'action': 'get_all_states', country_code: repProfile.country_code}, onStateCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setCountry(res.data);
            setState([]);
            setCity([]);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setCountry, setState, repProfile, onStateCb]);
    // For Country default to load
    useEffect(() => {
        if( showProfileModal === true ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_location', {'action': 'get_all_countries'}, onCountryCb);
        }
    }, [dispatch, onCountryCb, showProfileModal]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowProfileModal(false);
            dispatch(repActions.setRepProfile({ data: res.data })); 
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setShowProfileModal]);
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const user = {
            action: 'personal_info_update',
            memID: memid,
            repID: repid,
            ...data
        };
        CoreService.onPostFn('member_update', user, onCallbackFn);
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

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowProfileModal(false)}>
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
                    <IonTitle>Edit Profile Info</IonTitle>
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
                  </IonCol>
                  <IonCol>
                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Email <IonText color="danger">*</IonText></IonLabel>
                        <Controller 
                            name="email"
                            control={control}
                            render={({ field: {onChange, onBlur} }) => {
                            return <IonInput 
                                type="email"
                                onIonChange={onChange} 
                                onBlur={onBlur} />
                            }}
                            rules={{
                            required: {
                                value: true,
                                message: "Email is required"
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid Email Address"
                            }
                            }}
                        />
                    </IonItem>
                    <ErrorMessage
                        errors={errors}
                        name="email"
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
                            { repProfile && listCountry.length > 0 &&
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
                    <IonLabel className="fs-12" position="stacked">State <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-1">
                            {/* { listState.length > 0 && */}
                                <Controller 
                                    name="state"
                                    control={control}
                                    render={({ field }) => {
                                        return <Select
                                            {...field}
                                            placeholder="Select State"
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
                                            message: "State is required"
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
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Website</IonLabel>
                            <Controller 
                                name="website"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="url"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                rules={{
                                    pattern: {
                                        value: /^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/,
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
                    
                </IonRow>
                { isPlatform('desktop') && 
                    <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                        Submit
                    </IonButton>
                }
                
                </IonGrid>
            </IonContent>
        </form> 
    </>);
};
  
export default ProfileInfoModal;
  