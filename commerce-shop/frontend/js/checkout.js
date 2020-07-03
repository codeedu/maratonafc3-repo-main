import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import CustomerProfile from "./component/CustomerProfile";
import Address from "./component/Address";
import Payment from "./component/Payment";
import Step from "./component/Step";
import {StepContextProvider} from "./component/Step/StepContextProvider";
// import PaymentSuccess from "./component/PaymentSuccess";


const App = () => {
    return (
        <StepContextProvider>
            <BrowserRouter basename={'/checkout'}>
                <Step/>
                <Switch>
                    <Route path={'/'} component={CustomerProfile} exact={true}/>
                    <Route path={'/address'} component={Address} exact={true}/>
                    <Route path={'/payment'} component={Payment} exact={true}/>
                    {/*<Route path={'/payment-success'} component={PaymentSuccess} exact={true}/>*/}
                </Switch>
            </BrowserRouter>
        </StepContextProvider>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'))
