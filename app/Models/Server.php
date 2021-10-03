<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    protected $table = 'servers';

    protected $primaryKey = 'ID';

    protected $fillable = [ 'number', 'countryID', 'ip', 'port', 'active' ];

    public $expands = [
        'country'
    ];
    // const fields = [ 'number', 'countryID', 'ip', 'port', 'active' ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    public function getActiveAttribute($value) {
        if ($value) {
            return true;
        }
        return false;
    }

    public function country() {
        return $this->belongsTo('App\Models\Country', 'countryID', 'ID');
    }
}
