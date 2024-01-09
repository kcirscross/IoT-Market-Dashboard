import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import moment from 'moment';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Avatar } from '@mui/material';
import { Loading, Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const currencyFormat = (number) => {
  return number.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
};

const Store = () => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [tab, setTab] = useState(1);
  const { token } = useStateContext();
  const path = useLocation().pathname.split('/')[2];
  const navigate = useNavigate();
  const handleOnOrderCellClick = (params) => {
    if (params.field === 'deliveryCode') navigate(`/orders/${params.id}`);
  };

  const handleOnProductCellClick = (params) => {
    if (params.field === 'productName') navigate(`/products/${params.id}`);
  };
  const storeColumns = [
    {
      field: 'productName',
      headerName: 'Name',
      flex: 1,
      renderCell: function (params) {
        return (
          <div>
            <div className="flex flex-row items-center cursor-pointer">
              <Avatar
                className="mr-3"
                src={params.row.thumbnailImage}
                sx={{ width: 40, height: 40 }}
              />
              {params.row.productName}
            </div>
          </div>
        );
      },
      valueGetter: function (params) {
        return params.row.productName;
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      valueGetter: function (params) {
        const formatedCurrency = currencyFormat(Number(params.row.price));
        return formatedCurrency;
      },
    },
    {
      field: 'soldCount',
      headerName: 'Sold Count',
      flex: 0.5,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      flex: 0.5,
    },
  ];
  const orderColumns = [
    {
      field: 'deliveryCode',
      headerName: 'Delivery Tracking',
      flex: 1,
      renderCell: function (params) {
        return (
          <div className="flex flex-row justify-between items-center cursor-pointer">
            <Link
              to={`/orders/${params.row._id}`}
              style={{ textDecoration: 'none' }}
            >
              {params.row.deliveryCode}
            </Link>
          </div>
        );
      },
    },
    {
      field: 'product',
      headerName: 'Products',
      flex: 2,
      renderCell: function (params) {
        return (
          <div>
            {params.row.productsList.map((product) => (
              <div className="flex flex-row items-center ">
                <Avatar
                  src={product.name.thumbnailImage}
                  sx={{ width: 40, height: 40 }}
                  className="mr-3"
                />
                {product.name.productName}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date Purchased',
      flex: 1,
      valueGetter: function (params) {
        const formatedDate = moment(params.row.createdAt).format('DD/MM/YYYY');
        return formatedDate;
      },
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      flex: 1,
      valueGetter: function (params) {
        return params.row.userId.fullName;
      },
      renderCell: function (params) {
        return (
          <div className="flex flex-row justify-between items-center ">
            <Avatar
              src={params.row.userId.avatar}
              sx={{ width: 40, height: 40 }}
              className="mr-3"
            />

            {params.row.userId.fullName}
          </div>
        );
      },
      sortComparator: (v1, v2) => v1.fullName.localeCompare(v2.fullName),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      valueGetter: function (params) {
        const formatedCurrency = currencyFormat(
          params.row.VNPay.vnp_Amount / 100
        );
        return formatedCurrency;
      },
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      flex: 1,
      valueGetter: function (params) {
        if (params.row.isCod) return 'Cash On Delivery';
        else return `Payment via ${params.row.VNPay.vnp_BankCode}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      valueGetter: function (params) {
        if (params.row.shippingLogs.length === 0) return 'Confirming';
        else
          return params.row.shippingLogs[params.row.shippingLogs.length - 1]
            .status;
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    const fetchStore = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/store/${path}`,
        method: 'get',
      });

      setStore(response.data.store);
    };

    const fetchProducts = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/product/user/${path}`,
        method: 'get',
      });

      setProducts(response.data.products);
    };

    const fetchOrders = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/order/store/${path}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      setOrders(response.data.orders);
    };
    fetchStore();
    fetchProducts();
    fetchOrders();
  }, [path]);

  return (
    <>
      <Header category="Page" title="Store Information" />
      {store && products && orders ? (
        <div name="about" className="w-full my-16">
          <div className="max-w-[1240px] mx-auto">
            <div className="grid md:grid-cols-3 gap-2 px-2 text-center ">
              <div className=" flex items-center justify-end">
                <img
                  src={store.shopImage}
                  className="rounded-full w-[150px] items-center"
                  alt="round avatar"
                />
              </div>

              <div className="ml-20 grid md:grid-cols-1 gap-4 px-2 text-center">
                <div className=" flex items-center justify-start">
                  <p className="text-2xl font-bold">{store.displayName}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-2 px-2 text-center ">
                  <div className=" flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {store.followers.length}
                    </p>
                    <p className="text-gray-400 mt-2">Followers</p>
                  </div>
                  <div className=" flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {products.length}
                    </p>
                    <p className="text-gray-400 mt-2">Products</p>
                  </div>
                </div>
                <div className=" flex items-center justify-start text-xl">
                  <p>{store.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-16 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => {
                    setTab(1);
                  }}
                  className={
                    tab === 1
                      ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                      : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }
                  //className="inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500"
                >
                  Products
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => {
                    setTab(2);
                  }}
                  className={
                    tab === 2
                      ? 'inline-block p-4 text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500'
                      : 'inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }
                  aria-current="page"
                >
                  Orders
                </button>
              </li>
            </ul>
          </div>
          {tab === 1 && (
            <div className="w-full ">
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    sx={{
                      '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                        py: '8px',
                      },
                      '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                        py: '15px',
                      },
                      '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell':
                        {
                          py: '22px',
                        },
                    }}
                    components={{
                      Toolbar: CustomToolbar,
                    }}
                    getRowHeight={() => 'auto'}
                    autoHeight
                    getRowId={(row) => row._id}
                    rows={products}
                    columns={storeColumns}
                    pageSize={12}
                    onCellClick={handleOnProductCellClick}
                  />
                </div>
              </div>
            </div>
          )}
          {tab === 2 && (
            <div className="w-full ">
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    sx={{
                      '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                        py: '8px',
                      },
                      '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                        py: '15px',
                      },
                      '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell':
                        {
                          py: '22px',
                        },
                    }}
                    components={{
                      Toolbar: CustomToolbar,
                    }}
                    getRowHeight={() => 'auto'}
                    autoHeight
                    getRowId={(row) => row._id}
                    rows={orders}
                    columns={orderColumns}
                    pageSize={12}
                    onCellClick={handleOnOrderCellClick}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Store;
