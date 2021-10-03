<?php namespace App\Extensions;

use App\Models\Session;
use App\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Str;

class TokenToUserProvider implements UserProvider
{
	private $token;
	private $user;

	public function __construct (User $user, Session $token) {
		$this->user = $user;
		$this->token = $token;
	}

	public function retrieveById ($identifier) {
		return $this->user->find($identifier);
	}

	public function retrieveByToken ($identifier, $token) {
		$token = $this->token->with('user')->where($identifier, $token)->first();

		return $token && $token->user ? $token->user : null;
	}

	public function retrieveToken($identifier, $token) {
		$token = $this->token->where($identifier, $token)->first();
		
		return $token;
	}

	public function storeToken(Authenticatable $user, $infos) {
		$strToken = $this->token->addSession($user, $infos);
		return $strToken;
	}

	public function updateRememberToken (Authenticatable $user, $token) {
		// update via remember token not necessary
	}

	public function retrieveByCredentials (array $credentials) {
		// implementation upto user.
		// how he wants to implement -
		// let's try to assume that the credentials ['username', 'password'] given
		$user = $this->user;
		$condition = [];
		foreach ($credentials as $credentialKey => $credentialValue) {
			if (!Str::contains($credentialKey, 'password')) {
				$user = $user->where($credentialKey, $credentialValue);
			}
		}

		return $user->first();
	}

	public function validateCredentials (Authenticatable $user, array $credentials) {
		$plain = $credentials['password'];

		return app('hash')->check($plain, $user->getAuthPassword());
	}
}