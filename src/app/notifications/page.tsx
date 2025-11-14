'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Check, Trash2, Package, ShoppingBag, MessageSquare, Gift, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { db, auth } from '@/firebase/config';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface UserData {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  [key: string]: any;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  orderId?: string;
  isRead: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
  actionLabel?: string;
  actionLink?: string;
  user?: UserData;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_shipped':
        return Package;
      case 'new_products':
        return ShoppingBag;
      case 'review_request':
        return MessageSquare;
      case 'welcome':
        return Gift;
      default:
        return Bell;
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp: { seconds: number } | Date) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp.seconds * 1000);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return 'Just now';
  };

  // Fetch notifications for the current user
  useEffect(() => {
    let isMounted = true;
    
    const fetchNotifications = async (user: FirebaseUser) => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // First, get the current user's ID
        const userId = user.uid;
        
        // Query all notifications and filter client-side to avoid index requirements
        const q = query(
          collection(db, 'notifications')
          // Remove the where clause to avoid needing a composite index
          // We'll filter by userId client-side
        );
        
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          if (!isMounted) return;
          
          const notificationsData: Notification[] = [];
          let unread = 0;
          
          // Define interface for raw notification data
          interface RawNotification {
            id: string;
            userId: string;
            type?: string;
            title?: string;
            message?: string;
            isRead?: boolean;
            orderId?: string;
            actionLabel?: string;
            actionLink?: string;
            createdAt: any;
          }

          // Process and filter notifications
          const allNotifications: RawNotification[] = [];
          
          querySnapshot.forEach((docItem) => {
            const data = docItem.data();
            allNotifications.push({
              id: docItem.id,
              userId: data.userId || '',
              type: data.type || '',
              title: data.title || '',
              message: data.message || '',
              isRead: Boolean(data.isRead),
              orderId: data.orderId,
              actionLabel: data.actionLabel,
              actionLink: data.actionLink,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            });
          });

          // Filter by userId and sort by createdAt
          const userNotifications = allNotifications
            .filter(notification => notification.userId === userId)
            .sort((a, b) => {
              const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
              const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
              return timeB - timeA;
            });
          
          // Process filtered notifications
          const processNotifications = userNotifications.map(async (notification) => {
            const notificationData: Notification = {
              id: notification.id,
              userId: notification.userId,
              type: notification.type || '',
              title: notification.title || '',
              message: notification.message || '',
              isRead: Boolean(notification.isRead),
              orderId: notification.orderId,
              actionLabel: notification.actionLabel,
              actionLink: notification.actionLink,
              createdAt: notification.createdAt,
            };
            
            // Get user data for this notification
            try {
              if (notification.userId) {
                const userDoc = await getDoc(doc(db, 'users', notification.userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  notificationData.user = {
                    id: userDoc.id,
                    displayName: userData.displayName || '',
                    email: userData.email || '',
                    photoURL: userData.photoURL || '',
                    ...userData
                  } as UserData;
                }
              }
            } catch (error) {
              }
            
            if (!notification.isRead) unread++;
            return notificationData;
          });
          
          // Wait for all notifications to be processed
          const processedNotifications = await Promise.all(processNotifications);
          
          if (!isMounted) return;
          
          setNotifications(processedNotifications);
          setUnreadCount(unread);
          setLoading(false);
        }, (error) => {
          if (isMounted) {
            setLoading(false);
          }
        });
        
        return () => unsubscribe();
        
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!isMounted) return;
      
      setCurrentUser(user);
      
      if (!user) {
        setLoading(false);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      fetchNotifications(user);
    });
    
    return () => {
      isMounted = false;
      unsubscribeAuth();
    };
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!currentUser) return;
    
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { isRead: true });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser || notifications.length === 0) return;
    
    try {
      const batch = notifications
        .filter(notif => !notif.isRead)
        .map(notif => 
          updateDoc(doc(db, 'notifications', notif.id), { isRead: true })
        );
      
      await Promise.all(batch);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({
          ...notif,
          isRead: true
        }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, 'notifications', id));
      
      // Update local state
      setNotifications(prev => {
        const updated = prev.filter(notif => notif.id !== id);
        // Update unread count if the deleted notification was unread
        const deletedNotif = prev.find(notif => notif.id === id);
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        return updated;
      });
    } catch (error) {
      }
  };

  const handleClearAll = async () => {
    if (!currentUser || notifications.length === 0) return;
    
    try {
      const batch = notifications.map(notif => 
        deleteDoc(doc(db, 'notifications', notif.id))
      );
      
      await Promise.all(batch);
      
      // Clear local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-gray-600">Loading your notifications...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your notifications</p>
          <Link 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="text-center mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      {unreadCount} {unreadCount === 1 ? 'alert' : 'alerts'}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-sm text-gray-600">{unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className={`text-sm ${unreadCount > 0 ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                >
                  Mark all as read
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications yet</h3>
            <p className="text-gray-500">We'll let you know when something new arrives</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const isUnread = !notification.isRead;
            
            return (
              <div 
                key={notification.id} 
                className={`bg-white rounded-xl shadow-sm border ${isUnread ? 'border-l-4 border-l-blue-500' : 'border-gray-200'} p-4 transition-all hover:shadow-md cursor-pointer`}
                onClick={() => isUnread && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isUnread ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <Icon className={`w-5 h-5 ${isUnread ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {notification.user?.displayName ? `${notification.user.displayName}: ` : ''}
                      {notification.message}
                    </p>
                    {notification.actionLabel && notification.actionLink && (
                      <div className="mt-3">
                        <Link 
                          href={notification.actionLink}
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.actionLabel}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
