import clientPromise from '@/lib/mongodb';

export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients',
  CASES: 'cases',
  PAYMENTS: 'payments',
  AGREEMENTS: 'caseworkerAgreements',
  PROFIT_DISTRIBUTIONS: 'profitDistributions',
  AUDIT_LOGS: 'auditLogs',
  NOTIFICATIONS: 'notifications',
};

export async function getCollection(collectionName) {
  const client = await clientPromise;
  const db = client.db('lawapp');
  return db.collection(collectionName);
}