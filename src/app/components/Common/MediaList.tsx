import { IonAvatar, IonItem, IonLabel, IonText, IonList, IonIcon, IonModal } from '@ionic/react'; 
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { documentTextOutline, musicalNoteOutline, videocamOutline } from 'ionicons/icons';
import ViewerModal from '../../components/MediaViewer/ViewerModal';

let initialValues = {
    isOpen: false,
    title: '',
    formType: '', //  repProfile / comProfile / resource(document, audio, video, etc) / localquote
    formId: 0, // id or qq id
    memId: 0, // Member Id
    repId: 0, // Rep Id
    mediaType: '', // document, article, audio, video
    fileName: '',
    converted: 0
};

interface PropsInterface{
    attachments: any,
    formType: string
}

// Only for Resources Document, Audio, Video
const MediaList: React.FC<PropsInterface> = (props: PropsInterface) => { 
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const loadingState = useSelector( (state:any) => state.ui.loading);
    const [showViewerModal, setShowViewerModal] = useState(initialValues);

    const categoryModalFn = (title: string, mem_id: number, rep_id: number, form_id: number, media_type: string, filename: string, converted: number) => {
        setShowViewerModal({ 
            ...showViewerModal, 
            isOpen: true,
            title: title,
            formType: props.formType,
            formId: form_id,
            memId: mem_id,
            repId: rep_id,
            mediaType: media_type,
            fileName: filename,
            converted: converted
        });
    } 
    return (<>
        {props.attachments && Object.keys(props.attachments).length > 0 && 
            <IonList>
            { props.attachments.map((item: any, index: number) => {
                console.log( (+authUser.ID === +item.mem_id || +item.converted === 1) );
                let title = 'Document';
                let str: any = '';
                if(item && item.upload_type === 'audio'){
                    title = 'Audio';
                }else if(item && item.upload_type === 'video'){
                    title = 'Video';
                }
                if( item.uploaded_name && (+authUser.ID === +item.mem_id || +item.converted === 1)) {
                    str = <IonItem className="cursor" lines="none" key={index} onClick={() => categoryModalFn(`${title} Viewer`, item.mem_id, item.rep_id, item.form_id, item.upload_type, item.filename, item.converted)} >
                        <IonAvatar slot="start" color="appbg">
                            { item && ['document', 'article'].includes(item.upload_type) && <IonIcon className="pt-2" color="appbg" size="large" icon={documentTextOutline}></IonIcon>}
                            { item && item.upload_type === 'audio' && <IonIcon className="pt-2" color="appbg" size="large" icon={musicalNoteOutline}></IonIcon>}
                            { item && item.upload_type === 'video' && <IonIcon className="pt-2" color="appbg" size="large" icon={videocamOutline}></IonIcon>}
                        </IonAvatar>
                        <IonLabel>
                            <h2>{item.upload_title? item.upload_title: item.uploaded_name}</h2>
                        </IonLabel> 
                    </IonItem>; 
                }
                return str;
            })}
        </IonList>}
        { !props.attachments && Object.keys(props.attachments).length === 0 && !loadingState.showLoading && 
            <p className="py-5 px-3">
                <IonText color="warning">No attachments found.</IonText>
            </p>
        }
        <IonModal backdropDismiss={false} isOpen={showViewerModal.isOpen} className={ `${['document','article'].includes(showViewerModal.mediaType)? 'view-modal-wrap': ''}` }>
          { props.attachments && Object.keys(props.attachments).length > 0 && showViewerModal.isOpen === true && <ViewerModal
            showViewerModal={showViewerModal}
            setShowViewerModal={setShowViewerModal}
           /> }
        </IonModal>
    </>);
};

export default MediaList;
