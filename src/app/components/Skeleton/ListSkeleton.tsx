import { IonList, IonItem, IonThumbnail, IonSkeletonText, IonLabel, IonListHeader } from '@ionic/react';
import React from 'react';
import { useSelector } from 'react-redux';
import './Skeleton.scss';

const ListSkeleton = () => {
    const skeleton = useSelector( (state:any) => state.ui.skeleton);
    
    return (<>
        { skeleton && skeleton.showSkeleton && <IonList>
            <IonListHeader>
                <IonSkeletonText className="list-skeleton-title" animated></IonSkeletonText>
            </IonListHeader>
            { [1,2,3,4,5,6].map((item: any, index: number)=> { 
                return (
                    <IonItem key={index}>
                        <IonThumbnail slot="start">
                            <IonSkeletonText animated />
                        </IonThumbnail>
                        <IonLabel>
                        <h3>
                            <IonSkeletonText animated style={{ width: '50%' }} />
                        </h3>
                        <p>
                            <IonSkeletonText animated style={{ width: '80%' }} />
                        </p>
                        <p>
                            <IonSkeletonText animated style={{ width: '60%' }} />
                        </p>
                        </IonLabel>
                    </IonItem>
                );
            }) }
        </IonList>}    
    </>);
    
};
export default ListSkeleton;