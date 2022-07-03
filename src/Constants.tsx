export const lfConfig =  {
    // tinymceKey: 'p5k59vuava18l9axn125wa4fl2qsmhmwsxfs6krrtffntke8', // Arul account limited
    tinymceKey: 'pny4jwf7rrrkuio08hit5ojxslw59l941fvv1wvzsfileta1', // Rod Account
    tinymceMaxLength: 500,
    tinymceResourceMaxLength: 250,
    stripePublicKey: 'pk_test_T749JqokJ8nJKey9h8sDC4QZ',
    stripeSecretKey: 'sk_test_x5JKYvDFuRIY5n75wTzwa8Ne', 
    // apiBaseURL: process.env.REACT_APP_API_URL,
    // basename: process.env.REACT_APP_BASENAME,
    // baseurl: process.env.REACT_APP_BASE_URL,
    // To enable  ANDROID/IOS build
    // apiBaseURL: 'http://192.168.1.36:8100/', // process.env.REACT_APP_API_URL,
    // basename: '', // process.env.REACT_APP_BASENAME,
    // baseurl: 'http://192.168.1.36:8100', // process.env.REACT_APP_BASE_URL,
    apiBaseURL: 'https://www.onagon.com/', // process.env.REACT_APP_API_URL,
    basename: '/frontend', // process.env.REACT_APP_BASENAME,
    baseurl: 'https://www.onagon.com/frontend', // process.env.REACT_APP_BASE_URL,
    acceptedDocSize: '104857600',
    acceptedDocSizeMB: '100MB',
    acceptedDocTypes: 'doc, docx, pdf, rtf, txt, ppt, pptx, xls, xlsx, odt, odp, ods, tif, tiff, csv, png, jpg, jpeg, gif',
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
    acceptedAudSize: '157286400',
    acceptedAudSizeMB: '150MB',
    acceptedAudTypes: 'mp3, wma, wav,  ra, ram, rm, mid, ogg', // dct,
    acceptedAudioTypes: [
        'audio/mpeg', // mp3
        'video/x-ms-wma', // wma
        'audio/x-wav', // wav
        'audio/x-realaudio', // ra
        'audio/x-pn-realaudio', // rm | ram
        'audio/midi', // mid
        'audio/ogg' // ogg
    ],
    acceptedVidDuration: 600,
    acceptedVidSize: '314572800',
    acceptedVidSizeMB: '300MB',
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
    ],
    acceptedQQDocSize: '104857600',
    acceptedQQDocSizeMB: '100MB',
    acceptedQQAudSize: '157286400',
    acceptedQQAudSizeMB: '150MB',
    acceptedQQVidSize: '314572800',
    acceptedQQVidSizeMB: '300MB',
    LOCAL_DEAL: 'local_deal',
    PRESS_RELEASE: 'press_release',
    RESOURCE: 'resource',
    COMPANY: 'company',
    ICONS: {
        ICON_USERS: 'fa-users',
        ICON_COMPANY: 'fa-building-o',
        ICON_DEAL: 'fa-money',
        ICON_NEWS: 'fa-newspaper-o',
        ICON_RESOURCE: 'fa-files-o',
        ICON_DOCUMENT: 'fa-file-o',
        ICON_ARTICLE: 'fa-file-text-o',
        ICON_AUDIO: 'fa-file-audio-o',
        ICON_VIDEO: 'fa-file-video-o',
    },
    ADS: {
        HOME: 5,
        PROFILE: 5,
        DEFAULT: 3
    },
    WPPAGES:{
        SIGNUP_SELL: 'i-sell-products-or-services',
        SIGNUP_BUY: 'i-only-want-to-buy-products-or-services',
        USER_AGREEMENT: 'user-agreement',
        PRIVACY_POLICY: 'privacy-policy',
        COOKIE_POLICY: 'cookie-policy',
        LQ_TC: 'terms-of-service-quickquotes'
    }
}; 
