export const lfConfig =  {
    // baseURL : 'http://localhost:8100',
    tinymceMaxLength: 500,
    tinymceResourceMaxLength: 250,
    apiBaseURL: process.env.REACT_APP_API_URL,
    basename: process.env.REACT_APP_BASENAME,
    baseurl: process.env.REACT_APP_BASE_URL,
    acceptedDocTypes: 'doc, docx, pdf, rtf, txt, ppt, pptx, xls, xlsx, odt, odp, ods, tif, tiff, csv, png, jpg, gif',
    acceptedDocumentTypes: [
        //  doc, docx, pdf, rtf, txt, ppt, pptx, xls, xlsx, odt, odp, ods, tif, tiff, csv, png, jpg, gif // MIME Names are there
        // 'odf','odg','sxw','sxi','sxc','sxd','ps','pps','ppsx' No MIME name - doubtful
        'application/msword', // doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/pdf', // pdf
        'application/rtf', // rtf
        'text/plain', // txt
        'application/vnd.ms-powerpoint', // ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
        'application/vnd.ms-excel', // xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
        'application/vnd.oasis.opendocument.text', // odt
        'application/vnd.oasis.opendocument.presentation', // odp
        'application/vnd.oasis.opendocument.spreadsheet', // ods
        'image/tiff', // tif | tiff
        'text/csv', // csv,
        'image/png', // png
        'image/jpeg', // jpg | jpeg
        'image/gif' // gif
    ],
    acceptedAudTypes: 'mp3, wma, wav,  ra, ram, rm, mid, ogg', // dct,
    acceptedAudioTypes: [
        'audio/mpeg', // mp3
        'video/x-ms-wma', // wma
        'audio/wav', // wav
        'audio/x-realaudio', // ra
        'audio/x-pn-realaudio', // rm | ram
        'audio/midi', // mid
        'audio/ogg' // ogg
    ],
    acceptedVidTypes: 'mp4, avi, wmv, swf, mpg, flv, mov, webm, ogg, mts, MTS',
    acceptedVideoTypes: [
        'video/mp4', // mp4
        'video/x-msvideo', // avi
        'video/x-ms-wmv', // wmv
        'application/x-shockwave-flash', // swf
        'video/mpeg', // mpg | mpeg
        'video/x-flv', // flv
        'video/quicktime', // mov
        'video/webm', // webm
        'video/ogg', // ogg,
        'video/vnd.mts', // mts
        'video/mts' // mts | MTS
    ]
}; 
