import React, { useEffect, useState } from "react";
import { CryptoState } from "../../redux/CryptoContext";
import LastLogins from "./user/LastLogins";
import { Link } from "react-router-dom";
import { getUsers } from "../../services/Firebase/FirebaseAdmin";
import { useSelector } from "react-redux";
import Auth2FAModal from "../modal/Auth2FAModal";
function Settings() {
  const [authCheck, setAuthCheck] = useState(false);
  const { currency, setCurrency } = CryptoState();
  const [users, setUsers] = React.useState([]);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const res = await getUsers();
      setUsers(res);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const currentUser = users.find((u) => u.id === user.uid);
    if (currentUser && currentUser.auth2fa) {
      setAuthCheck(true);
    } else {
      setAuthCheck(false);
    }
  }, [users, user.uid]);


  return (
    <div className=" flex justify-center mt-10">
      <div className=" w-full max-w-4xl">
        <h1 className="text-4xl text-left px-4 font-bold">Ayarlar</h1>
        <ul className="text-left p-4">
          <li className="border p-2 rounded-lg shadow-sm my-3">
            <h1 className="font-bold text-xl">Güvenlik </h1>
            <span className="flex items-center justify-between">
              <label>İki Aşamalı Doğrulama </label>
              {authCheck ? (
                 <Auth2FAModal
                 isModalOpen={isModalOpen}
                 openModal={() => setIsModalOpen(true)}
                 closeModal={() => setIsModalOpen(false)}
               />
              ) : (
                <Link
                  to={"./auth2fa"}
                  className="border p-2 shadow-md rounded-md hover:bg-green-500 hover:text-white text-green-600"
                >
                  Etkinleştir
                </Link>
              )}
            </span>
          </li>
          {/* <li className="border p-2 rounded-lg shadow-sm my-3">
            <h1 className="font-bold text-xl">Listelenecek Veri Sayısı </h1>
            <span className="flex items-center justify-between">
              <label>Kayan Fiyat Listesi (Widget) </label>
              <select
                className="rounded-lg  p-1 border m-2  outline-none"
                name="coin"
                id="coin50"
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </select>
            </span>
            <span className="flex items-center justify-between">
              <label>Piyasalar </label>
              <select
                className="rounded-lg  p-1 m-2 border  outline-none "
                name="coin"
                id="coin50"
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </select>
            </span>
            <span className="flex items-center justify-between">
              <label>Borsalar </label>
              <select
                className="rounded-lg  p-1  m-2 border  outline-none"
                name="coin"
                id="coin50"
              >
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </select>
            </span>
          </li> */}
          <li className="border p-2 rounded-lg shadow-sm my-3">
            <span className="flex items-center justify-between ">
              <h1>Para Birimi </h1>
              <select
                value={currency}
                className="rounded-lg  p-1 m-2 border  outline-none"
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value={"TRY"}>TRY</option>
                <option value={"USD"}>USD</option>
              </select>
            </span>
          </li>
          <li>
            <LastLogins />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;
