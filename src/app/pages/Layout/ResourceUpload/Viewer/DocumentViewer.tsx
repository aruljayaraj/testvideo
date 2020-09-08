import React from 'react';
import { useParams } from 'react-router-dom';
// import { isPlatform } from '@ionic/react';
import '../ResourceUpload.scss';

import { useDispatch, useSelector } from 'react-redux';
// import * as uiActions from '../../../../store/reducers/ui';
import { lfConfig } from '../../../../../Constants';
import { PDFViewer } from 'react-view-pdf';

const DocumentViewer: React.FC = () => {
    const dispatch = useDispatch();
    // const authUser = useSelector( (state:any) => state.auth.data.user);
    // const loadingState = useSelector( (state:any) => state.ui.loading);
    const resource = useSelector( (state:any) => state.res.resource);
    const { apiBaseURL, basename } = lfConfig;
    // let { id, res_type } = useParams();

    const ResFile = ( resource && Object.keys(resource).length > 0 && resource.filename) ? `${apiBaseURL}uploads/member/${resource.mem_id}/${resource.filename}` : ``;
    // ${basename}/assets/img/placeholder.png
   
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
