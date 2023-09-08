import { useState, useCallback } from 'react';
import { Auth, GoogleAuthButton, GuestAuthButton } from '../firebase/Auth';

import { Monoton } from 'next/font/google';

import { CreateList } from './CreateList';
import { MemberList } from './MemberList';
import { UserInfo } from './UserInfo';
import { UserLists } from './UserLists';

const monoton = Monoton({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-monoton'
});

type FCProps = {
   theme: string;
   setSelectedListID: (newSelectedListID: ListInfo) => void;
   setSettings: (settings: boolean) => void;
};
type ListInfo = {
   listID: string;
   uid: string;
};

export const Sidebar: React.FC<FCProps> = ({
   setSelectedListID,
   theme,
   setSettings
}) => {
   const userInfo = Auth();
   const [localSelectedListID, setLocalSelectedListID] = useState<ListInfo>();
   const [memberList, setMemberList] = useState(false);

   const memoizedSetSelectedListID = useCallback(
      (newSelectedListID: ListInfo) => {
         setLocalSelectedListID(newSelectedListID);
         setSelectedListID(newSelectedListID);
      },
      []
   );

   return (
      <div
         className={`flex flex-col p-4 ${
            theme === 'ocean'
               ? 'bg-[#1D3557]'
               : theme === 'light'
               ? 'bg-[#f0e9d6]'
               : theme === 'dark'
               ? 'bg-[#1e2124]'
               : ''
         } md:h-screen w-full md:w-64 transition-all duration-200 font-sans`}
      >
         <h1
            className={` ${monoton.variable} ${
               theme === 'ocean' || theme === 'dark'
                  ? 'text-[#f0e9d6]'
                  : theme === 'light'
                  ? 'text-gray-800'
                  : ''
            } font-mono text-3xl font-medium text-center mb-5 `}
         >
            Octonotes
         </h1>

         <hr
            className={`${
               theme === 'ocean' || theme === 'dark'
                  ? 'border-[#f0e9d6]'
                  : theme === 'light'
                  ? 'border-gray-800'
                  : ''
            }`}
         />
         <br />

         <UserInfo setSettings={setSettings} theme={theme}></UserInfo>

         {!userInfo ? (
            <>
               <GoogleAuthButton></GoogleAuthButton>
               <GuestAuthButton></GuestAuthButton>
            </>
         ) : userInfo.isAnonymous ? (
            <GuestAuthButton />
         ) : (
            <GoogleAuthButton />
         )}

         {memberList && (
            <MemberList selectedList={localSelectedListID}></MemberList>
         )}

         <CreateList theme={theme}></CreateList>

         <div>
            <UserLists
               theme={theme}
               setSelectedListID={memoizedSetSelectedListID}
               setMemberList={setMemberList}
            ></UserLists>
         </div>
      </div>
   );
};
