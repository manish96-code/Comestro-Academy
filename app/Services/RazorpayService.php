<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class RazorpayService
{
    /**
     * Get Razorpay Key ID.
     */
    public function getKeyId(): string
    {
        $key = config('services.razorpay.key');

        if (! $key) {
            throw new RuntimeException('Razorpay Key ID is not configured in services.razorpay.key.');
        }

        return $key;
    }

    /**
     * Get Razorpay Key Secret.
     */
    public function getKeySecret(): string
    {
        $secret = config('services.razorpay.secret');

        if (! $secret) {
            throw new RuntimeException('Razorpay Key Secret is not configured in services.razorpay.secret.');
        }

        return $secret;
    }

    /**
     * Create an order on Razorpay.
     *
     * @param  float  $amountInRupees  Amount in INR (e.g. 2999.00)
     * @param  string  $receipt  Unique receipt identifier
     * @param  array<string, mixed>  $notes  Optional key-value metadata
     * @return array{id: string, entity: string, amount: int, currency: string, status: string, receipt: string}
     */
    public function createOrder(float $amountInRupees, string $receipt, array $notes = []): array
    {
        $keyId = $this->getKeyId();
        $keySecret = $this->getKeySecret();

        // Convert INR rupees to paise (1 INR = 100 paise)
        $amountInPaise = (int) round($amountInRupees * 100);

        $response = Http::withBasicAuth($keyId, $keySecret)
            ->post('https://api.razorpay.com/v1/orders', [
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'receipt' => $receipt,
                'notes' => $notes,
            ]);

        if ($response->failed()) {
            $error = $response->json('error.description') ?? $response->body();
            throw new RuntimeException("Razorpay order creation failed: {$error}");
        }

        return $response->json();
    }

    /**
     * Verify payment signature from Razorpay checkout.
     *
     * @param  string  $orderId  Razorpay Order ID
     * @param  string  $paymentId  Razorpay Payment ID
     * @param  string  $signature  Razorpay Signature returned from frontend
     */
    public function verifySignature(string $orderId, string $paymentId, string $signature): bool
    {
        $keySecret = $this->getKeySecret();

        $generatedSignature = hash_hmac('sha256', $orderId.'|'.$paymentId, $keySecret);

        return hash_equals($generatedSignature, $signature);
    }
}
