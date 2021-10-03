<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $table = 'payment_methods';

    protected $primaryKey = 'ID';

    protected $fillable = [ 'method' ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
