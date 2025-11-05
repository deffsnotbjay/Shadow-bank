# Quick Start Guide - Shadow Banking Simulator with API Integration

## Prerequisites

- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- Internet connection (for API calls)

## Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
```

Or if you prefer npm:
```bash
npm install
```

### 2. Run Development Server

```bash
pnpm dev
```

The application will start at: **http://localhost:3000**

### 3. Access the Application

#### Admin Dashboard
- URL: `http://localhost:3000/admin`
- Features:
  - View transaction statistics
  - Create new transactions
  - Post/reverse transactions
  - Monitor all system activity

#### User Dashboard
- URL: `http://localhost:3000/user/acc-demo-1`
- URL: `http://localhost:3000/user/acc-demo-2`
- Features:
  - View account balance
  - See transaction history
  - Send money to other accounts
  - Receive notifications

## Quick Test Workflow

### Test 1: Create and Post a Transaction

1. **Go to Admin → Create Transaction**
   ```
   http://localhost:3000/admin/create
   ```

2. **Create a transaction**
   - Select Account: `acc-demo-1`
   - Enter Amount: `5000`
   - Click "Create Transaction"
   - ✅ You should see a success message

3. **View the transaction**
   ```
   http://localhost:3000/admin/transactions
   ```
   - Find your new transaction (status: pending)
   - Note the transaction ID

4. **Post the transaction**
   - Click "Post Transaction" button
   - ✅ Status changes to "posted"
   - Balance should update

5. **Check user dashboard**
   ```
   http://localhost:3000/user/acc-demo-1
   ```
   - ✅ Balance should reflect the new transaction
   - Transaction should appear in history

### Test 2: Reverse a Transaction

1. **Go to Admin → Transactions**
   ```
   http://localhost:3000/admin/transactions
   ```

2. **Find a posted transaction**
   - Click "Reverse" button
   - ✅ Status changes to "reversed"
   - Balance should decrease

### Test 3: Transfer Between Accounts

1. **Go to User Dashboard**
   ```
   http://localhost:3000/user/acc-demo-1
   ```

2. **Click "Send Money"**
   - Select recipient: `acc-demo-2`
   - Enter amount: `1000`
   - Click "Send"
   - ✅ Transfer created (awaiting admin confirmation)

3. **Admin posts the transfer**
   ```
   http://localhost:3000/admin/transactions
   ```
   - Find the pending transfer
   - Click "Post Transfer"
   - ✅ Funds moved to recipient

## API Endpoints Being Used

The application connects to:
```
https://shadow-system-backend-8.onrender.com
```

### Active Endpoints:
- ✅ POST `/nip/credit` - Create transaction
- ✅ POST `/post/{txtId}` - Post transaction
- ✅ POST `/reverse/{txtId}` - Reverse transaction
- ✅ GET `/transactions` - Get all transactions
- ✅ GET `/ledger/{accountId}` - Get account ledger

## Browser Console Testing

Open browser console and try:

```javascript
// Fetch all transactions
fetch('https://shadow-system-backend-8.onrender.com/transactions')
  .then(r => r.json())
  .then(console.log)

// Get ledger for an account
fetch('https://shadow-system-backend-8.onrender.com/ledger/acc-demo-1')
  .then(r => r.json())
  .then(console.log)
```

## Troubleshooting

### Issue: API calls fail with CORS error
**Solution**: The backend needs to allow your origin. Contact backend team.

### Issue: Transactions not loading
**Solution**: 
1. Check if backend is up: https://shadow-system-backend-8.onrender.com/transactions
2. Check browser console for errors
3. Verify internet connection

### Issue: "Cannot find module 'react'" error
**Solution**: 
```bash
rm -rf node_modules
pnpm install
```

### Issue: Port 3000 already in use
**Solution**: 
```bash
pnpm dev -p 3001
```

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Project Structure

```
.
├── app/                    # Next.js pages
│   ├── admin/             # Admin dashboard pages
│   ├── user/              # User dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── hooks/                 # Custom React hooks
│   └── use-shadow-storage.ts  # Main state management hook
├── lib/                   # Utilities
│   ├── api.ts            # API client (NEW!)
│   ├── api-tests.ts      # Test utilities (NEW!)
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Key Features

### For Administrators
- 📊 Dashboard with statistics
- ➕ Create credit transactions
- ✅ Post pending transactions
- ↩️ Reverse posted transactions
- 📋 View all system transactions
- 🔄 Transfer management

### For Users
- 💰 View total and available balance
- 📜 Transaction history
- 💸 Send money to other accounts
- 🔔 Receive notifications
- ⏱️ Track pending deposits

## What's New in This Version

✨ **API Integration**
- Transactions now persist in backend database
- Balances calculated from real ledger data
- Real-time updates from server
- Improved error handling

🔧 **Technical Improvements**
- Async/await for all API operations
- Better TypeScript typing
- Comprehensive error handling
- Loading states for better UX

## Next Steps

1. ✅ Test the basic workflow (create → post → reverse)
2. ✅ Verify balances update correctly
3. ✅ Test transfers between accounts
4. 📝 Read `API_INTEGRATION.md` for detailed documentation
5. 🧪 Run test utilities in `lib/api-tests.ts`

## Need Help?

- **API Documentation**: See `API_INTEGRATION.md`
- **Integration Details**: See `INTEGRATION_SUMMARY.md`
- **Code Examples**: See `lib/api-tests.ts`

---

**Ready to go!** 🚀

Start the development server and begin testing:
```bash
pnpm dev
```

Visit: http://localhost:3000/admin
