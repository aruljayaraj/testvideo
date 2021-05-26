import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { lfConfig } from '../../../Constants';

interface PropsInterface {
    tinymceMaxLength: any;
    tinyWidth: any;
    tinyHeight: any;
    initialValue: string
}

const TextEditor: React.FC<PropsInterface> = (props: PropsInterface) => {
    
    return (
        <Editor
            apiKey = {lfConfig.tinymceKey}
            initialValue={props.initialValue}
            init={{
                max_chars: props.tinymceMaxLength, // max. allowed words
                
                init_instance_callback: function (editor: any) {
                    editor.on('change', function (e: Event) {
                        let content = editor.contentDocument.body.innerText;
                        // console.log(content.split(/[\w\u2019\'-]+/).length);
                        if(content.split(/[\w\u2019\'-]+/).length > props.tinymceMaxLength){
                            editor.contentDocument.body.innerText = content.split(/\s+/).slice(0, props.tinymceMaxLength).join(" ");
                        }
                    });
                },
                branding: false,
                height: props.tinyHeight, // 300,
                width: props.tinyWidth, // '100%',
                menubar: false,
                mobile: {
                    menubar: true
                },
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
            }}
            // onEditorChange={handleEditorChange}
        />
    );
};
export default TextEditor;
  