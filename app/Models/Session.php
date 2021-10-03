<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
	protected $table = 'sessions';

	protected $fillable = [ 'userID', 'sessionID', 'deviceID', 'deviceName', 'expiresIn' ];

	public $expands = [
        'user'
	];
	
	protected $hidden = [
        'created_at', 'updated_at'
	];
	
	public function user () {
		return $this->belongsTo(User::class, 'userID', 'ID');
	}

	public function addSession(User $user, $infos) {
		$this->userID = $user->ID;
		$this->deviceID = $infos['deviceID'];
		$this->deviceName = $infos['deviceName'];
		$this->sessionID = $this->generateSession($user);
		$this->expiresIn = now()->addMinutes(config('app.expire_token_limit'));
		$this->save();

		return $this->sessionID;
	}

	private function generateSession($user) {
		$randStr = $user->name . $user->password . str_random(128);
		return hash('sha512', $randStr);
	}
}
