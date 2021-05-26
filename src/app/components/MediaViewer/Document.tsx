import React from 'react';
import { lfConfig } from '../../../Constants';
import { PDFViewer } from 'react-view-pdf';
import { IonRouterLink, IonText } from '@ionic/react';

interface PropsInterface{
    memId: number,
    fileName: string,
    formId: number,
    formType: string,
    mediaType: string,
    converted: number,
    showViewerModal: any,
    setShowViewerModal: Function
}

const DocumentViewer: React.FC<PropsInterface> = (props: PropsInterface) => {
    const { apiBaseURL} = lfConfig;
    let { memId, fileName, formId, formType, mediaType, converted, showViewerModal, setShowViewerModal } = props;
    let resFile = '';
    // let routerLink = '';
    let fileExt: any = '';
    if(formId && memId && fileName) {
        fileExt = fileName.split('.').pop()?.toLowerCase() ?? '';
        if( formType === 'localquote' ){
            resFile = fileName ? `${apiBaseURL}uploads/localquote/${formId}/${fileName}` : ``;
            // routerLink = `${basename}/layout/buyer-request-center/${mediaType}`;
        }else if( formType === 'resource' ){
            resFile = fileName ? `${apiBaseURL}uploads/member/${memId}/${fileName}` : ``;
            // routerLink = `${basename}${redirectTo}`;
        }
    }

    return (<>
        { formId && memId && fileName && +(converted) === 0 &&
            <div className="p-4">
                <p className="py-5">
                    { fileName && <IonText color="danger">
                        { `Your ${mediaType} is currently being converted for internet streaming.`} 
                        Go <IonRouterLink className="cursor" color="primary" onClick={() => setShowViewerModal({
                            ...showViewerModal, 
                            isOpen: false
                        })}> back</IonRouterLink> and try your preview in a few minutes.
                    </IonText>}
                    { !fileName && <IonText color="danger">{`No ${mediaType} found!`}</IonText>}
                </p>
            </div>
        }
        { formId && memId && fileName && +(converted) === 1 && <>        
            { resFile && fileExt && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt) && 
                <img src={resFile} alt="Media" />
            }
            { resFile && fileExt && !['jpg', 'jpeg', 'png', 'gif'].includes(fileExt) && 
                <PDFViewer url={resFile} />
            }
            { /* <img src={prImage} alt="Resource Media" /> 
            http://www.africau.edu/images/default/sample.pdf
            https://media.w3.org/2010/05/sintel/trailer_hd.mp4
            */}
        </>}          
    </>);
};

export default DocumentViewer;
