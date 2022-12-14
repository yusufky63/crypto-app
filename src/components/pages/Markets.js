import {
  CheckPositiveNumber,
  NumberWithCommas,
  DataGlobal,
  MarketsDataError,
  AddFavorites,
} from "../utils";

import {
  BuyCrypto,
  SellCrypto,
} from "../modal";


import { Link } from "react-router-dom";
import { CryptoState } from "../redux/CryptoContext";
import axios from "axios";
import { Pagination } from "@mui/material";
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots,
} from "react-sparklines";
import {
  CoinList,
  GlobalData,
} from "../../services/Api";

import {
  addCrypto,
  deleteCrypto,
} from "../../services/firebase";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useEffect,
  useState,useMemo
} from "react";
function Markets() {
  const { user } = useSelector((state) => state.auth);
  const { favori } = useSelector((state) => state.favorites);


  const { currency, symbol } = CryptoState();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [globalData, setGlobalData] = useState([]);
  const [count, setCount] = useState(50);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios
      .get(CoinList(currency, count))
      .catch((err) => setErr(true))
      .finally(() => setLoading(false));
    setCoins(data);
    setErr(false);
  };
  const fetchGlobalData = async () => {
    const { data } = await axios(GlobalData());
    setGlobalData(data.data);
  };


  useEffect(() => {
    fetchGlobalData();
  }, [globalData]);


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
        addCrypto({
          name: id,
          uid: user.uid,
        });
      } else {
        deleteCrypto(data.id);
      }
    } else {
      toast.warning("L??tfen Giri?? Yap??n??z !");
    }
  };


  return (
    <div>
      <>
        <div className=" px-6  lg:px-8 pt-5 max-w-7xl mx-auto sm:px-6 ">
          {err && <MarketsDataError />}
          <header className="flex flex-col justify-center">
            <div>
              {" "}
              <h1 className="text-4xl text-left my-10  p-3 shadow-md rounded-lg flex justify-between items-center ">
                Piyasa
                {globalData.active_cryptocurrencies && (
                  <DataGlobal
                    globalData={
                      globalData
                    }
                    currency={
                      currency
                    }
                    symbol={
                      symbol
                    }
                  />
                )}
              </h1>
            </div>

            <div className="flex">
              <input
                type="text"
                placeholder="Arama"
                className=" w-3/4 text-center p-2 px-5 outline-none border rounded-lg shadow-lg md:4/6 lg:w-3/6  xl:w-2/6  mx-auto"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="p-2 px-3  justify-end  outline-none border rounded-lg shadow-xl"
                onChange={(e) => setCount(e.target.value)}
                value={count}
                name=""
                id=""
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
            </div>
          </header>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow   md:rounded-lg">
                  {filteredCoins && loading ? (
                    <div className="my-14" role="status">
                      <svg
                        className="inline mr-2 w-8 h-8 text-gray-200 animate-spin fill-red-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  ) : (
                    <>
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50 ">
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
                              24 Saatlik De??i??im
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5  text-sm font-semibold text-gray-900"
                            >
                              Piyasa De??eri
                            </th>
                            <th
                              scope="col"
                              className="whitespace-nowrap px-1  py-3.5  text-sm font-semibold text-gray-900"
                            >
                              Toplam Arz
                            </th>
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
                              7 G??nl??k De??i??im
                            </th>
                          </tr>
                        </thead>

                        <tbody className=" divide-y divide-gray-200 bg-white ">
                          {filteredCoins
                            .slice((page - 1) * 20, (page - 1) * 20 + 20)
                            .map((item) => (
                              <tr
                                id="priceT"
                                className="hover:drop-shadow-2xl hover:shadow-md hover:bg-gray-100 "
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
                                          <span className="uppercase text-xs text-gray-500">
                                            {" "}
                                            {item.symbol}
                                          </span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className=" price whitespace-nowrap px-3 py-4 text-sm ">
                                  <div className="">
                                    {" "}
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
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="text-gray-900">
                                    {NumberWithCommas(item.total_supply)}
                                  </div>
                                </td>
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
                                  <button className="border hover:bg-green-400 hover:text-white text-white shadow-md rounded-lg my-1 p-1 px-5 w-full">
                                    <BuyCrypto cryptoID={item.id}></BuyCrypto>
                                  </button>
                                  <button className="border hover:bg-red-400 hover:text-white text-red-900 shadow-md rounded-lg p-1 my-1 px-5 w-full">
                                    <SellCrypto cryptoID={item.id}></SellCrypto>
                                  </button>
                                </td>
                              </tr>
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
