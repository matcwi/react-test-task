import React, { useEffect, useState } from "react";
import { Button } from "../Button/button";

const PieceCounter = ({ pid, min, max, isBlocked, setItems, initialCount }) => {
  const [error, setError] = useState(false);
  const [count, setCount] = React.useState(initialCount);

  useEffect(() => {
    debounceOnChange();
  }, [count]);

  useEffect(() => {
    if (error) {
      handleCountChange("MIN");
    }
  }, [error]);

  const handleCountChange = (type) => {
    let newCount;
    switch (type) {
      case "INCREMENT": {
        newCount = count + 1;
        break;
      }
      case "DECREMENT": {
        newCount = count - 1;
        break;
      }
      default: {
        newCount = min;
        break;
      }
    }

    setCount(newCount);
    setItems((items) => {
      const elementIndex = items.findIndex((item) => item.pid === pid);
      let newArray = [...items];
      newArray[elementIndex].count = newCount;
      return newArray;
    });
  };

  const onIncrementClick = () => {
    if (!(max && count + 1 > max)) {
      handleCountChange("INCREMENT");
    }
  };

  const onDecrementClick = () => {
    if (!(min && count - 1 < min)) {
      handleCountChange("DECREMENT");
    }
  };

  const onChange = async () => {
    await fetch("/api/product/check", {
      method: "POST",
      body: JSON.stringify({ pid: pid, quantity: count }),
    })
      .then((res) => res.json())
      .then((res) => setError(res.isError));
  };

  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, delay);
    };
  };

  const debounceOnChange = React.useCallback(debounce(onChange, 400), [count]);

  return (
    <div>
      Obecnie masz {count} sztuk produktu
      <Button disabled={isBlocked || count === max} onClick={onIncrementClick}>
        +
      </Button>
      <Button disabled={isBlocked || count === min} onClick={onDecrementClick}>
        -
      </Button>
    </div>
  );
};

export { PieceCounter };
