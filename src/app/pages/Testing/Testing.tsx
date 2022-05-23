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
    IonSelectOption,
    IonModal
  } from '@ionic/react';
  import React, { useState, useRef } from 'react';
  import { useForm, Controller } from "react-hook-form";
  import RecordAudio from '../../components/Modal/Record/RecordAudio';
  import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';

  let initialValues = {
    isOpen: false,
    title: '',
    actionType: '', // new or edit
    memId: '',
    repId: '',
    frmId: ''
  };
  type FormInputs = {
    reps: Array<string>;
    // reps: string;
  }

  const defaultValues = {
    reps: ['brown']
  };
  
  const Testing: React.FC = () => {
    const { control, handleSubmit, formState: { errors }  } = useForm<FormInputs>({
      defaultValues: { ...defaultValues },
      mode: "onChange"
    });
    const [audio, setAudio] = useState<any>({});
    const audioRef = useRef<any>();
    const [showRecordAudioModal, setShowRecordAudioModal] = useState(initialValues);

    const onSubmit = (data: FormInputs, e: any) => {
        console.log("Meow");
        console.log(data);
    }

    const recordModalFn = (title: string, actionType: string) => {
        setShowRecordAudioModal({ 
            ...showRecordAudioModal, 
            isOpen: true,
            title: title,
            actionType: actionType
            // memId: (authUser && Object.keys(authUser).length > 0)? authUser.ID: '',
            // frmId: (pr && Object.keys(pr).length > 0)? pr.pr_id: ''
        });
    }

    /* const onRecord = () => {
        VoiceRecorder.canDeviceVoiceRecord()
        .then((result: GenericResponse) => {
            console.log(result.value);

            VoiceRecorder.hasAudioRecordingPermission()
            .then((result: GenericResponse) => {
                console.log(result.value);
                
                VoiceRecorder.requestAudioRecordingPermission()
                .then((result: GenericResponse) => {
                    console.log(result.value);
                    // Recording
                    VoiceRecorder.startRecording()
                    .then((result: any) => { // GenericResponse
                        console.log(result.value);
                        
                    })
                    .catch(error => console.log(error))
                });
            }).catch((error) =>{
                console.log(error);
                VoiceRecorder.requestAudioRecordingPermission()
                .then((result: GenericResponse) => {
                    console.log(result.value);
                    // Recording
                    VoiceRecorder.startRecording()
                    .then((result: any) => { // GenericResponse
                        console.log(result.value);
                        
                    })
                    .catch(error => console.log(error))
                });
            });
        });
    }*/

    const onStop = () => { console.log("stop");
        VoiceRecorder.stopRecording()
        .then((result: RecordingData) => {
            // console.log(result.value);
            const audDetails = {
                base64Sound: result.value.recordDataBase64,
                mimeType: result.value.mimeType
            }
            setAudio(audDetails);
        })
        .catch(error => console.log(error));
    }

    const onPlay = async() => {
        console.log(audio);
        const audioRef = new Audio(`data:${audio.mimeType};base64,${audio.base64Sound}`);
        // audioRef.play();
        audioRef.oncanplaythrough = () => audioRef.play()
        audioRef.load();
        try {
            await audioRef.play();
            console.log("Playing audio");
          } catch (err) {
            console.log("Failed to play, error: " + err);
          }
        
       /* if(audioRef.current){
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play();
        }*/
    }
  
    return (<>
    <IonPage className="contact-page">
      <IonContent className="ion-padding">
        { audio.base64Sound && <audio controls ref={audioRef}>
            <source src={audio.base64Sound} type="audio/ogg" />
        </audio> }
        <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="button" onClick={() => recordModalFn('Record Audio', 'press_release')}>
            Record
        </IonButton>
        <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="button" onClick={onStop}>
            Stop
        </IonButton>
        <IonButton color="greenbg" className="ion-margin-top mt-4" expand="block" type="button" onClick={onPlay}>
            Play
        </IonButton>
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
        <IonModal backdropDismiss={false} isOpen={showRecordAudioModal.isOpen} className='view-modal-wrap'>
            { showRecordAudioModal.isOpen === true &&  <RecordAudio
            showRecordAudioModal={showRecordAudioModal}
            setShowRecordAudioModal={setShowRecordAudioModal} 
           /> }
        </IonModal>
        </IonContent>
        </IonPage>
    </>);
  };
  
  export default Testing;
  