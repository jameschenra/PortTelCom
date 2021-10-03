<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Currency;

class SubscriptionPlan extends Model
{
    protected $table = 'subscription_plans';

    protected $primaryKey = 'ID';

    protected $fillable = [ 'name', 'description', 'price', 'priceCurrency', 'countryID', 'months', 'days', 'active' ];
    
    public $expands = [
        'country', 'currency'
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public function getActiveAttribute($value) {
        if ($value) {
            return true;
        }
        return false;
    }

    public function getPriceAttribute($value) {
        return number_format((float)$value, 2, '.', '');
    }

    public function country() {
        return $this->belongsTo('App\Models\Country', 'countryID', 'ID');
    }

    public function currency() {
        return $this->belongsTo(Currency::class, 'priceCurrency', 'name');
    }
}
