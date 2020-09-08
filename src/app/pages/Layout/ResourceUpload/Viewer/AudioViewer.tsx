import React from 'react';
import '../ResourceUpload.scss';

import { useDispatch, useSelector } from 'react-redux';
import { lfConfig } from '../../../../../Constants';
import ReactAudioPlayer from 'react-audio-player';

const AudioViewer: React.FC = () => {
    const dispatch = useDispatch();
    const resource = useSelector( (state:any) => state.res.resource);
    const { apiBaseURL, basename } = lfConfig;

    const ResFile = ( resource && Object.keys(resource).length > 0 && resource.filename) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${resource.filename}` : ``;
    // ${basename}/assets/img/placeholder.png
   
    return (<>
       { resource && Object.keys(resource).length > 0 && resource.filename && <>        
            { ResFile &&  
                <div className="pt-2">
                    <audio id="audioFrenata" src={ResFile}></audio> <br />
                    <ReactAudioPlayer
                        src={ResFile}
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
    </>);
};

export default AudioViewer;
