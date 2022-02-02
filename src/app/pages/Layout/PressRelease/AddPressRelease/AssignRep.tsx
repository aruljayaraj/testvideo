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
import * as prActions from '../../../../store/reducers/dashboard/pr';
import '../PressRelease.scss';
import CoreService from '../../../../shared/services/CoreService';
import PRStepInd from './PRStepInd';

type FormInputs = {
    reps: Array<string>;
}

const AssignRep: React.FC = () => {
    let listReps: any = null;
    const dispatch = useDispatch();
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const [addPR, setAddPR] = useState({ status: false, memID: '', ID: '' });
    const [ reps, setReps ] = useState([]);
    let { id } = useParams<any>(); 

    let initialValues = {
        reps: (pr && Object.keys(pr).length > 0 && pr.pr_reps) ? (pr.pr_reps).split(",") : [] // 
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
        if( pr && Object.keys(pr).length > 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            CoreService.onPostFn('get_member', {'action': 'get_reps', memID: pr.pr_mem_id }, onProfileCb);
        }
    }, [dispatch, onProfileCb, pr]);

    const onCallbackFn = useCallback((res: any) => {
        if(res.status === 'SUCCESS'){
            setAddPR({ status: true, memID: res.data.pr_mem_id, ID: res.data.pr_id  });
            dispatch(prActions.setPressRelease({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch]);
    
    const onSubmit = (data: FormInputs) => {
        if(data['reps'].length > 0 ){
            dispatch(uiActions.setShowLoading({ loading: true }));
            const fd = {
                action: 'pr_update_rep',
                memID: authUser.ID,
                repID: authUser.repID,
                formID: id,
                ...data
            };
            CoreService.onPostFn('pr_update', fd, onCallbackFn);
        }
    }

    if( pr && Object.keys(pr).length > 0 && reps && reps.length > 0 ){
        listReps = reps.map((rep: any) =>
            <IonSelectOption value={rep.rep_id} key={rep.rep_id}>{ `${rep.firstname} ${rep.lastname}`}</IonSelectOption> 
        );
    }

    if( addPR.status  ){
      return <Redirect to={`/layout/add-press-release/${addPR.ID}/${addPR.memID}/4`} />;
    }

    return (<>
        { pr && Object.keys(pr).length > 0 &&
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <PRStepInd />
        <IonCard className="card-center mt-2 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">Assign Representative Profile</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="8" sizeLg="8" sizeXl="8" sizeXs="12">
                            <IonItem class="ion-no-padding">
                                <IonLabel position="stacked">Select Rep(s) <IonText color="danger">*</IonText></IonLabel>
                                { pr && Object.keys(pr).length > 0 && listReps && 
                                    <Controller 
                                        name="reps"
                                        control={control}
                                        render={({ field: {onChange, onBlur, value} }) => {
                                            return <IonSelect multiple
                                                placeholder="Select Rep Profile"
                                                onIonChange={(event: any) => {
                                                    onChange(event.target.value);
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
  