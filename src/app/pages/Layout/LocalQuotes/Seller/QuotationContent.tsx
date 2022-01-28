import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRouterLink, IonRow, IonCol, IonItem, IonGrid, IonThumbnail, IonLabel, IonText } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import '../LocalQuotes.scss';
import { lfConfig } from '../../../../../Constants';
import CommonService from '../../../../shared/services/CommonService';
import RFQStatus from '../../../../components/Common/RFQStatus';

interface Props {
    qt: any,
    setShowActionSheet?: Function,
    setShowPopover?: Function,
    setShowDeleteModal?: Function
}

const QuotationContent: React.FC<Props> = (props) => { // {qt, setShowActionSheet, setShowPopover, setShowDeleteModal}
    const { basename } = lfConfig;
    const {qt, setShowActionSheet, setShowPopover } = props;
    let qq:any = {};
    let repImage = '';
    const { apiBaseURL } = lfConfig;

    if( qt.localquote && Object.keys(qt.localquote).length > 0  ){
        qq = qt.localquote;
        repImage = (Object.keys(qq).length > 0 && qq.profile_image) ? `${apiBaseURL}uploads/member/${qq.mem_id}/${qq.rep_id}/${qq.profile_image}` : `${basename}/assets/img/avatar.svg`;
    }
    return (<IonCard className="card-center mt-3 mb-1">
        <IonCardHeader color="titlebg">
            <IonCardTitle class="card-title">
                <IonRouterLink color="greenbg" href={`${basename}/layout/view-quotation/${qt.id}/${qt.mem_id}/${qt.localquote.id}/${qt.localquote.mem_id}/seller`}>
                    {qt.s_title}
                </IonRouterLink>
                { setShowActionSheet && <IonRouterLink color="greenbg" onClick={() => setShowActionSheet({status: true, qt: qt})} className="float-right router-link-anchor-vertical">
                    <i className="fa fa-ellipsis-v fa-lg green cursor" aria-hidden="true"></i>
                </IonRouterLink> }
            </IonCardTitle>
            <p className="m-0 pt-1 gray">{CommonService.dateFormat(qt.quotation_date)}</p>
        </IonCardHeader>
        <IonCardContent>
            
            <IonGrid>
                <IonItem lines="none">
                    { qt && Object.keys(qt).length > 0 && qq && Object.keys(qq).length > 0  && <IonGrid>   
                        <IonRow>
                            <IonCol>
                                <IonItem lines="none" >
                                    <IonThumbnail slot="start" color="greenbg">
                                        <img src={repImage} alt="Rep Profile" onError={() => CommonService.onImgErr('profile')} />
                                    </IonThumbnail>
                                    
                                    <IonLabel>
                                        <h2>{qq.p_title}</h2>
                                        { qq.firstname && setShowPopover && <h3 className="cursor anchor-link" onClick={() => setShowPopover({status: true, qq: qq})}>{`${qq.firstname} ${qq.lastname}`}</h3> }
                                        { +(qq.is_deleted) === 0 && <p>
                                            <IonRouterLink href={`${basename}/layout/view-localquote/${qq.id}/${qq.mem_id}/seller`}>
                                                View Original RFQ
                                            </IonRouterLink>
                                        </p>}
                                    </IonLabel>
                                </IonItem>
                            </IonCol>
                            <IonCol>
                                <IonItem lines="none" >
                                    <IonLabel>
                                        <p><span className="fw-bold">Date of Request : </span>{CommonService.dateFormat(qq.quotation_date)}</p>
                                        <p><span className="fw-bold">Response Deadline : </span>{CommonService.dateFormat(qq.quotation_req_date)}</p>
                                        <p><span className="fw-bold">Status: </span> 
                                            { +(qq.is_deleted) === 1 && <IonText color="danger">Deleted</IonText> }
                                            { +(qq.is_deleted) === 0 && <RFQStatus status={+(qq.is_active)} plainText={false} frontend={false}/> }
                                        </p>
                                        
                                    </IonLabel>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </IonGrid>}
                </IonItem>
            </IonGrid>

        </IonCardContent>
        <IonCardHeader color="titlebg">
            <IonRow>
                <IonCol>
                    Status: <RFQStatus status={+(qt.is_active)} plainText={false} frontend={false}/>
                </IonCol>
            </IonRow>
        </IonCardHeader>
    </IonCard>);
};

export default QuotationContent;
