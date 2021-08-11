import React from 'react';
interface PropsInterface{
    is_active: number;
    type: string;
    converted?: number;
}

const Status: React.FC<PropsInterface> = (props: PropsInterface) => {
    let color = 'blue';
    let status = 'Pending';
    if(['press_release', 'local_deal'].includes(props.type)){
        if(+(props.is_active) === 1 ){
            color = 'green';
            status = 'Active';
        }else if(+(props.is_active) === 2 ){
            color = 'error';
            status = 'Suspended';
        }else if(+(props.is_active) === 3 ){
            color = 'gray';
            status = 'Expired';
        }
        return (
             <i className={`fa fa-circle-o fa-lg fw-bold ${color}`}  aria-hidden="true" title={`${status}`}></i>
        );
    }else if(['resources'].includes(props.type)){
        if( +(props.is_active) === 1 && +(props.converted!) === 1 ){
            color = 'green';
            status = 'Active';
        }else if(+(props.is_active) === 2 && +(props.converted!) === 1 ){
            color = 'error';
            status = 'Suspended';
        }
        return (
             <i className={`fa fa-circle-o fa-lg fw-bold ${color}`}  aria-hidden="true" title={`${status}`}></i>
        );
    }else{
        return (<></>);
    }
};

export default Status;