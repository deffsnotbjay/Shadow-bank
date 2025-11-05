// API client for shadow banking backend
const API_BASE_URL = "https://shadow-system-backend-8.onrender.com";

export interface Transaction {
    id: string;
    accountId: string;
    amount: number;
    status: "pending" | "posted" | "reversed";
    timestamp: string;
}

export interface Transfer {
    id: string;
    from: string;
    to: string;
    amount: number;
    type: "TRANSFER";
    status: "pending" | "posted" | "reversed";
    timestamp: string;
}

export interface Balance {
    total: number;
    available: number;
}

export interface LedgerEntry {
    id: string;
    accountId: string;
    amount: number;
    type: string;
    status: string;
    timestamp: string;
}

// POST /nip/credit - Create a new credit transaction
export async function createCredit(accountId: string, amount: number): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/nip/credit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId, amount }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create credit: ${response.statusText}`);
    }

    return response.json();
}

// POST /provisional/{txtId} - Mark transaction as provisional (pending)
export async function markAsProvisional(txtId: string): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/provisional/${txtId}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error(`Failed to mark as provisional: ${response.statusText}`);
    }

    return response.json();
}

// POST /post/{txtId} - Post a transaction
export async function postTransaction(txtId: string): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/post/${txtId}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error(`Failed to post transaction: ${response.statusText}`);
    }

    return response.json();
}

// POST /reverse/{txtId} - Reverse a transaction
export async function reverseTransaction(txtId: string): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/reverse/${txtId}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error(`Failed to reverse transaction: ${response.statusText}`);
    }

    return response.json();
}

// GET /transactions - Get all transactions
export async function getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    return response.json();
}

// GET /ledger/{accountId} - Get ledger for specific account
export async function getAccountLedger(accountId: string): Promise<LedgerEntry[]> {
    const response = await fetch(`${API_BASE_URL}/ledger/${accountId}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ledger: ${response.statusText}`);
    }

    return response.json();
}

// Helper function to calculate balance from ledger entries
export function calculateBalanceFromLedger(ledger: LedgerEntry[]): Balance {
    let total = 0;
    let available = 0;

    ledger.forEach((entry) => {
        if (entry.status === "posted") {
            total += entry.amount;
            available += entry.amount;
        } else if (entry.status === "pending") {
            total += entry.amount;
            // Pending amounts are not available yet
        }
    });

    return { total, available };
}

// Get balances for all accounts
export async function getAllBalances(): Promise<Record<string, Balance>> {
    const transactions = await getAllTransactions();
    const balances: Record<string, Balance> = {};

    // Group transactions by accountId
    const accountIds = [...new Set(transactions.map((t) => t.accountId))];

    for (const accountId of accountIds) {
        const ledger = await getAccountLedger(accountId);
        balances[accountId] = calculateBalanceFromLedger(ledger);
    }

    return balances;
}
