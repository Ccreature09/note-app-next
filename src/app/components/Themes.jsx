import { useState } from 'react';

export const Themes = ({ setTheme }) => {
   const [dropdown, setDropdown] = useState(false);

   return (
      <div className="z-10">
         <div className="fixed top-10 right-0 w-80 flex justify-center items-center">
            <div>
               <div>
                  <button
                     className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 justify-center focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                     onClick={() => {
                        setDropdown(!dropdown);
                     }}
                  >
                     Theme
                     {dropdown ? (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20"
                           fill="currentColor"
                           className="w-5 h-5 ml-2.5"
                        >
                           <path
                              fillRule="evenodd"
                              d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                              clipRule="evenodd"
                           />
                        </svg>
                     ) : (
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20"
                           fill="currentColor"
                           className="w-5 h-5 ml-2.5"
                        >
                           <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                           />
                        </svg>
                     )}
                  </button>
                  {dropdown && (
                     <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                           <li>
                              <a
                                 href="#"
                                 className="block px-4 py-2 text-center  hover:bg-blue-200 hover:text-blue-400"
                                 onClick={() => {
                                    setTheme('ocean');
                                    setDropdown(!dropdown);
                                 }}
                              >
                                 <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="w-6 h-6 inline mr-2"
                                 >
                                    <path d="M.036 3.314a.5.5 0 01.65-.278l1.757.703a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.757-.703a.5.5 0 11.372.928l-1.758.703a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0L.314 3.964a.5.5 0 01-.278-.65zm0 3a.5.5 0 01.65-.278l1.757.703a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.757-.703a.5.5 0 11.372.928l-1.758.703a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0L.314 6.964a.5.5 0 01-.278-.65zm0 3a.5.5 0 01.65-.278l1.757.703a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.757-.703a.5.5 0 11.372.928l-1.758.703a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0L.314 9.964a.5.5 0 01-.278-.65zm0 3a.5.5 0 01.65-.278l1.757.703a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.014-.406a2.5 2.5 0 011.857 0l1.015.406a1.5 1.5 0 001.114 0l1.757-.703a.5.5 0 11.372.928l-1.758.703a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0l-1.014-.406a1.5 1.5 0 00-1.114 0l-1.015.406a2.5 2.5 0 01-1.857 0l-1.757-.703a.5.5 0 01-.278-.65z" />
                                 </svg>
                                 Ocean
                              </a>
                           </li>
                           <li>
                              <a
                                 href="#"
                                 className="block px-4 py-2 text-center hover:bg-white hover:text-black"
                                 onClick={() => {
                                    setTheme('light');
                                    setDropdown(!dropdown);
                                 }}
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 inline mr-2"
                                 >
                                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                 </svg>
                                 Light
                              </a>
                           </li>
                           <li>
                              <a
                                 href="#"
                                 className="block px-4 py-2 text-center  hover:bg-black hover:text-white"
                                 onClick={() => {
                                    setTheme('dark');
                                    setDropdown(!dropdown);
                                 }}
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6 inline mr-2"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 Dark
                              </a>
                           </li>
                        </ul>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
