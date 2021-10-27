import {
    IonItem,
    IonText,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonAvatar,
    IonLabel,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonButton,
    IonRouterLink
  } from '@ionic/react';

import React, { useState,  } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isPlatform } from '@ionic/react';
import '../ResourceUpload.scss';
import ResCategoryModal from '../../../../components/Category/ResCategory';
import { lfConfig } from '../../../../../Constants';
import ResStepInd from './ResStepInd';

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

const ResourceCategory: React.FC = () => {
    
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const resource = useSelector( (state:any) => state.res.resource);
    const [showCategoryModal, setShowCategoryModal] = useState(initialValues);
    const [selectedItem, setSelectedItem] = useState({});
    let { id, res_type } = useParams<any>(); 
    const { basename } = lfConfig;

    const categoryModalFn = (title: string, actionType: string, item?: any) => {
        setShowCategoryModal({ 
            ...showCategoryModal, 
            isOpen: true,
            type: '0',
            title: title,
            formType: res_type? res_type: '',
            actionType: actionType,
            repId: (authUser && Object.keys(authUser).length > 0)? authUser.repID: '',
            formId: (resource && Object.keys(resource).length > 0)? resource.id: '', 
            memId: (authUser && Object.keys(authUser).length > 0)? authUser.ID: ''
        });
        setSelectedItem(item);
    }

    return (<>
        <ResStepInd />
        <IonCard className="buscat-section-wrap card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle className="card-custom-title">
                    <span>Resources Category</span>
                    <IonRouterLink color="greenbg" onClick={() => categoryModalFn('Add Resources Category', 'new')} className="float-right router-link-anchor">
                        <i className="fa fa-plus green cursor" aria-hidden="true"></i>
                    </IonRouterLink>
                    
                </IonCardTitle>
            </IonCardHeader>
              
            <IonCardContent>
                <IonList className="buscat-section-content">
                    { resource && resource.buscats && resource.buscats.length > 0 &&  resource.buscats.map((item: any)=> {
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
                                            <IonItemOption color="greenbg cursor" onSubmit={() => categoryModalFn('Edit Business Category', 'edit', item)}>Edit</IonItemOption>
                                            <IonItemOption color="warning" onClick={() => categoryModalFn('Edit Business Category', 'edit', item)}>Delete</IonItemOption>
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
                                <IonAvatar className="anchor-white" slot="end" color="greenbg" onClick={() => categoryModalFn('Edit B2B Category', 'edit', item)}>
                                    <i className="fa fa-pencil fa-lg green cursor" aria-hidden="true"></i>
                                </IonAvatar>
                            </IonItem>
                            }
                        </div>)
                    })} 
                    { resource && resource.buscats && resource.buscats.length === 0 &&  
                        <IonItem lines="none" >
                            <IonText className="fs-13 mr-3" color="warning">
                                No categories added.   
                            </IonText>
                            <IonButton color="greenbg" onClick={() => categoryModalFn('Add Resources Category', 'new')}>Add</IonButton>
                        </IonItem>
                    }
                    {/* <p>{JSON.stringify(pr.buscats)}</p> */}
                </IonList>
                { resource && resource.buscats && resource.buscats.length > 0 && 
                <IonButton color="greenbg" 
                    routerLink={`${basename}/layout/add-resource/${res_type}/${id}/${authUser.ID}/3`}
                    className="ion-margin-top mt-4 mb-3 float-right">
                    Next
                </IonButton>
                }
            </IonCardContent>
        </IonCard>
        <IonModal backdropDismiss={false} isOpen={showCategoryModal.isOpen} cssClass='category-modal-wrap'>
          { resource && Object.keys(resource).length > 0 && showCategoryModal.isOpen === true && <ResCategoryModal
            showCategoryModal={showCategoryModal}
            setShowCategoryModal={setShowCategoryModal}
            selectedItem={selectedItem}
           /> }
        </IonModal>
    </>);
};
  
export default ResourceCategory;
  