const DB_NAME = 'sha256_forense';
const DB_VERSION = 2; // Incrementado a 2 para agregar el store 'correos_forenses'

type StoreSchema = {
  name: string;
  keyPath: string;
  indexes?: { name: string; keyPath: string; unique?: boolean }[];
};

const STORES: StoreSchema[] = [
  {
    name: 'casos',
    keyPath: 'id',
    indexes: [
      { name: 'numero_caso', keyPath: 'numero_caso', unique: true },
      { name: 'estado', keyPath: 'estado' },
      { name: 'user_id', keyPath: 'user_id' },
    ],
  },
  {
    name: 'audit_logs',
    keyPath: 'id',
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' },
      { name: 'accion', keyPath: 'accion' },
      { name: 'casoId', keyPath: 'casoId' },
    ],
  },
  {
    name: 'tareas',
    keyPath: 'id',
    indexes: [
      { name: 'casoId', keyPath: 'casoId' },
      { name: 'estado', keyPath: 'estado' },
    ],
  },
  {
    name: 'evidencias',
    keyPath: 'id',
    indexes: [
      { name: 'casoId', keyPath: 'casoId' },
      { name: 'tipo', keyPath: 'tipo' },
    ],
  },
  {
    name: 'personal',
    keyPath: 'id',
    indexes: [
      { name: 'rol', keyPath: 'rol' },
    ],
  },
  {
    name: 'correos_forenses',
    keyPath: 'id',
    indexes: [
      { name: 'casoId', keyPath: 'casoId' },
      { name: 'fecha', keyPath: 'fecha' },
    ],
  },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      STORES.forEach(({ name, keyPath, indexes }) => {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath });
          indexes?.forEach((idx) => {
            store.createIndex(idx.name, idx.keyPath, { unique: idx.unique ?? false });
          });
        }
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getTransaction(storeName: string, mode: IDBTransactionMode = 'readonly') {
  return openDB().then((db) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    return { tx, store, db };
  });
}

export const indexedDBStorage = {
  async getItem<T>(storeName: string, id: string): Promise<T | null> {
    const { store, db } = await getTransaction(storeName);
    return new Promise((resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => {
        db.close();
        resolve(req.result ?? null);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  },

  async getAll<T>(storeName: string): Promise<T[]> {
    const { store, db } = await getTransaction(storeName);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        db.close();
        resolve(req.result ?? []);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  },

  async getAllByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    const { store, db } = await getTransaction(storeName);
    return new Promise((resolve, reject) => {
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => {
        db.close();
        resolve(req.result ?? []);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  },

  async setItem(storeName: string, value: any): Promise<void> {
    const { store, db } = await getTransaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.put(value);
      req.onsuccess = () => {
        db.close();
        resolve();
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  },

  async deleteItem(storeName: string, id: string): Promise<void> {
    const { store, db } = await getTransaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => {
        db.close();
        resolve();
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  },

  async clear(storeName: string): Promise<void> {
    const { store, db } = await getTransaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => {
        db.close();
        resolve();
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  },

  async getCount(storeName: string): Promise<number> {
    const { store, db } = await getTransaction(storeName);
    return new Promise((resolve, reject) => {
      const req = store.count();
      req.onsuccess = () => {
        db.close();
        resolve(req.result);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  },

  /** Exporta un store completo a JSON (para backup) */
  async exportToJSON(storeName: string): Promise<string> {
    const data = await this.getAll<any>(storeName);
    return JSON.stringify(data, null, 2);
  },

  /** Importa datos desde JSON a un store */
  async importFromJSON(storeName: string, json: string): Promise<number> {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) throw new Error('El JSON debe ser un array');
    const { store, db } = await getTransaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      let count = 0;
      const tx = store.transaction;
      data.forEach((item) => {
        store.put(item);
        count++;
      });
      tx.oncomplete = () => {
        db.close();
        resolve(count);
      };
    });
  },

  /** Puebla un store con datos iniciales si está vacío */
  async seedStoreIfEmpty(storeName: string, defaultData: any[]): Promise<number> {
    const count = await this.getCount(storeName).catch(() => 0);
    if (count === 0 && Array.isArray(defaultData) && defaultData.length > 0) {
      const { store, db } = await getTransaction(storeName, 'readwrite');
      return new Promise((resolve, reject) => {
        let inserted = 0;
        const tx = store.transaction;
        defaultData.forEach((item) => {
          store.put(item);
          inserted++;
        });
        tx.oncomplete = () => {
          db.close();
          console.info(`[IndexedDB] Store '${storeName}' sembrado exitosamente con ${inserted} registros iniciales.`);
          resolve(inserted);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      });
    }
    return 0;
  },
};
