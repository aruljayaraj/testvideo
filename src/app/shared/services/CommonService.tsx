import { format } from 'date-fns';
var CommonService = (function() {
    // 
    var getBase64Image = function (img: any) {
        var canvas: any = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    const getBase64FromUrl = async (url: string) => {
        const data = await fetch(url, {mode: 'no-cors'});
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = function() {
            const base64data = reader.result;   
            resolve(base64data);
          }
        });
    }

    // b64 To Array of image data
    var b64ToUint8Array = function (b64Image: any) {
        var img = atob(b64Image.split(',')[1]);
        var img_buffer = [];
        var i = 0;
        while (i < img.length) {
            img_buffer.push(img.charCodeAt(i));
            i++;
        }
        return new Uint8Array(img_buffer);
    }
    // date format MMM dd, yyyy
    var dateFormat = function (cdate: any) {
        if(cdate){ // For safari need to do like this
            return format(new Date(cdate.replace(/-/g, "/")), 'MMM dd, yyyy')
        }
        return;
    }
    // Date readable format dd/MM/yyyy
    var dateReadFormat = function (cdate: any) {
        if(cdate){ // For safari need to do like this
            return format(new Date(cdate.replace(/-/g, "/")), 'dd/MM/yyyy')
        }
        return;
    }
    // Mysql date format to normal javascript format
    var mysqlToJsDateFormat = function (cdate: any) {
        if(cdate){ // For safari need to do like this
            return new Date(Date.parse(cdate!.replace(/-/g, '/')))
        }
        return;
    }

    return {
        // Common Fns
        getBase64Image: getBase64Image,
        getBase64FromUrl: getBase64FromUrl,
        b64ToUint8Array: b64ToUint8Array,
        dateFormat: dateFormat,
        dateReadFormat: dateReadFormat,
        mysqlToJsDateFormat: mysqlToJsDateFormat
    }

})();

export default CommonService;