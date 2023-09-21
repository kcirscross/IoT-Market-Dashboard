import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import OrderDetail from './pages/OrderDetail.jsx';
import { Sidebar } from './components';
import { useStateContext } from './contexts/ContextProvider';
import Navbar from './components/Navbar';
import Ecommerce from './pages/Ecommerce';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Login from './pages/Login';
import Request from './pages/Request';
import Loading from './components/Loading';
import StoreList from './pages/StoreList';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  const { activeMenu, token } = useStateContext();

  if (token === '') {
    return <Login />;
  }

  return (
    <div>
      <div className="flex relative dark:bg-main-dark-bg">
        {activeMenu ? (
          <div className="w-64 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={`dark:bg-main-bg bg-main-bg min-h-screen w-full ${
            activeMenu ? 'md:ml-64' : 'flex-2'
          }`}
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>

          <div>
            <Routes>
              <Route path="/" element={<Ecommerce />} />
              <Route path="/ecommerce" element={<Ecommerce />} />
              <Route path="/stores" element={<StoreList />} />
              <Route element={<Store />} path="stores/:id" />
              <Route element={<OrderDetail />} path="orders/:id" />
              <Route element={<ProductDetail />} path="products/:id" />
              <Route path="/orders" element={<Orders />}></Route>
              <Route path="/customers" element={<Customers />} />
              <Route path="/request" element={<Request />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
