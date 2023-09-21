import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAIL,
} from '../redux/orderDetailSlice';
import { useStateContext } from '../contexts/ContextProvider';
import { Avatar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Loading } from '../components';

const OrderDetail = () => {
  const currentOrder = useSelector((state) => state.orderDetail.currentOrder);

  const { token } = useStateContext();
  const path = useLocation().pathname.split('/')[2];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderDetail = async () => {
      dispatch(ORDER_DETAIL_REQUEST());
      try {
        const response = await axios({
          url: `https://iotmarket.herokuapp.com/api/v1/order/detailAdmin/${path}`,
          method: 'get',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        dispatch(ORDER_DETAIL_SUCCESS(response.data.order));
        console.log(response.data.order);
      } catch (error) {
        dispatch(ORDER_DETAIL_FAIL());
      }
    };
    fetchOrderDetail();
  }, [path, dispatch]);
  const currencyFormat = (number) => {
    return number.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
  };

  return (
    <>
      {currentOrder ? (
        <div class="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
          <div class="flex justify-start item-start space-y-2 flex-col">
            <h1 class="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
              Order {currentOrder?.deliveryCode}
            </h1>
            <p class="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
              21st Mart 2021 at 10:34 PM
            </p>
          </div>
          <div class="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
            <div class="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
              <div class="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                <p class="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                  Customer’s Cart
                </p>

                {currentOrder.productsList.map((product) => (
                  <>
                    <div class="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                      <div class="pb-4 md:pb-8 w-full md:w-40">
                        <img
                          class="w-full hidden md:block"
                          src={product.name.thumbnailImage}
                          alt="error"
                        />
                        <img
                          class="w-full md:hidden"
                          src={product.name.thumbnailImage}
                          alt="error"
                        />
                      </div>

                      <div class="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                        <div class="w-full flex flex-col justify-start items-start space-y-8">
                          <h3
                            onClick={() =>
                              navigate(`/products/${product.name._id}`)
                            }
                            class="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800"
                          >
                            {product?.name.productName}
                          </h3>
                          <div class="flex justify-start items-start flex-col space-y-2 whitespace-pre-line">
                            <p class="text-sm dark:text-white leading-none text-gray-800">
                              <span class="dark:text-gray-400 font-bold ">
                                Description:{' '}
                              </span>
                              {'\n\n'}
                              {product?.name.description}
                            </p>
                            <p class="text-sm dark:text-white leading-none text-gray-800">
                              <span class="dark:text-gray-400 font-bold">
                                Condition:{' '}
                              </span>{' '}
                              {product?.name.condition}
                            </p>
                            <p class="text-sm dark:text-white leading-none text-gray-800">
                              <span class="dark:text-gray-400 font-bold">
                                Rating:{' '}
                              </span>{' '}
                              {product?.name.rating.ratingValue}
                            </p>
                          </div>
                        </div>
                        <div class="flex justify-between space-x-8 items-start w-full">
                          <p class="text-base dark:text-white xl:text-lg leading-6">
                            {currencyFormat(Number(product.name.price))}
                          </p>
                          <p class="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
                            {product.quantity}
                          </p>
                          <p class="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                            {currencyFormat(
                              Number(product?.name.price) * product?.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <div class="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                <div class="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                  <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                    Summary
                  </h3>

                  <div class="flex justify-between items-center w-full">
                    <p class="text-base dark:text-white font-semibold leading-4 text-gray-800">
                      Order Total
                    </p>
                    <p class="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                      {currencyFormat(currentOrder.VNPay.vnp_Amount / 100)}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                  <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                    Shipping
                  </h3>
                  <div class="flex justify-between items-start w-full">
                    <div class="flex justify-center items-center space-x-4">
                      <div class="w-8 h-8">
                        <img
                          class="w-full h-full"
                          alt="logo"
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Orange.png"
                        />
                      </div>
                      <div class="flex flex-col justify-start items-center">
                        <p class="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                          Giao Hang Nhanh
                          <br />
                          <span class="font-normal">
                            Delivery Code: {currentOrder?.deliveryCode}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
              <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                Customer
              </h3>
              <div class="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                <div class="flex flex-col justify-start items-start flex-shrink-0">
                  <div class="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                    <Avatar src={currentOrder?.userId.avatar} alt="avatar" />
                    <div class="flex justify-start items-start flex-col space-y-2">
                      <p class="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">
                        {currentOrder?.userId.fullName}
                      </p>
                      <p class="text-sm dark:text-gray-300 leading-5 text-gray-600">
                        {currentOrder?.userId.accountStatus}
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 7L12 13L21 7"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p class="cursor-pointer text-sm leading-5 ">
                      {currentOrder?.userId.email}
                    </p>
                  </div>
                </div>
                <div class="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                  <div class="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                    <div class="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                      <p class="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                        Shipping Address
                      </p>
                      <p class="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                        {`${currentOrder?.userId.address.street}, ${currentOrder?.userId.address.district}, ${currentOrder?.userId.address.ward}, ${currentOrder?.userId.address.city}.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
              <h3 class="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                Seller
              </h3>
              <div class="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                <div class="flex flex-col justify-start items-start flex-shrink-0">
                  <div class="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                    <Avatar
                      src={
                        currentOrder?.ownerId.avatar
                          ? currentOrder?.ownerId.avatar
                          : currentOrder?.ownerId.shopImage
                      }
                      alt="avatar"
                    />
                    <div class="flex justify-start items-start flex-col space-y-2">
                      <p
                        onClick={() =>
                          navigate(`/stores/${currentOrder.ownerId._id}`)
                        }
                        class="text-base dark:text-white font-semibold leading-4 text-left text-gray-800"
                      >
                        {currentOrder?.ownerId.fullName
                          ? currentOrder?.ownerId.fullName
                          : currentOrder?.ownerId.displayName}
                      </p>
                      <p class="text-sm dark:text-gray-300 leading-5 text-gray-600">
                        {currentOrder?.ownerId.accountStatus
                          ? currentOrder?.ownerId.accountStatus
                          : currentOrder?.ownerId.status}
                      </p>
                    </div>
                  </div>

                  <div class="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3 7L12 13L21 7"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p class="cursor-pointer text-sm leading-5 ">
                      {currentOrder?.ownerId.email
                        ? currentOrder?.ownerId.email
                        : currentOrder?.ownerId.phoneNumber}
                    </p>
                  </div>
                </div>
                <div class="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                  <div class="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                    <div class="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                      <p class="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                        Address
                      </p>
                      <p class="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                        {`${currentOrder?.ownerId.address.street}, ${currentOrder?.ownerId.address.district}, ${currentOrder?.ownerId.address.ward}, ${currentOrder?.ownerId.address.city}.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default OrderDetail;
