import React from 'react';
interface PropsInterface{
    status: number,
    frontend: boolean,
    plainText: boolean
}
//  For RFQ Status
const RFQStatus: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { status, frontend, plainText } = props;
  
  let stCls = 'status_pending';
  let stMsg = 'Draft';
  
  if( status === 1 ){
    stCls = 'status_pending';
    stMsg = 'Open';
  }else if( status === 2 ){
    if( frontend ){
      stCls = 'status_pending';
      stMsg = 'Open';
    }else{
      stCls = 'status_revised';
      stMsg = 'Revised';
    }
  }else if( status === 3 ){
    stCls = 'status_cancelled';
    stMsg = 'Expired';
  }else if( status === 4 ){
    stCls = 'status_completed';
    stMsg = 'Awarded';
  }else if( status === 5 ){
    stCls = 'status_cancelled';
    stMsg = 'Cancelled';
  }else if( status === 6 ){
    stCls = 'status_withdrawn';
    stMsg = 'Withdrawn';
  }else{
    stCls = 'status_pending';
    stMsg = 'Incomplete'; // Not Approved
  }
  
  return (<>
    { !plainText &&  <span className={`pl-1 ${stCls}`}>{`${stMsg}`}</span> }
    { plainText &&  <>{stMsg}</> }
  </>);
};

export default RFQStatus;
