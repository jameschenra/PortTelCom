<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    protected $primaryKey = 'ID';

    protected $fillable = [ 'name', 'VAT', 'active' ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public function getActiveAttribute($value) {
        if ($value) {
            return true;
        }
        return false;
    }

    public function getVATAttribute($value) {
        return (float)(number_format((float)$value, 2, '.', '') . '');
    }
}
