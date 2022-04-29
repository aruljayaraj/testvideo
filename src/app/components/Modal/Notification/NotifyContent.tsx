import {
    IonRouterLink
  } from '@ionic/react';
import React, { useState, useEffect, useRef, useCallback } from "react";
import './Notification.scss';
  
import { useDispatch, useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import { nanoid } from '@reduxjs/toolkit';
  
const NotifyContent: React.FC = () => {
    const dispatch = useDispatch();
    const [baseurl] = useState(process.env.REACT_APP_BASENAME);
    const { basename, apiBaseURL } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const conversations = useSelector( (state:any) => state.rep.notifications.conversations); // console.log(conversations);
    const newQuotations = useSelector( (state:any) => state.rep.notifications.newQuotations);
    return (<>
        <ul>
          {conversations && conversations.length > 0 && conversations.map((item: any) => {
              let link: any;
              if( item.type === 'seller' ){ // You need to pass opposite link
                  link = <IonRouterLink color="blackbg" href={`${baseurl}/layout/buyer-request-center`}>{`You've got a new message for your LocalQuote - ${item.p_title}`}</IonRouterLink>;
              }else{
                  link = <IonRouterLink color="blackbg" href={`${baseurl}/layout/my-quotations`}>{`You've got a new message from the LocalQuote - ${item.p_title}`}</IonRouterLink>;
              }
              return <li key={nanoid()}>{link}</li>; 
          })}
          { newQuotations && newQuotations.length > 0 && newQuotations.map((item: any) => { // 2/52/3/1591
            return <li><IonRouterLink color="blackbg" href={`${baseurl}/layout/view-quotation/${item.id}/${item.mem_id}/${item.bq_id}/${item.bmem_id}/buyer`}>You've got a new Quotation - <b>{item.s_title}</b> for your LocalQuote - <b>{item.p_title}</b></IonRouterLink></li>;
          })}
        </ul>
    </>);
};
  
export default React.memo(NotifyContent);
  