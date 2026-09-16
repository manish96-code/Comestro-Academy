<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'invoice_number',
        'enrollment_id',
        'user_id',
        'course_id',
        'payment_id',
        'student_details',
        'course_details',
        'amount',
        'currency',
        'payment_method',
        'transaction_id',
        'order_id',
        'status',
        'paid_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'student_details' => 'array',
            'course_details' => 'array',
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public static function createSnapshot(Enrollment $enrollment, ?Payment $payment = null): self
    {
        $existing = self::where('enrollment_id', $enrollment->id)->first();
        if ($existing) {
            return $existing;
        }

        $enrollment->loadMissing([
            'user.studentProfile',
            'course.category',
            'course.instructor.user',
            'batch',
        ]);

        if (! $payment) {
            $payment = Payment::where('user_id', $enrollment->user_id)
                ->where('course_id', $enrollment->course_id)
                ->where('status', 'successful')
                ->latest()
                ->first();
        }

        $user = $enrollment->user;
        $course = $enrollment->course;
        $batch = $enrollment->batch;
        $profile = $user?->studentProfile;

        $enrolledDate = $enrollment->enrolled_at ?? $enrollment->created_at ?? now();
        $year = date('Y', strtotime($enrolledDate));
        $invoiceNumber = 'INV-'.$year.'-'.str_pad((string) $enrollment->id, 5, '0', STR_PAD_LEFT);

        $originalPrice = (float) ($course?->price ?? 0);
        $discountPrice = $course?->discount_price !== null ? (float) $course->discount_price : null;
        $effectivePrice = ($discountPrice !== null && $discountPrice < $originalPrice) ? $discountPrice : $originalPrice;

        $paidAmount = $payment ? (float) $payment->amount : ($effectivePrice <= 0 ? 0.00 : 0.00);

        return self::create([
            'invoice_number' => $invoiceNumber,
            'enrollment_id' => $enrollment->id,
            'user_id' => $enrollment->user_id,
            'course_id' => $enrollment->course_id,
            'payment_id' => $payment?->id,

            // 1. Student Point-in-time Snapshot (JSON)
            'student_details' => [
                'name' => $user?->name ?? 'Student',
                'email' => $user?->email ?? '',
                'phone' => $user?->phone ?? 'Not provided',
                'city' => $profile?->city,
                'state' => $profile?->state,
            ],

            // 2. Course Point-in-time Snapshot (JSON)
            'course_details' => [
                'id' => $course?->id,
                'title' => $course?->title ?? 'Course Enrollment',
                'slug' => $course?->slug,
                'category' => $course?->category?->name ?? 'Software Engineering',
                'instructor_name' => $course?->instructor?->user?->name ?? 'Comestro Faculty Team',
                'duration' => $course?->duration ?? 'Self-paced',
                'type' => $course?->type ?? 'recorded',
                'batch' => $batch ? [
                    'id' => $batch->id,
                    'batch_name' => $batch->batch_name,
                    'time_slot' => $batch->time_slot,
                    'days' => $batch->days,
                ] : null,
                'original_price' => $originalPrice,
                'discount_price' => $discountPrice,
            ],

            // 3. Payment & Financial details
            'amount' => $paidAmount,
            'currency' => $payment?->currency ?? 'INR',
            'payment_method' => $payment ? 'Razorpay Secure Payment' : 'Complimentary / Free Enrollment',
            'transaction_id' => $payment?->razorpay_payment_id ?? 'FREE-ADM-'.str_pad((string) $enrollment->id, 6, '0', STR_PAD_LEFT),
            'order_id' => $payment?->razorpay_order_id,
            'status' => 'PAID',
            'paid_at' => $payment?->created_at ?? $enrolledDate,
        ]);
    }
}
