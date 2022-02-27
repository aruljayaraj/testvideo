import React, { useEffect } from 'react';
import { lfConfig } from '../../../Constants';
import ReactAudioPlayer from 'react-audio-player';
import { IonRouterLink, IonText } from '@ionic/react';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio';

interface PropsInterface{
    memId: number,
    repId: number,
    fileName: string,
    formId: number,
    formType: string,
    mediaType: string,
    converted: number,
    showViewerModal: any,
    setShowViewerModal: Function
}

const Audio: React.FC<PropsInterface> = (props: PropsInterface) => {
    const { apiBaseURL } = lfConfig;
    let { memId, repId, fileName, formId, formType, mediaType, converted, showViewerModal, setShowViewerModal } = props;
    let resFile = '';
    if(formId && memId && fileName) {
        if( formType === 'localquote' ){
            resFile = fileName ? `${apiBaseURL}uploads/localquote/${formId}/${fileName}` : ``;
        }else if( props.formType === 'resource' ){
            resFile = fileName ? `${apiBaseURL}uploads/member/${memId}/${repId}/${fileName}` : ``;
        }
    }
    console.log(resFile);

    NativeAudio.preloadSimple('uniqueId1', resFile).then(() => {
        console.log("Meow T");
    }, (error: any)=> { 
        console.log(error);
        console.log("Meow E");
    });
    // const onSuccess = () => {

    // }

    useEffect(()=> { console.log("Meow 1");
        if(resFile){ console.log("Meow 2");
            NativeAudio.play('uniqueId1').then(() => {
                console.log("Playing");
            }, (error: any)=> {
        
            });
            
        }
    },[resFile]);
    

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
                <div className="pt-2">
                    
                    <audio id="audioFrenata" src={resFile}></audio> <br />
                    <ReactAudioPlayer
                        src={resFile}
                        autoPlay
                        controls
                    />
                </div>
            }
            { /* <img src={prImage} alt="Resource Media" /> 
            http://www.africau.edu/images/default/sample.pdf
            https://media.w3.org/2010/05/sintel/trailer_hd.mp4
            */}
        </>}          
    </div>);
};

export default Audio;
