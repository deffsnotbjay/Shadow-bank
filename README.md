# SHADOW - Banking Simulation Web App

A modern, cinematic banking simulation application that demonstrates instant payment processing with advanced transaction state management. Built with Next.js, TypeScript, and TailwindCSS.

**🎉 NOW WITH LIVE API INTEGRATION!** Connected to Shadow Banking Backend at `https://shadow-system-backend-8.onrender.com`

## ✨ What's New

### API Integration
- ✅ **Live Backend Connection**: Transactions now persist in a real database
- ✅ **Real-time Balance Updates**: Balances calculated from actual ledger data
- ✅ **RESTful API**: Full CRUD operations on transactions
- ✅ **Error Handling**: Robust error handling with user-friendly messages
- ✅ **Async Operations**: All API calls are asynchronous with loading states

### Quick Links
- 📚 **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- 📖 **[API Documentation](API_INTEGRATION.md)** - Complete API reference
- 📝 **[Integration Summary](INTEGRATION_SUMMARY.md)** - What changed and why

## Features

### Core Functionality
- **Real-Time Transaction Processing**: Watch transactions flow through multiple states (Received → Provisional → Posted → Reversed)
- **Dual Dashboard Architecture**: Separate, role-appropriate interfaces for Bank Administrators and End Users
- **Transaction Management**: Create, modify, and reverse transactions with state validation
- **Account Ledger**: Detailed transaction history with balance tracking and visualization
- **Advanced Analytics**: Transaction statistics and balance history charts

### Design & UX
- **Dark Theme with Neon Accents**: Sleek, cinematic financial-tech aesthetic
- **Glassmorphism UI**: Modern card-based design with backdrop blur effects
- **Smooth Animations**: Fade-in effects, pulse animations, and smooth transitions
- **Responsive Layout**: Optimized for desktop and tablet devices
- **Professional Polish**: Loading overlays, toast notifications, confirmation modals

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Typography**: Raleway (Google Fonts)
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **State Management**: React Hooks + API Integration
- **Backend API**: Shadow Banking Backend (Spring Boot)
- **Notifications**: react-hot-toast
- **Charts**: Recharts
- **Animations**: Framer Motion + CSS animations

## API Integration

### Backend Endpoints
- `POST /nip/credit` - Create new credit transaction
- `POST /provisional/{txtId}` - Mark transaction as provisional
- `POST /post/{txtId}` - Post transaction and update balance
- `POST /reverse/{txtId}` - Reverse posted transaction
- `GET /transactions` - Fetch all transactions
- `GET /ledger/{accountId}` - Get account ledger

### API Client
All API interactions are handled through `lib/api.ts`:
```typescript
import * as api from '@/lib/api'

// Create a transaction
const transaction = await api.createCredit('acc-demo-1', 5000)

// Post the transaction
await api.postTransaction(transaction.id)

// Get all transactions
const transactions = await api.getAllTransactions()
```

For detailed API documentation, see [API_INTEGRATION.md](API_INTEGRATION.md)



## Getting Started

### Prerequisites
- Node.js 18 or higher
- pnpm, npm, or yarn
- Internet connection (for API calls to backend)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd v0-remix-of-shadow-banking-simulator-main
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open the application**
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
   - User Dashboard: [http://localhost:3000/user/acc-demo-1](http://localhost:3000/user/acc-demo-1)

### Detailed Setup
For a complete setup guide with testing instructions, see [QUICKSTART.md](QUICKSTART.md)

### Building for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## Testing the API Integration

### Browser Console Test
```javascript
// Test API connection
fetch('https://shadow-system-backend-8.onrender.com/transactions')
  .then(r => r.json())
  .then(console.log)
```

### Using Test Utilities
```typescript
import { apiTests } from '@/lib/api-tests'

// Run complete workflow test
await apiTests.testCompleteWorkflow()

// Or test individual functions
await apiTests.testCreateCredit()
await apiTests.testGetAllTransactions()
```

For comprehensive testing guide, see [API_INTEGRATION.md](API_INTEGRATION.md)

## Usage

### Admin Dashboard
- View all transactions with real-time status updates
- Filter transactions by status (Received, Provisional, Posted, Reversed)
- Create new transactions with NIP reference, account, and amount
- Manage transaction states through action buttons
- Access detailed ledger for any account
- View comprehensive transaction statistics

### User Dashboard
- View personal account balance
- Monitor transaction status with color-coded indicators
- Access detailed transaction history
- View balance history chart
- Track transaction statistics

## Transaction States

- **Received**: Initial state when transaction is created
- **Provisional**: Transaction is being processed
- **Posted**: Transaction is confirmed and balance is updated
- **Reversed**: Transaction has been reversed or cancelled

## Color Scheme

- **Primary**: Cyan (#00d9ff) - Main accent and highlights
- **Background**: Deep Slate (#0f172a) - Dark theme base
- **Status Colors**:
  - Received: Blue (#3b82f6)
  - Provisional: Yellow (#fbbf24)
  - Posted: Green (#10b981)
  - Reversed: Red (#ef4444)

## Key Components

### TransactionCard
Displays transaction information with dynamic action buttons based on current status.

### StatusBadge
Color-coded badge showing transaction status with appropriate styling.

### BalanceChart
Recharts-based line chart showing balance history over time.

### TransactionStats
Grid of statistics cards showing transaction counts and amounts by status.

### LoadingOverlay
Full-screen loading indicator with animated dots and SHADOW branding.

### ConfirmationModal
Modal dialog for confirming critical actions like status changes.

## State Management

The application uses a hybrid approach:
- **API-backed State**: Transactions and balances are fetched from and persisted to the backend API
- **Local State**: Transfers and notifications (temporarily in localStorage until API endpoints are added)
- **React Hooks**: Custom `useShadowStorage` hook manages all state and API interactions
- **Real-time Updates**: State automatically refreshes after API mutations

### Architecture
```
User Action → Hook Function → API Call → Backend Database
                ↓                          ↓
           State Update ← Response ← Database
```

See [hooks/use-shadow-storage.ts](hooks/use-shadow-storage.ts) for implementation details.

## Future Enhancements

### Phase 1 (Current) ✅
- ✅ Real API integration for transactions
- ✅ Backend database persistence
- ✅ RESTful endpoints
- ✅ Balance calculation from ledger

### Phase 2 (Planned)
- [ ] Transfer API endpoints
- [ ] Notification API endpoints
- [ ] User authentication & authorization
- [ ] JWT token-based security

### Phase 3 (Roadmap)
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and search
- [ ] Export transaction reports
- [ ] Multi-currency support
- [ ] Analytics dashboard
- [ ] Mobile app version

## Performance Optimizations

- Async/await for non-blocking API operations
- Loading states for better UX
- Error boundaries for graceful failures
- Efficient state updates
- Optimized animations with GPU acceleration
- CSS containment for card grids
- Minified production builds

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader friendly

## Future Enhancements

### Phase 1 (Current) ✅
- ✅ Real API integration for transactions
- ✅ Backend database persistence
- ✅ RESTful endpoints
- ✅ Balance calculation from ledger

### Phase 2 (Planned)
- [ ] Transfer API endpoints
- [ ] Notification API endpoints
- [ ] User authentication & authorization
- [ ] JWT token-based security

### Phase 3 (Roadmap)
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and search
- [ ] Export transaction reports
- [ ] Multi-currency support
- [ ] Analytics dashboard
- [ ] Mobile app version

## Related Repositories

- **Backend API**: [shadow-backend](https://github.com/TobilobaLucas/shadow-backend) (Spring Boot)
- **Live API**: https://shadow-system-backend-8.onrender.com

## License

MIT

## Support

For issues or questions:
- Open an issue in this repository
- Check the [API Documentation](API_INTEGRATION.md)
- Review the [Quick Start Guide](QUICKSTART.md)
- See [Integration Summary](INTEGRATION_SUMMARY.md) for technical details
