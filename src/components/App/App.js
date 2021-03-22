import React, { useEffect, useState } from "react";
import { PieceCounter } from "../PieceCounter/PieceCounter";
import "./App.css";

const App = () => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  useEffect(() => {
    if (items) setTotalPrice(calculateTotalPrice());
  }, [items]);

  useEffect(async () => {
    setIsLoading(true);
    await fetch("/api/cart", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) =>
        setItems(data.map((item) => ({ ...item, count: item.min })))
      )
      .catch((exception) => console.log(exception))
      .finally(() => setIsLoading(false));
  }, []);

  const calculateTotalPrice = () => {
    let newTotalPrice = 0;
    items.map((item) => {
      newTotalPrice += item.price * item.count;
    });
    return formatPrice(newTotalPrice);
  };

  return (
    <div className="container">
      <h3>Lista produktów</h3>
      {isLoading ? (
        <div>ładowanie</div>
      ) : (
        <>
          <ul>
            {items.map((item, index) => (
              <li className="row" key={index}>
                {item.name}, cena: {formatPrice(Number(item.price))}zł
                <PieceCounter
                  pid={item.pid}
                  min={item.min}
                  max={item.max}
                  isBlocked={item.isBlocked}
                  setItems={setItems}
                  initialCount={item.count}
                />
              </li>
            ))}
          </ul>
          <div className="total-price-box">
            Łączna suma zamówienia: {totalPrice}zł
          </div>
        </>
      )}
    </div>
  );
};

export { App };
