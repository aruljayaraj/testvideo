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
import React, { useCallback } from 'react';
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { isPlatform } from '@ionic/react';

import CoreService from '../../../shared/services/CoreService';
import './RepProfile.scss';
import { useDispatch, useSelector } from 'react-redux';
import * as repActions from '../../../store/reducers/dashboard/rep';
import * as uiActions from '../../../store/reducers/ui';

interface Props {
    showContactModal: boolean,
    setShowContactModal: Function
}

const ContactInfoModal: React.FC<Props> = ({showContactModal, setShowContactModal}) => {
    let { repid,memid } = useParams();
    
    const dispatch = useDispatch();
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    let initialValues = {
        phone: (repProfile)? repProfile.phone: '',
        phoneExt: (repProfile)? repProfile.phoneext: '',
        mobile: (repProfile)? repProfile.mobile: '',
        fax: (repProfile)? repProfile.fax: '',
        bestDaysToContact: (repProfile)? repProfile.advdaystxt: '',
        bestTimeToContact: (repProfile)? repProfile.advtimetxt: '',
        bestWaysToContact: (repProfile)? repProfile.advcontacttype.split(','): '',
        newsLetter: (repProfile && repProfile.newsletteryn === 'Y')? true: false,
    };
    const { control, errors, handleSubmit } = useForm({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });

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
            setShowContactModal(false);
            dispatch(repActions.setRepProfile({ data: res.data }));
        }
        dispatch(uiActions.setShowLoading({ loading: false }));
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, setShowContactModal]);
    const onSubmit = (data: any) => { console.log(data);
        dispatch(uiActions.setShowLoading({ loading: true }));
        const user = {
            action: 'contact_info_update',
            memID: memid,
            repID: repid,
            ...data
        };
        CoreService.onPostFn('member_update', user, onCallbackFn);
    }    

    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonHeader translucent>
                <IonToolbar color="greenbg">
                    <IonButtons slot={ isPlatform('desktop') || isPlatform('tablet')? 'end': 'start' }>
                        <IonButton onClick={() => setShowContactModal(false)}>
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
                    <IonTitle>Edit Contact Info</IonTitle>
                </IonToolbar>
                
            </IonHeader>
            <IonContent fullscreen>
            <IonGrid>
                
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
                            <IonLabel position="stacked">Phone Ext </IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                    return selected.detail.value;
                                }}
                                name="phoneExt"
                                rules={{
                                    pattern: {
                                    value: /^[0-9]{1,5}$/i,
                                    message: "Invalid Phone Ext"
                                    }
                                }}
                            />
                        </IonItem>
                        {showError("phoneExt", "Phone Ext")}
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Mobile </IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="mobile"
                                rules={{
                                pattern: {
                                    value: /^[0-9]{7,12}$/i,
                                    message: "Invalid Mobile No"
                                }
                                }}
                            />
                        </IonItem>
                        {showError("mobile", "Mobile No")}
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

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Best Days to Contact </IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="bestDaysToContact"
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Best Time to Contact </IonLabel>
                            <Controller
                                as={IonInput}
                                control={control}
                                onChangeName="onIonChange"
                                onChange={([selected]) => {
                                return selected.detail.value;
                                }}
                                name="bestTimeToContact"
                            />
                        </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol sizeMd="6" sizeXs="12">
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Best ways to Contact </IonLabel>
                            <Controller
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
                            />
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Subscribe to Newsletter :  </IonLabel>
                            <Controller
                                as={IonCheckbox}
                                control={control}
                                onChangeName="onIonChange"
                                // defaultChecked={true}
                                // defaultValue={true}
                                onChange={([e]) => {
                                    return e.detail.checked;
                                }}
                                name="newsLetter"
                            />
                        </IonItem>
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
  
export default ContactInfoModal;
;
  