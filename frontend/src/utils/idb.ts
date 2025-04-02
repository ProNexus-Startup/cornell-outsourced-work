import { openDB, IDBPDatabase } from "idb";
import apiService from "@/utils/api";
import MetaExpert, { metaExpertFromJson } from "@/models/meta_expert";

type DBInstance = IDBPDatabase;

class IndexedDBService {
  private static _instance: DBInstance | null = null;
  private static _isInitializing: boolean = false;
  private static _initializationPromise: Promise<void> | null = null;

  private static async ensureInitialized(): Promise<void> {
    if (!this._instance || this._isClosing()) {
      console.warn(
        "Database instance is closed or uninitialized. Reinitializing..."
      );
      await this.init();
    }
  }

  private static _isClosing(): boolean {
    try {
      this._instance?.transaction("projects", "readonly");
      return false; // If transaction succeeds, DB is open
    } catch (error) {
      return (
        error instanceof DOMException && error.name === "InvalidStateError"
      );
    }
  }

  static async init(): Promise<void> {
    if (this._isInitializing) {
      if (this._initializationPromise) {
        await this._initializationPromise;
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.init();
    }

    this._isInitializing = true;
    this._initializationPromise = (async () => {
      try {
        this._instance = await openDB("AdminDB", 3, {
          upgrade(db, oldVersion, newVersion) {
            if (!db.objectStoreNames.contains("experts")) {
              db.createObjectStore("experts", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("projects")) {
              db.createObjectStore("projects", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("userProfiles")) {
              db.createObjectStore("userProfiles", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("expertNetworkRelationships")) {
              db.createObjectStore("expertNetworkRelationships", {
                keyPath: "id",
              });
            }
            if (!db.objectStoreNames.contains("expertNetworks")) {
              db.createObjectStore("expertNetworks", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("columnPreferences")) {
              db.createObjectStore("columnPreferences", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("metaExperts")) {
              db.createObjectStore("metaExperts", { keyPath: "id" });
            }
          },
        });
      } catch (e) {
        console.error("Error initializing database:", e);
        throw e;
      } finally {
        this._isInitializing = false;
        this._initializationPromise = null;
      }
    })();

    await this._initializationPromise;
  }

  static get instance(): DBInstance {
    if (!this._instance || this._isClosing()) {
      throw new Error(
        "Database not initialized or is closed. Call IndexedDBService.init() first."
      );
    }
    return this._instance;
  }

  static async initializeDatabase(): Promise<void> {
    await this.ensureInitialized();
  }

  static async makeMetaExpertTable(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      const response = await apiService.generalPurposeRequest(
        "get",
        "meta-experts"
      );
      const responseBody = await response.json();

      const metaExperts = responseBody.metaExperts;
      if (!Array.isArray(metaExperts) || metaExperts.length === 0) {
        console.log("Meta experts data is empty or not an array");
        return true; // Table is empty
      }

      const db = this.instance;
      const transaction = db.transaction("metaExperts", "readwrite");

      for (const metaExpertJson of metaExperts) {
        // Convert the meta expert with its tags and jobs
        const metaExpert = metaExpertFromJson(metaExpertJson);

        await transaction.store.put(metaExpert);
      }

      await transaction.done;
      console.log(
        `Successfully stored ${metaExperts.length} meta experts in IndexedDB`
      );
      return false; // Table is not empty
    } catch (e) {
      console.error("Error in makeMetaExpertTable:", e);
      return true; // Consider table empty on error
    }
  }

  static async getAllMetaExperts(): Promise<MetaExpert[]> {
    try {
      await this.ensureInitialized();
      const db = this.instance;
      return await db.getAll("metaExperts");
    } catch (e) {
      console.error("Error fetching meta experts:", e);
      return [];
    }
  }

  static async clearTables(): Promise<void> {
    try {
      await this.ensureInitialized();
      const db = this.instance;

      // List of all store names
      const stores = [
        "experts",
        "projects",
        "userProfiles",
        "expertNetworkRelationships",
        "expertNetworks",
        "columnPreferences",
        "metaExperts",
      ];

      // Create a transaction for all stores
      const transaction = db.transaction(stores, "readwrite");

      // Clear each store and collect all promises
      const clearPromises = stores.map((storeName) => {
        const store = transaction.objectStore(storeName);
        return store.clear();
      });

      // Wait for all clear operations to complete
      await Promise.all(clearPromises);
      await transaction.done;
    } catch (error) {
      console.error("Failed to clear tables:", error);
      throw new Error("Failed to clear database tables: " + error.message);
    }
  }
  static async closeDB(): Promise<void> {
    await this.ensureInitialized();
    const db = this.instance;
    db.close();
    this._instance = null; // Reset the instance
  }

}

export default IndexedDBService;
