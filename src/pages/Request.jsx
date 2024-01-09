import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { darken, lighten } from '@mui/material/styles';
import axios from 'axios';
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

import { Loading } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { Header } from '../components';

const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

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

const Request = () => {
  const { token } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(null);
  const [reasonForReject, setReasonForReject] = useState('');
  const [reason, setReason] = useState('');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [requestId, setRequestId] = useState('');

  const handleOnCellClick = async (params) => {
    if (params.field === 'action' && params.value === 2) {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/admin/request/${params.id}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setReason(response.data.storeRequest.reasonForReject);
      setShowReasonModal(true);
    }
  };

  const handleRejectRequest = async () => {
    if (reasonForReject.length <= 0)
      toast.error('Please input your reason for this refusal!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    else {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/admin/reject/${requestId}`,
        method: 'patch',
        headers: {
          Authorization: 'Bearer ' + token,
        },

        data: {
          reasonForReject: reasonForReject,
        },
      });
      console.log(response);
      if (response.status === 200) {
        setShowRejectModal(false);
        toast.success('Refuse sucessfully!', {
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
    }
  };

  const handleAcceptRequest = async () => {
    const response = await axios({
      url: `http://192.168.1.201:3000/api/v1/admin/approve/${requestId}`,
      method: 'patch',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (response.status === 200) {
      setShowAcceptModal(false);
      console.log(response);
      toast.success('Approved sucessfully!', {
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

  const columns = [
    {
      field: 'fullName',
      headerName: 'Requester',
      flex: 1,
      valueGetter: function (params) {
        return params.row.requesterId.fullName;
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Shop Phone Number',
      flex: 1,
    },
    {
      field: 'displayName',
      headerName: 'Shop Name',
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Shop Address',
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
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'shopImage',
      headerName: 'Shop Avatar',
      flex: 0.5,
      align: 'center',
      renderCell: (params) => {
        return <Avatar src={params.row.shopImage} />;
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      flex: 1.2,
      renderCell: (params) => {
        return (
          <div>
            {params.row.status === 'Pending' ? (
              <div className="inline-flex mt-3  ">
                <button
                  onClick={() => {
                    setShowAcceptModal(true);
                    setRequestId(params.row._id);
                  }}
                  className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(true);
                    setRequestId(params.row._id);
                  }}
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div>{params.row.status}</div>
            )}
          </div>
        );
      },
      valueGetter: function (params) {
        switch (params.row.status) {
          case 'Pending':
            return 0;
          case 'Approved':
            return 1;
          case 'Rejected':
            return 2;
          default:
            break;
        }
      },
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/admin/request`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setRequests(response.data.requests);
      console.log('Fetch data');
    };
    fetchOrders();
  }, [token, loading]);

  return (
    <>
      {requests ? (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
          <ToastContainer />
          <Header category="Page" title="Request" />
          <div style={{ display: 'flex', width: '100%' }}>
            <Box
              sx={{
                height: 400,
                width: '100%',
                '& .super-app-theme--Pending': {
                  bgcolor: (theme) =>
                    getBackgroundColor(
                      theme.palette.info.main,
                      theme.palette.mode
                    ),
                  '&:hover': {
                    bgcolor: (theme) =>
                      getHoverBackgroundColor(
                        theme.palette.info.main,
                        theme.palette.mode
                      ),
                  },
                },
                '& .super-app-theme--Approved': {
                  bgcolor: (theme) =>
                    getBackgroundColor(
                      theme.palette.success.main,
                      theme.palette.mode
                    ),
                  '&:hover': {
                    bgcolor: (theme) =>
                      getHoverBackgroundColor(
                        theme.palette.success.main,
                        theme.palette.mode
                      ),
                  },
                },
                '& .super-app-theme--Rejected': {
                  bgcolor: (theme) =>
                    getBackgroundColor(
                      theme.palette.error.main,
                      theme.palette.mode
                    ),
                  '&:hover': {
                    bgcolor: (theme) =>
                      getHoverBackgroundColor(
                        theme.palette.error.main,
                        theme.palette.mode
                      ),
                  },
                },
              }}
            >
              {/* Accept Model */}
              {showAcceptModal ? (
                <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div class="relative p-4 w-full max-w-md h-full md:h-auto">
                      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                          type="button"
                          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                          onClick={() => setShowAcceptModal(false)}
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
                            Are you sure you want to approve this request?
                          </h3>
                          <button
                            type="button"
                            onClick={handleAcceptRequest}
                            class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                          >
                            Yes, I'm sure
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAcceptModal(false)}
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                          >
                            No, cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              ) : null}

              {/* Reject Model */}
              {showRejectModal ? (
                <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div class="relative p-4 w-full max-w-md h-full md:h-auto">
                      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                          type="button"
                          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                          onClick={() => setShowRejectModal(false)}
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
                            Are you sure you want to reject this request? Write
                            the reason for your rejection below
                          </h3>
                          <div className="m-3">
                            <textarea
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Your reason..."
                              onChange={(e) =>
                                setReasonForReject(e.target.value)
                              }
                            ></textarea>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={handleRejectRequest}
                              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                            >
                              Yes, I'm sure
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowRejectModal(false)}
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

              {/* Reject Model */}
              {showReasonModal ? (
                <>
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div class="relative p-4 w-full max-w-md h-full md:h-auto">
                      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                          type="button"
                          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                          onClick={() => setShowReasonModal(false)}
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
                          <h2 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            You has rejected this request.
                          </h2>
                          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Reason : {reason}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
              ) : null}

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
                  rows={requests}
                  columns={columns}
                  pageSize={12}
                  onCellClick={handleOnCellClick}
                  getRowClassName={(params) =>
                    `super-app-theme--${params.row.status}`
                  }
                />
              </div>
            </Box>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};
export default Request;
