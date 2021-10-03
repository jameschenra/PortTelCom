<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $table = 'currencies';

    protected $primaryKey = 'ID';

    protected $fillable = [ 'name', 'sign' ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

}