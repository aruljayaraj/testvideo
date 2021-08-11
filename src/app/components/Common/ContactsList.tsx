import { IonAvatar, IonText, IonRouterLink } from '@ionic/react'; 
import React from 'react';
import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { lfConfig } from '../../../Constants';
interface PropsInterface{
    contacts: any
}

const ContactsList: React.FC<PropsInterface> = (props: PropsInterface) => {
  
    const loadingState = useSelector( (state:any) => state.ui.loading);
    const { apiBaseURL, basename } = lfConfig;

    return (<>
        {props.contacts && Object.keys(props.contacts).length > 0 && (props.contacts).map((item: any, index: number) => { 
            const repImage = (item.profile_image) ? `${apiBaseURL}uploads/member/${item.mem_id}/${item.profile_image}` : `${basename}/assets/img/avatar.svg`;
            return (<div className="mr-5" key={nanoid()}>
                <IonRouterLink href={`${basename}/profile/${item.mem_id}/${item.rep_id}`}>
                  <IonAvatar color="greenbg">
                    <img src={repImage} alt={`${item.firstname} ${item.lastname}`}/>
                  </IonAvatar>
                  <p className="mb-0"><IonText color="dark" className="mt-2"> {`${item.firstname} ${item.lastname}`}</IonText></p>
                </IonRouterLink>
            </div> )} 
        )}
        { !props.contacts && Object.keys(props.contacts).length === 0 && !loadingState.showLoading && 
            <p className="py-5 px-3">
                <IonText color="warning">No reps attached.</IonText>
            </p>
        }
    </>);
};

export default ContactsList;
