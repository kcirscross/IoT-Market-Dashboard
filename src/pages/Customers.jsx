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

const Orders = () => {
  const { token } = useStateContext();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(null);
  const [userId, setUserId] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnCellClick = (params) => {
    setUserId(params.id);
    switch (params.field) {
      case 'deliveryCode':
        navigate(`/orders/${userId}`);
        break;
      case 'accountStatus':
        if (params.value === 'Active') setShowBanModal(true);
        else setShowUnbanModal(true);
        break;
      case 'storeId':
        if (params.value !== '1') navigate(`/stores/${params.row.storeId._id}`);
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

  const handleBanRequest = async () => {
    const response = await axios({
      url: `http://192.168.1.202:3000/api/v1/admin/ban/${userId}`,
      method: 'patch',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (response.status === 200) {
      setShowBanModal(false);
      console.log(response);
      toast.success('Ban user sucessfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setLoading(!loading);
    } else {
      toast.error('Some error happened in database!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const handleUnbanRequest = async () => {
    const response = await axios({
      url: `http://192.168.1.202:3000/api/v1/admin/unban/${userId}`,
      method: 'patch',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (response.status === 200) {
      setShowUnbanModal(false);
      console.log(response);
      toast.success('Unban user sucessfully!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setLoading(!loading);
    } else {
      toast.error('Some error happened in database!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const classes = useStyles();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios({
        url: `http://192.168.1.202:3000/api/v1/user`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      setCustomers(response.data.users);
    };
    fetchOrders();
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
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
      renderCell: function (params) {
        return (
          <div>
            <div className="flex flex-row items-center ">
              <Avatar
                className="mr-3"
                src={params.row.avatar}
                sx={{ width: 40, height: 40 }}
              />
              {params.row.fullName}
            </div>
          </div>
        );
      },
      valueGetter: function (params) {
        return params.row.fullName;
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      valueGetter: function (params) {
        if (params.row.phoneNumber === '' || !params.row.phoneNumber)
          return 'Not yet assigned';
        return params.row.phoneNumber;
      },
      flex: 1,
    },
    {
      field: 'gender',
      headerName: 'Gender',
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
      field: 'storeId',
      headerName: 'Store',
      flex: 1,
      renderCell: function (params) {
        return (
          <div>
            {params.row.storeId ? (
              <div className="flex flex-row items-center cursor-pointer ">
                <Avatar
                  src={params.row.storeId.shopImage}
                  sx={{ width: 40, height: 40 }}
                  className="mr-3"
                />
                {params.row.storeId.displayName}
              </div>
            ) : (
              <div>Not A Store Owner</div>
            )}
          </div>
        );
      },
      valueGetter: function (params) {
        return params.row.storeId ? params.row.storeId.displayName : '1';
      },
    },
    {
      field: 'accountStatus',
      headerName: 'Status',
      flex: 0.7,
      renderCell: function (params) {
        return (
          <div className="cursor-pointer">
            {params.row.accountStatus === 'Active' ? (
              <Chip
                className="cursor-pointer"
                label="Active"
                icon={<CheckCircleIcon />}
                color="success"
                variant="outlined"
              ></Chip>
            ) : (
              <Chip
                className="cursor-pointer"
                label="BAN"
                icon={<WarningIcon />}
                color="error"
                variant="outlined"
              ></Chip>
            )}
          </div>
        );
      },
      valueGetter: function (params) {
        return params.row.accountStatus;
      },
    },
  ];

  return (
    <>
      {customers ? (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
          <ToastContainer />
          <Header category="Page" title="Customers" />
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
                  return params.row.accountStatus === 'BAN' ? classes.red : '';
                }}
                components={{
                  Toolbar: CustomToolbar,
                }}
                getRowHeight={() => 'auto'}
                autoHeight
                getRowId={(row) => row._id}
                rows={customers}
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
      <div>
        {/* Ban Model */}
        {showBanModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div class="relative p-4 w-full max-w-md h-full md:h-auto">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    onClick={() => setShowBanModal(false)}
                  >
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                  <div class="p-6 text-center">
                    <svg
                      aria-hidden="true"
                      class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to ban this user?
                    </h3>

                    <div>
                      <button
                        type="button"
                        onClick={handleBanRequest}
                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBanModal(false)}
                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>

      <div>
        {/* Unban Model */}
        {showUnbanModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div class="relative p-4 w-full max-w-md h-full md:h-auto">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    onClick={() => setShowUnbanModal(false)}
                  >
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                  <div class="p-6 text-center">
                    <svg
                      aria-hidden="true"
                      class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to unban this user?
                    </h3>

                    <div>
                      <button
                        type="button"
                        onClick={handleUnbanRequest}
                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUnbanModal(false)}
                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  );
};
export default Orders;
