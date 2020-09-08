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
import '../PressRelease.scss';
import CategoryModal from '../../../../components/Category/Category';
import { lfConfig } from '../../../../../Constants';
import PRStepInd from './PRStepInd';

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

const BusinessCategory: React.FC = () => {
    
    const authUser = useSelector( (state:any) => state.auth.data.user);
    const pr = useSelector( (state:any) => state.pr.pressRelease);
    const [showCategoryModal, setShowCategoryModal] = useState(initialValues);
    const [selectedItem, setSelectedItem] = useState({});
    let { id } = useParams(); 
    const { basename } = lfConfig;

    const categoryModalFn = (title: string, actionType: string, item?: any) => {
        setShowCategoryModal({ 
            ...showCategoryModal, 
            isOpen: true,
            type: '0',
            title: title,
            formType: 'pressRelease',
            actionType: actionType,
            repId: (authUser && Object.keys(authUser).length > 0)? authUser.repID: '',
            formId: (pr && Object.keys(pr).length > 0)? pr.pr_id: '', 
            memId: (authUser && Object.keys(authUser).length > 0)? authUser.ID: ''
        });
        setSelectedItem(item);
    }

    return (<>
        <PRStepInd />
        <IonCard className="buscat-section-wrap card-center mt-4 mb-4">
            <IonCardHeader color="titlebg">
                <IonCardTitle >
                    <span>B2B Category</span>
                    <IonRouterLink color="greenbg" onClick={() => categoryModalFn('Add Business Category', 'new')} className="float-right router-link-anchor">
                        <i className="fa fa-plus green cursor" aria-hidden="true"></i>
                    </IonRouterLink>
                    
                </IonCardTitle>
            </IonCardHeader>
              
            <IonCardContent>
                <IonList className="buscat-section-content">
                    { pr && pr.buscats && pr.buscats.length > 0 &&  pr.buscats.map((item: any)=> {
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
                                            <IonItemOption color="greenbg cursor" onSubmit={() => categoryModalFn('Edit Business Category', 'edit', item)}>Edit</IonItemOption>
                                            <IonItemOption color="warning" onClick={() => categoryModalFn('Edit Business Category', 'edit', item)}>Delete</IonItemOption>
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
                    { pr && pr.buscats && Object.keys(pr.buscats).length === 0 &&  
                        <IonItem lines="none" >
                            <IonText className="fs-13 mr-3" color="warning">
                                No categories added.   
                            </IonText>
                            <IonButton color="greenbg" onClick={() => categoryModalFn('Add Business Category', 'new')}>Add</IonButton>
                        </IonItem>
                    }
                    {/* <p>{JSON.stringify(pr.buscats)}</p> */}
                </IonList>
                { pr && pr.buscats && Object.keys(pr.buscats).length > 0 && 
                <IonButton color="greenbg" 
                    routerLink={`${basename}/layout/add-press-release/${id}/${authUser.ID}/3`}
                    className="ion-margin-top mt-4 mb-3 float-right">
                    Next
                </IonButton>
                }
            </IonCardContent>
        </IonCard>
        <IonModal isOpen={showCategoryModal.isOpen} cssClass='category-modal-wrap'>
          { pr && Object.keys(pr).length > 0 && showCategoryModal.isOpen === true && <CategoryModal
            showCategoryModal={showCategoryModal}
            setShowCategoryModal={setShowCategoryModal}
            selectedItem={selectedItem}
           /> }
        </IonModal>
    </>);
};
  
export default BusinessCategory;
  