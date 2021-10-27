import {
    IonLabel,
    IonButton,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonContent,
    IonChip,
    IonInput,
    IonSpinner
} from '@ionic/react';
import { checkmarkOutline, close, searchOutline } from 'ionicons/icons';
import React, { useState, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
// import { ErrorMessage } from '@hookform/error-message';
// import { isPlatform } from '@ionic/react';
import { nanoid } from 'nanoid';
import './SearchModal.scss';
import { lfConfig } from '../../../../Constants';
import CoreService from '../../../shared/services/CoreService';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
// import { SearchProps } from '../../../interfaces/Common';
    
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
    /*function useQuery() {
      return new URLSearchParams(useLocation().search);
    }
    let query = useQuery(); // console.log(query);
    const b2b = query.get("b2b");
    const b2c = query.get("b2c");
    const br = query.get("br");
    const d = query.get("d");
    const bn = query.get("bn");
    const key = query.get("key");
    // const display = query.get("display");
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
      showOptions: false,
      keyword: "", // keyword? keyword: ""
      loading: false
    });
    const [searchFilter, setSearchFilter] = useState({
      filterBy: 'b2b'
    });
    /*const [searchFilter, setSearchFilter] = useState({
      b2b: true, // b2b? b2b : true // Supplier
      b2c: false, // b2c? b2c: false // Consumer
      br: false, // br? br: false // Business Resource
      d: false, // d? d: false Deals
      bn: false, // bn? bn: false Business News/ Press Release
      cn: false // cn? cn: false Company Name/Business Name
    });*/
    const [redirectData, setRedirectData] = useState({ status: false, data: {} });

    const onCommonCb = useCallback((res: any) => {
      if(res.status === 'SUCCESS'){
        setState({
          ...state,
          activeOption: 0,
          filteredResults: res.data,
          showOptions: true,
          keyword: res.keyword,
          loading: false
        });
      }
    }, [dispatch]);

    const onHandleChange = (e: any) => {
      const currentKeyword = (e.currentTarget.value).toLowerCase();
      if( currentKeyword.length > 2 ){
        setState({
          ...state,
          loading: true
        });
        const fd = {
            action: 'autosearch',
            keyword: currentKeyword,
            filters: searchFilter,
            location: location
        };
        CoreService.onPostFn('search', fd, onCommonCb);
      }else{
          setState({
            ...state,
            activeOption: 0,
            filteredResults: [],
            showOptions: false,
            keyword: currentKeyword,
            loading: false
          });
      }
    };

    const clearSearch = () => {
      setValue('keyword', '', { shouldValidate: true });
      setState({
        ...state,
        activeOption: 0,
        filteredResults: [],
        showOptions: false,
        keyword: "",
        loading: false
      });
    }
    

    const onSubmit = (data: any) => {
      const currentKeyword = data.keyword;
      if( currentKeyword.length > 2 ){
        setRedirectData({ status: true, data: { ...searchFilter, keyword: currentKeyword, display: '', type:'Rep' } });
        props.setSearchModal(false);
      }
    }

    const onListSelect = (item: any) => {
      const currentKeyword = state.keyword; 
      if( currentKeyword.length > 2 ){
        setRedirectData({ ...redirectData, status: true, data: { ...searchFilter, keyword: currentKeyword, display: item.display, type: item.type, mem_id: item.mem_id, form_id: item.form_id, form_type: item.form_type } });
        setTimeout(() => {
          props.setSearchModal(false);
        }, 1000)
        
      }
    }
  
    let optionList; 
    if (state.showOptions && state.keyword) { 
      optionList = (
        <div className="suggestions-container">
          <ul className="options">
            {state.filteredResults.length > 0 && state.filteredResults.map((item: any, index: number) => { 
              let iconClassName;
              if(item.type === 'Rep'){ 
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

    if( redirectData.status  ){ 
      if(redirectData.data && Object.keys(redirectData.data).length > 0){
        let itemLink = "";
        let itemData = {};
        let item:any = redirectData.data;
        if(item.type === 'Rep'){ 
          //itemLink = `/preliminary-results`;
          //itemData = { ...searchFilter, keyword: state.keyword, display: item.display, type: item.type };
          const bcat_type = item.filterBy === 'b2c'? 1: 0;
          itemLink = `/search-results`;
          itemData = { ...searchFilter, keyword: state.keyword, category: item.display, type: bcat_type };
        }else if(item.type === 'Res'){
          itemLink = `/resource/${item.form_type}/${item.form_id}`;
        }else if(item.type === 'Deal'){
          itemLink = `/local-deal/${item.form_id}`; 
        }else if(item.type === 'News'){ 
          itemLink = `/press-release/${item.form_id}`; 
        }else if(item.type === 'Comp'){
          itemLink = `/company-results`;
          itemData = { ...searchFilter, company_name: item.display };
        }
        return <Redirect to={{ pathname: itemLink, state: itemData }} />;
      }
    }
    
    return (<>
      <IonContent fullscreen className="ion-padding">
        <IonToolbar>
          <IonButtons slot="end">
              <IonButton onClick={() => props.setSearchModal(false)}>
                  <IonIcon icon={close} slot="icon-only"></IonIcon>
              </IonButton>
          </IonButtons>
        </IonToolbar>
        <form className="searchbar" onSubmit={handleSubmit(onSubmit)}> {/* onSubmit={handleSubmit(onSubmitFn)} */}
          <div className="inner-form">
              <div className="basic-search">
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
                    
                    {/* <input id="search" type="text" placeholder="Search..." 
                      onChange={onHandleChange}
                      onKeyDown={onKeyDown}
                      autoComplete="off"
                      value={state.keyword}
                    /> */}
                    <div className="spinner-wrap">
                      {state.loading && <IonSpinner name="dots" /> }
                      {state.keyword && state.keyword.length > 0 && !state.loading && <IonIcon icon={close} slot="icon-only" onClick={clearSearch}></IonIcon>}
                    </div>
                </div>
                {optionList}
              </div>
              {/* <ErrorMessage
                  errors={errors}
                  name="keyword"
                  render={({ message }) => <div className="invalid-feedback">{message}</div>}
              /> */}
              <div className="advance-search mt-3">
                <div className="filterbox">
                  <IonChip color={searchFilter.filterBy === 'b2b'? 'primary' : ''} className="mr-3 mt-3" onClick={ () => setSearchFilter({...searchFilter, filterBy: 'b2b'}) }>
                    { searchFilter.filterBy === 'b2b' && <IonIcon icon={checkmarkOutline}></IonIcon> }
                    <IonLabel>B2B Products & Services</IonLabel>
                  </IonChip>
                  <IonChip color={searchFilter.filterBy === 'b2c'? 'primary' : ''} className="mr-3 mt-3" onClick={ () => setSearchFilter({...searchFilter, filterBy: 'b2c'}) }>
                    { searchFilter.filterBy === 'b2c' && <IonIcon icon={checkmarkOutline}></IonIcon> }
                    <IonLabel>Consumer Products & Services</IonLabel>
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
          </div>
        </form>
      </IonContent>
      
    </>);
  }
  
  export default React.memo(SearchModal);
  