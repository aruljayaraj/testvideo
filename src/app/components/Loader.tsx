import { IonLoading } from '@ionic/react';
import { useSelector } from 'react-redux';
const Loader = () => {
    const loading = useSelector( (state:any) => state.ui.loading); // console.log(loading);
    
    return (<>
        <IonLoading
            isOpen={loading.showLoading}
            message={ loading.msg? loading.msg : 'Please wait...'}
        />
    </>);
    
};
export default Loader;

