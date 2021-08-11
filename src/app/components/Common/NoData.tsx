import { IonText } from '@ionic/react';
import React from 'react';
import { useSelector } from 'react-redux';

interface PropsInterface{
    dataArr: any,
    htmlText: any
}

const NoData: React.FC<PropsInterface> = (props: PropsInterface) => {
  const loading = useSelector( (state:any) => state.ui.loading);
  return (<>
    { !loading.showLoading && props.dataArr && props.dataArr.length === 0 && props.htmlText &&  
      <div className="ion-text-center p-5">
        <IonText className="fs-13 mr-3 pt-5" color="warning">
          {props.htmlText}
        </IonText>
      </div>
    }
  </>);
};

export default NoData;
