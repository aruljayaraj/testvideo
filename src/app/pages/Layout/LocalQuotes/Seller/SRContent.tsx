import { IonCard, IonCardContent, IonCardHeader, IonRouterLink, IonRow, IonCol, IonButtons, IonItem, IonLabel, IonGrid, IonThumbnail } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import '../LocalQuotes.scss';
import { lfConfig } from '../../../../../Constants';
import CommonService from '../../../../shared/services/CommonService';
import RFQStatus from '../../../../components/Common/RFQStatus';

interface Props {
    qq: any,
    setShowActionSheet: Function,
    setShowPopover: Function
}

const SRContent: React.FC<Props> = ({qq, setShowActionSheet, setShowPopover}) => {
    const { basename } = lfConfig;
    let { rfqType } = useParams<any>();
    const { apiBaseURL } = lfConfig;
    const repImage = (Object.keys(qq).length > 0 && qq.profile_image) ? `${apiBaseURL}uploads/member/${qq.mem_id}/${qq.profile_image}` : `${basename}/assets/img/avatar.svg`;
    
    return (<IonCard className="card-center mt-3 mb-1">
        
        <IonCardContent>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonItem lines="none" >
                            <IonThumbnail slot="start" color="greenbg">
                            {/* <IonRouterLink href={`${basename}/member/${item.pr_mem_id}/${item.pr_id}`}> */}
                                <img src={repImage} alt="Rep Profile" />
                            {/* </IonRouterLink> */}
                            </IonThumbnail>
                            
                            <IonLabel>
                                <h2>{qq.p_title}</h2>
                                <h3 className="cursor anchor-link" onClick={() => setShowPopover({status: true, qq: qq})}>{`${qq.firstname} ${qq.lastname}`}</h3>
                                
                            </IonLabel>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem lines="none" >
                            <IonLabel>
                                <p><span className="fw-bold">Date of Request : </span>{CommonService.dateFormat(qq.quotation_date)}</p>
                                <p><span className="fw-bold">Response Deadline : </span>{CommonService.dateFormat(qq.quotation_req_date)}</p>
                            </IonLabel>
                        </IonItem>
                    </IonCol>
                </IonRow>
            </IonGrid>
            
        </IonCardContent>
        <IonCardHeader className="p-1" color="titlebg">
            <IonRow>
                <IonCol className="d-flex align-items-center">
                    Status: <RFQStatus status={+(qq.is_active)} plainText={false} frontend={false}/>
                </IonCol>
                <IonCol>
                    <IonButtons>
                    <IonRouterLink slot="start" color="greenbg" href={`${basename}/layout/view-localquote/${rfqType}/${qq.id}/${qq.mem_id}/sellers`}>
                        View RFQ</IonRouterLink>
                    </IonButtons>
                </IonCol>
            </IonRow>
        </IonCardHeader>
    </IonCard>);
};

export default SRContent;
