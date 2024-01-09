import React, { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import moment from 'moment';
import Avatar from '@mui/material/Avatar';

import { Loading } from '../components';
import { Header } from '../components';
import axios from 'axios';
import { useStateContext } from '../contexts/ContextProvider';

const currencyFormat = (number) => {
  return number.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
};

const Orders = () => {
  const { token } = useStateContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const handleOnCellClick = (params) => {
    if (params.field === 'deliveryCode') navigate(`/orders/${params.id}`);
  };

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

  const columns = [
    {
      field: 'deliveryCode',
      headerName: 'Delivery Tracking',
      flex: 1,
      renderCell: function (params) {
        return (
          <div className="flex flex-row justify-between items-center cursor-pointer ">
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

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/order`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setOrders(response.data.orders);
    };
    fetchOrders();
  }, []);

  return (
    <>
      {orders ? (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
          <Header category="Page" title="Orders" />
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                components={{
                  Toolbar: CustomToolbar,
                }}
                sx={{
                  '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                    py: '8px',
                  },
                  '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                    py: '15px',
                  },
                  '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                    py: '22px',
                  },
                }}
                getRowHeight={() => 'auto'}
                autoHeight
                getRowId={(row) => row._id}
                rows={orders}
                columns={columns}
                pageSize={12}
                onCellClick={handleOnCellClick}
              />
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};
export default Orders;
