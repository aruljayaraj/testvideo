import { 
    IonPage,
    IonContent,
    IonItem, 
    IonLabel,
    IonText,
    IonSelect,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSelectOption
  } from '@ionic/react';
  import React, { useCallback } from 'react';
  import { useForm, Controller } from "react-hook-form";

  type FormInputs = {
    reps: Array<string>;
    // reps: string;
  }

  const defaultValues = {
    reps: ['brown']
  };
  
  const Testing: React.FC = () => {
    const { control, handleSubmit, reset, formState: { errors }  } = useForm<FormInputs>({
      defaultValues: { ...defaultValues },
      mode: "onChange"
    });

    const onSubmit = (data: FormInputs, e: any) => {
        console.log("Meow");
        console.log(data);
    }
  
    return (<>
    <IonPage className="contact-page">
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonItem class="ion-no-padding">
                            <IonLabel position="stacked">Email <IonText color="danger">*</IonText></IonLabel>
                            <Controller 
                                name="reps"
                                control={control}
                                
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <IonSelect multiple
                                        // defaultValue={defaultValues.reps}
                                        placeholder="Select Rep Profile"
                                        onIonChange={(event: any) => {
                                            console.log(event.target.value);
                                            onChange(event.target.value);
                                        }}
                                        value={value}
                                        onBlur={onBlur}
                                    >
                                        <IonSelectOption value="brown">Brown</IonSelectOption>
                                        <IonSelectOption value="green">Green</IonSelectOption>
                                        <IonSelectOption value="black">Black</IonSelectOption>
                                        <IonSelectOption value="red">Red</IonSelectOption>
                                    </IonSelect>
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
                            {/* <Controller 
                                name="reps"
                                control={control}
                                render={({ field: {onChange, onBlur, value} }) => {
                                    return <select multiple
                                        defaultValue={[]}
                                        placeholder="Select Rep Profile"
                                        onChange={(event: any) => {
                                            if( event.target.selectedOptions ){
                                                onChange(
                                                    Array.from(event.target.selectedOptions).map(
                                                    (selectedOption: any) => selectedOption.value
                                                    )
                                                )
                                            }
                                        }}
                                         value={value}
                                        onBlur={onBlur}
                                    >
                                        <option value="brown">Brown</option>
                                        <option value="blonde">Blonde</option>
                                        <option value="black">Black</option>
                                        <option value="red">Red</option>
                                    </select>
                                }}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Representative Profile is required"
                                    },
                                    validate: value => {
                                        console.log(value);
                                        return Array.isArray(value) && value.length > 0;
                                    }
                                }}
                            /> */}
                            </IonItem>
                            {JSON.stringify(errors)}
                            {/* {errors.reps && <div className="invalid-feedback">{errors.reps.message}</div>} */}
                    </IonCol>
                </IonRow>
                    
            </IonGrid>
            
            <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="submit">
                Submit
            </IonButton>
        </form>
        </IonContent>
        </IonPage>
    </>);
  };
  
  export default Testing;
  