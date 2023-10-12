import { useState, useEffect } from 'react';

import { Auth } from '../firebase/Auth';
import {
   ref,
   remove,
   onValue,
   update,
   DatabaseReference
} from 'firebase/database';
import { database } from '../firebase/firebase';
import { Poiret_One } from 'next/font/google';

const poiret_One = Poiret_One({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-poiret'
});

type UserInfo = {
   displayName: string;
   email: string;
   isAnonymous: boolean;
   photoURL: string;
   uid: string;
};

type ListInfo = {
   listID: string;
   uid: string;
};

type List = {
   title: string;
   type: string;
   id: string;
   members: string[];
};

type FCProps = {
   theme: string;
   setSelectedListID: (newSelectedListID: ListInfo) => void;
   setMemberList: (memberList: boolean) => void;
};
type UnsubscribeFunction = () => void;

export const UserLists: React.FC<FCProps> = ({
   theme,
   setSelectedListID,
   setMemberList
}) => {
   const userInfo = Auth() as UserInfo | null;
   const [activeListItem, setActiveListItem] = useState('');
   const [userLists, setUserLists] = useState<List[]>([]);
   const [localSelectedListID, setLocalSelectedListID] = useState<ListInfo>();
   const [userPartOfLists, setUserPartOfLists] = useState<List[]>([]);
   const [listCollapsed, setlistCollapsed] = useState(false);
   const [listRef, setListRef] = useState<DatabaseReference | null>(null);
   const [removeSharedList, setRemoveSharedList] = useState(false);
   const [sharedListOwner, setSharedListOwner] = useState('');
   const [localmemberList, setLocalMemberList] = useState(false);

   useEffect(() => {
      if (userInfo) {
         setLocalSelectedListID({ listID: '', uid: '' });
         setSelectedListID({ listID: '', uid: '' });
         if (!userInfo.isAnonymous) {
            const uid = ref(
               database,
               `${userInfo.isAnonymous ? 'guests' : 'users'}/${userInfo.uid}`
            );
            update(uid, {
               ['name']: userInfo.displayName,
               ['email']: userInfo.email,
               ['photoURL']: userInfo.photoURL
            });
         }

         const userListsRef = ref(
            database,
            `${userInfo.isAnonymous ? 'guests' : 'users'}/${
               userInfo.uid
            }/lists/${localSelectedListID?.listID}`
         );
         const otherUsersListsRef = ref(database, 'users');

         onValue(userListsRef, (snapshot) => {
            if (snapshot.exists()) {
               const lists = snapshot.val();
               const listsArray = Object.values(lists) as List[];
               setUserLists(listsArray);
            } else {
               setUserLists([]);
               setLocalSelectedListID({ listID: '', uid: '' });
               setSelectedListID({ listID: '', uid: '' });
            }
         });

         onValue(otherUsersListsRef, (snapshot) => {
            if (snapshot.exists()) {
               const users = snapshot.val();
               const otherUsersLists: List[] = [];

               Object.keys(users).forEach((uid) => {
                  if (uid !== userInfo.uid) {
                     const userLists = users[uid].lists || {};
                     Object.keys(userLists).forEach((listID) => {
                        const members = userLists[listID].members || [];
                        if (members.includes(userInfo.email)) {
                           otherUsersLists.push(userLists[listID]);
                           setSharedListOwner(uid);
                        }
                     });
                  }
               });

               setUserPartOfLists(otherUsersLists);
            } else {
               setUserPartOfLists([]);
            }
         });
      } else {
         setUserLists([]);
         setLocalSelectedListID({ listID: '', uid: '' });
         setSelectedListID({ listID: '', uid: '' });
      }
      return () => {
         setMemberList(false);
      };
   }, [userInfo, setSelectedListID]);

   useEffect(() => {
      const unsubscribes: UnsubscribeFunction[] = [];

      userPartOfLists.forEach((list: List) => {
         // Update listRef when needed
         const newRef = ref(
            database,
            `users/${sharedListOwner}/lists/${list.id}`
         );
         setListRef(newRef);

         const unsubscribe = onValue(newRef, (snapshot) => {
            const members = snapshot.child('members').val() || [];
            if (!snapshot.exists() || !members.includes(userInfo?.email)) {
               setLocalSelectedListID({ listID: '', uid: '' });
               setSelectedListID({ listID: '', uid: '' });
            }
         });

         // Now, listRef is guaranteed to be a valid DatabaseReference
         if (listRef) {
            unsubscribes.push(unsubscribe);
         }
      });

      return () => {
         unsubscribes.forEach((unsubscribe) => unsubscribe());
      };

      // ...
   }, [userPartOfLists, sharedListOwner, setSelectedListID]);

   const removeList = (listId: string) => {
      setLocalSelectedListID({ listID: '', uid: '' });
      setSelectedListID({ listID: '', uid: '' });
      setMemberList(false);

      setUserLists((prevLists) =>
         prevLists.filter((list: List) => list.id !== listId)
      );

      const listRef = ref(
         database,
         `${
            userInfo?.isAnonymous ? 'guests' : 'users'
         }/${userInfo?.uid}/lists/${listId}`
      );

      remove(listRef);
   };

   const removeSharedListFromList = (listId: string, ownerUid: string) => {
      const sharedListRef = ref(database, `users/${ownerUid}/lists/${listId}`);

      onValue(sharedListRef, (snapshot) => {
         if (snapshot.exists()) {
            const listData = snapshot.val();

            // Check if listData.members exists and is an array before filtering
            if (Array.isArray(listData.members)) {
               const updatedMembers = listData.members.filter(
                  (memberEmail: string) => memberEmail !== userInfo?.email
               );

               // Update the shared list's members
               update(sharedListRef, { members: updatedMembers });
               setRemoveSharedList(false);
            } else {
               console.error('listData.members is not an array');
            }
         } else {
            console.error('Shared list does not exist');
         }
      });
   };
   return (
      <div className="max-h-36rem overflow-y-auto  overflow-x-hidden ">
         {userInfo && (
            <div>
               {userLists.length > 0 && (
                  <div className="flex ">
                     <button
                        className={`text-[#F1FAEE] m-auto font-semibold text-sm mb-2 cursor-pointer py-1 px-36 lg:px-24 md:px-24 border-2 rounded-lg ${
                           theme === 'ocean' || theme === 'dark'
                              ? 'border-[#f0e9d6]'
                              : theme === 'light'
                              ? 'border-gray-800'
                              : ''
                        }`}
                        onClick={() => {
                           setlistCollapsed((prevCollapsed) => !prevCollapsed);
                        }}
                     >
                        {listCollapsed ? (
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className={`w-6 h-6 ${
                                 theme === 'ocean' || theme === 'dark'
                                    ? 'text-[#f0e9d6]'
                                    : theme === 'light'
                                    ? 'text-gray-800'
                                    : ''
                              } `}
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
                              />
                           </svg>
                        ) : (
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className={`w-6 h-6 ${
                                 theme === 'ocean' || theme === 'dark'
                                    ? 'text-[#f0e9d6]'
                                    : theme === 'light'
                                    ? 'text-gray-800'
                                    : ''
                              } `}
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                              />
                           </svg>
                        )}
                     </button>
                  </div>
               )}

               {userLists.length > 0 && (
                  <div className={` ${listCollapsed ? 'hidden' : ''}`}>
                     <div className="mx-2">
                        <p
                           className={` font-bold text-2xl mb-2 text-center font-sans ${
                              poiret_One.variable
                           } ${
                              theme == 'ocean'
                                 ? 'text-[#f0e9d6]'
                                 : theme == 'light'
                                 ? 'text-gray-800'
                                 : theme == 'dark' && 'text-[#f0e9d6]'
                           } `}
                        >
                           My Lists:
                        </p>
                        <hr
                           className={`${
                              theme === 'ocean' || theme === 'dark'
                                 ? 'border-[#f0e9d6]'
                                 : theme === 'light'
                                 ? 'border-gray-800'
                                 : ''
                           }`}
                        />
                     </div>

                     <ul>
                        {userLists.map((list: List) => (
                           <div
                              className={`flex items-center justify-between p-4 ${
                                 listCollapsed ? 'hidden' : ''
                              }`}
                              key={list.id}
                           >
                              <li
                                 className={`transition-all duration-200 cursor-pointer w-full text-2xl font-black p-3 rounded-lg text-center  overflow-auto font-sans ${
                                    poiret_One.variable
                                 } ${
                                    theme === 'ocean'
                                       ? activeListItem === list.id
                                          ? 'bg-green-400'
                                          : 'bg-[#457B9D] hover:bg-green-400 text-[#F1FAEE]'
                                       : theme === 'light'
                                       ? activeListItem === list.id
                                          ? 'bg-green-400'
                                          : 'bg-[#1e2124] hover:bg-green-400 text-[#F1FAEE]'
                                       : theme === 'dark'
                                       ? activeListItem === list.id
                                          ? 'bg-green-400 text-[#f0e9d6]'
                                          : 'bg-[#f0e9d6] hover:bg-green-400 text-gray-800'
                                       : ''
                                 }`}
                                 key={list.id}
                                 onClick={() => {
                                    setActiveListItem(list.id);
                                    console.log({ list });
                                    console.log(
                                       localSelectedListID?.listID +
                                          '-selected, list id  ' +
                                          list.id
                                    );
                                    setSelectedListID({
                                       listID: list.id,
                                       uid: userInfo.uid
                                    });
                                    setLocalSelectedListID({
                                       listID: list.id,
                                       uid: userInfo.uid
                                    });
                                 }}
                              >
                                 {list.title}

                                 <div className="flex justify-between gap-4 mt-3">
                                    {list.type == 'group' &&
                                       localSelectedListID?.listID ==
                                          list.id && (
                                          <button
                                             className={`w-1/2 ${
                                                theme == 'ocean'
                                                   ? 'bg-[#1D3557] text-green-500 hover:bg-green-500 hover:text-white '
                                                   : theme == 'light'
                                                   ? 'bg-gray-800 text-green-500 hover:bg-green-500 hover:text-white'
                                                   : theme == 'dark' &&
                                                     'bg-[#f0e9d6] text-green-500  hover:bg-green-500 hover:text-white'
                                             } p-1.5 mb-3 rounded`}
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                if (localmemberList) {
                                                   setMemberList(false);
                                                   setLocalMemberList(false);
                                                }
                                                if (!localmemberList) {
                                                   setMemberList(true);
                                                   setLocalMemberList(true);
                                                }
                                             }}
                                          >
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className=" h-9 item   w-full p-2 rounded transition-all duration-200"
                                             >
                                                <path
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                                   d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                                />
                                             </svg>
                                          </button>
                                       )}
                                    <button
                                       className={`${
                                          theme == 'ocean'
                                             ? 'bg-[#1D3557] text-red-500 hover:bg-red-500 hover:text-white '
                                             : theme == 'light'
                                             ? 'bg-[#f0e9d6] text-red-500 hover:bg-red-500 hover:text-white'
                                             : theme == 'dark' &&
                                               'bg-[#1e2124] text-red-500  hover:bg-red-500 hover:text-white'
                                       } text-red-500  p-1.5 mb-3 rounded ${
                                          list.type == 'individual' ||
                                          localSelectedListID?.listID != list.id
                                             ? 'w-full'
                                             : 'w-1/2'
                                       }`}
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          removeList(list.id);
                                       }}
                                    >
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                          className="w-full h-9 item  p-2 rounded transition-all duration-200"
                                       >
                                          <path
                                             fillRule="evenodd"
                                             d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                             clipRule="evenodd"
                                          />
                                       </svg>
                                    </button>
                                 </div>
                              </li>
                           </div>
                        ))}
                     </ul>
                  </div>
               )}

               {userPartOfLists.length > 0 && (
                  <div className={`${listCollapsed ? 'hidden' : ''}`}>
                     <p
                        className={`text-[#F1FAEE] font-bold text-2xl mb-2 text-center font-sans ${
                           poiret_One.variable
                        } ${
                           theme == 'ocean'
                              ? 'text-[#f0e9d6]'
                              : theme == 'light'
                              ? 'text-gray-800'
                              : theme == 'dark' && 'text-[#f0e9d6]'
                        } `}
                     >
                        Shared Lists:
                        <div className="flex items-center mt-4 w-full">
                           <button
                              className={` p-1.5 w-full ml-2 rounded font-sans ${
                                 poiret_One.variable
                              }  ${
                                 theme == 'ocean'
                                    ? 'bg-[#1D3557] text-red-500 hover:bg-red-500 hover:text-white '
                                    : theme == 'light'
                                    ? 'bg-gray-800 text-red-500 hover:bg-red-500 hover:text-white'
                                    : theme == 'dark' &&
                                      'bg-[#f0e9d6] text-red-500  hover:bg-red-500 hover:text-white'
                              }`}
                              onClick={() => {
                                 setRemoveSharedList(!removeSharedList);
                              }}
                           >
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
                                    d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                                 />
                              </svg>
                           </button>
                        </div>
                     </p>
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

                     <ul>
                        {userPartOfLists.map((list: List) => {
                           const userIsMember = list.members.includes(
                              userInfo.email
                           );
                           if (userIsMember) {
                              return (
                                 <div
                                    className={`flex items-center justify-between p-4 ${
                                       listCollapsed ? 'hidden' : ''
                                    }`}
                                    key={list.id}
                                 >
                                    <li
                                       className={`transition-all duration-200 cursor-pointer w-full text-2xl font-black p-3 rounded-lg text-center text-[#F1FAEE] overflow-auto font-sans ${
                                          poiret_One.variable
                                       } ${
                                          theme === 'ocean'
                                             ? activeListItem === list.id
                                                ? 'bg-[#457B9D]'
                                                : 'bg-[#1D3557] hover:bg-[#457B9D]'
                                             : theme === 'light'
                                             ? activeListItem === list.id
                                                ? 'bg-green-400'
                                                : 'bg-gray-800 hover:bg-green-400'
                                             : theme === 'dark'
                                             ? activeListItem === list.id
                                                ? 'bg-green-400 text-[#f0e9d6]'
                                                : 'bg-[#f0e9d6] hover:bg-green-400 text-gray-800'
                                             : ''
                                       }`}
                                       onClick={() => {
                                          setActiveListItem(list.id);

                                          setSelectedListID({
                                             listID: list.id,
                                             uid: sharedListOwner
                                          });
                                          setLocalSelectedListID({
                                             listID: list.id,
                                             uid: sharedListOwner
                                          });
                                          console.log(theme);
                                       }}
                                    >
                                       {list.title}
                                    </li>
                                    {removeSharedList && (
                                       <div className="flex items-center">
                                          <button
                                             className={`text-red-500 p-1.5 ml-2 rounded ${
                                                theme == 'ocean'
                                                   ? 'bg-[#1D3557] text-red-500 hover:bg-red-500 hover:text-white '
                                                   : theme == 'light'
                                                   ? 'bg-gray-800 text-red-500 hover:bg-red-500 hover:text-white'
                                                   : theme == 'dark' &&
                                                     'bg-[#f0e9d6] text-red-500  hover:bg-red-500 hover:text-white'
                                             }`}
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                removeSharedListFromList(
                                                   list.id,
                                                   sharedListOwner
                                                );
                                             }}
                                          >
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                             >
                                                <path
                                                   strokeLinecap="round"
                                                   strokeLinejoin="round"
                                                   d="M6 18L18 6M6 6l12 12"
                                                />
                                             </svg>
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              );
                           }
                           return null;
                        })}
                     </ul>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};
