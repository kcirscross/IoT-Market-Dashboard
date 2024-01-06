import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStateContext } from '../contexts/ContextProvider';
import validator from 'validator';

import loginImg from '../assets/login.jpg';
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';
import axios from 'axios';

export default function Login() {
  const { currentColor, setToken } = useStateContext();

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(email)) setErrorMessage('Please input valid email');
    else {
      dispatch(loginStart());
      try {
        const response = await axios({
          url: `http://192.168.1.202:3000/api/v1/auth/signin`,
          method: 'post',
          data: {
            email,
            password,
          },
        });

        if (!response.data.data.roles.includes('Admin')) {
          setErrorMessage('This user is not an admin');
          dispatch(loginFailure());
        } else {
          dispatch(loginSuccess(response.data.data));
          setToken(response.data.token);
          navigate('/');
        }
      } catch (error) {
        dispatch(loginFailure());
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-90 ">
      <img
        className="absolute w-full h-full object-cover mix-blend-overlay brightness-50"
        src={loginImg}
        alt="/"
      />

      <div className="flex justify-center items-center h-full">
        <form className="max-w-[400px] w-full mx-auto bg-white p-8">
          <div className="flex justify-center items-center">
            <img
              width="70%"
              height="70%"
              src="https://firebasestorage.googleapis.com/v0/b/iotmarket-10501.appspot.com/o/logo.jpg?alt=media&token=562f373b-6b97-459e-8dd0-1dffac4f9092"
              alt="/"
            />
          </div>

          <div>
            {errorMessage && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong class="font-bold">{errorMessage}</strong>
              </div>
            )}
          </div>

          <div className="flex flex-col mb-4 text-black">
            <label>Email</label>
            <input
              className="border relative bg-gray-100 p-2"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col ">
            <label>Password</label>
            <input
              className="border relative bg-gray-100 p-2"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full py-3 mt-8  hover:bg-indigo-500 relative text-white"
            style={{ backgroundColor: currentColor }}
            onClick={handleLogin}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
