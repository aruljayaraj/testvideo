import React from 'react';
// import { isPlatform } from '@ionic/react';
// import ReactPlayer from 'react-player';
import '../ResourceUpload.scss';

import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../../Constants';

import VideoPlayer from './VideoJsPlayer';
// import { Plugins } from '@capacitor/core';
// import * as PluginsLibrary from 'capacitor-video-player';
// const { CapacitorVideoPlayer, Device } = Plugins;

const VideoViewer: React.FC = () => {
    const resource = useSelector( (state:any) => state.res.resource);
    const { apiBaseURL } = lfConfig;
    
    const ResFile = ( resource && Object.keys(resource).length > 0 && resource.filename) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${resource.filename}` : ``;
    const videoJsOptions = {
        autoplay: true,
        controls: true,
        width: '800',
        sources: [{
        // src: 'http://vjs.zencdn.net/v/oceans.mp4',
        src: `${ResFile}`,
        type: 'video/mp4'
        }]
    };
    // ${basename}/assets/img/placeholder.png
    // console.log(ResFile);
    return (<>
       { resource && Object.keys(resource).length > 0 && resource.filename && <>        
            { ResFile && <VideoPlayer {...videoJsOptions} /> }
        
            { /* <img src={prImage} alt="Resource Media" /> 
            https://media.w3.org/2010/05/sintel/trailer_hd.mp4
            */}
            
            {/* <ReactPlayer 
            width='100%'
            height='100%'
            playing={true}
            // played={0}
            // loaded={0}
            controls={true} 
            url={ResFile} /> */}
        </>}          
    </>);
};

export default VideoViewer;
