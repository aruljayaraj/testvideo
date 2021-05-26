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
    IonSelectOption
} from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../../../../store/reducers/ui';
import * as resActions from '../../../../store/reducers/dashboard/resource';
import '../ResourceUpload.scss';
import CoreService from '../../../../shared/services/CoreService';
import ResStepInd from './ResStepInd';

type FormInputs = {
    reps: string;
}

const AssignRep: React.FC = () => {
    let listReps: any = null;
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const resource = useSelector( (state:any) => state.res.resource);
    const [addRes, setAddRes] = useState({ status: false, memID: '', ID: '' });
    const [ reps, setReps ] = useState([]);
    let { id, res_type } = useParams<any>(); 

    let initialValues = {
        reps: (resource && Object.keys(resource).length > 0 && resource.res_reps) ? (resource.res_reps).split(",") : [] // 
    };
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

    // For State default to load
    const onProfileCb = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setReps([]);
            setReps(res.reps);
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
    }, [dispatch, setReps]);
    // For Country default to load
    useEffect(() => {
        if( resource && Object.keys(resource).length > 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_member', {'action': 'get_reps', memID: resource.mem_id }, onProfileCb);
        }
    }, [dispatch, onProfileCb, resource]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddRes({ status: true, memID: res.data.mem_id, ID: res.data.id  });
            dispatch(resActions.setResource({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: any) => {
        if(data['reps'].length > 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const fd = {
                action: 'res_update_rep',
                resType: res_type,
                memID: authUser.ID,
                repID: authUser.repID,
                formID: id,
                ...data
            };
            CoreService.onPostFn('res_update', fd, onCallbackFn);
        }
    } 

    if( resource && Object.keys(resource).length > 0 && reps && reps.length > 0 ){
        listReps = reps.map((rep: any) =>
            <IonSelectOption value={rep.rep_id} key={rep.rep_id}>{ `${rep.firstname} ${rep.lastname}`}</IonSelectOption> 
        );
    }

    if( addRes.status  ){
      return <Redirect to={`/layout/add-resource/${res_type}/${addRes.ID}/${addRes.memID}/4`} />;
    }
    return (<>
        { resource && Object.keys(resource).length > 0 &&
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ResStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">Assign Representative Profile</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
            
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="8" sizeLg="8" sizeXl="8" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Select Rep(s) <IonText color="danger">*</IonText></IonLabel>
                                { resource && Object.keys(resource).length > 0 && listReps && 
                                    <Controller 
                                        name="reps"
                                        control={control}
                                        render={({ field: {onChange, onBlur, value} }) => {
                                            return <IonSelect multiple
                                                placeholder="Select Rep Profile"
                                                value={value}
                                                onIonChange={(selected: any) =>{
                                                    onChange(selected.detail.value);
                                                }}
                                                onBlur={onBlur}
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
  