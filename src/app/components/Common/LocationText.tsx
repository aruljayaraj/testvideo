import React from 'react';
interface PropsInterface{
    location: number,
    plainText: boolean
}
//  For RFQ Location
const LocationText: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { location, plainText } = props;
  let stCls = '';
  let stMsg = '';
  if( location === 2 ){
    stCls = 'location_reg';
    stMsg = 'Regional';
  }else if( location === 3 ){
    stCls = 'location_nat';
    stMsg = 'National';
  }else if( location === 4 ){
    stCls = 'location_int';
    stMsg = 'International';
  }else{
    stCls = 'location_loc';
    stMsg = 'Local';
  }
  
  return (<>
    { !plainText &&  <span className={`pl-1 ${stCls}`}>{` ${stMsg}`}</span> }
    { plainText &&  <>{stMsg}</> }
  </>);
};

export default LocationText;
