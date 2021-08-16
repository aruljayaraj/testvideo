import { 
    IonCard, 
    IonCardHeader, 
    IonCardContent,
    IonItem, 
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonText,
    IonSelect,
    IonSelectOption,
    IonRouterLink
} from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as dealActions from '../../../../store/reducers/dashboard/deal';
import '../Deals.scss';
import { lfConfig } from '../../../../../Constants';
import CoreService from '../../../../shared/services/CoreService';
import StepInd from './StepInd';

type FormInputs = {
    reps: string;
}

const AssignRep: React.FC = () => {
    let listReps: any = null;
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const dd = useSelector( (state:any) => state.deals.localDeal);
    const [addDeal, setAddDeal] = useState({ status: false, memID: '', id: '' });
    const [ reps, setReps ] = useState([]);
    let { id } = useParams<any>(); 
    const { basename } = lfConfig;
    // console.log(dd?.reps!); 
    let initialValues = {
        reps: (dd && Object.keys(dd).length > 0) && dd.dd_reps  ? (dd.dd_reps).split(",") : [] // 
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
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
    useEffect(() => {
        if( dd && Object.keys(dd).length > 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_member', {'action': 'get_reps', memID: dd.mem_id }, onProfileCb);
        }
    }, [dispatch, onProfileCb, dd]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddDeal({ status: true, memID: res.data.mem_id, id: res.data.id  });
            dispatch(dealActions.setDeal({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: any) => {
        if(data['reps'].length > 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const fd = {
                action: 'dl_update_rep',
                memID: authUser.ID,
                repID: authUser.repID,
                formID: id,
                ...data
            };
            CoreService.onPostFn('deal_update', fd, onCallbackFn);
        }
    }

    if( dd && Object.keys(dd).length > 0 && reps && reps.length > 0 ){
        listReps = reps.map((rep: any) =>
            <IonSelectOption value={rep.rep_id} key={rep.rep_id}>{ `${rep.firstname} ${rep.lastname}`}</IonSelectOption> 
        );
    }

    if( addDeal.status  ){
      return <Redirect to={`/layout/deals/add-deal/${addDeal.id}/${addDeal.memID}/4`} />;
    }

    return (<>
        { dd && Object.keys(dd).length > 0 &&
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <StepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">Assign Representative Profile
                    <IonRouterLink color="greenbg" href={`${basename}/layout/deals/local-deals`} className="float-right router-link-anchor" title="Deal Listing">
                        <i className="fa fa-list green cursor" aria-hidden="true"></i>
                    </IonRouterLink>
                </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="8" sizeLg="8" sizeXl="8" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Select Rep(s) <IonText color="danger">*</IonText></IonLabel>
                                { dd && Object.keys(dd).length > 0 && listReps && 
                                    <Controller 
                                        name="reps"
                                        control={control}
                                        render={({ field: {onChange, onBlur, value} }) => {
                                            return <IonSelect multiple
                                                placeholder="Select Rep Profile"
                                                onIonChange={(selected: any) =>{
                                                    onChange(selected.detail.value);
                                                }}
                                                onBlur={onBlur}
                                                value={value}
                                                disabled={[1,2].includes(+(dd.is_premium))? true: false}
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
                            { [1,2].includes(+(dd.is_premium)) && <p className="mt-2">Premium deals we can't edit reps here. You need to choose appropirate reps during deal purcahse.</p> }
                        </IonCol>
                        
                    </IonRow>
                </IonGrid>
                
                <IonButton color="greenbg" className="ion-margin-top mt-4 float-right mb-3" type="submit">
                    Next
                </IonButton> 
                
            </IonCardContent>
        </IonCard>
        </form>}
    </>);
};
 
export default AssignRep;
  