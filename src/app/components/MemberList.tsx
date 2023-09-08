import { useState, useEffect } from 'react';
import { Auth } from '../firebase/Auth';
import { ref, onValue, get, set } from 'firebase/database';
import { database } from '../firebase/firebase';
import Image from 'next/image';

type ListInfo = {
   listID: string;
   uid: string;
};
type FCProps = {
   selectedList: {
      listID: string;
      uid: string;
   };
};

type User = {
   name: string;
   photoURL: string;
   uid: string;
   email: string;
};
type UserInfo = {
   isAnonymous: boolean;
   uid: string;
};

export const MemberList: React.FC<FCProps> = ({ selectedList }) => {
   const userInfo = Auth() as UserInfo | null;
   const [members, setMembers] = useState<User[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [addUser, setAddUser] = useState(false);
   const [removeUser, setRemoveUser] = useState(false);

   const addUserToList = async (user: User) => {
      if (!user || !user.email) {
         console.error('Invalid user object or missing email.');
         return;
      }

      const listRef = ref(
         database,
         `users/${userInfo?.uid}/lists/${selectedList.listID}/members`
      );

      const listMembersSnapshot = await get(listRef);
      const listMembers = listMembersSnapshot.val() || [];

      if (!listMembers.includes(user.email)) {
         listMembers.push(user.email);

         await set(listRef, listMembers);

         const updatedMembers = [...members, user];
         setMembers(updatedMembers);
      }
   };
   const removeUserFromList = async (user: User) => {
      if (!user || !user.email) {
         console.error('Invalid user object or missing email.');
         return;
      }

      const listRef = ref(
         database,
         `users/${userInfo?.uid}/lists/${selectedList.listID}/members`
      );

      const listMembersSnapshot = await get(listRef);
      const listMembers = listMembersSnapshot.val() || [];

      if (listMembers.includes(user.email)) {
         const updatedListMembers = listMembers.filter(
            (email: string) => email !== user.email
         );

         await set(listRef, updatedListMembers);

         const updatedMembers = members.filter(
            (member) => member.email !== user.email
         );
         setMembers(updatedMembers);
      }
   };

   useEffect(() => {
      const usersRef = ref(database, 'users');
      if (userInfo) {
         onValue(usersRef, async (snapshot) => {
            if (snapshot.exists()) {
               const users = snapshot.val();
               const usersList: User[] = [];

               const listMembersRef = ref(
                  database,
                  `users/${selectedList.uid}/lists/${selectedList.listID}/members`
               );
               const listMembersSnapshot = await get(listMembersRef);
               const listMembers = listMembersSnapshot.val() || [];

               Object.keys(users).forEach((uid) => {
                  if (
                     uid !== userInfo.uid &&
                     !listMembers.includes(users[uid].email)
                  ) {
                     const user = users[uid];
                     usersList.push({
                        name: user.name,
                        photoURL: user.photoURL,
                        uid: uid,
                        email: user.email
                     });
                  }
               });

               setUsers(usersList);
            } else {
               setUsers([]);
            }
         });
      }
   }, [userInfo, selectedList]);

   useEffect(() => {
      const fetchMembersData = async () => {
         if (selectedList && selectedList.uid) {
            const listRef = ref(
               database,
               `users/${selectedList.uid}/lists/${selectedList.listID}`
            );

            onValue(listRef, async (snapshot) => {
               if (snapshot.exists()) {
                  const listData = snapshot.val();
                  const membersList = listData.members || [];

                  const membersData = [];

                  const usersRef = ref(database, 'users');
                  const userSnapshot = await get(usersRef);
                  const usersData = userSnapshot.val();

                  for (const memberEmail of membersList) {
                     const matchingUserUID = Object.keys(usersData).find(
                        (uid) => usersData[uid].email === memberEmail
                     );

                     if (matchingUserUID) {
                        const memberUserData = usersData[matchingUserUID];
                        membersData.push({
                           name: memberUserData.name,
                           photoURL: memberUserData.photoURL,
                           uid: matchingUserUID,
                           email: memberUserData.email
                        });
                     }
                  }

                  setMembers(membersData);
               } else {
                  setMembers([]);
               }
            });
         } else {
            setMembers([]);
         }
      };

      fetchMembersData();
   }, [selectedList]);

   return (
      <div className="z-10">
         <div className="fixed top-24 right-14 w-80   flex justify-center items-center">
            <div
               className={` bg-white ${
                  addUser && users
                     ? 'border-green-500 border-4'
                     : !addUser && !removeUser && members
                     ? 'border-blue-500 border-4'
                     : removeUser && members
                     ? 'border-red-500 border-4'
                     : ''
               }   rounded-xl p-10 w-full max-w-lg`}
            >
               <div className="popup ">
                  <p className="text-5xl mb-2 text-center">Members:</p>
                  <hr className="mb-3" />
                  <div className="flex gap-2">
                     <button
                        className="w-1/3"
                        onClick={() => {
                           setRemoveUser(false);
                           setAddUser(true);
                        }}
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-full h-8 bg-green-500 rounded-lg text-white"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                           />
                        </svg>
                     </button>
                     <button
                        className="w-1/3"
                        onClick={() => {
                           setRemoveUser(false);
                           setAddUser(false);
                        }}
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-full h-8 bg-blue-500 text-white rounded-lg"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                           />
                        </svg>
                     </button>
                     <button
                        className="w-1/3"
                        onClick={() => {
                           setRemoveUser(true);
                           setAddUser(false);
                        }}
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-full h-8 bg-red-500 rounded-lg text-white"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                           />
                        </svg>
                     </button>
                  </div>
                  <br />

                  {addUser && users && (
                     <ul>
                        {users.map((user: User) => (
                           <li
                              key={user.uid}
                              className="flex items-center p-2 space-x-4 hover:bg-green-400 rounded-lg cursor-pointer"
                              onClick={() => addUserToList(user)}
                           >
                              {user.photoURL && (
                                 <Image
                                    src={user.photoURL}
                                    alt="pfp"
                                    width={100}
                                    height={100}
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                 />
                              )}

                              {user.uid && (
                                 <p className="text-2xl">{user.name}</p>
                              )}
                           </li>
                        ))}
                     </ul>
                  )}

                  {!addUser && !removeUser && members && (
                     <ul>
                        {members.map((user: User) => (
                           <li
                              key={user.uid}
                              className="flex items-center p-2 space-x-4  hover:bg-blue-400 rounded-lg"
                           >
                              {user.photoURL && (
                                 <Image
                                    src={user.photoURL}
                                    alt="pfp"
                                    width={100}
                                    height={100}
                                    className="w-10 h-10 rounded-full"
                                 />
                              )}

                              {user.uid && (
                                 <p className="text-2xl">{user.name}</p>
                              )}
                           </li>
                        ))}
                        {members.length == 0 && <li>No members yet...</li>}
                     </ul>
                  )}

                  {removeUser && members && (
                     <ul>
                        {members.map((user: User) => (
                           <li
                              key={user.uid}
                              onClick={() => removeUserFromList(user)}
                              className="flex items-center p-2 space-x-4 hover:bg-red-400 rounded-lg cursor-pointer"
                           >
                              {user.photoURL && (
                                 <Image
                                    src={user.photoURL}
                                    alt="pfp"
                                    width={100}
                                    height={100}
                                    className="w-10 h-10 rounded-full"
                                 />
                              )}

                              <p className="text-2xl">{user.name}</p>
                           </li>
                        ))}
                        {members.length == 0 && (
                           <li>No members to remove...</li>
                        )}
                     </ul>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
