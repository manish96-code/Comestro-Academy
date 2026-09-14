import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import echo from '@/echo';

const STORAGE_KEY = 'comestro_admin_live_notifications';

export default function AdminNotificationBell({ user }) {
    const [notifications, setNotifications] = useState(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Persist notifications to local storage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        } catch {
            // Ignore storage errors
        }
    }, [notifications]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Connect to Echo and listen to Reverb private channel 'admin-notifications'
    useEffect(() => {
        if (!echo || !user || (user.role !== 'admin' && !user.is_admin)) {
            return;
        }

        const channel = echo.private('admin-notifications');

        channel.listen('.student.enrolled', (event) => {
            const newNotification = {
                id: event.id || String(Date.now()),
                studentName: event.student_name || 'Student',
                profilePic: event.profile_pic || null,
                courseId: event.course_id,
                courseTitle: event.course_title || 'Course',
                enrolledAt: event.enrolled_at || new Date().toISOString(),
                read: false,
            };

            setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]);

            toast.success(`${event.student_name} enrolled in ${event.course_title}`);
        });

        return () => {
            channel.stopListening('.student.enrolled');
            echo.leave('admin-notifications');
        };
    }, [user]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="Live Notifications"
                aria-label="Live Notifications"
            >
                <Bell className="h-4 w-4" />

                {/* Pulsing indicator when there are unread notifications */}
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </span>
                )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gray-50/90 border-b border-gray-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-600 text-white shadow-2xs">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllAsRead}
                                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
                                    title="Mark all as read"
                                >
                                    <CheckCheck className="h-3 w-3" />
                                    <span>Read all</span>
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="text-[11px] font-medium text-gray-400 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
                                    title="Clear notifications"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Clear</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications Scroll Area */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length > 0 ? (
                            notifications.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        markAsRead(item.id);
                                        if (item.courseId) {
                                            setIsOpen(false);
                                            router.visit(route('admin.courses.show', item.courseId));
                                        }
                                    }}
                                    className={`p-3.5 transition flex items-start gap-3 cursor-pointer hover:bg-gray-50 ${
                                        !item.read ? 'bg-indigo-50/40' : 'bg-white'
                                    }`}
                                >
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 overflow-hidden">
                                        {item.profilePic ? (
                                            <img
                                                src={item.profilePic}
                                                alt={item.studentName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            item.studentName?.charAt(0).toUpperCase() || 'S'
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-xs font-bold text-gray-900 truncate">
                                                {item.studentName}
                                            </p>
                                            <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                                                {item.enrolledAt
                                                    ? new Date(item.enrolledAt).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : 'Just now'}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-600 line-clamp-1">
                                            Enrolled in <strong className="text-gray-900">{item.courseTitle}</strong>
                                        </p>
                                    </div>

                                    {!item.read && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0 mt-2"></span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center space-y-2">
                                <div className="h-9 w-9 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                                    <Bell className="h-4 w-4" />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">No notifications</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
