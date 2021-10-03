<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'roles';

    protected $fillable = [ 'name', 'guard_name' ];

    protected $hidden = [
        'created_at', 'updated_at', 'guard_name'
    ];

}
