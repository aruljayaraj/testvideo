import {
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
    IonHeader
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller} from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import Select from 'react-select';

import CoreService from '../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../store/reducers/auth';
import * as uiActions from '../store/reducers/ui';

type FormInputs = {
    country: {
        value: number|string;
        label: string;
    };
    state: {
        value: number|string;
        label: string;
    };
    city: {
        value: number|string;
        label: string;
    };
}

type LocationType = {
    value: number|string;
    label: string;
}

interface Props {
    showLocationModal: boolean,
    setShowLocationModal: Function
}
const LocationModal: React.FC<Props> = ({ showLocationModal, setShowLocationModal}) => {

    let listCountry: LocationType[] = [];
    let listState: LocationType[] = [];
    let listCity: LocationType[] = []; 

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
    const location = useSelector( (state:any) => state.auth.location);
    const [ countries, setCountries ] = useState([]);
    const [ states, setStates ] = useState([]);
    const [ cities, setCities ] = useState([]);
    let initialValues = {
        country: (location)? { value: location.countryCode, label: location.country } : { value: '', label: '' },
        state: (location)? { value: location.stateCode, label: location.state } : { value: '', label: '' },
        city: (location)? { value: location.city, label: location.city }: { value: '', label: '' },
    };
  
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });
    
    const onStateChangeCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            // setValue([{city: {value: '', label: ''}}]);
            setCities(res.data);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setCities]);
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
            // setValue([{state: {value: '', label: ''}}, {city: {value: '', label: ''}}]);
            setValue("state", {value: '', label: ''});
            setValue("city", {value: '', label: ''});
            // [ { name: 'subCategory', value: 'data' } ].forEach(({ name, value }) => setValue(name, value))
            setStates([]);
            setStates(res.data);
            setCities([]);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setStates]);
    const onCountryChange = (ctry: string) => {
        if( ctry ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_location', {'action': 'get_all_states', country_code: ctry}, onCountryChangeCb);
        }
    };

    // For Cities default to load
    const onCityCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setCities(res.data);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setCities]);
    const onStateCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if(location && location.stateCode){
                CoreService.onPostFn('get_location', {'action': 'get_all_cities', state_code: location.stateCode}, onCityCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setStates(res.data);
            setCities([]);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setStates, location, onStateChangeCb]);

    // For State default to load
    const onCountryCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            // For default values to load Country
            setCountries([]);
            if( location.countryCode ){
                CoreService.onPostFn('get_location', {'action': 'get_all_states', country_code: location.countryCode}, onStateCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setCountries(res.data);
            setStates([]);
            setCities([]);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setCountries, setStates, location, onStateCb]);
    // For Country default to load
    useEffect(() => {
        if( showLocationModal === true ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_location', {'action': 'get_all_countries'}, onCountryCb);
        }
    }, [dispatch, onCountryCb, showLocationModal]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowLocationModal(false);
            dispatch(authActions.setLocation({ location: res.data })); 
            /* setTimeout(()=>{
                setShowLocationModal(false);
            },1000); */
        }
        // setTimeout(()=>{
            dispatch(uiActions.setShowLoading({ loading: false }));
            dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        // },2000);
        
    }, [dispatch, setShowLocationModal]);
    const onSubmit = (data: any) => { 
        if(data.country.value && data.state.value && data.city.value){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const user = {
                action: 'change_location',
                country_code: data.country.value,
                state_code: data.state.value,
                city: data.city.value
            };
            CoreService.onPostFn('get_location', user, onCallbackFn);
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: "Country/State/City should not be empty!" }));
        }
    }

    if( countries.length > 0 ){
        countries.map((ctry: any) => {
            listCountry.push({ value: ctry.Country_str_code, label: ctry.Country_str_name });
            // <IonSelectOption value={ctry.Country_str_code} key={ctry.Country_str_code}>{ctry.Country_str_name}</IonSelectOption> 
        });
    }
    if( states.length > 0 ){
        states.map((st: any) => {
            listState.push({ value: st.Admin1_str_code, label: st.Admin1_str_name });
            // <IonSelectOption value={st.Admin1_str_code} key={st.Admin1_str_code}>{st.Admin1_str_name}</IonSelectOption> 
        });
    }
    if( cities.length > 0 ){
        cities.map((ct: any) => {
            listCity.push({ value: ct.Feature_str_name, label: ct.Feature_str_name });
            // <IonSelectOption value={ct.Feature_str_name} key={index}>{ct.Feature_str_name}</IonSelectOption> 
        });
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                        <IonButton onClick={() => setShowLocationModal(false)}>
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
                    <IonTitle>Change Location </IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonLabel className="mb-2">Country <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-2">
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
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="country"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        /> 
                    </IonCol>
                </IonRow>

                <IonRow>    
                    <IonCol>
                        <IonLabel className="mb-2">State <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-2">
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
                        </div>
                        <ErrorMessage
                            errors={errors}
                            name="state"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                        
                  </IonCol>
                </IonRow>
                 
                <IonRow>    
                    <IonCol>
                        <IonLabel className="mb-2">City <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-2">
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
                </IonRow>
                
                <div className="mt-4">           
                { (isPlatform('desktop')) && 
                    <IonButton color="greenbg" className="ion-margin-top mt-4 mb-3 float-right" type="submit" >
                        Submit
                    </IonButton>
                }
                </div> 
                </IonGrid>
            </IonContent> 
        </form> 
    </>);
};
  
export default LocationModal;
  