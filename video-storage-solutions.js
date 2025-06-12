// Option 1: IndexedDB for local browser storage
const saveToIndexedDB = async (videoBlob, fileName) => {
  const request = indexedDB.open("VideoInterviewDB", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos", { keyPath: "id", autoIncrement: true });
    }
  };

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["videos"], "readwrite");
      const store = transaction.objectStore("videos");

      store.add({
        fileName,
        videoBlob,
        timestamp: Date.now(),
        size: videoBlob.size,
      });

      transaction.oncomplete = () => resolve(fileName);
      transaction.onerror = () => reject(transaction.error);
    };
  });
};

// Option 2: Upload to server
const uploadVideoToServer = async (videoBlob, fileName) => {
  const formData = new FormData();
  formData.append("video", videoBlob, fileName);
  formData.append("questionId", questionId);
  formData.append("candidateId", candidateId);

  const response = await fetch("/api/video-interview/upload", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// Option 3: Cloud storage (AWS S3, Google Cloud Storage)
const uploadToCloudStorage = async (videoBlob, fileName) => {
  // Generate signed URL from backend
  const signedUrlResponse = await fetch("/api/video-interview/get-signed-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, contentType: "video/webm" }),
  });

  const { signedUrl } = await signedUrlResponse.json();

  // Upload directly to cloud storage
  await fetch(signedUrl, {
    method: "PUT",
    body: videoBlob,
    headers: { "Content-Type": "video/webm" },
  });

  return { fileName, cloudUrl: signedUrl.split("?")[0] };
};
