import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface DBUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  loginCount: number;
}

export interface DBOrder {
  id: string;
  userId: string;
  email: string;
  company: string;
  items: { title: string; type: string; price: number; billing: string }[];
  total: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  poNumber?: string;
}

export interface DBDownload {
  id: string;
  userId: string;
  assetId: string;
  fileName: string;
  downloadedAt: string;
}

export interface DBEntitlement {
  id: string;
  userId: string;
  productSlug: string;
  grantedAt: string;
  expiresAt: string | null;
}

export interface DBInteraction {
  id: string;
  userId?: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  page: string;
}

interface BlueprintDB extends DBSchema {
  users: {
    key: string;
    value: DBUser;
    indexes: { 'by-email': string; 'by-lastLogin': string };
  };
  orders: {
    key: string;
    value: DBOrder;
    indexes: { 'by-userId': string; 'by-status': string; 'by-submittedAt': string };
  };
  downloads: {
    key: string;
    value: DBDownload;
    indexes: { 'by-userId': string; 'by-assetId': string };
  };
  entitlements: {
    key: string;
    value: DBEntitlement;
    indexes: { 'by-userId': string; 'by-productSlug': string };
  };
  interactions: {
    key: string;
    value: DBInteraction;
    indexes: { 'by-userId': string; 'by-event': string; 'by-timestamp': string };
  };
}

const DB_NAME = 'blueprint_db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<BlueprintDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<BlueprintDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BlueprintDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email', { unique: true });
        userStore.createIndex('by-lastLogin', 'lastLogin');
      }

      // Orders store
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
        orderStore.createIndex('by-userId', 'userId');
        orderStore.createIndex('by-status', 'status');
        orderStore.createIndex('by-submittedAt', 'submittedAt');
      }

      // Downloads store
      if (!db.objectStoreNames.contains('downloads')) {
        const downloadStore = db.createObjectStore('downloads', { keyPath: 'id' });
        downloadStore.createIndex('by-userId', 'userId');
        downloadStore.createIndex('by-assetId', 'assetId');
      }

      // Entitlements store
      if (!db.objectStoreNames.contains('entitlements')) {
        const entitlementStore = db.createObjectStore('entitlements', { keyPath: 'id' });
        entitlementStore.createIndex('by-userId', 'userId');
        entitlementStore.createIndex('by-productSlug', 'productSlug');
      }

      // Interactions store
      if (!db.objectStoreNames.contains('interactions')) {
        const interactionStore = db.createObjectStore('interactions', { keyPath: 'id' });
        interactionStore.createIndex('by-userId', 'userId');
        interactionStore.createIndex('by-event', 'event');
        interactionStore.createIndex('by-timestamp', 'timestamp');
      }
    },
  });

  return dbInstance;
}

// ─── Users ──────────────────────────────────────────────

export async function dbPutUser(user: DBUser): Promise<void> {
  const db = await getDB();
  await db.put('users', user);
}

export async function dbGetUser(id: string): Promise<DBUser | undefined> {
  const db = await getDB();
  return db.get('users', id);
}

export async function dbGetUserByEmail(email: string): Promise<DBUser | undefined> {
  const db = await getDB();
  return db.getFromIndex('users', 'by-email', email);
}

export async function dbGetAllUsers(): Promise<DBUser[]> {
  const db = await getDB();
  return db.getAll('users');
}

// ─── Orders ─────────────────────────────────────────────

export async function dbPutOrder(order: DBOrder): Promise<void> {
  const db = await getDB();
  await db.put('orders', order);
}

export async function dbGetOrder(id: string): Promise<DBOrder | undefined> {
  const db = await getDB();
  return db.get('orders', id);
}

export async function dbGetOrdersByUser(userId: string): Promise<DBOrder[]> {
  const db = await getDB();
  return db.getAllFromIndex('orders', 'by-userId', userId);
}

export async function dbGetAllOrders(): Promise<DBOrder[]> {
  const db = await getDB();
  return db.getAll('orders');
}

// ─── Downloads ──────────────────────────────────────────

export async function dbAddDownload(record: DBDownload): Promise<void> {
  const db = await getDB();
  await db.put('downloads', record);
}

export async function dbGetDownloadsByUser(userId: string): Promise<DBDownload[]> {
  const db = await getDB();
  return db.getAllFromIndex('downloads', 'by-userId', userId);
}

// ─── Entitlements ───────────────────────────────────────

export async function dbPutEntitlement(ent: DBEntitlement): Promise<void> {
  const db = await getDB();
  await db.put('entitlements', ent);
}

export async function dbGetEntitlementsByUser(userId: string): Promise<DBEntitlement[]> {
  const db = await getDB();
  return db.getAllFromIndex('entitlements', 'by-userId', userId);
}

// ─── Interactions ───────────────────────────────────────

export async function dbAddInteraction(interaction: DBInteraction): Promise<void> {
  const db = await getDB();
  await db.put('interactions', interaction);
}

export async function dbGetRecentInteractions(limit = 100): Promise<DBInteraction[]> {
  const db = await getDB();
  const all = await db.getAll('interactions');
  return all
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit);
}

// ─── Migration from localStorage ────────────────────────

const MIGRATION_KEY = 'blueprint_idb_migrated';

export async function migrateFromLocalStorage(): Promise<void> {
  if (localStorage.getItem(MIGRATION_KEY)) return;

  try {
    // Migrate users
    const usersRaw = localStorage.getItem('blueprint_users');
    if (usersRaw) {
      const users: Record<string, { user: { id: string; email: string; firstName: string; lastName: string; company?: string; role: string; createdAt: string; lastLogin: string } }> = JSON.parse(usersRaw);
      for (const entry of Object.values(users)) {
        await dbPutUser({
          ...entry.user,
          loginCount: 1,
        });
      }
    }

    // Migrate entitlements
    const entsRaw = localStorage.getItem('blueprint_entitlements');
    if (entsRaw) {
      const allEnts: Record<string, { productSlug: string; grantedAt: string; expiresAt: string | null }[]> = JSON.parse(entsRaw);
      for (const [userId, ents] of Object.entries(allEnts)) {
        for (const ent of ents) {
          await dbPutEntitlement({
            id: crypto.randomUUID(),
            userId,
            ...ent,
          });
        }
      }
    }

    // Migrate downloads
    const dlRaw = localStorage.getItem('blueprint_downloads');
    if (dlRaw) {
      const allDl: Record<string, { assetId: string; downloadedAt: string; fileName: string }[]> = JSON.parse(dlRaw);
      for (const [userId, records] of Object.entries(allDl)) {
        for (const rec of records) {
          await dbAddDownload({
            id: crypto.randomUUID(),
            userId,
            ...rec,
          });
        }
      }
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
  } catch {
    // Migration is best-effort — localStorage fallbacks still work
  }
}
