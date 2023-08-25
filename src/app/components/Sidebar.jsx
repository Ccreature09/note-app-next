import { useState, useEffect } from 'react';
import { Auth, GoogleAuthButton, GuestAuthButton } from '../firebase/Auth';
import { CreateList } from './CreateList';
import { ref, remove, onValue, update } from 'firebase/database';
import { database } from '../firebase/firebase';
import { Poiret_One } from 'next/font/google';
import { Monoton } from 'next/font/google';
import Image from 'next/image';

const poiret_One = Poiret_One({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-poiret'
});
const monoton = Monoton({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-monoton'
});

export const Sidebar = ({ setSelectedListID }) => {
   const userInfo = Auth();
   const isAnonymous = userInfo && userInfo.isAnonymous;
   const img = userInfo && userInfo.photoURL;
   const name = userInfo && userInfo.displayName;
   const email = userInfo && userInfo.email;
   const [activeListItem, setActiveListItem] = useState('');

   const [ListCollapsed, setListCollapsed] = useState(false);
   const [userLists, setUserLists] = useState([]);
   const [userPartOfLists, setUserPartOfLists] = useState([]);
   const [sharedListOwner, setSharedListOwner] = useState();
   const [memberList, setToggleMemberList] = useState(false);

   const toggleListCollapse = () => {
      setListCollapsed((prevCollapsed) => !prevCollapsed);
   };

   const toggleMemberList = () => {
      setToggleMemberList(!memberList);
   };

   useEffect(() => {
      if (userInfo) {
         setSelectedListID({ listID: '', uid: '' });
         if (!userInfo.isAnonymous) {
            const uid = ref(
               database,
               `${userInfo.isAnonymous ? 'guests' : 'users'}/${userInfo.uid}`
            );
            update(uid, {
               ['Name']: userInfo.displayName,
               ['Email']: userInfo.email
            });
         }

         const userListsRef = ref(
            database,
            `${userInfo.isAnonymous ? 'guests' : 'users'}/${userInfo.uid}/lists`
         );
         const otherUsersListsRef = ref(database, 'users');

         onValue(userListsRef, (snapshot) => {
            if (snapshot.exists()) {
               const lists = snapshot.val();
               const listsArray = Object.values(lists);
               setUserLists(listsArray);
            } else {
               setUserLists([]);
               setSelectedListID({ listID: '', uid: '' });
            }
         });

         onValue(otherUsersListsRef, (snapshot) => {
            if (snapshot.exists()) {
               const users = snapshot.val();
               const otherUsersLists = [];

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
         setSelectedListID({ listID: '', uid: '' });
      }
   }, [userInfo, setSelectedListID]);

   useEffect(() => {
      const unsubscribes = [];

      userPartOfLists.forEach((list) => {
         const listRef = ref(
            database,
            `users/${sharedListOwner}/lists/${list.id}`
         );
         const unsubscribe = onValue(listRef, (snapshot) => {
            if (!snapshot.exists()) {
               setSelectedListID({ listID: '', uid: '' });
            }
         });

         unsubscribes.push(unsubscribe);
      });

      return () => {
         unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
   }, [userPartOfLists, sharedListOwner, setSelectedListID]);

   const removeList = (listId) => {
      setSelectedListID({ listID: '', uid: '' });

      setUserLists((prevLists) =>
         prevLists.filter((list) => list.id !== listId)
      );

      let listRef;
      if (userInfo) {
         listRef = ref(
            database,
            `${userInfo.isAnonymous ? 'guests' : 'users'}/${
               userInfo.uid
            }/lists/${listId}`
         );
      }

      remove(listRef);
   };

   return (
      <div
         className={`flex flex-col p-4 bg-[#1D3557] md:h-screen w-full md:w-64 ${poiret_One.variable} font-sans`}
      >
         <h1
            className={` ${monoton.variable} font-mono text-white text-3xl font-medium text-center mb-5 `}
         >
            Octonotes
         </h1>

         <hr />
         <br />
         {userInfo && isAnonymous && (
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

         {userInfo && !isAnonymous && (
            <div className="flex items-center justify-center space-x-4 mb-6">
               <Image
                  className="rounded-full"
                  src={img}
                  width={64}
                  height={64}
                  alt="Picture of the author"
               />
               <div className="flex flex-col">
                  <p className="text-[#F1FAEE] font-black text-2xl">{name}</p>
                  <p className="text-[#F1FAEE] text-base truncate md:w-auto">
                     {email}
                  </p>
               </div>
            </div>
         )}

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

         <CreateList></CreateList>

         <div>
            {userInfo && (
               <div>
                  {userLists.length > 0 && (
                     <div className="flex">
                        <button
                           className="text-[#F1FAEE] m-auto font-semibold text-sm mb-2 cursor-pointer py-1 px-36 lg:px-24 md:px-24 border-white border-2 rounded-lg"
                           onClick={toggleListCollapse}
                        >
                           {ListCollapsed ? (
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
                                 className="w-6 h-6"
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
                     <div className={` ${ListCollapsed ? 'hidden' : ''}`}>
                        <div className="mx-2">
                           <p
                              className={
                                 'text-[#F1FAEE] font-bold text-2xl mb-2 text-center'
                              }
                           >
                              My Lists:
                           </p>
                           <hr />
                        </div>

                        <ul>
                           {userLists.map((list) => (
                              <div
                                 className={`flex items-center justify-between p-4 ${
                                    ListCollapsed ? 'hidden' : ''
                                 }`}
                                 key={list.id}
                              >
                                 <li
                                    className={`transition-all duration-200 cursor-pointer w-full text-2xl font-black p-3 rounded-lg text-center text-[#F1FAEE] overflow-auto ${
                                       activeListItem === list.id
                                          ? 'bg-[#457B9D]'
                                          : 'bg-[rgba(0,0,0,0.15)] hover:bg-[#457B9D]'
                                    }`}
                                    onClick={() => {
                                       setActiveListItem(list.id);
                                       setSelectedListID({
                                          listID: list.id,
                                          uid: userInfo.uid
                                       });
                                    }}
                                 >
                                    {list.title}
                                    <div className="flex justify-between gap-4 mt-3">
                                       {list.type == 'group' && (
                                          <button
                                             className="w-1/2 text-green-500 bg-[#1D3557] p-1.5 mb-3 rounded"
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMemberList();
                                             }}
                                          >
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className=" h-9 item hover:bg-[#457B9D]  w-full p-2 rounded transition-all duration-200"
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
                                          className={` text-red-500 bg-[#1D3557] p-1.5 mb-3 rounded ${
                                             list.type == 'individual'
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
                                             className="w-full h-9 item hover:bg-[#457B9D] p-2 rounded transition-all duration-200"
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
                     <div className={`${ListCollapsed ? 'hidden' : ''}`}>
                        <p
                           className={`text-[#F1FAEE] font-bold text-2xl mb-2 text-center `}
                        >
                           Shared Lists:
                        </p>
                        <hr />
                        <br />
                        <ul>
                           {userPartOfLists.map((list) => (
                              <div
                                 className={`flex items-center justify-between p-4 ${
                                    ListCollapsed ? 'hidden' : ''
                                 }`}
                                 key={list.id}
                              >
                                 <li
                                    className={`transition-all duration-200 cursor-pointer text-2xl font-black p-3 mb-3 rounded-lg flex-grow text-center text-[#F1FAEE] max-w-2xl overflow-auto ${
                                       activeListItem === list.id
                                          ? 'bg-[#457B9D]'
                                          : 'bg-[#1D3557] hover:bg-[#457B9D]'
                                    }`}
                                    onClick={() => {
                                       setActiveListItem(list.id);
                                       setSelectedListID({
                                          listID: list.id,
                                          uid: sharedListOwner
                                       });
                                       console.log(
                                          list.id + ' and ' + sharedListOwner
                                       );
                                    }}
                                 >
                                    {list.title}
                                 </li>
                              </div>
                           ))}
                        </ul>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};
