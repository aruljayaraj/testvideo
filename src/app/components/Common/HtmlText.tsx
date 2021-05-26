import React from 'react';
interface PropsInterface{
    htmlText: any
}

const HtmlText: React.FC<PropsInterface> = (props: PropsInterface) => {
  
    return (<>
        {props.htmlText &&
            <div className="external_text" dangerouslySetInnerHTML={{ __html: props.htmlText }} ></div>
        }
    </>);
};

export default HtmlText;
