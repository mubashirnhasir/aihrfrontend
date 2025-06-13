"use client";
import { useState, useEffect } from 'react';

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      removeNotification(id);
    }, duration);
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const showSuccess = (message, duration) => addNotification(message, 'success', duration);
  const showInfo = (message, duration) => addNotification(message, 'info', duration);
  const showWarning = (message, duration) => addNotification(message, 'warning', duration);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showInfo,
    showWarning
  };
};

export default useNotification;
