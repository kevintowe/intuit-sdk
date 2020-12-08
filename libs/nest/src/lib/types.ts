/**
 * Config
 */
export interface IntuitConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  redirectUri: string;
  frontEndRedirectUri: string;
  verifierToken: string; // webhook
}

export interface IntuitPersistence {
  saveToken(token: OAuthToken): Promise<void>;
  getToken(): Promise<OAuthToken>;
  create<T>(entityName: string, entity: T): Promise<void>;
  update<T>(entityName: string, entity: T): Promise<void>;
}

/**
 * OAuth
 */
export interface OAuthToken {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  x_refresh_token_expires_in: number;
  id_token: string;
  createdAt: number;
  realmId: string;
}

/**
 * Webhook
 */
export interface IntuitWebhookNotification {
  realmId: string;
  name: string;
  id: string;
  operation: WebhookActions;
  lastUpdated: string;
}

export type WebhookActions =
  | 'Create'
  | 'Merge'
  | 'Update'
  | 'Delete'
  | 'Void'
  | 'Emailed';

export type WebhookEntities =
  | 'Account'
  | 'Bill'
  | 'BillPayment'
  | 'Budget'
  | 'Class'
  | 'CreditMemo'
  | 'Currency'
  | 'Customer'
  | 'Department'
  | 'Deposit'
  | 'Employee'
  | 'Estimate'
  | 'Invoice'
  | 'Item'
  | 'JournalCode'
  | 'JournalEntry'
  | 'Payment'
  | 'PaymentMethod'
  | 'Preferences'
  | 'Purchase'
  | 'PurchaseOrder'
  | 'RefundReceipt'
  | 'SalesReceipt'
  | 'TaxAgency'
  | 'Term'
  | 'TimeActivity'
  | 'Transfer'
  | 'Vendor'
  | 'VendorCredit';

/**
 * Intuit Api
 */
