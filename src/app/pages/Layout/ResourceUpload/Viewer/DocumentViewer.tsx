import React from 'react';
import '../ResourceUpload.scss';

import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../../Constants';
import { PDFViewer } from 'react-view-pdf';

const DocumentViewer: React.FC = () => {
    const resource = useSelector( (state:any) => state.res.resource);
    const { apiBaseURL} = lfConfig;

    const ResFile = ( resource && Object.keys(resource).length > 0 && resource.filename) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${resource.filename}` : ``;
   
    return (<>
       { resource && Object.keys(resource).length > 0 && resource.filename && <>        
            { ResFile &&  
                
                <PDFViewer url={ResFile} />
            }
            { /* <img src={prImage} alt="Resource Media" /> 
            http://www.africau.edu/images/default/sample.pdf
            https://media.w3.org/2010/05/sintel/trailer_hd.mp4
            */}
        </>}          
    </>);
};

export default DocumentViewer;
