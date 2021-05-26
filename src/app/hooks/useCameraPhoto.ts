import { useCamera } from '@ionic/react-hooks/camera';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { CameraResultType, CameraSource} from "@capacitor/core";
import CommonService from '../shared/services/CommonService';

export function useCameraPhoto() {

    const { getPhoto } = useCamera();
  
    const takePhoto = async (callbackFn: any) => {
      try {
        const cameraPhoto = await getPhoto({
          quality: 100,
          allowEditing: true,
          correctOrientation: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera
        })
        if( cameraPhoto ){
          const base64Image = await base64FromPath(cameraPhoto.webPath!);
          var u8Image  = CommonService.b64ToUint8Array(base64Image);
          return callbackFn(u8Image);
        }
      } catch (e) {
        console.log('No hoto');
      }
    };
  
    return {
      takePhoto
    };
  }