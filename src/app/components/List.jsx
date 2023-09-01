'use client';

import { useState, useEffect } from 'react';
import { onValue, ref, push, remove } from 'firebase/database';
import { database } from '../firebase/firebase';
import { Auth } from '../firebase/Auth';

export const List = ({ listInfo, theme }) => {
   const userInfo = Auth();
   const isAnonymous = userInfo && userInfo.isAnonymous;
   const listID =
      listInfo && listInfo.listID
         ? JSON.stringify(listInfo.listID).replace(/['"]+/g, '')
         : '';
   const listUID =
      listInfo && listInfo.uid
         ? JSON.stringify(listInfo.uid).replace(/['"]+/g, '')
         : '';

   const [inputValue, setInputValue] = useState('');
   const [error, setError] = useState('');
   const [reminderTime, setReminderTime] = useState('');
   const [items, setItems] = useState([]);
   const [reminder, setReminder] = useState(false);

   const addItem = () => {
      const ListInDB = ref(
         database,
         `${
            userInfo.isAnonymous ? 'guests' : 'users'
         }/${listUID}/lists/${listID}/items`
      );
      if (inputValue.trim() === '') {
         setError('Please enter a valid item.');
         return;
      }
      const reminderDate = new Date(reminderTime);

      const newReminder = {
         name: inputValue,
         time: reminderDate.getTime(),
         formattedTime: ` ${reminderDate.getDate()} ${reminderDate.toLocaleString(
            'default',

            {
               month: 'long',
               hour: 'numeric',
               minute: 'numeric',
               hour12: true
            }
         )}`,
         notified: false
      };
      const newNote = {
         name: inputValue
      };

      if (reminderTime !== '') {
         push(ListInDB, newReminder);
      } else {
         push(ListInDB, newNote);
      }

      setInputValue('');
      setReminderTime('');
      setReminder(false);
   };

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         addItem();
      }
   };

   const handleInputFocus = () => {
      setError('');
   };

   const removeItem = (itemId) => {
      const exactLocationOfItemInDB = ref(
         database,
         `${
            isAnonymous ? 'guests' : 'users'
         }/${listUID}/lists/${listID}/items/${itemId}`
      );
      remove(exactLocationOfItemInDB);
   };

   useEffect(() => {
      const listRef = ref(
         database,
         `${isAnonymous ? 'guests' : 'users'}/${listUID}/lists/${listID}/items`
      );
      onValue(listRef, (snapshot) => {
         if (snapshot.exists()) {
            const listData = snapshot.val();
            const itemList = Object.entries(listData);
            setItems(itemList);
         } else {
            setItems([]);
         }
      });
   }, [isAnonymous, listID, listUID]);

   return (
      <>
         {listID.length > 2 && listUID.length > 2 && (
            <div>
               <div className="flex">
                  <input
                     className="font-sans block p-4 rounded-lg text-xl text-center mb-3 text-[#432000] w-full bg-[#F1FAEE]"
                     type="text"
                     placeholder="Bread"
                     value={inputValue}
                     onChange={(e) => setInputValue(e.target.value)}
                     onKeyDown={handleKeyPress}
                     onFocus={handleInputFocus}
                     maxLength={30}
                  />
                  <button
                     onClick={() => {
                        setReminder(!reminder);
                     }}
                  >
                     {reminder ? (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-8 h-1/2 rounded bg-[#F1FAEE] ml-2 mb-3 "
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                           />
                        </svg>
                     ) : (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-8 h-1/2 rounded bg-[#F1FAEE] ml-2 mb-3"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
                           />
                        </svg>
                     )}
                  </button>
               </div>
               {reminder && (
                  <div className="flex">
                     <input
                        type="datetime-local"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        size="100"
                        className=" text-lg text-center m-auto  rounded mb-4 "
                     />
                  </div>
               )}

               {error && <p className="text-red-500">{error}</p>}
               <button
                  onClick={addItem}
                  className={`p-4 rounded-lg text-xl text-center mb-3  ${
                     theme === 'ocean'
                        ? 'bg-[#1D3557] text-[#f0e9d6]'
                        : theme === 'light'
                        ? 'bg-[#1e2124] text-[#f0e9d6] '
                        : theme === 'dark'
                        ? 'bg-[#f0e9d6] text-[#1e2124]'
                        : ''
                  } w-full`}
               >
                  <p>Add to List</p>
               </button>
               <ul className="list-none flex flex-wrap gap-3">
                  {items.map(([itemId, item]) => (
                     <li
                        key={itemId}
                        onClick={() => removeItem(itemId)}
                        className={`hover:bg-[#E63946] transition-all duration-200 cursor-pointer text-xl  p-4 rounded-lg flex-grow text-center ${
                           theme == 'ocean'
                              ? 'bg-[#70A9A1] text-[#f0e9d6]'
                              : theme == 'light'
                              ? 'bg-[#f0e9d6] text-[#1e2124]'
                              : theme == 'dark' && 'bg-[#1e2124] text-[#f0e9d6]'
                        }`}
                     >
                        <div>{item.name}</div>
                        {item.formattedTime && (
                           <div className="text-blue-500">
                              {item.formattedTime}
                           </div>
                        )}
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </>
   );
};
