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
    IonHeader,
    IonCheckbox
  } from '@ionic/react';
  import { close } from 'ionicons/icons';
import React, { useCallback, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { isPlatform } from '@ionic/react';
import Select from 'react-select';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as frmdataActions from '../../../store/reducers/common';
import * as uiActions from '../../../store/reducers/ui';
import CoreService from '../../../shared/services/CoreService';
import { DropDown } from '../../../interfaces/Common';

type FormInputs = {
    phone_code: {
        value: number|string;
        label: string;
    };
    phone: string;
    phoneExt: string;
    mobile_code: {
        value: number|string;
        label: string;
    };
    mobile: string;
    fax: string;
    bestDaysToContact: string;
    bestTimeToContact: string;
    bestWaysToContact: string;
    newsLetter: boolean;
}

interface Props {
    showContactModal: boolean,
    setShowContactModal: Function
}

const ContactInfoModal: React.FC<Props> = ({showContactModal, setShowContactModal}) => {
    let { repid,memid } = useParams<any>();
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
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const isdCodes = useSelector( (state:any) => state.formdata.isdCodes);
    let initialValues = {
        phone_code: (repProfile)? { value: repProfile.phone_code, label: repProfile.phone_code_label } : { value: '', label: '' },
        phone: (repProfile)? repProfile.phone: '',
        phoneExt: (repProfile)? repProfile.phoneext: '',
        mobile_code: (repProfile)? { value: repProfile.mobile_code, label: repProfile.mobile_code_label } : { value: '', label: '' },
        mobile: (repProfile)? repProfile.mobile: '',
        fax: (repProfile)? repProfile.fax: '',
        bestDaysToContact: (repProfile)? repProfile.advdaystxt: '',
        bestTimeToContact: (repProfile)? repProfile.advtimetxt: '',
        bestWaysToContact: (repProfile)? repProfile.advcontacttype.split(','): '',
        newsLetter: (repProfile && repProfile.newsletteryn === 'Y')? true: false,
    }; // console.log(initialValues);
    
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
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

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setShowContactModal(false);
            dispatch(repActions.setRepProfile({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setShowContactModal]);
    const onSubmit = (data: any) => { 
        dispatch(uiActions.setShowLoading({ loading: true }));
        const user = {
            action: 'contact_info_update',
            memID: memid,
            repID: repid,
            ...data
        };
        CoreService.onPostFn('member_update', user, onCallbackFn);
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
                        <IonButton onClick={() => setShowContactModal(false)}>
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
                    <IonTitle>Edit Contact Info</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen>
            <IonGrid>
                
                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonLabel className="fs-12" position="stacked">Phone Code <IonText color="danger">*</IonText></IonLabel>
                        <div className="mt-1">
                            { repProfile && listCodes.length > 0 &&
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
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Phone Ext </IonLabel>
                            <Controller 
                                name="phoneExt"
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="tel"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                                defaultValue=""
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^[0-9]{1,5}$/i,
                                        message: "Invalid Phone Ext"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="phoneExt"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
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
                                        value: /^[0-9]{3,15}$/i,
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

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonLabel className="fs-12" position="stacked">Mobile Code </IonLabel>
                        <div className="mt-1">
                            { repProfile && listCodes.length > 0 &&
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
                    <IonCol>
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
                            <IonLabel position="stacked">Best Days to Contact </IonLabel>
                            <Controller 
                                name="bestDaysToContact"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="text"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Best Time to Contact </IonLabel>
                            <Controller 
                                name="bestTimeToContact"
                                control={control}
                                render={({ field }) => {
                                    return <IonInput 
                                        {...field}
                                        type="text"
                                        onIonChange={(e: any) => field.onChange(e.target.value)}
                                    />
                                }}
                            />
                        </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Best ways to Contact </IonLabel>
                            {/* <Controller
                                as={
                                    <IonSelect className="mt-3" value="" multiple placeholder="Select">
                                        <IonSelectOption value="phone">Phone</IonSelectOption>
                                        <IonSelectOption value="cell">Cell</IonSelectOption>
                                        <IonSelectOption value="fax">Fax</IonSelectOption>
                                        <IonSelectOption value="email">Email</IonSelectOption>
                                        <IonSelectOption value="person">In Person</IonSelectOption>
                                    </IonSelect>
                                }
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="bestWaysToContact"
                            /> */}
                            <Controller 
                                name="bestWaysToContact"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonSelect className="mt-3" multiple placeholder="Select"
                                        onIonChange={(selected: any) =>{
                                            onChange(selected.detail.value);
                                        }}
                                        onBlur={onBlur}
                                        value={value}>
                                    <IonSelectOption value="phone">Phone</IonSelectOption>
                                    <IonSelectOption value="cell">Cell</IonSelectOption>
                                    <IonSelectOption value="fax">Fax</IonSelectOption>
                                    <IonSelectOption value="email">Email</IonSelectOption>
                                    <IonSelectOption value="person">In Person</IonSelectOption>
                                </IonSelect>
                                }}
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Subscribe to Newsletter :  </IonLabel>
                            <Controller 
                                name="newsLetter"
                                control={control}
                                defaultValue={true}
                                // render={({ field }) => {
                                //     return <IonCheckbox 
                                //         {...field}
                                //         value=""
                                //         checked={(repProfile && repProfile.newsletteryn === 'Y')? true: false}
                                //         onIonChange={(e: any) =>{ console.log(e.detail.checked);
                                //             field.onChange(e.detail.checked);
                                //             return e.detail.checked;
                                //         }}
                                //     />
                                // }}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonCheckbox slot="start"
                                        onIonChange={(e: any) =>{
                                            onChange(e.detail.checked);
                                        }}
                                        onBlur={onBlur}
                                        checked={value}
                                    />
                                }}
                            />
                        </IonItem>
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
  
export default ContactInfoModal;
;
  