# API Integration Documentation

This project has been integrated with the Shadow Banking Backend API hosted at:
**https://shadow-system-backend-8.onrender.com**

## API Endpoints Used

### Transaction Management

#### 1. Create Credit Transaction
- **Endpoint**: `POST /nip/credit`
- **Description**: Creates a new credit transaction for an account
- **Request Body**:
  ```json
  {
    "accountId": "string",
    "amount": number
  }
  ```
- **Response**: Returns the created transaction object
- **Used in**: `lib/api.ts` → `createCredit()`

#### 2. Mark as Provisional (Pending)
- **Endpoint**: `POST /provisional/{txtId}`
- **Description**: Marks a transaction as provisional/pending
- **URL Parameter**: `txtId` - Transaction ID
- **Used in**: `lib/api.ts` → `markAsProvisional()`

#### 3. Post Transaction
- **Endpoint**: `POST /post/{txtId}`
- **Description**: Posts a pending transaction, making funds available
- **URL Parameter**: `txtId` - Transaction ID
- **Response**: Returns the updated transaction object
- **Used in**: `lib/api.ts` → `postTransaction()`

#### 4. Reverse Transaction
- **Endpoint**: `POST /reverse/{txtId}`
- **Description**: Reverses a transaction
- **URL Parameter**: `txtId` - Transaction ID
- **Response**: Returns the reversed transaction object
- **Used in**: `lib/api.ts` → `reverseTransaction()`

### Data Retrieval

#### 5. Get All Transactions
- **Endpoint**: `GET /transactions`
- **Description**: Retrieves all transactions from the system
- **Response**: Array of transaction objects
- **Used in**: `lib/api.ts` → `getAllTransactions()`

#### 6. Get Account Ledger
- **Endpoint**: `GET /ledger/{accountId}`
- **Description**: Retrieves the ledger entries for a specific account
- **URL Parameter**: `accountId` - Account ID
- **Response**: Array of ledger entries
- **Used in**: `lib/api.ts` → `getAccountLedger()`

## Implementation Details

### Core Files

1. **`lib/api.ts`**
   - Contains all API client functions
   - Handles HTTP requests to the backend
   - Provides helper functions for balance calculation

2. **`hooks/use-shadow-storage.ts`**
   - Main React hook for state management
   - Integrates API calls with local React state
   - Handles loading, creating, posting, and reversing transactions
   - Falls back to localStorage for transfers and notifications (until API endpoints are available)

### Key Features

- **Async Operations**: All transaction operations are now asynchronous
- **Error Handling**: Comprehensive try-catch blocks with user-friendly error messages
- **Balance Calculation**: Balances are calculated from ledger entries returned by the API
- **Hybrid Storage**: 
  - Transactions and balances: Fetched from API
  - Transfers and notifications: Stored in localStorage (temporary)

### Data Flow

1. **On App Load**:
   ```
   useEffect → loadData() → getAllTransactions() + getAllBalances()
   → Update React state
   ```

2. **Creating a Transaction**:
   ```
   User action → createTransaction() → API: POST /nip/credit
   → Update local state → Reload data from API
   ```

3. **Posting a Transaction**:
   ```
   Admin action → postTransaction() → API: POST /post/{txtId}
   → Update local state → Reload balances from API
   ```

4. **Reversing a Transaction**:
   ```
   Admin action → reverseTransaction() → API: POST /reverse/{txtId}
   → Update local state → Reload balances from API
   ```

## Pages Updated

- **`app/admin/create/page.tsx`**: Create new transactions via API
- **`app/admin/transactions/page.tsx`**: Post/reverse transactions via API
- **`app/admin/page.tsx`**: View transaction statistics from API
- **`app/user/[id]/page.tsx`**: View account balance and transactions from API

## Migration Notes

### What Changed
- ✅ Transaction creation now uses API endpoint
- ✅ Transaction posting uses API endpoint
- ✅ Transaction reversal uses API endpoint
- ✅ Transactions are fetched from API
- ✅ Balances are calculated from API ledger data
- ⏳ Transfers still use localStorage (pending API endpoints)
- ⏳ Notifications still use localStorage (pending API endpoints)

### Future Enhancements
- Add API endpoints for transfers
- Add API endpoints for notifications
- Implement real-time updates using WebSockets
- Add proper authentication/authorization
- Implement pagination for transaction lists
- Add filtering and search capabilities

## Testing

To test the integration:

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```

3. **Test scenarios**:
   - Create a new transaction as admin
   - Post a pending transaction
   - Reverse a posted transaction
   - View account balance updates
   - Check that transactions persist across page refreshes

## Error Handling

The application handles various error scenarios:

- **Network errors**: Shows user-friendly error message
- **API failures**: Falls back to initial data and logs error
- **Invalid data**: Validates input before API calls
- **Loading states**: Shows loading indicators during API calls

## Configuration

The API base URL is configured in `lib/api.ts`:

```typescript
const API_BASE_URL = "https://shadow-system-backend-8.onrender.com";
```

To change the API endpoint, update this constant.
