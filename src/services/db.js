let db;
let version = 1;

export const storeName = "cards";

export const initDB = () => {
  return new Promise((resolve) => {
    const request = indexedDB.open("cardsDB");

    request.onupgradeneeded = () => {
      db = request.result;

      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve({ success: true });
    };

    request.onerror = () => {
      resolve({ succes: false });
    };
  });
};

export const getStoreData = (storeName) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("cardsDB");

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve({ success: true, data: res.result });
      };
    };
  });
};

export const addData = (storeName, data) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("cardsDB", version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve({ success: true, data });
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve({ success: false, error });
      } else {
        resolve({ success: false, error: "Unknown error" });
      }
    };
  });
};

export const updateData = (storeName, data) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("cardsDB", version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.get(data.id);
      res.onsuccess = (event) => {
        let card = event.target.result;

        card = { ...card, ...data };

        const requestUpdate = store.put(card);
        requestUpdate.onerror = (event) => {
          resolve({ success: false, error: "Unknown error" });
        };
        requestUpdate.onsuccess = (event) => {
          resolve({ success: true, data: card });
        };
      };
      res.onerror = () => {
        const error = res.error?.message;
        if (error) {
          resolve({ success: false, error });
        } else {
          resolve({ success: false, error: "Unknown error" });
        }
      };
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve({ success: false, error });
      } else {
        resolve({ success: false, error: "Unknown error" });
      }
    };
  });
};

export const deleteData = (storeName, key) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("cardsDB", version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      res.onsuccess = () => {
        resolve({ success: true });
      };
      res.onerror = () => {
        const error = request.error?.message;
        console.log({ error });
        resolve({ success: false, error: "Unknow error" });
      };
    };
  });
};
