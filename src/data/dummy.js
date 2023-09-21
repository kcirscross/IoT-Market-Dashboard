import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FiShoppingBag } from 'react-icons/fi';
import { RiContactsLine } from 'react-icons/ri';

export const links = [
  {
    title: 'Dashboard',
    links: [
      {
        name: 'ecommerce',
        icon: <FiShoppingBag />,
      },
    ],
  },

  {
    title: 'Pages',
    links: [
      {
        name: 'orders',
        icon: <AiOutlineShoppingCart />,
      },
      {
        name: 'customers',
        icon: <RiContactsLine />,
      },
      {
        name: 'stores',
        icon: <RiContactsLine />,
      },
      {
        name: 'Request',
        icon: <AiOutlineShoppingCart />,
      },
    ],
  },
];
