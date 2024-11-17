// let request;
let db;
let version = 1;

export const storeName = "cards";

export const initDB = () => {
  return new Promise((resolve) => {
    // open the connection
    const request = indexedDB.open("cardsDB");

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(storeName)) {
        console.log("Creating cards store");
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log("request.onsuccess - initDB", version);
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
      console.log("request.onsuccess - getAllData");
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
      console.log("request.onsuccess - addData", data);
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
    console.log({ data });

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.get(data.id);
      res.onsuccess = (event) => {
        // Get the old value that we want to update
        let card = event.target.result;

        // update the value(s) in the object that you want to change
        card = { ...card, ...data };

        // Put this updated object back into the database.
        const requestUpdate = store.put(card);
        requestUpdate.onerror = (event) => {
          resolve({ success: false, error: "Unknown error" });
          // Do something with the error
        };
        requestUpdate.onsuccess = (event) => {
          resolve({ success: true, data: card });
          // Success - the data is updated!
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
    console.log({storeName, key})
    // again open the connection
    const request = indexedDB.open("cardsDB", version);

    request.onsuccess = () => {
      console.log("request.onsuccess - deleteData", key);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);
      
      // add listeners that will resolve the Promise
      res.onsuccess = () => {
        console.log('teste')
        resolve({ success: true });
      };
      res.onerror = () => {
      const error = request.error?.message;
      console.log({error})
        resolve({ success: false, error: "Unknow error" });
      };
    };
  });
};
