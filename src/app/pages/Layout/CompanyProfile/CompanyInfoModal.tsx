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
import { useForm, Controller } from "react-hook-form";
import { isPlatform } from '@ionic/react';

import CoreService from '../../../shared/services/CoreService';
import './CompanyProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';

interface Props {
    showCompanyModal: boolean,
    setShowCompanyModal: Function
}

const CompanyInfoModal: React.FC<Props> = ({showCompanyModal, setShowCompanyModal}) => {

    let listCountry= null;
    let listState = null;
    let listCity = null; 
    
    const dispatch = useDispatch();
    const comProfile = useSelector( (state:any) => state.rep.comProfile);
    const [ country, setCountry ] = useState([]);
    const [ state, setState ] = useState([]);
    const [ city, setCity ] = useState([]);
    let initialValues = {
        company_name: (Object.keys(comProfile).length > 0)? comProfile.company_name: '',
        email: (Object.keys(comProfile).length > 0)? comProfile.email: '',
        firstname: (Object.keys(comProfile).length > 0)? comProfile.firstname: '',
        lastname: (Object.keys(comProfile).length > 0)? comProfile.lastname: '',
        address1: (Object.keys(comProfile).length > 0)? comProfile.address1: '',
        address2: (Object.keys(comProfile).length > 0)? comProfile.address2: '',
        country: (Object.keys(comProfile).length > 0)? comProfile.country_code: '',
        state: (Object.keys(comProfile).length > 0)? comProfile.state_code: '',
        city: (Object.keys(comProfile).length > 0)? comProfile.city: '',
        postal: (Object.keys(comProfile).length > 0)? comProfile.postal: '',
        phone: (Object.keys(comProfile).length > 0)? comProfile.phone: '',
        fax: (Object.keys(comProfile).length > 0)? comProfile.fax: '',
        website: (Object.keys(comProfile).length > 0)? comProfile.website: '',
    };
    const { control, errors, handleSubmit } = useForm({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    const onStateChangeCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
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
    const onStateCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            if(comProfile.state_code){
                CoreService.onPostFn('get_location', {'action': 'get_all_cities', state_code: comProfile.state_code}, onStateChangeCb);
            }else{
                dispatch(uiActions.setShowLoading({ loading: false }));
            }
            setState(res.data);
            setCity([]);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
        }
    }, [dispatch, setState, comProfile, onStateChangeCb]);

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

    if( country.length > 0 ){
        listCountry = country.map((ctry: any) =>
            <IonSelectOption value={ctry.Country_str_code} key={ctry.Country_str_code}>{ctry.Country_str_name}</IonSelectOption> 
        );
    }
    if( state.length > 0 ){
        listState = state.map((st: any) =>
            <IonSelectOption value={st.Admin1_str_code} key={st.Admin1_str_code}>{st.Admin1_str_name}</IonSelectOption> 
        );
    }
    if( city.length > 0 ){
        listCity = city.map((ct: any, index) =>
            <IonSelectOption value={ct.Feature_str_name} key={index}>{ct.Feature_str_name}</IonSelectOption> 
        );
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop') || isPlatform('tablet')? 'end': 'start' }>
                        <IonButton onClick={() => setShowCompanyModal(false)}>
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
                            as={IonInput}
                            control={control}
                            onChangeName="onIonChange"
                            onChange={([selected]) => {
                            return selected.detail.value;
                            }}
                            name="company_name"
                            rules={{
                            required: true,   
                            pattern: {
                                value: /^[A-Z0-9!@#$&-_() ]{2,100}$/i,
                                message: "Invalid Company Name"
                            }
                            }}
                        />
                    </IonItem>
                    {showError("company_name", "Company Name")}
                  </IonCol>
                  <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Website</IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="website"
                                rules={{
                                    required: false,
                                    pattern: {
                                        value: /^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/,
                                        message: "Invalid Website"
                                    }
                                }}
                            />
                        </IonItem>
                        {showError("website", "Website")}
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">First Name <IonText color="danger">*</IonText></IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="firstname"
                                rules={{
                                required: true,
                                pattern: {
                                    value: /^[A-Z0-9 ]{2,25}$/i,
                                    message: "Invalid First Name"
                                }
                                }}
                            />
                        </IonItem>
                        {showError("firstname", "First Name")}
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Last Name <IonText color="danger">*</IonText></IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                name="lastname"
                                rules={{
                                    required: true,
                                    pattern: {
                                    value: /^[A-Z0-9 ]{1,25}$/i,
                                    message: "Invalid Last Name"
                                    }
                                }}
                            />
                        </IonItem>
                        {showError("lastname", "Last Name")}
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Address Line 1 <IonText color="danger">*</IonText></IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="address1"
                                rules={{
                                required: true,

                                minLength: {
                                    value: 3,
                                    message: "Address1 minlength should be 3 characters"
                                }
                                }}
                            />
                        </IonItem>
                        {showError("address1", "Address 1")}
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Address Line 2</IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                name="address2"
                                rules={{
                                    required: false
                                }}
                            />
                        </IonItem>
                        {showError("address2", "Address2")}
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Country <IonText color="danger">*</IonText></IonLabel>
                            { comProfile && listCountry && 
                                <Controller
                                as={
                                    <IonSelect name="country" placeholder="Select Country">
                                        {listCountry}
                                    </IonSelect>
                                }
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    onCountryChange(selected.detail.value);
                                    return selected.detail.value;
                                }}
                                name="country"
                                rules={{
                                    required: true
                                }}
                            />}
                            
                        </IonItem>
                        {showError("country", "Country")}
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">State <IonText color="danger">*</IonText></IonLabel>
                            { listState && 
                            <Controller
                                as={
                                    <IonSelect name="state" placeholder="Select State">
                                        {listState}
                                    </IonSelect>
                                }
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    onStateChange(selected.detail.value);
                                    return selected.detail.value;
                                }}
                                name="state"
                                rules={{
                                    required: true
                                }}
                            />}
                        </IonItem>
                        {showError("state", "State")}
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">City <IonText color="danger">*</IonText></IonLabel>
                            { listCity &&
                            <Controller
                                as={
                                    <IonSelect name="city" placeholder="Select City">
                                        {listCity}
                                    </IonSelect>
                                }
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="city"
                                rules={{
                                    required: true
                                }}
                            />}
                        </IonItem>
                        {showError("city", "City")}
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Postal/ZipCode <IonText color="danger">*</IonText></IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                name="postal"
                                rules={{
                                    required: true,
                                    pattern: {
                                    value: /^[A-Z0-9 ]{1,10}$/i,
                                    message: "Invalid Postal"
                                    }
                                }}
                            />
                        </IonItem>
                        {showError("postal", "Postal")}
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Phone <IonText color="danger">*</IonText></IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="phone"
                                rules={{
                                required: true,
                                pattern: {
                                    value: /^[0-9 ]{5,15}$/i,
                                    message: "Invalid Phone No"
                                }
                                }}
                            />
                        </IonItem>
                        {showError("phone", "Phone No")}
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Fax</IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                name="fax"
                                rules={{
                                    pattern: {
                                    value: /^[0-9]{3,15}$/i,
                                    message: "Invalid Fax"
                                    }
                                }}
                            />
                        </IonItem>
                        {showError("fax", "Fax")}
                  </IonCol>
                </IonRow>
                { (isPlatform('desktop') || isPlatform('tablet')) && 
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
  