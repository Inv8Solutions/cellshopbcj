'use client';

import { ArrowLeft, Bell, Check, Trash2, Package, ShoppingBag, MessageSquare, Gift } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      icon: Package,
      title: 'Order Processing',
      message: 'Your order #BJ-2024/105 is being prepared by our artisans at Baguio City Jail.',
      time: '1 day ago',
      isRead: false,
      actionLabel: 'View Details',
      actionLink: '/profile'
    },
    {
      id: 2,
      icon: ShoppingBag,
      title: 'New Products Added',
      message: 'Check out our latest collection of handwoven baskets from La Trinidad Municipal Jail.',
      time: '3 days ago',
      isRead: false,
      actionLabel: 'Browse Collection',
      actionLink: '/products'
    },
    {
      id: 3,
      icon: MessageSquare,
      title: 'Review Request',
      message: 'How was your recent purchase? Share your experience and help support our community.',
      time: '4 days ago',
      isRead: false,
      actionLabel: 'Write Review',
      actionLink: '#'
    },
    {
      id: 4,
      icon: Gift,
      title: 'Welcome to BJMP E-Commerce!',
      message: 'Thank you for joining our community. Every purchase supports rehabilitation programs.',
      time: '1 week ago',
      isRead: false,
      actionLabel: 'Learn More',
      actionLink: '/'
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  const handleClearAll = () => {
    console.log('Clear all notifications');
  };

  const handleDeleteNotification = (id: number) => {
    console.log('Delete notification:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{unreadCount}</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Mark All as Read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-6 border transition-all hover:shadow-md ${
                  notification.isRead ? 'border-gray-200' : 'border-gray-300'
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Mark as read"
                        >
                          <Bell className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      
                      <Link
                        href={notification.actionLink}
                        className="px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                      >
                        {notification.actionLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
