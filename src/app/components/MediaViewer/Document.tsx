import React, {useState, useRef, useEffect } from 'react';
import { lfConfig } from '../../../Constants';
// import { PDFViewer } from 'react-view-pdf';
import { isPlatform } from '@ionic/react';
import { IonRouterLink, IonText } from '@ionic/react';
import { Document, Page, pdfjs } from 'react-pdf/dist/umd/entry.webpack';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './MediaViewer.scss';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfWidth, setPdfWidth] = useState(0);
    const ref = useRef<HTMLHeadingElement>(null);

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    useEffect(() => {
        if( ref.current ){
            setPdfWidth(ref.current.offsetWidth);
        }
    }, [ref.current]);

    const goToPrevPage = () => setPageNumber(pageNumber - 1);
    const goToNextPage = () => setPageNumber(pageNumber + 1);

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

    return (<div ref={ref} className="d-flex justify-content-center mb-3">
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
                // <PDFViewer url={resFile} width={`100%`} height={`600px`} />
                <TransformWrapper>
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <div className="pdf-container mt-4">
                        <div className={`pdf-toolbar d-flex justify-content-between ${ isPlatform('ios')? 'ios-platform':'' } `}>
                            <span>
                            {  numPages >= pageNumber && pageNumber !== 1 &&
                                <a onClick={goToPrevPage}><i className="fa fa-arrow-up" aria-hidden="true"></i></a>
                            }
                            { pageNumber === 1 && 
                                <a><i className="fa fa-arrow-up" aria-hidden="true"></i></a>
                            }
                            { numPages > pageNumber && 
                                <a onClick={goToNextPage}><i className="fa fa-arrow-down" aria-hidden="true"></i></a>
                            }
                            { numPages === pageNumber && 
                                <a><i className="fa fa-arrow-down" aria-hidden="true"></i></a>
                            }</span>
                            <span><a>Page {pageNumber} of {numPages}</a></span>
                            <span>
                                <a onClick={() => zoomIn()}><i className="fa fa-search-plus" aria-hidden="true"></i></a>
                                <a onClick={() => zoomOut()}><i className="fa fa-search-minus" aria-hidden="true"></i></a>
                                <a onClick={() => resetTransform()}><i className="fa fa-refresh" aria-hidden="true"></i></a>
                            </span>
                        </div>
                        <TransformComponent>
                            <Document
                                file={resFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                            <Page width={(pdfWidth-30)} pageNumber={pageNumber} />
                            </Document>
                        </TransformComponent>
                     </div>
                    )}
                </TransformWrapper>
                  
            }
            { /* <img src={prImage} alt="Resource Media" /> 
            http://www.africau.edu/images/default/sample.pdf
            https://media.w3.org/2010/05/sintel/trailer_hd.mp4
            */}
        </>}          
    </div>);
};

export default DocumentViewer;
