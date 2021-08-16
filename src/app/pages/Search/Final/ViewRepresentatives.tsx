import { IonRouterLink } from '@ionic/react'; 
import React from 'react';
import { nanoid } from 'nanoid';
import '../Search.scss';
import { lfConfig } from '../../../../Constants';

interface Props{
    reps: any
}

const ViewRepresentatives: React.FC<Props> = ({reps}) => {
  const { basename } = lfConfig;
  
  return (<div className="pl-2">
        <p>View Representatives</p>
        { reps && reps.length > 0 && reps.map( (rep: any) => { 
            return <p key={nanoid()}><IonRouterLink href={`${basename}/profile/${rep.mem_id}/${rep.id}`}>{`${rep.firstname} ${rep.lastname}`}</IonRouterLink></p> ;
        } ) } 
    </div>
  );
};

export default ViewRepresentatives;
