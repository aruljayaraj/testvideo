import {
    IonLabel,
    IonButton,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonContent,
    IonChip,
    IonInput,
    IonSpinner,
    IonTitle
} from '@ionic/react';
import { checkmarkOutline, close, searchOutline } from 'ionicons/icons';
import React, { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';
// import { ErrorMessage } from '@hookform/error-message';
// import { isPlatform } from '@ionic/react';
import { nanoid } from 'nanoid';
import './SearchModal.scss';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import * as uiActions from '../../../store/reducers/ui';
    
interface Props {
  // title: string,
  searchModal: any,
  setSearchModal: Function
}
// const SearchModal: React.FC<Partial<SearchProps> & Partial<Props>> = (props:any) => { // { searchModal, setSearchModal }
const SearchModal: React.FC<Props> = (props) => { // { searchModal, setSearchModal }
    const dispatch = useDispatch();
    const location = useSelector( (state:any) => state.auth.location);
    const { ICONS  } = lfConfig;
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    /*function useQuery() {
      return new URLSearchParams(useLocation().search);
    }
    let query = useQuery(); // console.log(query);
    const b2b = query.get("b2b");
    // const type = query.get("type");*/
    // const { b2b, b2c, br, d, bn, keyword, display, type } = props.location.state;
    let initialValues = {
      keyword: "", // keyword? keyword: ""
    };
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: { ...initialValues },
        mode: "onChange"
    });
    const [state, setState] = useState({
      activeOption: 0,
      filteredResults: [],
      showOptions: false
    });
    const [searchFilter, setSearchFilter] = useState({
      filterBy: 'b2b'
    });
    const [redirectData, setRedirectData] = useState({ status: false, data: {} });
    /*const [searchFilter, setSearchFilter] = useState({
      b2b: true, // b2b? b2b : true // Supplier
      b2c: false, // b2c? b2c: false // Consumer
      br: false, // br? br: false // Business Resource
      d: false, // d? d: false Deals
      bn: false, // bn? bn: false Business News/ Press Release
      cn: false // cn? cn: false Company Name/Business Name
    });*/

    useEffect(() => {
      let cancel: any;
      if( keyword.length > 2 ){
        setLoading(true);
        const data = {
          action: 'autosearch',
          keyword: keyword,
          filters: searchFilter.filterBy,
          location: location
        }
        axios.post(`v2/search`, data, {
          cancelToken: new axios.CancelToken((c: any)=> cancel = c)
        })
        .then( (result: any) => { 
          const res = result.data;
          setLoading(false);
          if (result.status === 200 && res.status === 'SUCCESS') {
            setState( {
                ...state,
                activeOption: 0,
                filteredResults: res.data,
                showOptions: true
            });
          }
        })
        .catch( (error: any) => {
          if(axios.isCancel(error)) return; 
          setLoading(false);
          dispatch(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: error }));
          console.error(error);
        });
      }  
      return () => {
        if( cancel ){
          cancel();
          setLoading(false);
        }
      };
    },[keyword,location, searchFilter.filterBy]);

    const onHandleChange = (e: any) => {
      const currentKeyword = (e.currentTarget.value).toLowerCase();
      setKeyword(currentKeyword);
    };

    const clearSearch = () => {
      setValue('keyword', '', { shouldValidate: true });
      setKeyword('');
      setState({
        ...state,
        activeOption: 0,
        filteredResults: [],
        showOptions: false
      });
    } 

    // const onSubmit = (data: any) => {
    //   const currentKeyword = data.keyword;
    //   if( currentKeyword.length > 2 ){
    //     setRedirectData({ status: true, data: { ...searchFilter, keyword: currentKeyword, display: '', type:'Rep' } });
    //     props.setSearchModal(false);
    //   }
    // }

    const onListSelect = (item: any) => {
      const currentKeyword = keyword; 
      if( currentKeyword.length > 2 ){
        setRedirectData({ ...redirectData, status: true, data: { ...searchFilter, keyword: currentKeyword, display: item.display, type: item.type, mem_id: item.mem_id, form_id: item.form_id, form_type: item.form_type } });
        setTimeout(() => {
          props.setSearchModal(false);
        }, 1000)
        
      }
    }
  
    let optionList; 
    if (state.showOptions && keyword) {
      optionList = (
        <div className="suggestions-container">
          <ul className="options">
            {state.filteredResults.length > 0 && state.filteredResults.map((item: any, index: number) => { 
              let iconClassName;
              if(['Rep','Non'].includes(item.type)){ 
                iconClassName = ICONS.ICON_USERS; 
              }else if(item.type === 'Res'){ 
                iconClassName = ICONS.ICON_RESOURCE;
              }else if(item.type === 'Deal'){ 
                iconClassName = ICONS.ICON_DEAL;
              }else if(item.type === 'News'){ 
                iconClassName = ICONS.ICON_NEWS;
              }else if(item.type === 'Comp'){ 
                iconClassName = ICONS.ICON_COMPANY;
              }
              return (
                <li className="" key={nanoid()} onClick={(e: any) => onListSelect(item)} > {/* onClick={(e: any) => onClick(e, item)} */}
                  <p>
                      { iconClassName && <i className={`fa ${iconClassName} mr-3`} aria-hidden="true"></i> }
                      {item.display}
                  </p>
                </li>
              );
            })}
            {state.filteredResults.length === 0 && <li className="py-2 pr-3 error">No Results found.</li>}
          </ul>
        </div>
      );
    }

    if( redirectData.status ){
      if(redirectData.data && Object.keys(redirectData.data).length > 0){
        let itemLink = "";
        let itemData = {};
        let item:any = redirectData.data;
        if(['Rep','Non'].includes(item.type)){ 
          //itemLink = `/preliminary-results`;
          //itemData = { ...searchFilter, keyword: state.keyword, display: item.display, type: item.type };
          itemLink = `/search-results`;
          itemData = { ...searchFilter, keyword: keyword, category: item.display };
        }else if(item.type === 'Res'){
          itemLink = `/resource/${item.form_type}/${item.form_id}`;
        }else if(item.type === 'Deal'){
          itemLink = `/local-deal/${item.form_id}`; 
        }else if(item.type === 'News'){ 
          itemLink = `/press-release/${item.form_id}`; 
        }else if(item.type === 'Comp'){
          let display = item.display.split(',');
          itemLink = `/company-results`;
          itemData = { ...searchFilter, company_name: display[0]? display[0]: display };
        }
        return <Redirect to={{ pathname: itemLink, state: itemData }} />;
      }
    }
    
    return (<>
      <IonContent fullscreen className="ion-padding">
        <IonToolbar>
          <IonTitle>Searching for (select one) : </IonTitle>
          <IonButtons slot="end">
              <IonButton onClick={() => props.setSearchModal(false)}>
                  <IonIcon icon={close} slot="icon-only"></IonIcon>
              </IonButton>
          </IonButtons>
        </IonToolbar>
        <form className="searchbar"> {/* onSubmit={handleSubmit(onSubmitFn)} */}
          {loading}
          <div className="inner-form">
              <div className="advance-search">
                <div className="filterbox">
                  <IonChip color={searchFilter.filterBy === 'b2b'? 'primary' : ''} className="mr-3 mt-3" onClick={ () => setSearchFilter({...searchFilter, filterBy: 'b2b'}) }>
                    { searchFilter.filterBy === 'b2b' && <IonIcon icon={checkmarkOutline}></IonIcon> }
                    <IonLabel>Products & Services</IonLabel>
                  </IonChip>
                  <IonChip color={searchFilter.filterBy === 'br'? 'primary' : ''} className="mr-3 mt-3" onClick={ () => setSearchFilter({...searchFilter, filterBy: 'br'}) }>
                    { searchFilter.filterBy === 'br' && <IonIcon icon={checkmarkOutline}></IonIcon> }
                    <IonLabel>Business Resources</IonLabel>
                  </IonChip>
                  <IonChip color={searchFilter.filterBy === 'd'? 'primary' : ''} className="mr-3 mt-3" onClick={ () => setSearchFilter({...searchFilter, filterBy: 'd'}) }>
                    { searchFilter.filterBy === 'd' && <IonIcon icon={checkmarkOutline}></IonIcon> }
                    <IonLabel>Local Deals</IonLabel>
                  </IonChip>
                  <IonChip color={searchFilter.filterBy === 'bn'? 'primary' : ''} className="mr-3 mt-3" onClick={ () => setSearchFilter({...searchFilter, filterBy: 'bn'}) }>
                    { searchFilter.filterBy === 'bn' && <IonIcon icon={checkmarkOutline}></IonIcon> }
                    <IonLabel>Business News</IonLabel>
                  </IonChip>
                  <IonChip color={searchFilter.filterBy === 'cn'? 'primary' : ''} className="mr-3 mt-3" onClick={ () => setSearchFilter({...searchFilter, filterBy: 'cn'}) }>
                    { searchFilter.filterBy === 'cn' && <IonIcon icon={checkmarkOutline}></IonIcon> }
                    <IonLabel>Business Name</IonLabel>
                  </IonChip>

                </div>
                {/* <IonButton className="ion-margin-top mt-5" expand="block" type="submit">
                  Search
                </IonButton> */}
              </div>

              <div className="basic-search  mt-3">
                <div className="input-field">
                    <div className="icon-wrap">
                      <IonIcon icon={searchOutline} slot="icon-only"></IonIcon>
                    </div>
                    <Controller 
                        name="keyword"
                        control={control}
                        render={({ field: {onChange, onBlur, value} }) => {
                            return <IonInput type="text"
                                onKeyUp={(e: any) => {
                                    var str = e.target.value;
                                    if( str.split(/\s+/).length > 10 ){
                                        e.target.value = str.split(/\s+/).slice(0, 10).join(" ");
                                    }
                                }} 
                                onIonChange={(e: any) => {
                                  onChange(e.target.value);
                                  onHandleChange(e);
                                }}
                                onBlur={onBlur}
                                // onKeyDown={onKeyDown}
                                
                                value={value}
                            />
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: "Keyword is required"
                            },
                            // pattern: {
                            //     value: /^\W*(\w+(\W+|$)){1,10}$/i,
                            //     message: "Keyword should be valid"
                            // }
                        }}
                    />
                    <div className="spinner-wrap">
                      {loading && <IonSpinner name="dots" /> }
                      {keyword && keyword.length > 0 && !loading && <IonIcon icon={close} slot="icon-only" onClick={clearSearch}></IonIcon>}
                    </div>
                </div>
                {optionList}
              </div>
              {/* <ErrorMessage
                  errors={errors}
                  name="keyword"
                  render={({ message }) => <div className="invalid-feedback">{message}</div>}
              /> */}
              
          </div>
        </form>
      </IonContent>
      
    </>);
  }
  
  export default React.memo(SearchModal);
  