import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();

  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="flex flex-wrap justify-between items-center ">
          <div className="bg-white shadow-2xl border-2 border-indigo-500/100 h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 mr-2 pt-8 ">
            <iframe
              width="100%"
              height="100%"
              src="https://charts.mongodb.com/charts-iotmarket-pdpec/embed/charts?id=63733a03-8cc5-4a1e-8420-06ffb4fee975&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"
            ></iframe>
          </div>
          <div className="bg-white h-44 shadow-2xl border-2 border-blue-500/100  dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 mr-2 pt-8">
            <iframe
              width="100%"
              height="100%"
              src="https://charts.mongodb.com/charts-iotmarket-pdpec/embed/charts?id=63733da9-e681-4be9-808a-94288af0afa1&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"
            ></iframe>
          </div>
          <div className="bg-white h-44 shadow-2xl border-2 border-indigo-500/100  dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 mr-2 pt-8">
            <iframe
              width="100%"
              height="100%"
              src="https://charts.mongodb.com/charts-iotmarket-pdpec/embed/charts?id=63733f0a-e272-4f18-8532-520fb940f3bd&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"
            ></iframe>
          </div>
          <div className="bg-white h-44 shadow-2xl border-2 border-blue-500/100  dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 mr-2 pt-8">
            <iframe
              width="100%"
              height="100%"
              src="https://charts.mongodb.com/charts-iotmarket-pdpec/embed/charts?id=6373405a-f4e1-4858-804a-2b183b25baef&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="flex lg:flex-nowrap justify-center items-center mt-12">
        <div className="grid grid-cols-2 gap-4 "></div>
        <div>
          <iframe
            style={{
              background: '#FFFFFF',
              border: 'none',
              borderRadius: '2px',
              boxShadow: '0 2px 10px rgba(70,76,79,.2)',
            }}
            width="620"
            height="480"
            className="shadow-2xl"
            src="https://charts.mongodb.com/charts-iotmarket-pdpec/embed/charts?id=63731340-f412-4173-8ab6-7c4cd84ad572&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"
          ></iframe>
        </div>
        <div className="ml-2">
          <iframe
            style={{
              background: '#FFFFFF',
              border: 'none',
              borderRadius: '2px',
              boxShadow: '0 2px 10px rgba(70,76,79,.2)',
            }}
            width="620"
            height="480"
            className="shadow-2xl"
            src="https://charts.mongodb.com/charts-iotmarket-pdpec/embed/charts?id=637d8ede-eec5-41cc-8886-a1b388e26473&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"
          ></iframe>
        </div>
      </div>

      <div className=" max-w-[1240px] mx-auto mt-12 flex items-center justify-center ">
        <iframe
          className="w-[1240px] h-[480px] border-solid border-2"
          style={{
            background: '#FFFFFF',
            borderRadius: '2px',
            boxShadow: '0 2px 10px rgba(70,76,79,.2)',
          }}
          src="https://charts.mongodb.com/charts-iotmarket-pdpec/embed/charts?id=6380315f-aedb-4dea-8d70-953a5d7b8c29&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"
        ></iframe>
      </div>
    </div>
  );
};

export default Ecommerce;
