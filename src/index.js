import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import NotifBar from './constants/NotifBar/NotifBar';
import store from "./redux/store";
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';



const homePage = lazy(()=>import('./Home'));
const penjualanPage = lazy(() => import('./pages/penjualan/penjualanPage'));
const barangPage = lazy(() => import('./pages/barang/barangPage'));
const pelangganPage = lazy(() => import('./pages/pelanggan/pelangganPage'));
const itemPenjualanPage = lazy(() => import('./pages/item_penjualan/item_penjualanPage'));


class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      }
      this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount(){
  }
  
  async handleChange(fieldname, value){
    this.setState({
      [fieldname]: value
    })
  }

  render(){
      return (
        <Suspense fallback={<div>Loading... </div>}>

          <Router>
            <NotifBar />
            <Switch>
              <Route exact path='/' ><Redirect to={'/home'}/></Route>
              <Route path='/home' component={homePage}/>
              <Route path='/penjualan' component={penjualanPage} />
              <Route path='/pelanggan' component={pelangganPage} />
              <Route path='/barang' component={barangPage} />
              <Route path='/item-penjualan' component={itemPenjualanPage} />
            </Switch>

          </Router>
        </Suspense>
      );
  }
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider> 
    {/* <App/> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
