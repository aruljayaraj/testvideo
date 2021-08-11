import {
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonRouterLink
  } from '@ionic/react';

import React from 'react';
import './Profile.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../Constants';

const Resources: React.FC = () => {
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const resources = useSelector( (state:any) => state.res.resources);
    const { basename } = lfConfig;

    return (<>
        { Object.keys(repProfile).length > 0 && resources && resources.length > 0 && 
        <IonCard className="buscat-section-wrap card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="fs-18">
                    <span>Resource Uploads</span>
                </IonCardTitle>
            </IonCardHeader>
              
            <IonCardContent>
                <IonList className="buscat-section-content">
                    { resources.map((item: any)=> {
                        return (<div className="pl-3" key={item.id}>
                            <IonRouterLink color="greenbg" href={`${basename}/layout/resources/${item.res_type}/${item.id}`} className="">
                            <IonText>
                                {item.res_type === 'video' && <i className="fa fa-video-camera pr-2" aria-hidden="true"></i> }
                                {item.res_type === 'audio' && <i className="fa fa-file-audio-o pr-2" aria-hidden="true"></i> }
                                {['article', 'document'].includes(item.res_type) === true && <i className="fa fa-file-pdf-o pr-2" aria-hidden="true"></i> }
                                {item.title}
                            </IonText>
                            </IonRouterLink>
                        </div>)
                    })}
                </IonList>
                
            </IonCardContent>
        </IonCard>
        }
    </>);
};
  
export default Resources;
  