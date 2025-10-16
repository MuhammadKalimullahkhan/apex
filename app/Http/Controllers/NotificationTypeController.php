<?php

namespace App\Http\Controllers;

use App\Models\NotificationType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationTypeController extends Controller
{
    /**
     * Display a listing of the notification types.
     */
    public function index()
    {
        $notificationTypes = NotificationType::with(['company', 'entryUser'])
            ->latest()
            ->paginate(10);

        return inertia('notification-types/index', [
            'notification_types' => $notificationTypes,
        ]);
    }


    /**
     * Show the form for creating a new notification type.
     */
    public function create()
    {
        return Inertia::render('notification-types/upsert');
    }

    /**
     * Store a newly created notification type in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_name' => 'required|string|max:255'
        ]);

        NotificationType::create($validated + [
            'company_id' => auth()->user()->company_id,
            'entry_user_id' => auth()->user()->id,
        ]);

        return redirect()->route('notifications-types.index')
            ->with('success', 'Notification type created successfully.');
    }

    /**
     * Show the form for editing the specified notification type.
     */
    public function edit(int $id)
    {
        $notificationType = NotificationType::find($id);
        return Inertia::render('notification-types/upsert', [
            'notification_type' => $notificationType,
        ]);
    }

    /**
     * Update the specified notification type in storage.
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'type_name' => 'required|string|max:255',
        ]);

        $notificationType = NotificationType::find($id);

        $notificationType->update($validated);

        return redirect()->route('notifications-types.index')
            ->with('success', 'Notification type updated successfully.');
    }

    /**
     * Remove the specified notification type from storage.
     */
    public function destroy(int $id)
    {
        NotificationType::find($id)->delete();

        return redirect()->route('notifications-types.index')
            ->with('success', 'Notification type deleted successfully.');
    }
}
