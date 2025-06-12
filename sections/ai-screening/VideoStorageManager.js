// filepath: d:\aihrfrontend\sections\ai-screening\VideoStorageManager.js
"use client";

import React, { useState, useRef } from "react";
import {
  Cloud,
  HardDrive,
  Database,
  Upload,
  Download,
  Trash2,
  FileVideo,
} from "lucide-react";

class VideoStorageManager {
  constructor() {
    this.storageOptions = {
      indexedDB: { available: false, size: 0 },
      localStorage: { available: false, size: 0 },
      webkitStorage: { available: false, size: 0 },
      memoryStorage: { available: true, size: 0 },
    };

    this.initializeStorage();
  }

  async initializeStorage() {
    // Check IndexedDB
    try {
      const db = await this.openIndexedDB();
      this.storageOptions.indexedDB.available = true;
      db.close();
    } catch (error) {
      console.warn("IndexedDB not available:", error);
    }

    // Check localStorage
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      this.storageOptions.localStorage.available = true;
    } catch (error) {
      console.warn("localStorage not available:", error);
    }

    // Check webkitStorage (for large files)
    try {
      if (
        "webkitStorageInfo" in navigator &&
        "requestQuota" in navigator.webkitStorageInfo
      ) {
        this.storageOptions.webkitStorage.available = true;
      }
    } catch (error) {
      console.warn("webkitStorage not available:", error);
    }
  }

  async openIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("VideoInterviewDB", 2);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create videos store
        if (!db.objectStoreNames.contains("videos")) {
          const videoStore = db.createObjectStore("videos", {
            keyPath: "id",
            autoIncrement: true,
          });
          videoStore.createIndex("fileName", "fileName", { unique: false });
          videoStore.createIndex("timestamp", "timestamp", { unique: false });
          videoStore.createIndex("questionIndex", "questionIndex", {
            unique: false,
          });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains("metadata")) {
          const metaStore = db.createObjectStore("metadata", { keyPath: "id" });
          metaStore.createIndex("interviewId", "interviewId", {
            unique: false,
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveVideo(videoBlob, metadata = {}) {
    const videoData = {
      fileName: metadata.fileName || `video_${Date.now()}.webm`,
      questionIndex: metadata.questionIndex || 0,
      timestamp: Date.now(),
      size: videoBlob.size,
      type: videoBlob.type,
      interviewId: metadata.interviewId || this.generateInterviewId(),
      blob: videoBlob,
      ...metadata,
    };

    // Try IndexedDB first
    if (this.storageOptions.indexedDB.available) {
      try {
        return await this.saveToIndexedDB(videoData);
      } catch (error) {
        console.warn("IndexedDB save failed, trying localStorage:", error);
      }
    }

    // Fallback to localStorage (for smaller videos)
    if (
      this.storageOptions.localStorage.available &&
      videoBlob.size < 5 * 1024 * 1024
    ) {
      try {
        return await this.saveToLocalStorage(videoData);
      } catch (error) {
        console.warn("localStorage save failed, using memory storage:", error);
      }
    }

    // Fallback to memory storage
    return this.saveToMemory(videoData);
  }

  async saveToIndexedDB(videoData) {
    const db = await this.openIndexedDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["videos"], "readwrite");
      const store = transaction.objectStore("videos");
      const request = store.add(videoData);

      request.onsuccess = () => {
        console.log("✅ Video saved to IndexedDB:", videoData.fileName);
        resolve({
          id: request.result,
          url: URL.createObjectURL(videoData.blob),
          storage: "indexedDB",
          ...videoData,
        });
      };

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
    });
  }

  async saveToLocalStorage(videoData) {
    try {
      // Convert blob to base64 for localStorage
      const base64 = await this.blobToBase64(videoData.blob);
      const storageData = {
        ...videoData,
        blob: base64,
        storage: "localStorage",
      };

      const key = `video_${videoData.timestamp}`;
      localStorage.setItem(key, JSON.stringify(storageData));

      console.log("✅ Video saved to localStorage:", videoData.fileName);
      return {
        id: key,
        url: URL.createObjectURL(videoData.blob),
        storage: "localStorage",
        ...videoData,
      };
    } catch (error) {
      throw new Error("localStorage storage failed: " + error.message);
    }
  }

  saveToMemory(videoData) {
    if (!this.memoryStorage) {
      this.memoryStorage = new Map();
    }

    const id = `memory_${Date.now()}`;
    const storageData = {
      ...videoData,
      storage: "memory",
    };

    this.memoryStorage.set(id, storageData);

    console.log("✅ Video saved to memory:", videoData.fileName);
    return {
      id,
      url: URL.createObjectURL(videoData.blob),
      storage: "memory",
      ...videoData,
    };
  }

  async getAllVideos() {
    const videos = [];

    // Get from IndexedDB
    if (this.storageOptions.indexedDB.available) {
      try {
        const indexedDBVideos = await this.getFromIndexedDB();
        videos.push(...indexedDBVideos);
      } catch (error) {
        console.warn("Failed to retrieve from IndexedDB:", error);
      }
    }

    // Get from localStorage
    if (this.storageOptions.localStorage.available) {
      try {
        const localStorageVideos = await this.getFromLocalStorage();
        videos.push(...localStorageVideos);
      } catch (error) {
        console.warn("Failed to retrieve from localStorage:", error);
      }
    }

    // Get from memory
    if (this.memoryStorage) {
      const memoryVideos = Array.from(this.memoryStorage.entries()).map(
        ([id, data]) => ({
          id,
          url: URL.createObjectURL(data.blob),
          ...data,
        })
      );
      videos.push(...memoryVideos);
    }

    return videos.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getFromIndexedDB() {
    const db = await this.openIndexedDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["videos"], "readonly");
      const store = transaction.objectStore("videos");
      const request = store.getAll();

      request.onsuccess = () => {
        const videos = request.result.map((video) => ({
          id: video.id,
          url: URL.createObjectURL(video.blob),
          storage: "indexedDB",
          ...video,
        }));
        resolve(videos);
      };

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
    });
  }

  async getFromLocalStorage() {
    const videos = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("video_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.blob) {
            const blob = await this.base64ToBlob(data.blob, data.type);
            videos.push({
              id: key,
              url: URL.createObjectURL(blob),
              ...data,
              blob,
            });
          }
        } catch (error) {
          console.warn("Failed to parse localStorage video:", key, error);
        }
      }
    }

    return videos;
  }

  async deleteVideo(id, storage) {
    switch (storage) {
      case "indexedDB":
        return this.deleteFromIndexedDB(id);
      case "localStorage":
        return this.deleteFromLocalStorage(id);
      case "memory":
        return this.deleteFromMemory(id);
      default:
        throw new Error("Unknown storage type: " + storage);
    }
  }

  async deleteFromIndexedDB(id) {
    const db = await this.openIndexedDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["videos"], "readwrite");
      const store = transaction.objectStore("videos");
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log("✅ Video deleted from IndexedDB:", id);
        resolve();
      };

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
    });
  }

  deleteFromLocalStorage(id) {
    localStorage.removeItem(id);
    console.log("✅ Video deleted from localStorage:", id);
  }

  deleteFromMemory(id) {
    if (this.memoryStorage) {
      this.memoryStorage.delete(id);
      console.log("✅ Video deleted from memory:", id);
    }
  }

  async clearAllVideos() {
    // Clear IndexedDB
    if (this.storageOptions.indexedDB.available) {
      try {
        const db = await this.openIndexedDB();
        const transaction = db.transaction(["videos"], "readwrite");
        const store = transaction.objectStore("videos");
        await store.clear();
        db.close();
      } catch (error) {
        console.warn("Failed to clear IndexedDB:", error);
      }
    }

    // Clear localStorage
    if (this.storageOptions.localStorage.available) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("video_")) {
          keys.push(key);
        }
      }
      keys.forEach((key) => localStorage.removeItem(key));
    }

    // Clear memory
    if (this.memoryStorage) {
      this.memoryStorage.clear();
    }

    console.log("✅ All videos cleared from storage");
  }

  async getStorageStats() {
    const stats = {
      indexedDB: { count: 0, size: 0 },
      localStorage: { count: 0, size: 0 },
      memory: { count: 0, size: 0 },
      total: { count: 0, size: 0 },
    };

    const videos = await this.getAllVideos();

    videos.forEach((video) => {
      stats[video.storage].count++;
      stats[video.storage].size += video.size || 0;
      stats.total.count++;
      stats.total.size += video.size || 0;
    });

    return stats;
  }

  generateInterviewId() {
    return `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async base64ToBlob(base64, type) {
    const response = await fetch(base64);
    return response.blob();
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// React component for managing video storage
const VideoStorageUI = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState([]);
  const [storageStats, setStorageStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const storageManager = useRef(new VideoStorageManager());

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const allVideos = await storageManager.current.getAllVideos();
      const stats = await storageManager.current.getStorageStats();
      setVideos(allVideos);
      setStorageStats(stats);
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (id, storage) => {
    try {
      await storageManager.current.deleteVideo(id, storage);
      await loadVideos(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  const clearAllVideos = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all videos? This action cannot be undone."
      )
    ) {
      try {
        await storageManager.current.clearAllVideos();
        await loadVideos();
      } catch (error) {
        console.error("Failed to clear videos:", error);
      }
    }
  };

  React.useEffect(() => {
    loadVideos();
  }, []);

  const getStorageIcon = (storage) => {
    switch (storage) {
      case "indexedDB":
        return <Database className="w-4 h-4 text-blue-500" />;
      case "localStorage":
        return <HardDrive className="w-4 h-4 text-green-500" />;
      case "memory":
        return <Cloud className="w-4 h-4 text-orange-500" />;
      default:
        return <FileVideo className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Video Storage Manager
        </h3>
        <div className="flex gap-2">
          <button
            onClick={loadVideos}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={clearAllVideos}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear All
          </button>
        </div>
      </div>

      {storageStats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">IndexedDB</span>
            </div>
            <div className="text-sm text-blue-600">
              {storageStats.indexedDB.count} videos (
              {storageManager.current.formatFileSize(
                storageStats.indexedDB.size
              )}
              )
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">localStorage</span>
            </div>
            <div className="text-sm text-green-600">
              {storageStats.localStorage.count} videos (
              {storageManager.current.formatFileSize(
                storageStats.localStorage.size
              )}
              )
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Memory</span>
            </div>
            <div className="text-sm text-orange-600">
              {storageStats.memory.count} videos (
              {storageManager.current.formatFileSize(storageStats.memory.size)})
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileVideo className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Total</span>
            </div>
            <div className="text-sm text-gray-600">
              {storageStats.total.count} videos (
              {storageManager.current.formatFileSize(storageStats.total.size)})
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No videos stored. Record some videos to see them here.
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <div className="flex-shrink-0">
                {getStorageIcon(video.storage)}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {video.fileName}
                </div>
                <div className="text-sm text-gray-600">
                  Question {video.questionIndex + 1} •{" "}
                  {storageManager.current.formatFileSize(video.size)} •
                  {new Date(video.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onVideoSelect && onVideoSelect(video)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  View
                </button>
                <button
                  onClick={() => deleteVideo(video.id, video.storage)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { VideoStorageManager, VideoStorageUI };
