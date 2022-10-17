import React from "react";

import CheckPositiveNumber from "../utils/CheckPositiveNumber";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { CryptoState } from "../context/CryptoContext";
import { CoinList } from "../../services/Api";

function AllCoinsWidget() {
  const [crypto, setCrypto] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchCoins = async () => {
    const { data } = await axios.get(CoinList(currency, 50));

    setCrypto(data);
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <div>
      <div className=" flex justify-center flex-wrap  ">
        {
          <AliceCarousel
            autoPlay
            autoPlayStrategy="none"
            autoPlayInterval={500}
            animationDuration={1000}
            animationType="fadeout"
            infinite
            touchTracking={false}
            disableButtonsControls
            disableDotsControls
            responsive={responsive}
          >
            {crypto.map((coin) => (
              <div
                data-value={coin.market_cap_rank}
                key={coin.id}
                className="border p-1 bg-white"
              >
                <div className="card-body">
                  <div className="flex  items-center justify-center">
                    <img src={coin.image} width="20" alt="coin" />
                    <span className="ml-1 text-sm text-gray-500 uppercase">
                      {coin.symbol}
                    </span>
                    <h5 className="mx-3 card-title ">
                      {symbol}
                      {coin.current_price}
                    </h5>{" "}
                    <span className="text-sm  ">
                      {" "}
                      <CheckPositiveNumber
                        number={coin.price_change_percentage_24h}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </AliceCarousel>
        }
      </div>
    </div>
  );
}

export default AllCoinsWidget;

const responsive = {
  0: { items: 2 },
  680: { items: 3 },
  940: { items: 4 },
  1280: { items: 6 },
  1480: { items: 6 },
  1536: { items: 8 },
  1920: { items: 10 },
};