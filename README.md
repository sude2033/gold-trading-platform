# 🏆 Gold Trading Platform

A professional-grade, full-stack gold trading Single-Page Application (SPA) built with React 18+ that allows users to monitor **real-time market prices**, execute trades, and manage their gold portfolio.

![Gold Trading Platform](https://img.shields.io/badge/React-18+-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🔐 **Secure Authentication**
- User registration with comprehensive validation
- Secure login/logout functionality
- Protected routes with session management
- 30-minute session timeout

### 📊 **Real-Time Market Data**
- **Live gold prices** from Metals.live API (free, no API key required)
- Automatic fallback to simulated data if API unavailable
- Price tracking for 24K, 22K, and 18K gold
- Interactive price history charts (7D, 30D, 90D views)
- Real-time price updates every 5 seconds
- Price change indicators with percentage

### 💰 **Transaction Management**
- **Buy gold** with real-time price calculations
- **Sell gold** from your holdings
- Automatic fee and tax calculations:
  - 2% processing fee
  - 3% GST
- Transaction confirmation modals
- Instant notifications for successful trades

### 📈 **Portfolio Management**
- Real-time portfolio value tracking
- Holdings breakdown by purity
- Profit/Loss calculations with percentages
- Average buy price tracking
- Dynamic value updates as market prices change

### 📜 **Transaction History**
- Complete transaction log
- Filter by type (Buy/Sell/All)
- Sort by date (newest/oldest)
- Detailed transaction breakdown
- Export-ready data structure

### 🎨 **Premium UI/UX**
- **Professional design** with deep blue and gold color scheme
- Fully responsive (Mobile, Tablet, Desktop)
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications
- Accessibility compliant (WCAG AA)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gold-trading-platform.git
   cd gold-trading-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📡 Real-Time API Integration

The platform uses **Metals.live API** for real-time gold prices:

- ✅ **Free tier** - No API key required
- ✅ **Real-time data** - Updates every 5 seconds
- ✅ **Automatic fallback** - Uses simulated data if API unavailable
- ✅ **USD to INR conversion** - Automatic currency conversion

### Optional: Enhanced API Support

For more features, you can add API keys for additional providers:

1. Create a `.env` file in the root directory:
   ```env
   VITE_GOLDAPI_KEY=your_goldapi_key_here
   ```

2. Sign up for free API keys:
   - [GoldAPI.io](https://www.goldapi.io/) - 100 requests/month free
   - [Metals-API.com](https://metals-api.com/) - 60-second updates

## 🏗️ Project Structure

```
gold-trading-platform/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── market/        # Market data components
│   │   ├── portfolio/     # Portfolio components
│   │   ├── transactions/  # Transaction components
│   │   └── ui/            # Reusable UI components
│   ├── contexts/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── MarketContext.jsx     # Market data state
│   │   └── PortfolioContext.jsx  # Portfolio state
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useNotification.js
│   │   └── useTransactionCalculation.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PortfolioPage.jsx
│   │   └── HistoryPage.jsx
│   ├── utils/
│   │   ├── validation.js      # Input validation
│   │   ├── formatting.js      # Data formatting
│   │   ├── marketData.js      # Market data logic
│   │   └── goldPriceAPI.js    # API integration
│   ├── styles/
│   │   └── variables.css      # CSS variables
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18+
- **Build Tool**: Vite 5.0
- **Routing**: React Router DOM 6+
- **Charts**: Recharts
- **Date Handling**: date-fns
- **State Management**: Context API + Custom Hooks
- **Styling**: CSS Modules + CSS Variables
- **Data Persistence**: LocalStorage
- **API Integration**: Metals.live API (free)

## 🎯 Key Features Explained

### Authentication System
- Email validation with regex patterns
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Input sanitization to prevent XSS attacks
- Session management with automatic timeout

### Market Data
- Real-time price fetching from Metals.live API
- Automatic USD to INR conversion (1 USD ≈ ₹83)
- Price calculation for different purities:
  - 24K: 99.9% pure gold
  - 22K: 91.6% pure gold (24K × 0.916)
  - 18K: 75% pure gold (24K × 0.75)
- 90-day price history with interactive charts

### Transaction Processing
- Real-time cost calculations
- Fee structure:
  - Subtotal = Quantity × Current Price
  - Processing Fee = 2% of subtotal
  - GST = 3% of (subtotal + fee) for buy, (subtotal - fee) for sell
- Average buy price tracking for profit/loss calculations

### Portfolio Calculations
- Current Value = Quantity × Current Market Price
- Invested Value = Quantity × Average Buy Price
- Profit/Loss = Current Value - Invested Value
- Profit/Loss % = (Profit/Loss / Invested Value) × 100

## 📱 Responsive Design

- **Mobile (320px+)**: Single column layout, stacked components
- **Tablet (768px+)**: Two-column grid, collapsible sidebar
- **Desktop (1024px+)**: Multi-column layout, full navigation

## ♿ Accessibility

- WCAG AA compliant (4.5:1 color contrast)
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- Focus indicators on all interactive elements

## 🔒 Security

- Input sanitization (XSS prevention)
- Client-side validation
- Session timeout (30 minutes)
- No sensitive data in LocalStorage
- Secure password requirements

> **Note**: This is a demo application. For production deployment:
> - Implement backend authentication (JWT tokens)
> - Use a database for data persistence
> - Add server-side validation
> - Implement HTTPS
> - Add CSRF protection
> - Use environment variables for API keys

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🧪 Testing

The application includes:
- Form validation testing
- Transaction calculation verification
- Portfolio value calculations
- Responsive layout testing
- LocalStorage persistence testing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Gold price data from [Metals.live](https://metals.live/)
- Icons and design inspiration from modern fintech applications
- Built with ❤️ using React and Vite

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with 💛 for gold traders and investors**
