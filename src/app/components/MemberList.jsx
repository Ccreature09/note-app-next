import { useState, useEffect } from 'react';
import { Auth } from '../firebase/Auth';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../firebase/firebase';
import Image from 'next/image';

export const MemberList = ({ selectedList }) => {
   const userInfo = Auth();
   const [members, setMembers] = useState([]);
   const [users, setUsers] = useState([]);

   useEffect(() => {
      const usersRef = ref(database, 'users');
      if (userInfo) {
         onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
               const users = snapshot.val();
               const usersList = [];

               Object.keys(users).forEach((uid) => {
                  if (uid !== userInfo.uid) {
                     const user = users[uid];
                     usersList.push({
                        name: user.name,
                        photoURL: user.photoURL
                     });
                  }
               });

               setUsers(usersList);
            } else {
               setUsers([]);
            }
         });
      }
   }, [userInfo]);

   useEffect(() => {
      const fetchMembersData = async () => {
         if (selectedList) {
            const listRef = ref(
               database,
               `users/${selectedList.uid}/lists/${selectedList.listID}`
            );

            onValue(listRef, async (snapshot) => {
               if (snapshot.exists()) {
                  const listData = snapshot.val();
                  const membersList = listData.members || [];

                  const membersData = [];
                  for (const memberEmail of membersList) {
                     const usersRef = ref(database, 'users');
                     const userSnapshot = await get(usersRef);
                     const usersData = userSnapshot.val();
                     const matchingUserUID = Object.keys(usersData).find(
                        (uid) => usersData[uid].Email === memberEmail
                     );

                     if (matchingUserUID) {
                        const memberUserRef = ref(
                           database,
                           `users/${matchingUserUID}`
                        );
                        const memberUserSnapshot = await get(memberUserRef);
                        const memberUserData = memberUserSnapshot.val();
                        membersData.push({
                           name: memberUserData.name,
                           photoURL: memberUserData.photoURL
                        });
                        console.log(membersData);
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
      <div>
         <div className="fixed top-24 right-14 w-80  flex justify-center items-center">
            <div className={' bg-white rounded-xl p-10 w-full max-w-lg'}>
               <div className="popup ">
                  <p className="text-5xl mb-2 text-center">Members:</p>
                  <hr />

                  {members && (
                     <ul>
                        {members.map((user) => (
                           <li
                              key={user.name}
                              className="flex items-center p-2 space-x-4"
                           >
                              <Image
                                 src={user.photoURL}
                                 alt="pfp"
                                 width={100}
                                 height={100}
                                 className="w-10 h-10 rounded-full"
                              />

                              <p className="text-2xl">{user.name}</p>
                           </li>
                        ))}
                     </ul>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
