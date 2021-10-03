<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    protected $table = 'payment_transactions';

    protected $primaryKey = 'ID';

    protected $fillable = [ 'userID', 'userEmail', 'userName', 'paymentType', 'transaction_id',
        'amount', 'currency', 'subscriptionPlanID', 'paymentStatus', 'subscriptionStatus' ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
