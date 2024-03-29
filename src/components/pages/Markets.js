import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  CheckPositiveNumber,
  NumberWithCommas,
  DataGlobal,
  MarketsDataError,
  AddFavorites,
} from "../../utils";

import { BuyCrypto, SellCrypto } from "../modal";
import { CryptoState } from "../../redux/CryptoContext";
import { Pagination } from "@mui/material";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { CoinList, GlobalData } from "../../services/Api";
import {
  addFavoritesCrypto,
  deleteFavoritesCrypto,
} from "../../services/Firebase/FirebasePortfolyoAndFavorites";
import LoadingIcon from "../../assets/icon/LoadingIcon";
import { motion } from "framer-motion";
function Markets() {
  const { user } = useSelector((state) => state.auth);
  const { favori } = useSelector((state) => state.favorites);

  const { currency, symbol } = CryptoState();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [globalData, setGlobalData] = useState([]);
  const [count, setCount] = useState(10);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const currencyEdit = currency.toLowerCase();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios
      .get(CoinList(currencyEdit, count))
      .catch((err) => setErr(true));

    setCoins(data);
    setLoading(false);
    setErr(false);
  };

  const fetchGlobalData = async () => {
    const { data } = await axios(GlobalData());
    setGlobalData(data.data);
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, currency, page]);

  const filteredCoins = useMemo(() => {
    if (coins) {
      return coins.filter((coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  }, [coins, search]);

  const handleSavedCoin = (e, id) => {
    e.preventDefault();
    if (user) {
      const data = favori.find((item) => item.name === id);
      if (!data) {
        addFavoritesCrypto({
          name: id,
          uid: user.uid,
        });
      } else {
        deleteFavoritesCrypto(data.id);
      }
    } else {
      toast.warning("Lütfen Giriş Yapınız !");
    }
  };
  return (
    <div className="bg-market">
      <>
        <div className=" px-6  lg:px-8 pt-5 max-w-7xl mx-auto sm:px-6 ">
          {err && <MarketsDataError />}
          <header className="flex flex-col justify-center">
            <div>
              <h1 className="text-3xl  text-left my-10  p-3 shadow-md rounded-lg flex justify-between items-center bg-white">
                Piyasa
                {globalData.active_cryptocurrencies && (
                  <DataGlobal
                    globalData={globalData}
                    currencyEdit={currencyEdit}
                    symbol={symbol}
                  />
                )}
              </h1>
            </div>

            <div className="flex justify-center">
              <div className="flex flex-col w-3/4 lg:w-3/6  xl:w-2/6">
                <input
                  type="text"
                  placeholder="Arama"
                  className=" text-center p-2 px-5 outline-none  rounded-lg shadow-md "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                  <span className="mt-2 text-xs text-left text-gray-400">
                    Sonuc Bulundu : {filteredCoins.length}
                  </span>
                )}
              </div>

              <select
                className="p-2 px-3 h-10  outline-none rounded-lg shadow-md "
                onChange={(e) => setCount(e.target.value)}
                value={count}
                name=""
                id=""
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <br />
            </div>
          </header>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow   md:rounded-lg">
                  {filteredCoins && loading ? (
                    <div className="my-14" role="status">
                      <LoadingIcon />
                    </div>
                  ) : filteredCoins.length < 1 ? (
                    <span className=" text-red-600">Sonuç Yok</span>
                  ) : (
                    <>
                      <table className="min-w-full divide-y ">
                        <thead className="bg-white  ">
                          <tr className="text-center">
                            <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5  text-sm font-semibold text-gray-900 "
                            ></th>
                            {/* <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3  text-sm font-semibold text-gray-900 "
                            >
                              Rank
                            </th> */}
                            <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5 text-left pl-8 text-sm font-semibold text-gray-900"
                            >
                              Coin
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5  text-sm font-semibold text-gray-900"
                            >
                              Fiyat
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5  text-sm font-semibold text-gray-900"
                            >
                              24 Saatlik Değişim
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5  text-sm font-semibold text-gray-900"
                            >
                              Piyasa Değeri
                            </th>
                            {/* <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5  text-sm font-semibold text-gray-900"
                            >
                              Toplam Arz
                            </th> */}
                            <th
                              scope="col"
                              className="px-1  py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              24 Saatlik Hacim
                            </th>
                            <th
                              scope="col"
                              className="px-1  py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              7 Günlük Değişim
                            </th>
                          </tr>
                        </thead>

                        <tbody className=" divide-white  ">
                          {filteredCoins
                            .slice((page - 1) * 20, (page - 1) * 20 + 20)
                            .map((item) => (
                              <motion.tr
                                initial={{ opacity: 0, x: -80 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                id="priceT"
                                className="hover:drop-shadow-2xl hover:shadow-md hover:bg-gray-100 duration-300 ease-in-out shadow-inner"
                                key={item.id}
                              >
                                <td
                                  onClick={(e) => handleSavedCoin(e, item.id)}
                                >
                                  <AddFavorites id={item.id} />
                                </td>
                                {/* <td className="whitespace-nowrap px-1 py-4 text-xs text-gray-500">
                                  <div className="text-gray-900">
                                    {item.market_cap_rank}
                                  </div>
                                </td> */}
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 flex-shrink-0">
                                      <img
                                        className="h-8 w-8 rounded-full"
                                        src={item.image}
                                        alt=""
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className=" text-gray-900 font-bold ">
                                        <Link to={`/markets/${item.id}`}>
                                          {item.name}
                                          <span className="uppercase text-xs text-gray-500 ml-1">
                                            {item.symbol}
                                          </span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className=" price whitespace-nowrap px-3 py-4 text-sm ">
                                  <div className="">
                                    {symbol}
                                    {item.current_price}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="text-gray-900">
                                    <CheckPositiveNumber
                                      number={item.price_change_percentage_24h}
                                    />
                                  </div>
                                </td>
                                <td className=" whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="text-gray-900">
                                    {symbol}
                                    {NumberWithCommas(item.market_cap)}
                                  </div>
                                </td>
                                {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="text-gray-900">
                                    {NumberWithCommas(item.total_supply)}
                                  </div>
                                </td> */}
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="text-gray-900">
                                    {symbol}
                                    {NumberWithCommas(item.total_volume)}
                                  </div>
                                </td>
                                <td className="px-10 mx-20 py-4">
                                  <Sparklines
                                    svgHeight={30}
                                    width={50}
                                    height={90}
                                    margin={-30}
                                    data={item.sparkline_in_7d.price}
                                  >
                                    <SparklinesLine style={{ fill: "" }} />
                                    <SparklinesSpots />
                                  </Sparklines>
                                </td>
                                <td className="p-1">
                                  <button className="border hover:bg-green-400 hover:text-white text-white shadow-md rounded-lg my-1  w-full">
                                    <BuyCrypto cryptoID={item.id}></BuyCrypto>
                                  </button>
                                  <button className="border hover:bg-red-400 hover:text-white text-red-900 shadow-md rounded-lg  my-1 w-full">
                                    <SellCrypto cryptoID={item.id}></SellCrypto>
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                      {filteredCoins && (
                        <Pagination
                          count={Number(
                            (filteredCoins?.length / 20).toFixed(0)
                          )}
                          variant="outlined"
                          shape="rounded"
                          color="warning"
                          style={{
                            padding: 30,
                            display: "flex",
                            justifyContent: "center",
                          }}
                          onChange={(_, value) => {
                            setPage(value);
                            window.scroll(0, 450);
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Markets;
