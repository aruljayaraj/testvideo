import {useState, useCallback, useEffect} from "react";
import { useParams, Redirect } from 'react-router-dom';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { IonButton, IonCol, IonGrid, IonInput, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import Select from 'react-select';
import './Payment.scss';
import { lfConfig } from '../../../Constants';
import CoreService from '../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../store/reducers/ui';
import * as frmdataActions from '../../store/reducers/common';
import { DropDown } from '../../interfaces/Common';

/*const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#fff",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#fce883"
        },
        "::placeholder": {
          color: "#87bbfd"
        }
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "#ffc7ee"
      }
    }
};*/

type FormInputs = {
    name: string;
    email: string;
    mobile_code: {
        value: null|string;
        label: null|string;
    };
    mobile: string;
}

export const CreditCardForm = () => {
    
    const stripe: any = useStripe();
    const elements: any = useElements();

    const dispatch = useDispatch();
    const { baseurl, LOCAL_DEAL } = lfConfig;
    let listCodes: DropDown[] = [];
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const itemData = useSelector( (state:any) => state.formdata.item);
    const isdCodes = useSelector( (state:any) => state.formdata.isdCodes);
    let { id } = useParams<any>();
    const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
    let initialValues = {
        name: `${authUser.firstname} ${authUser.lastname}`,
        email: authUser.email,
        mobile_code: { value: '', label: '' },
        mobile: ""
    };

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

    const { control, handleSubmit, formState: { errors }, getValues } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    // For Purchase log default to load
    const onPurCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(frmdataActions.setFormData({ data: res.data, key: 'item' }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch]);
    const onfdCbFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(frmdataActions.setFormData({ data: res.data.isd_codes, key: 'isdCodes' }));
        }else{
          dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch]);
    useEffect(() => { 
        if( authUser.ID && Object.keys(itemData).length === 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('item_purchase', {'action': 'get_item_purchase', memID: authUser.ID, repID: authUser.repID, formID: id }, onPurCb);
        }
        if( isdCodes.length === 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const data = {
              action: 'get_isd_codes'
            };
            CoreService.onPostFn('get_formdata', data, onfdCbFn);
          }
    }, [dispatch, authUser.ID, itemData, onPurCb, onfdCbFn,  isdCodes ]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(frmdataActions.setFormData({ data: res.data, key: 'item' }));
            setPaymentStatus(true);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    // Payment call
    const onSubmit = async (data: any, e: any) => {
        if( data.email && data.name && CardElement ){  
            e.preventDefault();
            const billing_details = {
                email: data.email,
                phone: data.mobile_code.value+' '+data.mobile,
                name: data.name
            }
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(CardElement),
                billing_details: billing_details
            }); // console.log(error, paymentMethod);

            if(!error && paymentMethod) {
                dispatch(uiActions.setShowLoading({ loading: true }));
                try {
                    const {id: payment_id} = paymentMethod;
                    const fd = {
                        memID: authUser.ID,
                        repID: authUser.repID,
                        formID: id,
                        type: 'credit_card',
                        action: itemData.type,
                        amount: itemData.price,
                        id: payment_id,
                        billing: billing_details,
                        ...data
                    };
                    CoreService.onPostFn('payment', fd, onCallbackFn);

                } catch (error) {
                    dispatch(uiActions.setShowLoading({ loading: false }));
                    dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error }));
                }
            } else {
                dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error.message }));
            }
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: "Name/Email Should not be empty!" }));
        }
    }
    if( isdCodes.length > 0 ){
        isdCodes.map((cd: any) => {
            listCodes.push({ value: cd.isd_code, label: cd.display_name });
        });
    }

    if( itemData && Object.keys(itemData).length > 0 && paymentStatus){
        if( itemData.type === LOCAL_DEAL ){
            return <Redirect to={`/layout/deals/add-deal/${itemData.form_id}/${itemData.mem_id}/1`} />;
            //return <Redirect to={`/layout/deals/local-deals`} />;
        }
    }

    return (<>
        { itemData && Object.keys(itemData).length > 0 &&
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonGrid>
                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Name <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="name"
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
                                        message: "Name is required"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9 ]{2,100}$/i,
                                        message: "Invalid Name"
                                    }
                                }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => <div className="invalid-feedback">{message}</div>}
                        />
                    </IonCol>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Email <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="email"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                return <IonInput 
                                    type="email"
                                    onIonChange={onChange} 
                                    onBlur={onBlur}
                                    value={value} />
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
                        <div className="mt-1">
                            <IonLabel position="stacked">Mobile Code <IonText color="danger">*</IonText></IonLabel>
                            { listCodes.length > 0 &&
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
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Mobile Code is required"
                                        }
                                    }}
                                />
                            }
                            <ErrorMessage
                                errors={errors}
                                name="mobile_code"
                                render={({ message }) => <div className="invalid-feedback">{message}</div>}
                            />
                        </div>
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Mobile No <IonText color="danger">*</IonText></IonLabel>
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
                                    required: {
                                        value: true,
                                        message: "Mobile No is required"
                                    },
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
                    <IonCol>
                        <fieldset className="FormGroup formInput my-3">
                            <div className="FormRow">
                                <CardElement options={{hidePostalCode: true}} /> 
                                {/* options={CARD_OPTIONS} formInput */}
                            </div>
                        </fieldset>
                    </IonCol>
                </IonRow>
            </IonGrid>    
            
            <IonButton color="greenbg" className="ion-margin-top my-4 float-right" type="submit" >
                Pay <strong> {itemData && itemData.price ? ` $${itemData.price}`: ''}</strong>
            </IonButton>
        </form> 
        }
    </>
  );
};