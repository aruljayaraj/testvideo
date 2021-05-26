import React from 'react';
interface PropsInterface{
    is_active: number,
    type: string;
}

const Status: React.FC<PropsInterface> = (props: PropsInterface) => {
    if(['press_release', 'daily_deal'].includes(props.type)){
        let color = 'blue';
        let status = 'Pending';
        if(+(props.is_active) === 1 ){
            color = 'green';
            status = 'Active';
        }else if(+(props.is_active) === 2 ){
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