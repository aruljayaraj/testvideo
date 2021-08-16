import React, { Suspense, lazy } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import {
  //IonRouterOutlet,
  IonContent
 } from '@ionic/react';
// import { IonReactRouter } from '@ionic/react-router';
import { lfConfig } from './Constants';

import Home from './app/pages/Home/Home';
import NoPage from './app/pages/NoPage/NoPage'; 
import Login from './app/pages/Login/Login';
import Header from './app/components/Header/Header';
import Footer from './app/components/Footer/Footer';
//import Layout from './app/pages/Layout/Layout';
import Signup from './app/pages/Signup/Signup';
import EmailVerify from './app/pages/EmailVerify/EmailVerify';
import ForgetPassword from './app/pages/ForgetPassword/ForgetPassword';
import AboutUs from './app/pages/AboutUs/AboutUs';
import PrivacyPolicy from './app/pages/PrivacyPolicy/PrivacyPolicy';
import ContactUs from './app/pages/ContactUs/ContactUs';
import Profile from './app/pages/Profile/Profile';
import PreResults from './app/pages/Search/Preliminary/Results';
// import MainResults from './app/pages/Search/Main/Results';

import CompanyProfile from  './app/pages/Layout/CompanyProfile/CompanyProfile';
import RepProfile from './app/pages/Layout/RepProfile/RepProfile';
import NewRep from './app/pages/Layout/RepProfile/AddRep/NewRep';
import Dashboard from './app/pages/Layout/Dashboard/Dashboard';
import HomePR from './app/pages/PressReleases/PR';
import PressRelease from './app/pages/Layout/PressRelease/PressRelease';
import PressReleases from './app/pages/Layout/PressRelease/PressReleases';
import AddPressRelease from './app/pages/Layout/PressRelease/AddPressRelease/AddPressRelease';
import AddResource from './app/pages/Layout/ResourceUpload/Add/AddResource';
import Resources from './app/pages/Layout/ResourceUpload/Resources';
import Resource from './app/pages/Layout/ResourceUpload/Resource';
import HomeLD from './app/pages/LocalDeals/LocalDeal';
import LocalDeal from './app/pages/Layout/Deals/LocalDeal';
import LocalDeals from './app/pages/Layout/Deals/LocalDeals';
import AddDeal from './app/pages/Layout/Deals/AddDeal/AddDeal';
import BuyDeal from './app/pages/Layout/Deals/Premium/Buy';
// import QuickQuotes from './app/pages/Layout/QuickQuotes/QuickQuotes';
import ViewLQ from './app/pages/Layout/LocalQuotes/View/ViewLQ';
import ViewQuotation from './app/pages/Layout/LocalQuotes/View/ViewQuotation';
import AddLQ from './app/pages/Layout/LocalQuotes/Add/AddLQ';
import BuyerRequestCenter from './app/pages/Layout/LocalQuotes/Buyer/BuyerRequestCenter';
import SellerRequestCenter from './app/pages/Layout/LocalQuotes/Seller/SellerRequestCenter';
import Quotation from './app/pages/Layout/LocalQuotes/Quotation/Quotation';
import MyQuotations from './app/pages/Layout/LocalQuotes/Seller/MyQuotations';
import MyQuotationArchive from './app/pages/Layout/LocalQuotes/Seller/MyQuotationArchive';
import MyLQArchive from './app/pages/Layout/LocalQuotes/Buyer/MyLQArchive';
import RFQSettings from './app/pages/Layout/LocalQuotes/RFQSettings';
import DealPayment from './app/pages/Layout/Deals/Premium/DealPayment';
import HomeResource from './app/pages/Resources/Resource';
import FinalResults from './app/pages/Search/Final/Results';

// class DebugRouter extends Router {
//   constructor(props){
//     super(props);
//     console.log('initial history is: ', JSON.stringify(this.history, null,2))
//     this.history.listen((location, action)=>{
//       console.log(
//         `The current URL is ${location.pathname}${location.search}${location.hash}`
//       )
//       console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
//     });
//   }
// }

const Routes: React.FC = () => {
  const { basename } = lfConfig;
    /*const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={props => (
          fakeAuth.isAuthenticated ? (
            <Component {...props}/>
          ) : (
            <Redirect to={{
              pathname: '/login',
              state: { from: props.location }
            }}/>
          )
        )}/>
      );*/
      
    return (
      // <DebugRouter>
    <Router basename={process.env.REACT_APP_BASENAME}>
        <Suspense fallback={<div><h1>Loading...</h1></div>}>
          <Header />
          <IonContent>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <Route path="/email-verify" component={EmailVerify} exact={true} />
                <Route path="/forget-password" component={ForgetPassword} exact={true} />
                <Route path="/about-us" component={AboutUs} exact={true} />
                <Route path="/privacy-policy" component={PrivacyPolicy} exact={true} />
                <Route path="/contact-us" component={ContactUs} exact={true} />

                <Route path="/profile/:memid/:repid" component={Profile} exact={true} />
                <Route path="/preliminary-results" component={PreResults} exact={true} />
                <Route path="/search-results" component={FinalResults} exact={true} />
                <Route path="/press-release/:mem_id/:id" component={HomePR} exact={true} />
                <Route path="/local-deal/:mem_id/:id" component={HomeLD} exact={true} />
                <Route path="/resource/:res_type/:mem_id/:id" component={HomeResource} exact={true} />
                {/* <Route path="/reset-password" component={ResetPassword} exact={true} /> */}
                {/* <Route 
                    path="/layout"
                    exact
                    render={props => {
                        return (authValues.authenticated && authValues.isVerified &&  authValues.user) ? <Redirect to="/layout" /> : <Redirect to="/login" />;
                    }}
                    /> */}
                {/* <Route path="/layout" component={Layout} exact={true} /> */}
                <Route path="/layout/dashboard" component={Dashboard} exact={true} />
                <Route path="/layout/company-profile" component={CompanyProfile} exact={true} />
                <Route path="/layout/rep-profile/:memid/:repid" component={RepProfile} exact={true} />
                <Route path="/layout/add-newrep" component={NewRep} exact={true} />

                <Route path="/layout/press-release/:id" component={PressRelease} exact={true} />
                <Route path="/layout/press-releases/" component={PressReleases} exact={true} />
                <Route path="/layout/add-press-release/:id?/:mem_id?/:step?" component={AddPressRelease} exact={true} />

                <Route path="/layout/resources/:res_type/" component={Resources} exact={true} />
                <Route path="/layout/resources/:res_type/:id" component={Resource} exact={true} />
                <Route path="/layout/add-resource/:res_type/:id?/:mem_id?/:step?" component={AddResource} exact={true} />

                <Route path="/layout/deals/local-deal/:id" component={LocalDeal} exact={true} />
                <Route path="/layout/deals/local-deals/" component={LocalDeals} exact={true} />
                <Route path="/layout/deals/add-deal/:id?/:mem_id?/:step?" component={AddDeal} exact={true} />
                <Route path="/layout/deals/buy-deal/:id?" component={BuyDeal} exact={true} />
                <Route path="/layout/deals/deal-payment/:id" component={DealPayment} exact={true} />

                <Route path="/layout/add-localquote/:rfqType/:id?/:mem_id?/:step?" component={AddLQ} exact={true} />
                <Route path="/layout/view-localquote/:rfqType/:id/:mem_id/:vfrom?" component={ViewLQ} exact={true} />
                <Route path="/layout/quotation/:rfqType/:id?/:mem_id?/:quote_id?/:step?" component={Quotation} exact={true} />
                <Route path="/layout/view-quotation/:rfqType/:id?/:mem_id?/:qq_id?/:qq_mem_id?/:vfrom?" component={ViewQuotation} exact={true} />

                <Route path="/layout/buyer-request-center/:rfqType/" component={BuyerRequestCenter} exact={true} /> 
                <Route path="/layout/my-localquotes-archive/:rfqType/" component={MyLQArchive} exact={true} />
                <Route path="/layout/notification-settings/:rfqType" component={RFQSettings} exact={true} />
                <Route path="/layout/seller-request-center/:rfqType/" component={SellerRequestCenter} exact={true} />
                <Route path="/layout/my-quotations/:rfqType/" component={MyQuotations} exact={true} />
                <Route path="/layout/my-quotations-archive/:rfqType/" component={MyQuotationArchive} exact={true} />
                {/* <Route path="/layout/add-qq/:rfqType/:id?/:mem_id?/:step?" component={AddQQ} exact={true} /> */}
                
                
                <Route path="*" component={NoPage} />
            </Switch>
        </IonContent>
        <Footer/>
      </Suspense>  
    </Router>
    // </DebugRouter>
    );
}

export default Routes;
