import { OAuthToken } from './types';

/**
 * Returns a formatted oauth token
 */
export function buildToken(authResponse: any) {
  const token: OAuthToken = {
    token_type: authResponse.token.token_type,
    access_token: authResponse.token.access_token,
    expires_in: authResponse.token.expires_in,
    refresh_token: authResponse.token.refresh_token,
    x_refresh_token_expires_in: authResponse.token.x_refresh_token_expires_in,
    id_token: authResponse.token.id_token,
    createdAt: Date.now(),
    realmId: authResponse.token.realmId,
  };
  return token;
}

/**
 * Accepts an entity name and makes the first character lowercase, for database references.
 */
export function prepEntityName(entity: string) {
  let firstChar = entity.charAt(0);
  firstChar = firstChar.toLowerCase();
  return firstChar + entity.substr(1);
}

/**
 * Returns the correct database path from an uppercase entity name that's already in the singular
 */
export function databaseName(entity: string) {
  return DatabaseNamesMap[entity];
}

const DatabaseNamesMap = {
  Account: 'accounts',
  Attachable: 'attachables',
  Bill: 'bills',
  BillPayment: 'billPayments',
  Budget: 'budgets',
  Class: 'classes',
  CompanyInfo: 'companyInfo',
  CreditMemo: 'creditMemos',
  Customer: 'customers',
  Department: 'departments',
  Deposit: 'deposits',
  Employee: 'employees',
  Estimate: 'estimates',
  ExchangeRate: 'exchangeRates',
  Invoice: 'invoices',
  Item: 'items',
  JournalCode: 'journalCodes',
  JournalEntry: 'journalEntries',
  Payment: 'payments',
  PaymentMethod: 'paymentMethods',
  Preferences: 'preferences',
  Purchase: 'purchases',
  PurchaseOrder: 'purchaseOrders',
  RefundReceipt: 'refundReceipts',
  Reports: 'reports',
  SalesReceipt: 'salesReceipts',
  TaxAgency: 'taxAgency',
  TaxCode: 'taxCodes',
  TaxRate: 'taxRates',
  Term: 'terms',
  TimeActivity: 'timeActivities',
  Vendor: 'vendors',
  VendorCredit: 'vendorCredits',
  ExchangeRates: 'exchangeRates',
};
