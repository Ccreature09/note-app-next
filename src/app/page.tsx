'use client';
import { useState, useEffect, useCallback } from 'react';
import { List } from './components/List';
import { Sidebar } from './components/Sidebar';
import { Auth } from './firebase/Auth';
import Image from 'next/image';
import octupus from './images/octupus.png';
import { Themes } from './components/Themes';

type ListInfo = {
   listID: string;
   uid: string;
};

export default function Home() {
   const [selectedListID, setSelectedListID] = useState<ListInfo>();
   const memoizedSetSelectedListID = useCallback(
      (newSelectedListID: ListInfo) => {
         setSelectedListID(newSelectedListID);
      },
      []
   );

   const [notificationPermission, setNotificationPermission] =
      useState('default');
   const [theme, setTheme] = useState('ocean');
   const [settings, setSettings] = useState(false);
   const userInfo = Auth();

   useEffect(() => {
      if ('serviceWorker' in navigator) {
         navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
               console.log(
                  'Service Worker registered with scope:',
                  registration.scope
               );
            })
            .catch((error) => {
               console.error('Service Worker registration failed:', error);
            });
      }
      if ('Notification' in window) {
         Notification.requestPermission().then((permission) => {
            setNotificationPermission(permission);
         });
      }
   }, []);

   return (
      <>
         <div
            className={`flex flex-col md:flex-row bg-gradient-to-b  min-h-screen ${
               theme == 'ocean'
                  ? 'from-[#A8DADC] to-[#1D3557]'
                  : theme == 'light'
                  ? 'from-[#a8edea] to-[#fed6e3]'
                  : theme == 'dark' && 'from-[#6b6d70] to-[#282b30]'
            }`}
         >
            <div>
               <Sidebar
                  setSelectedListID={memoizedSetSelectedListID}
                  theme={theme}
                  setSettings={setSettings}
               />
            </div>

            <div className="flex flex-col flex-grow max-w-xs h-auto mx-auto justify-center my-10">
               <Image
                  width={160}
                  height={160}
                  src={octupus}
                  priority={true}
                  className="w-32 h-32 mx-auto mb-5"
                  alt=""
               />
               {settings && <Themes setTheme={setTheme}></Themes>}

               <div className="flex justify-center md:items-center  w-full">
                  {selectedListID && userInfo && (
                     <List ListInfo={selectedListID} theme={theme} />
                  )}
               </div>
            </div>
         </div>
      </>
   );
}
