import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarRightCollapse,
} from 'react-icons/tb';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { logout } from '../redux/userSlice';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    setScreenSize,
    screenSize,
    setToken,
  } = useStateContext();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  const handleLogout = async () => {
    dispatch(logout());
    setToken('');
    navigate('/');
  };

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      {activeMenu === true ? (
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          color={currentColor}
          icon={<TbLayoutSidebarRightExpand />}
        />
      ) : (
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          color={currentColor}
          icon={<TbLayoutSidebarRightCollapse />}
        />
      )}

      <div className="flex">
       
       
        <div className="relative group h-0">
          <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg ">
            <img
              className="rounded-full w-8 h-8"
              src={currentUser.avatar}
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Welcome,</span>{' '}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {currentUser.fullName}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>

          <div
            className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block "
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex="-1"
          >
            <div className="py-1" role="none">
              <button
                type="submit"
                className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
                role="menuitem"
                tabIndex="-1"
                id="menu-item-3"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* {isClicked.cart && <Cart />}
        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />} */}
      </div>
    </div>
  );
};

export default Navbar;
