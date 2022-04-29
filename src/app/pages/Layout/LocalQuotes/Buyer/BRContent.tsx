import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRouterLink, IonRow, IonCol, IonButton, IonItem, IonGrid, IonThumbnail, IonLabel, IonFab, IonFabButton, IonIcon, IonModal } from '@ionic/react';
import { chatboxEllipsesOutline } from 'ionicons/icons';
import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import { isPlatform } from '@ionic/react';
import '../LocalQuotes.scss';
import { useSelector } from 'react-redux';
import CommonService from '../../../../shared/services/CommonService';
import { lfConfig } from '../../../../../Constants';
import RFQStatus from '../../../../components/Common/RFQStatus';
import LocationText from '../../../../components/Common/LocationText';
import NoData from '../../../../components/Common/NoData';
import Chat from '../../../../components/Modal/Chat/Chat';

interface Props {
    qq: any,
    setShowActionSheet?: Function,
    setShowPopover: Function,
    setShowDeleteModal?: Function,
    onAwardedFn?: Function
}

let initialValues = {
    isOpen: false,
    title: '',
    qq_type: '',
    bid: 0,
    sid: 0,
    mem_id: 0,
    receiver_id: 0
};

const BRContent: React.FC<Props> = ({qq, setShowActionSheet, setShowPopover, setShowDeleteModal, onAwardedFn}) => {
    const { basename } = lfConfig;
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const { apiBaseURL } = lfConfig;
    const [showChatModal, setShowChatModal] = useState(initialValues);

    const handleChatFn = (bid: number, sid: number, mem_id: number,  receiver_id: number) => {
        // console.log(bid, sid, mem_id, receiver_id);
        setShowChatModal({ 
            ...showChatModal, 
            isOpen: true,
            title: 'Message Center',
            qq_type: 'buyer',
            bid, // Buyer QQ ID
            sid, // Seller QQ ID
            mem_id, // Mem ID
            receiver_id, // Receiver Mem ID
            
        });
    }
    
    return (<IonCard className="card-center mt-3 mb-1">
        { qq && Object.keys(qq).length > 0 && <>
        <IonCardHeader color="titlebg">
            <IonCardTitle class="card-title">
                <IonRouterLink color="greenbg" href={`${basename}/layout/view-localquote/${qq.id}/${authUser.ID}/buyer/`}>
                    {qq.p_title}
                </IonRouterLink>
                { setShowActionSheet && <IonRouterLink color="greenbg" onClick={() => setShowActionSheet({status: true, qq: qq})} className="float-right router-link-anchor-vertical">
                    <i className="fa fa-ellipsis-v fa-lg green cursor" aria-hidden="true"></i>
                </IonRouterLink>}
            </IonCardTitle>
            <p className="m-0 pt-1 gray">{CommonService.dateFormat(qq.quotation_date)}</p>
        </IonCardHeader>
        <IonCardContent>
            <IonGrid>
                { qq.quotations && qq.quotations.length > 0 && qq.quotations.map((qt: any, index: number) => {
                    const repImage = (Object.keys(qt).length > 0 && qt.profile_image) ? `${apiBaseURL}uploads/member/${qt.mem_id}/${qt.rep_id}/${qt.profile_image}` : `${basename}/assets/img/avatar.svg`;
                    return (
                        <IonItem key={index} lines={ (index+1) < qq.quotations.length?  "full" : "none"}>
                        <IonGrid className='no-padding'>   
                        <IonRow>
                            <IonCol>
                            <IonItem lines="none" className='no-padding'>
                                <IonThumbnail slot="start" color="greenbg">
                                {/* <IonRouterLink href={`${basename}/member/${item.pr_mem_id}/${item.pr_id}`}> */}
                                    <img src={repImage} alt="Rep Profile" onError={() => CommonService.onImgErr('profile')} />
                                {/* </IonRouterLink> */}
                                </IonThumbnail>
                                
                                <IonLabel>
                                    <h2>{qt.s_title}</h2>
                                    { qt.firstname && <h3 className="cursor anchor-link" onClick={() => setShowPopover({status: true, qq: qt})}>{`${qt.firstname} ${qt.lastname}`}</h3> }
                                    <p>
                                        <IonRouterLink href={`${basename}/layout/view-quotation/${qt.id}/${qt.mem_id}/${qq.id}/${qq.mem_id}/buyer`}>
                                            View Quotation
                                        </IonRouterLink>
                                    </p>
                                </IonLabel>
                                { qq.quotations && qq.quotations.length > 0 && <IonFab vertical="bottom" horizontal="end" >
                                    <IonFabButton color="greenbg" size="small" onClick={()=>handleChatFn(qq.id, qt.id, qq.mem_id, qt.mem_id)}> 
                                        <IonIcon icon={chatboxEllipsesOutline} size="small" />
                                    </IonFabButton>
                                </IonFab>}
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            {/* <p>{JSON.stringify(qt)}</p> */}
                            <IonItem lines="none" >
                                <IonLabel>
                                    <p><span className="fw-bold">Response Deadline : </span>{CommonService.dateFormat(qq.quotation_req_date)}</p>
                                    <p><span className="fw-bold">Quotation Date : </span>{CommonService.dateFormat(qt.quotation_date)}</p> 
                                    <p><span className="fw-bold">Status: </span> <RFQStatus status={+(qt.is_active)} plainText={false} frontend={false}/></p>
                                    { onAwardedFn && [1, 2].includes(+(qq.is_active)) && [1, 2].includes(+(qt.is_active)) &&
                                        <IonButton color="greenbg" onClick={() => onAwardedFn(qt.id, qt.mem_id, qq.id, qq.mem_id)} >Accept Quotation</IonButton>
                                    }
                                </IonLabel>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    </IonGrid> 
                </IonItem>)} )}
                <NoData dataArr={qq.quotations} htmlText={`Your quotations are empty.`} />
            </IonGrid>

        </IonCardContent>
        <IonCardHeader color="titlebg">
            <IonRow>
                <IonCol>
                    Status: <RFQStatus status={+(qq.is_active)} plainText={false} frontend={false}/>
                </IonCol>
                <IonCol>
                    { isPlatform('desktop')? `Supplier`:``} Range: <LocationText location={+(qq.location)} plainText={false} />
                </IonCol>
            </IonRow>
        </IonCardHeader>
        </>}
        <IonModal backdropDismiss={false} isOpen={showChatModal.isOpen} className='view-modal-wrap'>
            { showChatModal.isOpen === true &&  <Chat
                showChatModal={showChatModal}
                setShowChatModal={setShowChatModal} 
           /> }
        </IonModal>
    </IonCard>);
};

export default BRContent;
