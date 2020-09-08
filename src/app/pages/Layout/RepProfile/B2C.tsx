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

const B2C: React.FC = () => {
    const repProfile = useSelector( (state:any) => state.rep.repProfile);
    const b2cCategory = useSelector( (state:any) => state.rep.b2c);
    const [showCategoryModal, setShowCategoryModal] = useState(initialValues);
    const [selectedItem, setSelectedItem] = useState({});

    const categoryModalFn = (title: string, actionType: string, item?: any) => {
        setShowCategoryModal({ 
            ...showCategoryModal, 
            isOpen: true,
            type: '1',
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
                <IonCardTitle onClick={() => categoryModalFn('Add B2B Category', 'new')}>
                    <span>B2C Category</span>
                    <i className="fa fa-plus float-right green cursor" aria-hidden="true"></i>
                </IonCardTitle>
                
                { b2cCategory && b2cCategory.length === 0 &&
                    <IonCardSubtitle>
                        <IonText className="fs-10 ml-2" color="danger">(Update required)</IonText>
                    </IonCardSubtitle>        
                }
            </IonCardHeader>
              
            <IonCardContent>
                <IonList className="buscat-section-content">
                    { b2cCategory && b2cCategory.length > 0 &&  b2cCategory.map((item: any)=> {
                        return (<div key={item.id}>
                            { (isPlatform('android') || isPlatform('ios')) &&  
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
                                            <IonItemOption color="greenbg" onClick={() => categoryModalFn('Edit B2B Category', 'edit', item)}>Edit</IonItemOption>
                                            <IonItemOption color="warning" onClick={() => categoryModalFn('Edit B2B Category', 'edit', item)}>Delete</IonItemOption>
                                        </IonItemOptions>
                                    </IonItem>
                                </IonItemSliding>
                            }
                            { (isPlatform('desktop') || isPlatform('tablet')) && 
                            <IonItem lines="none">
                                <IonAvatar slot="start" color="greenbg">
                                    <i className="fa fa-chevron-right fa-lg green" aria-hidden="true"></i>
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{item.catname}</h2>
                                    <h3>{item.sub_catname}</h3>
                                    <p><strong>Keywords:</strong> {item.keywords}</p>
                                </IonLabel>
                                <IonAvatar className="anchor-white" slot="end" color="greenbg" onClick={() => categoryModalFn('Edit B2B Category', 'edit', item)}>
                                    <i className="fa fa-pencil green cursor" aria-hidden="true"></i>
                                </IonAvatar>
                            </IonItem>
                            }
                        </div>)
                    })} 
                    { b2cCategory && Object.keys(b2cCategory).length === 0 && 
                        <IonItem lines="none" >
                            <IonText className="fs-13" color="warning">No categories added.</IonText>
                        </IonItem>
                    }
                </IonList>
            </IonCardContent>
        </IonCard>
        }
        <IonModal isOpen={showCategoryModal.isOpen} cssClass='category-modal-wrap'>
          { repProfile && showCategoryModal.isOpen === true && <CategoryModal
            showCategoryModal={showCategoryModal}
            setShowCategoryModal={setShowCategoryModal}
            selectedItem={selectedItem}
           /> }
        </IonModal>
    </>);
};
  
export default B2C;
  