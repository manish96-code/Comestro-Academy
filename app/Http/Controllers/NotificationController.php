<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Mark as read
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $request->user()->unreadNotifications()->where('id', $id)->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    // Mark all as read
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    // Clear all
    public function clear(Request $request): JsonResponse
    {
        $request->user()->notifications()->delete();

        return response()->json(['success' => true]);
    }
}
