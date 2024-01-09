import React, { useEffect, useState } from 'react';
import axios from 'axios';

import moment from 'moment';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'react-slideshow-image/dist/styles.css';
import { Avatar, Rating, Typography } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import { Loading } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const currencyFormat = (number) => {
  return number.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
};

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState(null);
  const path = useLocation().pathname.split('/')[2];
  const { token } = useStateContext();
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/product/admin/${path}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setProduct(response.data.product);
    };
    const fetchReviews = async () => {
      const response = await axios({
        url: `http://192.168.1.201:3000/api/v1/review/admin/${path}`,
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setReviews(response.data.reviews);
    };
    fetchProduct();
    fetchReviews();
  }, [path]);

  return (
    <>
      {product && reviews ? (
        <div className="text-gray-700 body-font overflow-hidden bg-white">
          <div className="container px-5 py-24 mx-auto">
            <div className="grid grid-cols-2">
              <div>
                <Carousel autoPlay>
                  <div>
                    <img src={product.thumbnailImage} alt="error" />
                  </div>
                  {product.detailImages.map((image) => (
                    <div>
                      <img src={image} alt="error" />
                    </div>
                  ))}
                </Carousel>
              </div>

              <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  {product.categoryId.categoryName}\
                  {product.subcategoryId.subcategoryName}
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {product.productName}
                </h1>
                <div className="flex mb-4">
                  <span className="flex items-center">
                    <Rating
                      name="read-only"
                      value={product.rating.ratingValue}
                      readOnly
                      precision={0.5}
                    />
                    <span className="text-gray-600 ml-3">
                      {product.rating.ratingCount} Reviews
                    </span>
                    <span className="text-gray-600 ml-3">
                      {product.soldCount} Sold
                    </span>
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">
                    {currencyFormat(Number(product.price))}
                  </span>
                  <span className="flex ml-auto text-gray-600 ml-3  border-0 py-2 px-6 focus:outline-none  ">
                    {product.numberInStock} Lefts
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center pb-5 border-solid border-4 mb-5"></div>
          <div className>
            <div className=" w-full h-full grid grid-cols-3">
              {reviews &&
                reviews.map((review) => (
                  <div className=" m-4 border-solid border-8 ">
                    <div className="bg-white max-w-xl rounded-2xl px-10 py-8 shadow-lg hover:shadow-2xl transition duration-500 ">
                      <div className="mt-4">
                        <h1 className="text-lg text-gray-700 font-semibold hover:underline cursor-pointer">
                          Product Review
                        </h1>
                        <div className="flex mt-2">
                          <Rating
                            name="read-only"
                            value={review.starPoints}
                            readOnly
                            precision={0.5}
                          />
                        </div>
                        <p className="mt-4 text-md text-gray-600">
                          {review.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="mt-4 flex items-center space-x-4 py-6">
                            <div className="">
                              <Avatar
                                className="w-12 h-12 rounded-full"
                                src={review.reviewerId.avatar}
                                alt=""
                              />
                            </div>
                            <div className="grid grid-col-1 text-sm font-semibold">
                              {review.reviewerId.fullName}
                              <span className="font-normal">
                                {' '}
                                5 minutes ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ProductDetail;
