import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { useParams, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Payment.scss';
import { lfConfig } from '../../../Constants';
import CoreService from '../../shared/services/CoreService';
import * as uiActions from '../../store/reducers/ui';
import * as frmdataActions from '../../store/reducers/common';

declare global {
    interface Window {
        paypal:any;
    }
}
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
export default function Paypal() {
    const dispatch = useDispatch();
    let { id } = useParams<any>();
    const { LOCAL_DEAL } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const itemData = useSelector( (state:any) => state.formdata.item);
    const [paymentStatus, setPaymentStatus] = useState<boolean>(false);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            dispatch(frmdataActions.setFormData({ data: res.data, key: 'item' }));
            setPaymentStatus(true);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);

    const createOrder = (data: any, actions: any, err: any) => {
        if(itemData && Object.keys(itemData).length > 0){
            let desc = '';
            if(itemData.type === 'local_deal'){
                desc = 'Purchase LocalFirst Deal'
            }
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        description: desc,
                        amount: {
                            currency_code: "USD",
                            value: itemData.price,
                        },
                    }
                ]
            });
        }    
    }

    const onApprove = async (data: any, actions: any) => {
        dispatch(uiActions.setShowLoading({ loading: true }));
        const order = await actions.order.capture();
        if(order && Object.keys(order).length > 0 && order.status === 'COMPLETED'){
            const fd = {
                memID: authUser.ID,
                repID: authUser.repID,
                formID: id,
                type: 'paypal',
                action: itemData.type,
                amount: itemData.price,
                id: order.id,
                paypalData: order,
                // billing: billing_details,
                ...data
            };
            CoreService.onPostFn('payment', fd, onCallbackFn);
        }else{
            dispatch(uiActions.setShowLoading({ loading: false }));
            dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Payment Failed. Try again' }));
        }
        // console.log(order);
    }
    const onError = (error: any) => {
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error }));
    }

    if( itemData && Object.keys(itemData).length > 0 && paymentStatus){
        if( itemData.type === LOCAL_DEAL ){
            // return <Redirect to={`/layout/deals/add-deal/${itemData.form_id}/${itemData.mem_id}/1`} />;
            return <Redirect to={`/layout/deals/local-deals`} />;
        }
    }

    return (
        <div className="p-5">
            { itemData && Object.keys(itemData).length > 0 && 
                <PayPalButton
                    createOrder={(data:any, actions:any, err:any) => createOrder(data, actions, err)}
                    onApprove={(data:any, actions:any) => onApprove(data, actions)}
                    onError={(error: any) => onError(error)}
                />
            }
        </div>
    );
}