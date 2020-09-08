import { IonLoading } from '@ionic/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import * as uiActions from '../store/reducers/ui';

type Props = {};
const Loader = () => {
    const loading = useSelector( (state:any) => state.ui.loading);
    // const [counter, setCounter] = useState(0);
    // setTimeout( () => {
    //     // setCounter(counter +1); console.log(counter);
    // }, 2000);
    
    return (<>
        <IonLoading
            isOpen={loading.showLoading}
            // onDidDismiss={() => dispatch(uiActions.showLoading({loading: false}))}
            message={ loading.msg? loading.msg : 'Please wait...'}
            //message={`${counter}`}
        />
    </>);
    
};
export default Loader;