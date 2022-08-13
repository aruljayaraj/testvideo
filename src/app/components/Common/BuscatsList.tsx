import { IonAvatar, IonItem, IonLabel, IonText, IonList } from '@ionic/react'; 
import React from 'react';
import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
interface PropsInterface{
    buscats: any
}

const BuscatsList: React.FC<PropsInterface> = (props: PropsInterface) => {
  
    const loadingState = useSelector( (state:any) => state.ui.loading);
  
    return (<>
        {props.buscats && Object.keys(props.buscats).length > 0 && 
            <IonList>
            { props.buscats.map((item: any, index: number) => { 
                return (<IonItem lines="none" key={nanoid()}>
                    <IonAvatar slot="start" color="appbg">
                        <i className="fa fa-chevron-right fa-lg green" aria-hidden="true"></i>
                    </IonAvatar>
                    <IonLabel>
                        <h2>{item.catname}</h2>
                        <h3>{item.sub_catname}</h3>
                        {item.keywords && <p><strong>Keywords:</strong> {item.keywords}</p>}
                    </IonLabel>
                </IonItem> )} 
            )}
        </IonList>}
        { !props.buscats && Object.keys(props.buscats).length === 0 && !loadingState.showLoading && 
            <p className="py-5 px-3">
                <IonText color="warning">No categories added.</IonText>
            </p>
        }
    </>);
};

export default BuscatsList;
