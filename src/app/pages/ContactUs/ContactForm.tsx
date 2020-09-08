import { 
    IonItem, 
    IonLabel,
    IonText,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonTextarea
  } from '@ionic/react';
  import React, { useCallback } from 'react';
  import { useForm, Controller } from "react-hook-form";
  import { useDispatch } from 'react-redux';
  import * as uiActions from '../../store/reducers/ui';
  
  import CoreService from '../../shared/services/CoreService';

  const defaultValues = {
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  };
  
  const ContactForm: React.FC = () => {
    const dispatch = useDispatch();
    const { control, errors, handleSubmit, reset  } = useForm({
      defaultValues: { ...defaultValues },
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
  
    const onContactCb = useCallback((res: any) => {
        dispatch(uiActions.setShowLoading({loading: false}));
        if(res.status === 'SUCCESS'){
            reset(defaultValues);
        }
        dispatch(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
    }, [dispatch, reset]);

    const onSubmit = (data: any, e: any) => {
        dispatch(uiActions.setShowLoading({loading: true}));
        CoreService.onPostFn('contact', data, onContactCb);
    }
  
    return (<>
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonGrid>
                <IonRow>
                <IonCol>
                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Name <IonText color="danger">*</IonText></IonLabel>    
                        <Controller
                            as={IonInput}
                            control={control}
                            onChangeName="onIonChange"
                            onChange={([selected]) => {
                            return selected.detail.value;
                            }}
                            name="name"
                            placeholder="John"
                            defaultValue=""
                            rules={{
                            required: true,
                            pattern: {
                                value: /^[A-Z0-9 ]{2,25}$/i,
                                message: "Invalid Name"
                            }
                            }}
                        />
                    </IonItem>
                    {showError("name", "Name")}
                </IonCol>
                </IonRow>

                <IonRow>
                <IonCol>
                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Email <IonText color="danger">*</IonText></IonLabel>
                        <Controller
                            as={IonInput}
                            control={control}
                            onChangeName="onIonChange"
                            onChange={([selected]) => {
                            return selected.detail.value;
                            }}
                            name="email"
                            placeholder="john@example.com"
                            rules={{
                            required: true,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid Email Address"
                            }
                            }}
                        />
                        </IonItem>
                        {showError("email", "Email")}
                </IonCol>
                </IonRow>
                
                <IonRow>
                <IonCol >
                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Company Name</IonLabel> 
                        <Controller
                            as={IonInput}
                            control={control}
                            onChangeName="onIonChange"
                            onChange={([selected]) => {
                            return selected.detail.value;
                            }}
                            name="company"
                            placeholder="Isondai Corporation"
                            rules={{
                            required: false,
                            minLength: {
                                value: 3,
                                message: "Invalid Company Name"
                            },
                            maxLength: {
                                value: 150,
                                message: "Company Name must consist of at maximum 150 characters"
                            }
                            }}
                        />
                    </IonItem>
                    {showError("company", "Company Name")}
                </IonCol>
                </IonRow>

                <IonRow>
                <IonCol>
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
                            placeholder="1.306.525.1655"
                            rules={{
                            required: true,
                            pattern: {
                                value: /^[0-9. ]{8,15}$/i,
                                message: "Invalid Phone No"
                            }
                            }}
                        />
                    </IonItem>
                    {showError("phone", "Phone No")}
                </IonCol>
                </IonRow>  
                
                <IonRow>
                <IonCol>
                    <IonItem class="ion-no-padding">
                        <IonLabel position="stacked">Message <IonText color="danger">*</IonText></IonLabel>    
                        <Controller
                            as={IonTextarea}
                            control={control}
                            onChangeName="onIonChange"
                            onChange={([selected]) => {
                            return selected.detail.value;
                            }}
                            name="message"
                            placeholder="Enter your query here..."
                            rules={{
                            required: true
                            }}
                        />
                    </IonItem>
                    {showError("message", "Message")}
                </IonCol>
                </IonRow> 
                    
            </IonGrid>
            
            <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="submit">
                Submit
            </IonButton>
        </form>
    </>);
  };
  
  export default ContactForm;
  