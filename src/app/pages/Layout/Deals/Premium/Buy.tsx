import { 
    IonCard, 
    IonCardHeader, 
    IonCardContent,
    IonItem, 
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonText,
    IonRadioGroup,
    IonRadio
} from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import {unserialize} from 'php-serialize'
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import '../Deals.scss';
import CoreService from '../../../../shared/services/CoreService';
import { lfConfig } from '../../../../../Constants';
// import useDebounce from '../../../../hooks/useDebounce';

type FormInputs = {
    location: string;
    reps: [];
    duration: number;
    payment_type: string;
}

const BuyDeal: React.FC = () => {
    let listReps: any = null;
    const dispatch = useDispatch();
    const { LOCAL_DEAL } = lfConfig;
    let { id } = useParams<any>();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const [ reps, setReps ] = useState([]);
    const [dealLog, setDealLog] = useState<any>({ 
        duration: 1,
        space_total: '0.00', 
        tax: '0.00', 
        init: false, 
        id: id? id: 0,
        log: {}
    });
    // const debouncedValue = useDebounce<string>(dealLog.duration, 2500)

    let initialValues = {
        location: "1",
        reps: [],
        duration: 1,
        payment_type: 'credit_card'
        
    };
    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    // For Reps default to load
    const onProfileCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setReps([]);
            setReps(res.reps);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setReps]);
    const onItemCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            const logResData = unserialize(res.data.details);
            setValue('location', logResData.location, { shouldValidate: true });
            if( (logResData.reps).length > 0 ){
                setValue('reps', (logResData.reps).split(",") , { shouldValidate: true });
            }
            setValue('duration', res.data.days, { shouldValidate: true });
            setValue('payment_type', res.data.payment_type, { shouldValidate: true });
            setDealLog({...dealLog, log: res.data });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setReps]);
    useEffect(() => {
        if( authUser.ID ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('item_purchase', {'action': 'get_item_purchase', formID: id, memID: authUser.ID, repID: authUser.repID }, onItemCb);
            CoreService.onPostFn('get_member', {'action': 'get_reps', memID: authUser.ID }, onProfileCb);
        }
    }, [dispatch, onProfileCb, authUser.ID]);

    const onFeeCbFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setDealLog({ ...dealLog, space_total: res.data.space_total, tax: res.data.tax });
        }else{
            dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [setDealLog, dispatch]);
    const onPremiumDealFeeCalc = (loading:boolean) => { 
        const data = getValues();
        if( data.location && data.duration && data.reps && data.reps.length > 0 ){
            if( loading ){
                dispatch(uiActions.setShowLoading({ loading: true }));
            }
            const fd: any = {
                action: 'dl_fees_calc',
                memID: authUser.ID,
                repID: authUser.repID,
                ...data
            };
            CoreService.onPostFn('deal_update', fd, onFeeCbFn);
        }   
    }
    useEffect(() => {
        // Delay calling api on input typing
        if( dealLog.duration ){
            const delayDebounceFn = setTimeout(() => {
                onPremiumDealFeeCalc(false);
            }, 3000);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [dealLog.duration]);

    const resetAction = () => {
        setValue('location', "1", { shouldValidate: true });
        setValue('reps', [] , { shouldValidate: true });
        setValue('duration', 1, { shouldValidate: true });
        setValue('payment_type', 'credit_card', { shouldValidate: true });
        setDealLog({ 
            duration: 1,
            space_total: '0.00', 
            tax: '0.00', 
            init: false, 
            id: id? id: 0,
            log: {}
        });
        onPremiumDealFeeCalc(false);
    }

    

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setDealLog({ ...dealLog, id: res.data.id, init: true, log: res.data });
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const fd = {
            action: id? 'dl_purchase_update': 'dl_purchase',
            memID: authUser.ID,
            repID: authUser.repID,
            action_type: LOCAL_DEAL,
            ...data
        };
        if( id ){
            fd.formID = id;
        }
        CoreService.onPostFn('item_purchase', fd, onCallbackFn);
    }

    if( reps && reps.length > 0 ){
        listReps = reps.map((rep: any) =>
            <IonSelectOption value={rep.rep_id} key={rep.rep_id}>{ `${rep.firstname} ${rep.lastname}`}</IonSelectOption> 
        );
    }

    const duration = getValues('duration');
    if( dealLog.id && dealLog.init === true ){
        return <Redirect to={`/layout/deals/deal-payment/${dealLog.id}`} />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">Purchase your Local Deal</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <div className="mx-2 my-3">
                    <p>Local Deals is a paid ad service to promote your daily specials. You will be charged per day based on the distance from location you want your ad to be seen in from in relation to the representative that you select to add to this deal. You can assign only one representative per ad.</p>
                    <p>Local - your city and surrounding area. Regional - state or province. National - country. International - everywhere.</p>
                </div>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" sizeXs="12">
                            <IonRow>
                                <IonCol>
                                    <IonItem class="ion-no-padding">
                                        <IonLabel position="stacked">Location Preference  <IonText color="danger">*</IonText></IonLabel>
                                        <Controller 
                                            name="location"
                                            control={control}
                                            render={({ field: {onChange, onBlur, value} }) => {
                                                return <IonSelect
                                                    placeholder="Select Location Pref."
                                                    onIonChange={(selected: any) =>{
                                                        onChange(selected.detail.value);
                                                        onPremiumDealFeeCalc(true);
                                                    }}
                                                    onBlur={onBlur}
                                                    value={value}
                                                >
                                                    <IonSelectOption value="1">Local</IonSelectOption>
                                                    <IonSelectOption value="2">Regional</IonSelectOption>
                                                    <IonSelectOption value="3">National</IonSelectOption>
                                                    <IonSelectOption value="4">InterNational</IonSelectOption>
                                                </IonSelect>
                                            }}
                                            rules={{ 
                                                required: {
                                                    value: true,
                                                    message: "Location Preferrence is required"
                                                }
                                            }}
                                        />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name="location"
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem class="ion-no-padding">
                                        <IonLabel position="stacked">Select Rep <IonText color="danger">*</IonText></IonLabel>
                                        { listReps && 
                                            <Controller 
                                                name="reps"
                                                control={control}
                                                render={({ field: {onChange, onBlur, value} }) => {
                                                    return <IonSelect multiple
                                                        placeholder="Select Rep Profile"
                                                        onIonChange={(selected: any) =>{
                                                            onChange(selected.detail.value);
                                                            onPremiumDealFeeCalc(true);
                                                        }}
                                                        onBlur={onBlur}
                                                        value={value}
                                                    >{listReps}</IonSelect>
                                                }}
                                                rules={{
                                                    required: {
                                                        value: true,
                                                        message: "Representative Profile is required"
                                                    },
                                                    validate: value => {
                                                        return Array.isArray(value) && value.length > 0;
                                                    }
                                                }}
                                            />
                                        }
                                        
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name="reps"
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem class="ion-no-padding">
                                        <IonLabel position="stacked">How many days do you want this ad to run?<IonText color="danger">*</IonText></IonLabel>
                                        <Controller 
                                            name="duration"
                                            control={control}
                                            render={({ field: {onChange, onBlur, value} }) => {
                                                return <IonInput type="text"
                                                    onIonChange={(e: any) => {
                                                        onChange(e.target.value);
                                                        setDealLog({ ...dealLog, duration: e.target.value });
                                                    }}
                                                    onBlur={onBlur}
                                                    value={value}
                                                />
                                            }}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "No. of days is required"
                                                },
                                                pattern: {
                                                    value: /^[1-9][0-9]*$/i,
                                                    message: "No. of days shoul be a number"
                                                }
                                            }}
                                        />
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name="duration"
                                        render={({ message }) => <div className="invalid-feedback">{message}</div>}
                                    />
                                </IonCol>
                            </IonRow>    
                        </IonCol>

                        <IonCol sizeMd="6" sizeXs="12">
                            <p><b>Based on the location(s) of your rep(s) this Local Deals ad will cost</b></p>
                            <div className="adCost"> Ad Space Costs: <strong>${parseFloat(dealLog.space_total).toFixed(2)}</strong></div>
                            <div className="tax"> GST/Federal Tax: <strong>${(duration * parseFloat(dealLog.tax)).toFixed(2)}</strong></div>
                            <hr />
                            <div className="total mb-3">Total Cost: <strong>${(parseFloat(dealLog.space_total)+ (duration* parseFloat(dealLog.tax)) ).toFixed(2)}</strong></div>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>Choose your payment method</IonLabel>

                                    <Controller 
                                        name="payment_type"
                                        control={control}
                                        render={({ field: {onChange, onBlur, value} }) => {
                                        return <IonRadioGroup
                                            onIonChange={onChange} 
                                            onBlur={onBlur}
                                            value={value}>
                                                <IonRow>
                                                    <IonCol>
                                                        <IonItem lines="none">
                                                            <IonLabel color="medium">Credit Card</IonLabel>
                                                            <IonRadio slot="start" value="credit_card" />
                                                        </IonItem>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonItem lines="none">
                                                            <IonLabel color="medium">Paypal</IonLabel>
                                                            <IonRadio slot="start" value="paypal" />
                                                        </IonItem>
                                                    </IonCol>
                                                </IonRow>
                                        </IonRadioGroup>
                                        }}
                                        rules={{ 
                                            required: {
                                                value: true,
                                                message: "Payment Type is required"
                                            }
                                        }}
                                    />
                                    {errors.payment_type && <div className="invalid-feedback">{errors.payment_type.message}</div>}
                                </IonCol>
                                </IonRow>
                        </IonCol>    
                    </IonRow>    
                </IonGrid>
                
                <IonButton color="danger" className="ion-margin-top mt-4 float-right mb-3" type="button" onClick={resetAction}>
                    Cancel
                </IonButton>
                <IonButton color="greenbg" className="ion-margin-top mt-4 float-right mb-3" type="submit">
                    Purchase
                </IonButton>
                
            </IonCardContent>
        </IonCard>
        </form>
    );
};
export default BuyDeal;
  