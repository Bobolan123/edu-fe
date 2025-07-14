'use client'

import React, { createContext, useContext, useState, ReactNode } from "react";

type supportedCurrencies = "VND"|"USD"
type CurrencyContextType = {
    currency: string;
    setCurrency: (currency: supportedCurrencies) => void;
};
const CurrencyContext = createContext<CurrencyContextType | undefined>(
    undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<supportedCurrencies>("VND");

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};
