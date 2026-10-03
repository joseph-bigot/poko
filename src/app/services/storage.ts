import { Injectable } from '@angular/core';
import { Month } from '../models/month';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly databaseName = 'poko-db';
  private readonly databaseVersion = 1;
  private readonly storeName = 'months';

  private databasePromise: Promise<IDBDatabase> | null = null;

  private openDatabase(): Promise<IDBDatabase> {
    if (this.databasePromise) {
      return this.databasePromise;
    }

    this.databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(
        this.databaseName,
        this.databaseVersion
      );

      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(this.storeName)) {
          database.createObjectStore(this.storeName, {
            keyPath: 'id',
          });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.databasePromise;
  }

  async saveMonth(month: Month): Promise<void> {
    const database = await this.openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        this.storeName,
        'readwrite'
      );

      const store = transaction.objectStore(this.storeName);

      store.put(month);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  async getMonth(id: string): Promise<Month | undefined> {
    const database = await this.openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        this.storeName,
        'readonly'
      );

      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getAllMonths(): Promise<Month[]> {
    const database = await this.openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        this.storeName,
        'readonly'
      );

      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteMonth(id: string): Promise<void> {
    const database = await this.openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        this.storeName,
        'readwrite'
      );

      const store = transaction.objectStore(this.storeName);

      store.delete(id);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }
}