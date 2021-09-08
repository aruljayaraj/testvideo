import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList} from '@ionic/react'; 
import React from 'react';
import { nanoid } from 'nanoid';
import { isPlatform } from '@ionic/react';
import '../Search.scss';
import { useSelector } from 'react-redux';
import { lfConfig } from '../../../../Constants';
import NoData from '../../../components/Common/NoData';
interface Props {
    itemType: string;
  }

const PreListItems: React.FC<Props> = ({itemType}) => {
    const { basename, LOCAL_DEAL, PRESS_RELEASE, RESOURCE, COMPANY, ICONS  } = lfConfig;
    const preDealResults = useSelector( (state:any) => state.search.preResults.deals);
    const preNewsResults = useSelector( (state:any) => state.search.preResults.news);
    const preResResults = useSelector( (state:any) => state.search.preResults.resources);
    const preComResults = useSelector( (state:any) => state.search.preResults.company);

    let preResults:any[] = [];
    let title = '';
    if( itemType === LOCAL_DEAL ){  
        preResults = preDealResults; 
        title = 'Member Deals and Promotions';
    }else if( itemType === PRESS_RELEASE ){  
        preResults = preNewsResults; 
        title = 'Business News';
    }else if( itemType === RESOURCE ){  
        preResults = preResResults;
        title = 'Business Resources'; 
    }else if( itemType === COMPANY ){
        preResults = preComResults;
        title = 'Business Names'; 
    }
  
  return (<>
     { preResults && preResults && preResults.length > 0 && <IonCard className="card-center my-4">
    <IonCardHeader color="titlebg">
        <IonCardTitle className="fs-18">{title}</IonCardTitle>
    </IonCardHeader>

    <IonCardContent>
        <IonList>
        { preResults.map((item: any) => { 
            let itemLink = '';
            let itemName = '';
            let cusClassName = '';
            if( itemType === LOCAL_DEAL ){  
                itemLink = `${basename}/local-deal/${item.id}`;
                itemName = item.name;
                cusClassName = ICONS.ICON_DEAL;
            }else if( itemType === PRESS_RELEASE ){  
                itemLink = `${basename}/press-release/${item.id}`;
                itemName = item.name;
                cusClassName = ICONS.ICON_NEWS;
            }else if( itemType === RESOURCE ){
                itemLink = `${basename}/resource/${item.form_type}/${item.form_id}`;
                itemName = item.title;
                if( item.form_type === 'document' ){  
                    cusClassName = ICONS.ICON_DOCUMENT;
                }else if( item.form_type === 'article' ){  
                    cusClassName = ICONS.ICON_ARTICLE;
                }else if( item.form_type === 'audio' ){  
                    cusClassName = ICONS.ICON_AUDIO;
                }else if( item.form_type === 'video' ){  
                    cusClassName = ICONS.ICON_VIDEO;
                }
            }else if( itemType === COMPANY ){  
                itemLink = `${basename}/search-results/${item.mem_id}/${item.id}`;
                itemName = item.name;
                cusClassName = ICONS.ICON_COMPANY;
            }
            return (
            <IonItem lines="none" key={nanoid()} routerLink={itemLink}>
                <IonLabel>
                    <h2 className="fw-bold py-1"> 
                        <i className={`fa ${cusClassName} fa-lg green ${ isPlatform('desktop')? 'mr-3': 'mr-2' }`} aria-hidden="true"></i>
                        {itemName}
                    </h2>
                </IonLabel> 
            </IonItem>)}
        )}
        </IonList>
        <NoData dataArr={preResults} htmlText="No results found." />
    </IonCardContent> 
    </IonCard>}
    </>
  );
};

export default PreListItems;
