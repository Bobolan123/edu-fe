import { currencyService } from "@/services/currency";
import { IOrder } from "../../types/entities";

// Export single order to CSV
export const exportSingleOrder = async (order: IOrder, currency: string = 'VND') => {
  const csvData = await formatOrderForCSV([order], currency);
  const filename = `order_${order.id}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvData, filename);
};

// Export multiple orders to CSV
export const exportAllOrders = async (orders: IOrder[], currency: string = 'VND') => {
  const csvData = await formatOrderForCSV(orders, currency);
  const filename = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvData, filename);
};

// Export single order to PDF (invoice-like format)
export const exportOrderAsPDF = async (order: IOrder, currency: string = 'VND') => {
  // Create HTML content for the order invoice
  const htmlContent = await formatOrderForPDF(order, currency);
  
  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

// Format orders data for CSV export
const formatOrderForCSV = async (orders: IOrder[], currency: string): Promise<string> => {
  const headers = [
    'Order ID',
    'Transaction ID',
    'Customer Name',
    'Customer Email',
    'Total Amount',
    'Currency',
    'Payment Method',
    'Status',
    'Created Date',
    'Updated Date'
  ];

  const rows = await Promise.all(orders.map(async (order) => {
    // Convert price if needed
    let formattedAmount: number = Number(order.totalPrice) || 0;
    
    if (currency === 'USD') {
      try {
        const convertedAmount = await currencyService.convertPrice(order.totalPrice, 'VND', 'USD');
        const numericAmount = Number(convertedAmount);
        formattedAmount = !isNaN(numericAmount) ? numericAmount : Number(order.totalPrice) || 0;
      } catch (error) {
        console.warn('Currency conversion failed, using original amount');
        formattedAmount = Number(order.totalPrice) || 0;
      }
    }

    // Final safety check - ensure we have a valid number
    if (typeof formattedAmount !== 'number' || isNaN(formattedAmount)) {
      formattedAmount = Number(order.totalPrice) || 0;
    }

    // Format the amount safely
    const amountString = formattedAmount.toFixed(2);

    return [
      order.id.toString(),
      order.transactionId || 'N/A',
      order.user?.name || 'Unknown',
      order.user?.email || 'No email',
      amountString,
      currency,
      order.paymentMethod,
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
      new Date(order.updatedAt).toLocaleDateString()
    ];
  }));

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

// Format single order for PDF export (invoice-like)
const formatOrderForPDF = async (order: IOrder, currency: string): Promise<string> => {
  // Convert price if needed
  let formattedAmount: number = Number(order.totalPrice) || 0;
  let currencySymbol = '₫';
  
  if (currency === 'USD') {
    try {
      const convertedAmount = await currencyService.convertPrice(order.totalPrice, 'VND', 'USD');
      const numericAmount = Number(convertedAmount);
      formattedAmount = !isNaN(numericAmount) ? numericAmount : Number(order.totalPrice) || 0;
      currencySymbol = '$';
    } catch (error) {
      console.warn('Currency conversion failed, using original amount');
      currency = 'VND';
      formattedAmount = Number(order.totalPrice) || 0;
    }
  }

  // Final safety check - ensure we have a valid number
  if (typeof formattedAmount !== 'number' || isNaN(formattedAmount)) {
    formattedAmount = Number(order.totalPrice) || 0;
    currency = 'VND';
  }

  const formattedPrice = currencyService.formatPrice(formattedAmount, currency);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Invoice - ${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1976d2; padding-bottom: 20px; }
        .company-name { font-size: 28px; font-weight: bold; color: #1976d2; margin-bottom: 10px; }
        .invoice-title { font-size: 24px; color: #666; }
        .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 30px 0; }
        .section { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .section h3 { margin-top: 0; color: #1976d2; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .status { 
          display: inline-block; 
          padding: 4px 12px; 
          border-radius: 16px; 
          font-size: 12px; 
          font-weight: bold; 
          text-transform: uppercase;
        }
        .status.completed { background: #e8f5e8; color: #2e7d32; }
        .status.pending { background: #fff3e0; color: #f57c00; }
        .status.failed { background: #ffebee; color: #d32f2f; }
        .total { 
          font-size: 24px; 
          font-weight: bold; 
          color: #2e7d32; 
          text-align: center; 
          margin: 30px 0; 
          padding: 20px; 
          background: #f0f8f0; 
          border-radius: 8px; 
        }
        .footer { 
          margin-top: 40px; 
          text-align: center; 
          color: #777; 
          font-size: 12px; 
          border-top: 1px solid #ddd; 
          padding-top: 20px; 
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">EduPlatform</div>
        <div class="invoice-title">Order Invoice</div>
      </div>

      <div class="order-info">
        <div class="section">
          <h3>Order Information</h3>
          <div class="info-row">
            <span class="label">Order ID:</span>
            <span class="value">#${order.id}</span>
          </div>
          <div class="info-row">
            <span class="label">Transaction ID:</span>
            <span class="value">${order.transactionId || 'N/A'}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value">
              <span class="status ${order.status.toLowerCase()}">${order.status}</span>
            </span>
          </div>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span class="value">${order.paymentMethod}</span>
          </div>
          <div class="info-row">
            <span class="label">Order Date:</span>
            <span class="value">${new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div class="section">
          <h3>Customer Information</h3>
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">${order.user?.name || 'Unknown'}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${order.user?.email || 'No email'}</span>
          </div>
          <div class="info-row">
            <span class="label">Customer ID:</span>
            <span class="value">#${order.user?.id || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div class="total">
        Total Amount: ${formattedPrice}
      </div>

      <div class="footer">
        <p>This is a computer-generated document. No signature required.</p>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `;
};

// Download CSV file
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};