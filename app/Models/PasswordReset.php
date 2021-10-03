<?php

namespace App\Models;

use App\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
	protected $table = 'password_resets';

	public $timestamps = false;

	protected $fillable = [ 'email', 'verificationCode', 'attempt', 'expiresIn' ];

}
