import React from 'react';
import { 
    IonToast
} from '@ionic/react';
interface Props{
    isOpen: boolean,
    message: string,
    type: string
}
const Toast: React.FC<Props> = ({isOpen, message, type}) => {

    return (
    <IonToast
        isOpen={isOpen}
        // onDidDismiss={() => setShowToast({status: false, type: '' msg: '' })}
        message={message}
        duration={5000}
        color={type === 'error'? "danger": "success" }
    />
    );
}

export default Toast;
