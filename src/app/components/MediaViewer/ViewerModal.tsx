import {
    IonButton,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader
} from '@ionic/react';
import { close } from 'ionicons/icons';
import React from 'react';
import { isPlatform } from '@ionic/react';
import Document from '../../components/MediaViewer/Document';
import Audio from '../../components/MediaViewer/Audio';
import Video from '../../components/MediaViewer/Video';

// Note 
/*  isOpen: false,
    title: '',
    formType: '', //  repProfile / comProfile / resource(document, audio, video, etc) / localquote
    formId: 0, // id or qq id
    memId: 0, // Member Id
    repId: 0, // rep Id
    mediaType: '', // // document, article, audio, video
    fileName: '',
    converted: 0
*/
interface PropsInterface {
    showViewerModal: any,
    setShowViewerModal: Function,
    // selectedItem: any
}
const ViewerModal: React.FC<PropsInterface> = (props: PropsInterface) => {
    
    let { title, mediaType, formType, formId, memId, repId, fileName, converted } = props.showViewerModal;
    
    return (<>
        <IonHeader translucent>
            <IonToolbar color="appbg">
                <IonButtons slot={ isPlatform('desktop')? 'end': 'start' }>
                    <IonButton onClick={() => props.setShowViewerModal({
                        ...props.showViewerModal, 
                        isOpen: false
                    })}>
                        <IonIcon icon={close} slot="icon-only"></IonIcon>
                    </IonButton>
                </IonButtons>
                <IonTitle> {title}</IonTitle>
            </IonToolbar>
            
        </IonHeader>
        <IonContent fullscreen className="ion-padding d-flex justify-content-center mb-3">
            { fileName && memId && ['document','article'].includes(mediaType) && 
                <Document 
                    memId={memId}
                    repId={repId}
                    formId={formId}
                    fileName={fileName}
                    formType={formType}
                    mediaType={mediaType}
                    converted={converted}
                    showViewerModal={props.showViewerModal}
                    setShowViewerModal={props.setShowViewerModal}
                /> 
            }
            { fileName && memId && mediaType === 'audio' && 
                <Audio
                    memId={memId}
                    repId={repId}
                    formId={formId}
                    fileName={fileName}
                    formType={formType}
                    mediaType={mediaType}
                    converted={converted}
                    showViewerModal={props.showViewerModal}
                    setShowViewerModal={props.setShowViewerModal}
                /> 
            }
            { fileName && memId && mediaType === 'video' && 
                <Video
                    memId={memId}
                    repId={repId}
                    formId={formId}
                    fileName={fileName}
                    formType={formType}
                    mediaType={mediaType}
                    converted={converted}
                    showViewerModal={props.showViewerModal}
                    setShowViewerModal={props.setShowViewerModal}
                />
            }
        </IonContent> 
    </>);
};
  
export default ViewerModal;
  