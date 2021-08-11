import { IonRouterLink, IonText } from '@ionic/react';
import React from 'react';
import { lfConfig } from '../../../Constants';
// import VideoPlayer from './VideoJsPlayer';

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

const Video: React.FC<PropsInterface> = (props: PropsInterface) => {
    const { apiBaseURL } = lfConfig; 
    let { memId, fileName, formId, formType, mediaType, converted, showViewerModal, setShowViewerModal } = props;
    let resFile = '';
    let imgFile = '';
    if(formId && memId && fileName) {
        if( formType === 'localquote' ){
            resFile = fileName ? `${apiBaseURL}uploads/localquote/${formId}/${fileName}` : ``;
            imgFile = fileName ? `${apiBaseURL}uploads/localquote/${formId}/${fileName.split(".")[0]}.png` : ``;
        }else if( props.formType === 'resource' ){
            resFile = fileName ? `${apiBaseURL}uploads/member/${memId}/${fileName}` : ``;
            imgFile = fileName ? `${apiBaseURL}uploads/member/${memId}/${fileName.split(".")[0]}.png` : ``;
        }
    } // console.log(resFile);

    // const videoJsOptions = {
    //     autoplay: true,
    //     controls: true,
    //     width: '800',
    //     sources: [{
    //         src: 'http://vjs.zencdn.net/v/oceans.mp4',
    //         // src: `${resFile}`,
    //         type: 'video/mp4'
    //     }]
    // };
    return (<div className="d-flex justify-content-center mb-3">
        
       { formId && memId && +(converted) === 0 &&
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
            { resFile && 
                <div className="py-3">
                    <video poster={imgFile} width="100%" height="auto" controls> {/* autoPlay loop */}
                        <source src={resFile} type="video/mp4" />
                    </video>
                    {/* <VideoPlayer {...videoJsOptions} />  */}
                </div>
            }
        </>}          
    </div>);
};

export default Video;
