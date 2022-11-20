/* eslint-disable jsx-a11y/anchor-is-valid */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import {
  login,
  resetPasword,
  githubLogin,
  googleLogin,
} from "../../services/firebase";

export default function ModalLogin() {
  let [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const user = login(email, password);
    if (user.email || user.photoURL) {
      closeModal();
    }
  };

  return (
    <>
      <a className=" w-full " onClick={openModal}>
        Giriş Yap
      </a>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto w-full "
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 " />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle "
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-sm p-6 my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl  border border-gray-200">
                <button
                  onClick={closeModal}
                  className=" text-red-500 hover:bg-red-200 rounded-lg p-2"
                >
                  {" "}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <br />
                <br />
                <div className="flex justify-around mx-10">
                  <button
                    onClick={githubLogin}
                    type="button"
                    className="inline-block px-12 py-2.5 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                    style={{ backgroundColor: "#333" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                      className="w-4 h-4"
                    >
                      <path
                        fill="currentColor"
                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={googleLogin}
                    type="button"
                    className="inline-block px-12 py-2.5 mb-2 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                    style={{ backgroundColor: "#ea4335" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                      className="w-4 h-4"
                    >
                      <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                      />
                    </svg>
                  </button>
                </div>

                <Dialog.Title
                  as="h3"
                  className=" text-center text-2xl my-3 font-bold leading-10 text-gray-900"
                >
                  Giriş Yap
                </Dialog.Title>
                <div className="flex justify-center my-5 text-sm mx-10 bg-green-100 p-2 rounded-lg">
                  <div className="text-center ">
                    <span className="text-green-600">https://</span>{" "}
                    test-react-crypo-app/login{" "}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div>
                    <label htmlFor="floatingInput" className="text-gray-700">
                      Email
                    </label>
                    <div className="form-floating mb-3 w-full">
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className="form-control
      block
      w-full
      px-10
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="floatingInput"
                        placeholder="adresin@gmail.com"
                      />
                    </div>
                    <label htmlFor="floatingPassword" className="text-gray-700">
                      Şifre
                    </label>
                    <div className="form-floating mb-3 w-full">
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        className="form-control
      block
      w-full
      px-10
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        id="floatingPassword"
                        placeholder="Şifre"
                      />
                    </div>
                    <a
                      onClick={() => resetPasword(email)}
                      className="text-indigo-500 flex justify-end mb-2 text-sm cursor-pointer"
                    >
                      Şifremi Unuttum
                    </a>
                  </div>
                </div>

                <div className="mt-4 text-center flex justify-around">
                  <button
                    onClick={handleLogin}
                    type="button"
                    className="inline-flex justify-center  py-2 w-3/4  text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 duration-300"
                  >
                    Giriş Yap
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
