<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    // List coupons with metrics and filtering
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status'); // 'all', 'active', 'inactive', 'expired'

        $query = Coupon::withCount(['courses', 'usages']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status === 'active') {
            $query->where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                });
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        } elseif ($status === 'expired') {
            $query->whereNotNull('expires_at')->where('expires_at', '<=', now());
        }

        $coupons = $query->latest()->paginate(10)->withQueryString();

        $stats = [
            'total' => Coupon::count(),
            'active' => Coupon::where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })->count(),
            'total_redemptions' => (int) Coupon::sum('used_count'),
            'total_discount_given' => (float) CouponUsage::sum('discount_amount'),
        ];

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'stats' => $stats,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    // create new coupon
    public function create(): Response
    {
        $courses = Course::where('status', 'published')
            ->orderBy('title')
            ->get(['id', 'title', 'price']);

        return Inertia::render('Admin/Coupons/Create', [
            'courses' => $courses,
        ]);
    }

    // store coupon details
    public function store(Request $request): RedirectResponse
    {
        if ($request->has('code')) {
            $request->merge([
                'code' => strtoupper(trim((string) $request->input('code'))),
            ]);
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'alpha_dash', 'unique:coupons,code'],
            'name' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => [
                'required',
                'numeric',
                'min:0.01',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->input('discount_type') === 'percentage' && $value > 100) {
                        $fail('Percentage discount cannot exceed 100%.');
                    }
                },
            ],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0.01'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'max_uses_per_user' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
            'applies_to_all_courses' => ['boolean'],
            'course_ids' => ['nullable', 'array'],
            'course_ids.*' => ['exists:courses,id'],
        ]);

        $appliesToAll = (bool) ($validated['applies_to_all_courses'] ?? true);

        $coupon = Coupon::create([
            'code' => $validated['code'],
            'name' => $validated['name'] ?? null,
            'description' => $validated['description'] ?? null,
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'max_discount_amount' => $validated['discount_type'] === 'percentage' ? ($validated['max_discount_amount'] ?? null) : null,
            'min_order_amount' => $validated['min_order_amount'] ?? 0.00,
            'max_uses' => $validated['max_uses'] ?? null,
            'max_uses_per_user' => $validated['max_uses_per_user'] ?? 1,
            'starts_at' => $validated['starts_at'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'applies_to_all_courses' => $appliesToAll,
        ]);

        if (! $appliesToAll && ! empty($validated['course_ids'])) {
            $coupon->courses()->sync($validated['course_ids']);
        }

        return redirect()->route('admin.coupons.index')
            ->with('success', "Coupon '{$coupon->code}' has been created successfully.");
    }

    // edit coupon details
    public function edit(Coupon $coupon): Response
    {
        $coupon->load('courses:id,title');

        $courses = Course::where('status', 'published')
            ->orderBy('title')
            ->get(['id', 'title', 'price']);

        return Inertia::render('Admin/Coupons/Edit', [
            'coupon' => $coupon,
            'courses' => $courses,
        ]);
    }

    // update coupon details
    public function update(Request $request, Coupon $coupon): RedirectResponse
    {
        if ($request->has('code')) {
            $request->merge([
                'code' => strtoupper(trim((string) $request->input('code'))),
            ]);
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'alpha_dash', Rule::unique('coupons', 'code')->ignore($coupon->id)],
            'name' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => [
                'required',
                'numeric',
                'min:0.01',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->input('discount_type') === 'percentage' && $value > 100) {
                        $fail('Percentage discount cannot exceed 100%.');
                    }
                },
            ],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0.01'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'max_uses_per_user' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
            'applies_to_all_courses' => ['boolean'],
            'course_ids' => ['nullable', 'array'],
            'course_ids.*' => ['exists:courses,id'],
        ]);

        $appliesToAll = (bool) ($validated['applies_to_all_courses'] ?? true);

        $coupon->update([
            'code' => $validated['code'],
            'name' => $validated['name'] ?? null,
            'description' => $validated['description'] ?? null,
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'max_discount_amount' => $validated['discount_type'] === 'percentage' ? ($validated['max_discount_amount'] ?? null) : null,
            'min_order_amount' => $validated['min_order_amount'] ?? 0.00,
            'max_uses' => $validated['max_uses'] ?? null,
            'max_uses_per_user' => $validated['max_uses_per_user'] ?? 1,
            'starts_at' => $validated['starts_at'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'applies_to_all_courses' => $appliesToAll,
        ]);

        if ($appliesToAll) {
            $coupon->courses()->detach();
        } else {
            $coupon->courses()->sync($validated['course_ids'] ?? []);
        }

        return redirect()->route('admin.coupons.index')
            ->with('success', "Coupon '{$coupon->code}' has been updated successfully.");
    }

    // delete a coupon
    public function destroy(Coupon $coupon): RedirectResponse
    {
        $code = $coupon->code;
        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', "Coupon '{$code}' was successfully deleted.");
    }

    // Toggle active/inactive status for a coupon
    public function toggleStatus(Coupon $coupon): RedirectResponse
    {
        $coupon->update([
            'is_active' => ! $coupon->is_active,
        ]);

        $statusText = $coupon->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Coupon '{$coupon->code}' has been {$statusText}.");
    }
}
