interface ExchangeRates {
    [key: string]: number;
  }
  
  class CurrencyService {
    private rates: ExchangeRates = {};
    private lastUpdate: number = 0;
    private readonly CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 hour x 24h
  
    async getExchangeRates(): Promise<ExchangeRates> {
      const now = Date.now();
  
      if (this.rates && (now - this.lastUpdate) < this.CACHE_DURATION) {
        return this.rates;
      }
  
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/VND');
        const data = await response.json();
  
        this.rates = data.rates;
        this.lastUpdate = now;
  
        return this.rates;
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return this.rates || { USD: 0.038, VND: 1 };
      }
    }
  
    async convertPrice(
        amount: number,
        fromCurrency: string = 'VND',
        toCurrency: string = 'VND'
      ): Promise<number> {
        if (fromCurrency === toCurrency) return amount;
      
        const rates = await this.getExchangeRates();
      
        // Safety checks
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
      
        if (!fromRate || !toRate) {
          throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
        }
      
        // Convert amount to VND first if not already in VND
        const amountInVND = fromCurrency === 'VND' ? amount : amount / fromRate;
      
        // Then convert from VND to the target currency
        const convertedAmount = toCurrency === 'VND' ? amountInVND : amountInVND * toRate;
      
        return Math.round(convertedAmount * 100) / 100;
      }
        
      formatPrice(amount: number, currency: string = 'VND'): string {
        const localeMap: Record<string, string> = {
          VND: 'vi-VN',
          USD: 'en-US',
        };
      
        const locale = localeMap[currency] || 'vi-VN';
      
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          currencyDisplay: 'symbol',
        }).format(amount);
      }

      // Method to get payment currency based on payment method
      getPaymentCurrency(paymentMethod: 'vnpay' | 'paypal'): string {
        return paymentMethod === 'vnpay' ? 'VND' : 'USD';
      }
      
  }
  
  export const currencyService = new CurrencyService();
  