import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import {
    Bell,
    CheckCheck,
    Trash2,
    Video,
    Layers,
    ChevronRight,
} from 'lucide-react';
import echo from '@/echo';

export default function NotificationBell({ user }) {
    const { admin_notifications = [], student_notifications = [] } = usePage().props;
    const isAdmin = user?.role === 'admin' || Boolean(user?.is_admin);

    const initialList = isAdmin ? admin_notifications : student_notifications;
    const [notifications, setNotifications] = useState(initialList || []);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Sync state when Inertia page props update
    useEffect(() => {
        setNotifications(isAdmin ? admin_notifications : student_notifications);
    }, [admin_notifications, student_notifications, isAdmin]);

    // Close dropdown on outside click
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

    // Connect to Echo and listen to role-specific Reverb channel
    useEffect(() => {
        if (!echo || !user?.id) {
            return;
        }

        if (isAdmin) {
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
                toast.success(`${newNotification.studentName} enrolled in ${newNotification.courseTitle}`);
            });

            return () => {
                channel.stopListening('.student.enrolled');
                echo.leave('admin-notifications');
            };
        } else {
            const channel = echo.private(`student-notifications.${user.id}`);

            channel.listen('.content.added', (event) => {
                const newNotification = {
                    id: event.id || String(Date.now()),
                    type: event.type || 'lesson_added',
                    courseId: event.course_id,
                    courseTitle: event.course_title || 'Course',
                    courseSlug: event.course_slug || '',
                    moduleId: event.module_id,
                    moduleName: event.module_name || 'Module',
                    lessonId: event.lesson_id,
                    lessonTitle: event.lesson_title || 'Lecture',
                    isNewModule: Boolean(event.is_new_module),
                    message: event.message || 'New content added to your course',
                    addedAt: event.added_at || new Date().toISOString(),
                    read: false,
                };

                setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]);
                toast.success(newNotification.message);
            });

            return () => {
                channel.stopListening('.content.added');
                echo.leave(`student-notifications.${user.id}`);
            };
        }
    }, [user?.id, isAdmin]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        if (window.axios) {
            window.axios.post(route('notifications.readAll')).catch(() => {});
        }
    };

    const clearAll = () => {
        setNotifications([]);
        if (window.axios) {
            window.axios.delete(route('notifications.clear')).catch(() => {});
        }
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        if (window.axios && id) {
            window.axios.post(route('notifications.read', id)).catch(() => {});
        }
    };

    const handleNotificationClick = (item) => {
        markAsRead(item.id);
        setIsOpen(false);

        if (!isAdmin && item.courseSlug) {
            router.visit(route('student.courses.learn', item.courseSlug));
        } else if (isAdmin && item.courseId) {
            router.visit(route('admin.courses.show', item.courseId));
        }
    };

    const formatRelativeTime = (isoString) => {
        if (!isoString) return 'Just now';
        const date = new Date(isoString);
        const diffInSeconds = Math.floor((new Date() - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-200"
                title="Notifications"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />

                {/* Pulsing indicator when there are unread notifications */}
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 border border-white"></span>
                    </span>
                )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gray-50/90 border-b border-gray-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-indigo-600 text-white shadow-2xs">
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
                            notifications.map((item) => {
                                const badgeText = item.isNewModule
                                    ? 'New Chapter'
                                    : item.lessonTitle
                                    ? 'New Lecture'
                                    : 'Enrollment';

                                const title = item.lessonTitle || item.studentName || item.courseTitle;
                                const subtitle = item.studentName
                                    ? `Enrolled in ${item.courseTitle}`
                                    : `${item.courseTitle}${item.moduleName ? ` • ${item.moduleName}` : ''}`;
                                const time = item.enrolledAt || item.addedAt || item.createdAt;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleNotificationClick(item)}
                                        className={`p-3.5 hover:bg-gray-50/80 transition cursor-pointer flex items-start gap-3 group ${
                                            !item.read ? 'bg-indigo-50/30' : ''
                                        }`}
                                    >
                                        {/* Icon / Avatar */}
                                        <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs overflow-hidden">
                                            {item.profilePic ? (
                                                <img
                                                    src={item.profilePic}
                                                    alt={title}
                                                    className="h-full w-full object-cover rounded-lg"
                                                />
                                            ) : item.isNewModule ? (
                                                <Layers className="h-4 w-4" />
                                            ) : item.lessonTitle ? (
                                                <Video className="h-4 w-4" />
                                            ) : item.studentName ? (
                                                <span>{item.studentName.charAt(0).toUpperCase()}</span>
                                            ) : (
                                                <Bell className="h-4 w-4" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                    {badgeText}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono">
                                                    {formatRelativeTime(time)}
                                                </span>
                                                {!item.read && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 ml-auto shrink-0"></span>
                                                )}
                                            </div>

                                            <p className="text-xs font-semibold text-gray-900 group-hover:text-indigo-600 transition truncate">
                                                {title}
                                            </p>

                                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                                {subtitle}
                                            </p>
                                        </div>

                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-500 transition shrink-0 self-center" />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center">
                                <div className="h-10 w-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2.5">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <p className="text-xs font-semibold text-gray-800">No notifications yet</p>
                                <p className="text-[11px] text-gray-400 mt-1 max-w-[220px] mx-auto">
                                    You're all caught up! New updates and real-time alerts will appear here.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2.5 bg-gray-50/70 border-t border-gray-100 text-center">
                            <span className="text-[11px] text-gray-500">
                                Click a notification to open details
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
