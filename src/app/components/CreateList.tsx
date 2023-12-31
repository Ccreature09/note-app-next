import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase/firebase';
import { Auth } from '../firebase/Auth';
import { Poiret_One } from 'next/font/google';

type FCProps = {
   theme: string;
};
type UserInfo = {
   isAnonymous: boolean;
   uid: string;
};

const poiret_One = Poiret_One({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-poiret'
});

export const CreateList: React.FC<FCProps> = ({ theme }) => {
   const userInfo = Auth() as UserInfo | null;

   const [listName, setListName] = useState<string>('');
   const [error, setError] = useState<string>('');
   const [listType, setListType] = useState('individual');
   const [showOverlay, setShowOverlay] = useState(false);
   const [listMembers, setListMembers] = useState<string[]>([]);

   const toggleOverlay = () => {
      setListType('individual');
      setShowOverlay(!showOverlay);

      setError('');
   };

   const handleCreateList = () => {
      if (listName.trim() === '') {
         setError('Please enter a valid list name.');
         return;
      }

      const newList = {
         id: '',
         title: listName,
         type: listType,
         members: listMembers
      };

      const listsRef = ref(
         database,
         `${userInfo?.isAnonymous ? 'guests' : 'users'}/${userInfo?.uid}/lists`
      );
      const listRef = push(listsRef);
      newList.id = listRef.key as string;

      set(listRef, newList);

      setListName('');
      setListType('individual');
      setListMembers([]);
      toggleOverlay();
   };

   return (
      <div className="relative">
         {userInfo && (
            <button
               onClick={toggleOverlay}
               className={`mb-4 border-none p-2 rounded text-2xl w-full font-sans ${
                  poiret_One.variable
               } ${
                  theme == 'ocean'
                     ? 'bg-[#70A9A1] text-[#f0e9d6]'
                     : theme == 'light'
                     ? 'bg-[#1e2124] text-[#f0e9d6]'
                     : theme == 'dark' && 'bg-[#f0e9d6] text-gray-800'
               }`}
            >
               Create List
            </button>
         )}

         {showOverlay && userInfo && (
            <div className="fixed top-0 left-0 w-full h-full bg-[rgba(60,84,150,0.48)] flex justify-center items-center">
               <div
                  className={`  rounded-xl p-10 w-full max-w-lg ${
                     theme == 'ocean'
                        ? 'bg-[#1D3557] text-[#f0e9d6]'
                        : theme == 'light'
                        ? 'bg-[#f0e9d6]'
                        : theme == 'dark' && 'bg-gray-800 text-[#f0e9d6]'
                  }`}
               >
                  <div
                     className={`${
                        theme == 'ocean'
                           ? 'bg-[#1D3557] text-[#f0e9d6]'
                           : theme == 'light'
                           ? 'bg-[#f0e9d6]'
                           : theme == 'dark' && 'bg-gray-800 text-[#f0e9d6]'
                     }`}
                  >
                     <p
                        className={`text-center text-7xl font-sans ${poiret_One.variable} font-black mb-6 `}
                     >
                        What is the list&apos;s name?
                     </p>
                     <input
                        type="text"
                        placeholder="Shopping List"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="text-center rounded-lg w-full text-gray-800 font-bold text-5xl bg-[#f0e9d6] mb-5"
                     />
                     {error && <p className="text-red-500">{error}</p>}
                     <div className="flex">
                        <label
                           className={` mx-2 ${
                              theme == 'ocean'
                                 ? 'bg-[#70A9A1]'
                                 : theme == 'light'
                                 ? 'bg-gray-800 text-[#f0e9d6]'
                                 : theme == 'dark' &&
                                   'bg-[#f0e9d6] text-gray-800'
                           } rounded-2xl ${
                              userInfo.isAnonymous ? 'w-full' : 'w-1/2'
                           }`}
                        >
                           <input
                              className={`w-full font-sans ${poiret_One.variable}`}
                              type="radio"
                              name="listType"
                              value="individual"
                              checked={listType === 'individual'}
                              onChange={() => setListType('individual')}
                           />
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-full h-6"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                           </svg>
                           <p
                              className={`text-center text-3xl font-sans ${poiret_One.variable}`}
                           >
                              Individual
                           </p>
                        </label>
                        {!userInfo.isAnonymous && (
                           <label
                              className={`w-1/2 mx-2  rounded-2xl ${
                                 theme == 'ocean'
                                    ? 'bg-[#70A9A1]'
                                    : theme == 'light'
                                    ? 'bg-gray-800 text-[#f0e9d6]'
                                    : theme == 'dark' &&
                                      'bg-[#f0e9d6] text-gray-800'
                              }`}
                           >
                              <input
                                 className="w-full"
                                 type="radio"
                                 name="listType"
                                 value="group"
                                 checked={listType === 'group'}
                                 onChange={() => setListType('group')}
                              />
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-full h-6"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                                 />
                              </svg>
                              <p
                                 className={`text-center text-3xl font-sans ${poiret_One.variable}`}
                              >
                                 Group
                              </p>
                           </label>
                        )}
                     </div>
                     {/* {listType === 'group' && (
                        <div className="mt-4">
                           <h3 className="text-lg font-semibold mb-2 text-center">
                              List Members (separate with comma):
                           </h3>
                           {listMembers.length > 0 && (
                              <div className="overflow-x-auto">
                                 <ul className="list-none flex flex-wrap gap-3 mb-3">
                                    {listMembers.map((member, index) => (
                                       <li
                                          className="hover:bg-slate-300 transition-all duration-200 cursor-pointer text-3xl font-bold bg-slate-200 p-4 rounded-lg flex-grow text-center"
                                          key={index}
                                       >
                                          {member}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           )}

                           <input
                              type="text"
                              placeholder="Enter email"
                              value={listMembers.join(', ')}
                              onChange={(e) => {
                                 const inputValue = e.target.value;
                                 const membersArray = inputValue
                                    ? inputValue
                                         .split(',')
                                         .map((member) => member.trim())
                                    : [];
                                 setListMembers(membersArray);
                              }}
                              className="text-center w-full text-5xl mb-5"
                           />
                        </div>
                     )} */}

                     <div className="flex mt-5">
                        <button
                           className={`bg-blue-600 text-[#f0e9d6] p-2 mx-2 font-semibold rounded text-4xl w-1/2 font-sans ${poiret_One.variable}`}
                           onClick={handleCreateList}
                        >
                           Create List
                        </button>
                        <button
                           className={`bg-blue-600 text-[#f0e9d6] p-2 text-4xl font-semibold mx-2 rounded w-1/2 font-sans ${poiret_One.variable}`}
                           onClick={toggleOverlay}
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
