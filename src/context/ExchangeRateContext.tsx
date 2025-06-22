"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
    import { getExchangeRateVND } from "../../utils/utils";

interface ExchangeRateContextType {
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
}

const ExchangeRateContext = createContext<ExchangeRateContextType>({
  exchangeRate: 26000, 
  setExchangeRate: () => {},
});

export const useExchangeRate = () => useContext(ExchangeRateContext);

export const ExchangeRateProvider = ({ children }: { children: React.ReactNode }) => {
  const [exchangeRate, setExchangeRate] = useState(25000);

  useEffect(() => {
    getExchangeRateVND('USD')
      .then(setExchangeRate)
      .catch(() => console.warn("Using default exchange rate"));
  }, []);

  return (
    <ExchangeRateContext.Provider value={{ exchangeRate, setExchangeRate }}>
      {children}
    </ExchangeRateContext.Provider>
  );
};
