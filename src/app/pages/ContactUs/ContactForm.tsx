import { 
    IonItem, 
    IonLabel,
    IonText,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol
  } from '@ionic/react';
  import React, { useCallback, useEffect } from 'react';
  import { useForm, Controller } from "react-hook-form";
  import { useDispatch } from 'react-redux';
  import * as uiActions from '../../store/reducers/ui';
  
  import CoreService from '../../shared/services/CoreService';

  type FormInputs = {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string
  }

  const initialValues = {
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  };
  
  const ContactForm: React.FC = () => {
    const dispatch = useDispatch();
    const { control, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<FormInputs>({
      defaultValues: { ...initialValues },
      mode: "onChange"
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
          reset({ ...initialValues });
        }
    }, [isSubmitSuccessful, initialValues, reset]);
  
    const onContactCb = useCallback((res: any) => {
        dispatch(uiActions.setShowLoading({loading: false}));
        if(res.status === 'SUCCESS'){ 
            reset({...initialValues});
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
                                name="name"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput 
                                    type="text"
                                    placeholder="John"
                                    onIonChange={onChange} 
                                    onBlur={onBlur} 
                                    value={value}/>
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Name is required"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9 ]{2,25}$/i,
                                        message: "Invalid Name"
                                    }
                                }}
                            />
                        </IonItem>
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Email <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="email"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput 
                                    type="email"
                                    placeholder="john@example.com"
                                    onIonChange={onChange} 
                                    onBlur={onBlur} 
                                    value={value}/>
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
                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </IonCol>
                </IonRow>
                
                <IonRow>
                    <IonCol >
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Company Name</IonLabel> 
                            <Controller 
                                name="company"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput 
                                    type="text"
                                    placeholder="Isondai Corporation"
                                    onIonChange={onChange} 
                                    onBlur={onBlur} 
                                    value={value} />
                                }}
                                rules={{
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
                        {errors.company && <div className="invalid-feedback">{errors.company.message}</div>}
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Phone <IonText color="danger">*</IonText></IonLabel>    
                            <Controller 
                                name="phone"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput 
                                    type="tel"
                                    placeholder="1.306.525.1655"
                                    onIonChange={onChange} 
                                    onBlur={onBlur} 
                                    value={value} />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Phone No is required"
                                    },
                                    pattern: {
                                        value: /^[0-9. ]{8,15}$/i,
                                        message: "Invalid Phone No"
                                    }
                                }}
                            />
                        </IonItem>
                        {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </IonCol>
                </IonRow>  
                
                <IonRow>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Message <IonText color="danger">*</IonText></IonLabel>    
                            <Controller 
                                name="message"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonInput 
                                    type="text"
                                    placeholder="Enter your query here..."
                                    onIonChange={onChange} 
                                    onBlur={onBlur} 
                                    value={value} />
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Message is required"
                                    },
                                    maxLength: {
                                        value: 250,
                                        message: "Message must consist of at maximum 250 characters"
                                    }
                                }}
                            />
                        </IonItem>
                        {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
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
  