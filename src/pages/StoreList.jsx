import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { Header, Loading } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const StoreList = () => {
  const { token } = useStateContext();
  const navigate = useNavigate();
  const [stores, setStores] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOnCellClick = (params) => {
    switch (params.field) {
      case 'displayName':
        navigate(`/stores/${params.id}`);
        break;

      default:
        break;
    }
  };

  const useStyles = makeStyles({
    red: {
      color: 'red',
    },
  });
  const classes = useStyles();

  useEffect(() => {
    const fetchStores = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/store/`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      setStores(response.data.allStores);
    };
    fetchStores();
  }, [loading, token]);

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
      field: 'displayName',
      headerName: 'Shop Name',
      flex: 1,
      renderCell: function (params) {
        return (
          <div>
            <div className="flex flex-row items-center cursor-pointer">
              <Avatar
                src={params.row.shopImage}
                sx={{ width: 40, height: 40 }}
                className="mr-3"
              />
              {params.row.displayName}
            </div>
          </div>
        );
      },
      valueGetter: function (params) {
        return params.row.displayName;
      },
    },
    {
      field: 'ownerId',
      headerName: 'Shop Owner',
      flex: 1,
      renderCell: function (params) {
        return (
          <div>
            <div className="flex flex-row items-center justify-around ">
              <Avatar
                src={params.row.ownerId.avatar}
                sx={{ width: 40, height: 40 }}
                className="mr-3"
              />
              {params.row.ownerId.fullName}
            </div>
          </div>
        );
      },
      valueGetter: function (params) {
        return params.row.displayName;
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      valueGetter: function (params) {
        if (params.row.phoneNumber === '' || !params.row.phoneNumber)
          return 'Not yet assigned';
        return params.row.phoneNumber;
      },
      flex: 0.5,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      renderCell: function (params) {
        return (
          <div className="grid grid-cols-1">
            <div>{params.row.address.street}</div>
            <div>{params.row.address.district}</div>
            <div>{params.row.address.ward}</div>
            <div>{params.row.address.city}</div>
          </div>
        );
      },
    },
    {
      field: 'ghnShopId',
      headerName: 'GHN Shop Id',
      flex: 0.5,
    },

    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      renderCell: function (params) {
        return (
          <div>
            {params.row.status === 'Active' ? (
              <Chip
                label="Active"
                icon={<CheckCircleIcon />}
                color="success"
                variant="outlined"
              ></Chip>
            ) : (
              <Chip
                label="Deactive"
                icon={<WarningIcon />}
                color="error"
                variant="outlined"
              ></Chip>
            )}
          </div>
        );
      },
      valueGetter: function (params) {
        return params.row.status;
      },
    },
  ];

  return (
    <>
      {stores ? (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
          <ToastContainer />
          <Header category="Page" title="Stores" />
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
                  '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                    py: '22px',
                  },
                }}
                getRowClassName={(params) => {
                  return params.row.accountStatus === 'Deactive'
                    ? classes.red
                    : '';
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
                getRowHeight={() => 'auto'}
                autoHeight
                getRowId={(row) => row._id}
                rows={stores}
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

export default StoreList;
