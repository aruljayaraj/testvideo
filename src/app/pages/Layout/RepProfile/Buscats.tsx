import {
    IonItem,
    IonText,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonAvatar,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
  } from '@ionic/react';

import React, { useState } from 'react';
import './RepProfile.scss';
import { useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import CategoryModal from '../../../components/Category/Category';
let initialValues = {
    isOpen: false,
    title: '',
    type: '', // 0 or 1 (B2B or B2C)
    formType: '', //  Rep or Company or Resource
    actionType: '', // new or edit
    formId: '', // id or resource id
    repId: '', // Rep Id
    memId: '' // Member Id
};

const Buscats: React.FC = () => {
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const busCategory = useSelector( (state:any) => state.rep.buscats);
    const [showCategoryModal, setShowCategoryModal] = useState(initialValues);
    const [selectedItem, setSelectedItem] = useState({});

    const categoryModalFn = (title: string, actionType: string, item?: any) => {
        setShowCategoryModal({ 
            ...showCategoryModal, 
            isOpen: true,
            type: '0',
            title: title,
            formType: 'repProfile',
            actionType: actionType,
            repId: repProfile? repProfile.id: '',
            formId: repProfile? repProfile.id: '', 
            memId: repProfile? repProfile.mem_id: ''
        });
        setSelectedItem(item);
    }

    return (<>
        { Object.keys(repProfile).length > 0 &&
        <IonCard className="buscat-section-wrap card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title" onClick={() => categoryModalFn('Add Category', 'new')}>
                    <span>Categories</span>
                    <i className="fa fa-plus float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
                { busCategory.length === 0 &&
                    <IonCardSubtitle>
                        <IonText className="text-10 ml-2" color="danger">(Update required)</IonText>
                    </IonCardSubtitle>        
                }
            </IonCardHeader>
              
            <IonCardContent>
                <IonList className="buscat-section-content">
                    { busCategory && busCategory.length > 0 &&  busCategory.map((item: any)=> {
                        return (<div key={item.id}>
                            { (!isPlatform('desktop')) &&    
                                <IonItemSliding > 
                                    <IonItem lines="none" >
                                        <IonAvatar slot="start" color="greenbg">
                                            <i className="fa fa-chevron-right fa-lg green" aria-hidden="true"></i>
                                        </IonAvatar>
                                        <IonLabel>
                                            <h2>{item.catname}</h2>
                                            <h3>{item.sub_catname}</h3>
                                            <p><strong>Keywords:</strong> {item.keywords}</p>
                                        </IonLabel>
                                        <IonItemOptions side="end">
                                            <IonItemOption color="greenbg" onClick={() => categoryModalFn('Edit Category', 'edit', item)}>Edit</IonItemOption>
                                            <IonItemOption color="warning" onClick={() => categoryModalFn('Delete Category', 'edit', item)}>Delete</IonItemOption>
                                        </IonItemOptions>
                                    </IonItem>
                                </IonItemSliding>
                            }
                            { (isPlatform('desktop')) && 
                            <IonItem lines="none">
                                <IonAvatar slot="start" color="greenbg">
                                    <i className="fa fa-chevron-right fa-lg green" aria-hidden="true"></i>
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{item.catname}</h2>
                                    <h3>{item.sub_catname}</h3>
                                    <p><strong>Keywords:</strong> {item.keywords}</p>
                                </IonLabel>
                                <IonAvatar className="anchor-white" slot="end" color="greenbg" onClick={() => categoryModalFn('Edit Category', 'edit', item)}>
                                    <i className="fa fa-pencil fa-lg green cursor" aria-hidden="true"></i>
                                </IonAvatar>
                            </IonItem>
                            }
                        </div>)
                    })} 
                    { busCategory && Object.keys(busCategory).length === 0 &&  
                        <IonItem lines="none" >
                            <IonText className="fs-13" color="warning">No categories added.</IonText>
                        </IonItem>
                    }
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        <IonModal backdropDismiss={false} isOpen={showCategoryModal.isOpen} className='category-modal-wrap'>
          { repProfile && showCategoryModal.isOpen === true && <CategoryModal
            showCategoryModal={showCategoryModal}
            setShowCategoryModal={setShowCategoryModal}
            selectedItem={selectedItem}
           /> }
        </IonModal>
    </>);
};
  
export default Buscats;
  