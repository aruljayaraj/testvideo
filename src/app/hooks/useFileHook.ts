import { lfConfig } from '../../Constants';
import { useDispatch, useSelector } from 'react-redux';
import * as uiActions from '../store/reducers/ui';

export function useFileHook() {
    const dispatch = useDispatch();
  
    // Single File Type check
    const isValidFileType = (fileType: string, resType: string): boolean => { //console.log(fileType);
      let result = false;
      if( ['document', 'article'].includes(resType) ){ 
          result = lfConfig.acceptedDocumentTypes.includes(fileType);
      }else if( ['audio'].includes(resType) ){
          result = lfConfig.acceptedAudioTypes.includes(fileType);
      }else if( ['video'].includes(resType) ){
          result = lfConfig.acceptedVideoTypes.includes(fileType);
      }
      return result;
  };

  // Multiple File Type Check
  const checkFileTypes = function (files: any, qqResType: string) {
      let flag = true; // console.log(files.length);
      for (let i = 0; i < files.length; i++) { 
          const file = files[i];  //console.log(file.type);
          if (file && !isValidFileType(file.type, qqResType)) {
              let msg = '';
              if( ['document','article'].includes(qqResType) ){
                  msg = `Only ${lfConfig.acceptedDocTypes} these type are allowed`;
              }else if(qqResType === 'audio'){
                  msg = `Only ${lfConfig.acceptedAudTypes} these type are allowed`;
              }else if(qqResType === 'video'){ //console.log('Three');
                  msg = `Only ${lfConfig.acceptedVidTypes} these type are allowed`;
              }
              dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: msg }));
              return false;
          }
      }
      return flag;
  }

  // Single File Size Check
  const isAllowedFilesize = (filesize: number, resType: string): boolean => {
      let result = false;
      if( ['document', 'article'].includes(resType) ){
          return +(lfConfig.acceptedQQDocSize) > filesize;
      }else if( ['audio'].includes(resType) ){
          return +(lfConfig.acceptedQQAudSize) > filesize;
      }else if( ['video'].includes(resType) ){
          return +(lfConfig.acceptedQQVidSize) > filesize;
      }
      return result;
  };

  // Multiple File Size Check
  const checkFileSizes = (files: any, qqResType: string) => {
      let flag = true; // console.log(files.length);
      let filesize = 0;

      for (let i = 0; i < files.length; i++) { 
          const file = files[i];  // console.log(file.name+"=="+file.size);
          filesize += file.size; 
      }
      if (filesize && !isAllowedFilesize(filesize, qqResType)) {
          let msg = '';
          if( filesize > 0 ){
              if( ['document','article'].includes(qqResType? qqResType: '') ){
                  msg = `Only less than ${lfConfig.acceptedQQDocSizeMB} size is allowed`;
              }else if(qqResType === 'audio'){
                  msg = `Only less than ${lfConfig.acceptedQQAudSizeMB} size is allowed`;
              }else if(qqResType === 'video'){
                  msg = `Only less than ${lfConfig.acceptedQQVidSizeMB} size is allowed`;
              }
          }else{
              msg = `Please attach a valid file`;
          }
          dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: msg }));
          return false;
      }
      return flag;
    }
  
    return {
      // File Validation Fns
      isValidFileType, // Single File Type check
      checkFileTypes,  // Multiple File Type Check
      isAllowedFilesize, // Single File Size Check
      checkFileSizes // Multiple File Size Check

    }
  }