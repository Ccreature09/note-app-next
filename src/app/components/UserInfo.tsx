import { useState } from 'react';
import { Auth } from '../firebase/Auth';

import Image from 'next/image';

type FCProps = {
   setSettings: (settings: boolean) => void;
   theme: string;
};
type UserInfo = {
   displayName: string;
   email: string;
   isAnonymous: boolean;
   photoURL: string;
};

export const UserInfo: React.FC<FCProps> = ({ setSettings, theme }) => {
   const userInfo = Auth() as UserInfo | null;

   const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);
   return (
      <div>
         {userInfo && userInfo.isAnonymous && (
            <svg
               width="100px"
               height="100px"
               viewBox="0 0 16 16"
               className="p-3 w-auto mb-3"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.371 1.072a1 1 0 00-1.32.612L2.28 7H1a1 1 0 000 2h14a1 1 0 100-2h-1.28l-1.77-5.316a1 1 0 00-1.32-.612L8 2.123 5.371 1.072zM11.613 7l-1.226-3.678-2.016.806a1 1 0 01-.742 0l-2.016-.806L4.387 7h7.226z"
                  fill="#000000"
               />
               <path
                  d="M2 11a1 1 0 100 2c.552 0 .98.475 1.244.959A2 2 0 005 15h.558a2 2 0 001.898-1.367l.105-.317a.463.463 0 01.878 0l.105.316A2 2 0 0010.441 15H11a2 2 0 001.755-1.041c.266-.484.693-.959 1.245-.959a1 1 0 100-2H2z"
                  fill="#000000"
               />
            </svg>
         )}

         {userInfo && !userInfo.isAnonymous && (
            <div
               className="flex items-center justify-center space-x-4 mb-6"
               onClick={() => {
                  setSettings(true);
                  setShowSettingsOverlay(!showSettingsOverlay);
                  if (showSettingsOverlay) {
                     setSettings(false);
                     setShowSettingsOverlay(false);
                  }
               }}
            >
               <Image
                  className="rounded-full"
                  src={userInfo.photoURL}
                  width={64}
                  height={64}
                  alt="Picture of the author"
               />
               <div className="flex flex-col">
                  <p
                     className={`text-[#F1FAEE] font-black text-2xl ${
                        theme == 'ocean'
                           ? 'text-[#f0e9d6]'
                           : theme == 'light'
                           ? 'text-gray-800'
                           : theme == 'dark' && 'text-[#f0e9d6]'
                     } `}
                  >
                     {userInfo.displayName}
                  </p>
                  <p
                     className={`text-[#F1FAEE] text-base truncate md:w-auto ${
                        theme == 'ocean'
                           ? 'text-[#f0e9d6]'
                           : theme == 'light'
                           ? 'text-gray-800'
                           : theme == 'dark' && 'text-[#f0e9d6]'
                     }`}
                  >
                     {userInfo.email}
                  </p>
               </div>
            </div>
         )}
      </div>
   );
};
