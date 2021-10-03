<?php namespace App\Enums;

class PaymentStatus {
    const PENDING = 1;
    const PROCESSING = 2;
    const PAID = 3;
    const CANCELLED = 4;
    const FAILED = 5;
}