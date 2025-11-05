/**
 * API Integration Test Examples
 * 
 * This file contains example code for testing the API integration.
 * You can use these examples in your browser console or create test pages.
 */

import * as api from './api';

// Example 1: Create a new credit transaction
async function testCreateCredit() {
    try {
        const transaction = await api.createCredit('acc-demo-1', 5000);
        console.log('✅ Transaction created:', transaction);
        return transaction;
    } catch (error) {
        console.error('❌ Failed to create credit:', error);
    }
}

// Example 2: Get all transactions
async function testGetAllTransactions() {
    try {
        const transactions = await api.getAllTransactions();
        console.log('✅ All transactions:', transactions);
        console.log(`Total: ${transactions.length} transactions`);
        return transactions;
    } catch (error) {
        console.error('❌ Failed to fetch transactions:', error);
    }
}

// Example 3: Post a transaction
async function testPostTransaction(txId: string) {
    try {
        const transaction = await api.postTransaction(txId);
        console.log('✅ Transaction posted:', transaction);
        return transaction;
    } catch (error) {
        console.error('❌ Failed to post transaction:', error);
    }
}

// Example 4: Reverse a transaction
async function testReverseTransaction(txId: string) {
    try {
        const transaction = await api.reverseTransaction(txId);
        console.log('✅ Transaction reversed:', transaction);
        return transaction;
    } catch (error) {
        console.error('❌ Failed to reverse transaction:', error);
    }
}

// Example 5: Get account ledger
async function testGetAccountLedger(accountId: string) {
    try {
        const ledger = await api.getAccountLedger(accountId);
        console.log(`✅ Ledger for ${accountId}:`, ledger);

        const balance = api.calculateBalanceFromLedger(ledger);
        console.log('Calculated balance:', balance);

        return { ledger, balance };
    } catch (error) {
        console.error('❌ Failed to fetch ledger:', error);
    }
}

// Example 6: Get all balances
async function testGetAllBalances() {
    try {
        const balances = await api.getAllBalances();
        console.log('✅ All account balances:', balances);
        return balances;
    } catch (error) {
        console.error('❌ Failed to fetch balances:', error);
    }
}

// Example 7: Complete workflow test
async function testCompleteWorkflow() {
    console.log('🚀 Starting complete workflow test...\n');

    // Step 1: Create a transaction
    console.log('Step 1: Creating transaction...');
    const newTransaction = await testCreateCredit();
    if (!newTransaction) return;

    console.log('\n⏳ Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Verify transaction exists
    console.log('Step 2: Verifying transaction exists...');
    const allTransactions = await testGetAllTransactions();
    const exists = allTransactions?.some(t => t.id === newTransaction.id);
    console.log(exists ? '✅ Transaction found' : '❌ Transaction not found');

    console.log('\n⏳ Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Post the transaction
    console.log('Step 3: Posting transaction...');
    await testPostTransaction(newTransaction.id);

    console.log('\n⏳ Waiting 2 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Check updated balance
    console.log('Step 4: Checking updated balance...');
    await testGetAccountLedger(newTransaction.accountId);

    console.log('\n✨ Complete workflow test finished!');
}

// Export test functions for use in browser console or test files
export const apiTests = {
    testCreateCredit,
    testGetAllTransactions,
    testPostTransaction,
    testReverseTransaction,
    testGetAccountLedger,
    testGetAllBalances,
    testCompleteWorkflow,
};

// Example usage instructions
export const USAGE_INSTRUCTIONS = `
To test the API integration:

1. Open browser console
2. Import the test functions:
   import { apiTests } from './lib/api-tests'

3. Run individual tests:
   await apiTests.testGetAllTransactions()
   await apiTests.testCreateCredit()
   
4. Run complete workflow:
   await apiTests.testCompleteWorkflow()

Note: Make sure the API server is running at:
https://shadow-system-backend-8.onrender.com
`;

console.log(USAGE_INSTRUCTIONS);
