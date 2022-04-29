import {
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonText,
    IonTextarea
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { nanoid } from 'nanoid';
import {formatDistance, parse} from 'date-fns';
import { eo } from 'date-fns/locale';
import './Chat.scss';

import { useDispatch, useSelector } from 'react-redux';
import CoreService from '../../../shared/services/CoreService';
import CommonService from '../../../shared/services/CommonService';
import { lfConfig } from '../../../../Constants';
import * as uiActions from '../../../store/reducers/ui';
import * as qqActions from '../../../store/reducers/dashboard/qq';
import { isPlatform } from '@ionic/react';

interface Props {
    qq_type: string
}

const Messages: React.FC<Props> = ({qq_type}) => {
    
    const dispatch = useDispatch();
    const [basename] = useState(process.env.REACT_APP_BASENAME);
    // const qq = useSelector( (state:any) => state.qq.localQuote);
    const messages = useSelector( (state:any) => state.qq.messages.messages);
    const qq_mem = useSelector( (state:any) => state.qq.messages.qq_mem); 
    const qt_mem = useSelector( (state:any) => state.qq.messages.qt_mem); 
    const { apiBaseURL } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const loadingState = useSelector( (state:any) => state.ui.loading);
    let senderUrl = `${basename}/assets/img/avatar.svg`;
    let receiverUrl = `${basename}/assets/img/avatar.svg`;
    
    if( qq_mem && Object.keys(qq_mem).length > 0 && qq_mem.profile_image ){
        senderUrl = `${apiBaseURL}uploads/member/${qq_mem.mem_id}/${qq_mem.rep_id}/${qq_mem.profile_image}`;
    }
    if( qt_mem && Object.keys(qt_mem).length > 0 && qt_mem.profile_image ){
        receiverUrl = `${apiBaseURL}uploads/member/${qt_mem.mem_id}/${qt_mem.rep_id}/${qt_mem.profile_image}`;
    }
    
    /*const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    
    console.log(tz);*/

    return (<>
        { messages && messages.length > 0 &&  // !loadingState.showLoading && 
        
        <div className="card-body chat-care">
            <ul className="chat p-0">
                { messages.map((msg: any)=> {
                    const added_date = CommonService.mysqlToJsDateFormat(msg.added_date);
                    let str: any;
                    if((qq_type === 'buyer' && authUser.ID !== msg.mem_id) || (qq_type === 'seller' && authUser.ID === msg.mem_id)){
                        str = (<li key={nanoid()} className="agent">
                            <span className={ qq_type === 'buyer'? 'chat-img left mx-2': 'chat-img right mx-2' }>
                                <img src={receiverUrl} alt="Agent" className="img-circle"  width="50" height="50" />
                            </span>
                            <div className="chat-body">
                                <div className="header">
                                    <strong className="primary-font">{qt_mem.name}</strong>
                                    <small className="right text-muted">
                                        <span className="glyphicon glyphicon-time"></span>
                                        
                                        {added_date && formatDistance(
                                            new Date(added_date),
                                            new Date(),
                                            { addSuffix: true }
                                        )}
                                    </small>
                                </div>
                                <p>{msg.message}</p>
                            </div>
                        </li>);
                    }else{
                        str = <li key={nanoid()} className="admin ">
                            <span className={ qq_type === 'buyer'? 'chat-img right mx-2': 'chat-img left mx-2' }>
                                <img src={senderUrl} alt="Admin" className="img-circle" width="50" height="50" />
                            </span>
                            <div className="chat-body">
                                <div className="header">
                                    <small className="left text-muted">
                                        <span className="glyphicon glyphicon-time"></span>
                                        {added_date && formatDistance(
                                            parse('', '', new Date(added_date)),
                                            new Date(),
                                            { addSuffix: true }
                                        )}
                                    </small>
                                    <strong className="right primary-font">{qq_mem.name}</strong>
                                </div>
                                <p className='py-2'>{msg.message}</p>
                            </div>
                        </li>;
                    }
                    return str;
                })}
            </ul>
        </div> }    
    </>);
};
  
export default Messages;
  