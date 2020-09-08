import React from 'react';
import { IonToast } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import * as uiActions from '../store/reducers/ui';

type Props = {};
const Toast = () => {
    const showToast = useSelector( (state:any) => state.ui.toast);
    const dispatch = useDispatch();
    return (
        <IonToast
            isOpen={showToast.isShow}
            onDidDismiss={() => dispatch(uiActions.setShowToast({isShow: false, status: '', message: '' }))}
            message={showToast.message}
            duration={10000}
            color={showToast.status === 'ERROR'? 'danger': 'success'}
        />
    );
};

export default Toast;
