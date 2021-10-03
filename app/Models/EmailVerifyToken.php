<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailVerifyToken extends Model
{
    protected $table = 'email_verify_tokens';

    protected $fillable = [ 'email', 'verificationCode', 'verifyAttempt', 'expiresIn' ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];
}
