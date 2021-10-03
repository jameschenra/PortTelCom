<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $table = 'subscriptions';

    protected $primaryKey = 'ID';

    protected $fillable = [ 'userID', 'planID', 'paymentMethod', 'paymentStatus', 'appliedVAT', 'startDate', 'endDate', 'expireStatus' ];
    
    public $expands = [
        'user', 'subscriptionPlan', 'paymentStatus', 'paymentMethod'
    ];

    public $expandsUnderScore = [
        'subscriptionPlan' => 'subscription_plan',
        'paymentStatus' => 'payment_status',
        'paymentMethod' => 'payment_method'
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public function getStartDateAttribute($value) {
        $date = Carbon::parse($value);
        return $date->format('d-m-Y');
    }

    public function getEndDateAttribute($value) {
        $date = Carbon::parse($value);
        return $date->format('d-m-Y');
    }

    public function user() {
        return $this->belongsTo('App\User', 'userID', 'ID');
    }

    public function subscriptionPlan() {
        return $this->belongsTo('App\Models\SubscriptionPlan', 'planID', 'ID');
    }

    public function paymentMethod() {
        return $this->belongsTo('App\Models\PaymentMethod', 'paymentMethod', 'ID');
    }

    public function paymentStatus() {
        return $this->belongsTo('App\Models\PaymentStatus', 'paymentStatus', 'ID');
    }
}
