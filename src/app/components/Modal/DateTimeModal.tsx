import React, { useState, useEffect} from 'react';
import { IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonDatetime,
  IonCardHeader,
  IonRow,
  IonCol
} from '@ionic/react';
import { 
    close
} from 'ionicons/icons';
import { format, parseISO, formatISO } from 'date-fns';
import CommonService from '../../shared/services/CommonService';

interface Props {
    datePickerModal: any,
    setDatePickerModal: Function,
    updateDateHandler: Function
}
const DateTimeModal: React.FC<Props> = ({ datePickerModal, setDatePickerModal, updateDateHandler }) => {
    const [selectDate, setSelectDate] = useState<string>(); 
    useEffect(() => {
        setSelectDate(datePickerModal.dateValue);
    }, []); 

    const datePickerHandler = () => {
        updateDateHandler(datePickerModal.fieldName, selectDate);
        setDatePickerModal({
            ...datePickerModal, 
            isOpen: false,
            dateValue: selectDate
        });
    }

    // if( selectDate ){
        // console.log(selectDate);
        // console.log(formatISO(new Date(selectDate)));
        // console.log(datePickerModal.min, datePickerModal.max);
    // }
  
    return (<>
        <IonHeader translucent>
            <IonToolbar color="appbg">
                <IonTitle className="ion-text-wrap">Select {datePickerModal.title}</IonTitle>
                <IonButtons slot="end">
                    <IonButton onClick={datePickerHandler}>
                        <IonIcon icon={close} slot="icon-only"></IonIcon>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding pl-4">
            <IonDatetime
                presentation={datePickerModal.presentation? datePickerModal.presentation: 'date'}
                min={datePickerModal.min}
                max={datePickerModal.max}
                value={ selectDate && datePickerModal.presentation === 'time-date'? formatISO(new Date(CommonService.mysqlToJsDateFormat(selectDate))): selectDate }
                onIonChange={(selected: any) => {
                    let selectedDate;
                    if(datePickerModal.presentation === 'time-date'){
                        selectedDate = format(parseISO(selected.detail.value), 'yyyy-MM-dd HH:mm:ss');
                    } else {
                        selectedDate = format(parseISO(selected.detail.value), 'yyyy-MM-dd');
                    }
                    // console.log(selectedDate);
                    setSelectDate(selectedDate);
                }}>
            </IonDatetime>
        </IonContent>
        <IonCardHeader color="titlebg">
            <IonRow>
                { selectDate && <IonCol>
                    Selected Date : {selectDate}
                </IonCol>}
                <IonCol className="p-0">
                    <IonButton className="m-0 p-0 ion-float-right" onClick={datePickerHandler} color="appbg" type="button">Ok</IonButton>
                </IonCol>
            </IonRow>
        </IonCardHeader>
    </>);
}

export default DateTimeModal;
