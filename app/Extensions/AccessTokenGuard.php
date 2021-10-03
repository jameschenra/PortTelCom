<?php namespace App\Extensions;

use App\Models\User;

use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;

class AccessTokenGuard implements Guard
{
	use GuardHelpers;
	
	private $inputKey = '';
	private $storageKey = '';
	private $request;
	private $tokenObj;

	public function __construct (UserProvider $provider, Request $request, $configuration) {
		$this->provider = $provider;
		$this->request = $request;
		// key to check in request
		$this->inputKey = isset($configuration['input_key']) ? $configuration['input_key'] : 'sessionID';
		// key to check in database
		$this->storageKey = isset($configuration['storage_key']) ? $configuration['storage_key'] : 'sessionID';
	}

	public function attempt($credentials) {
		if ($user = $this->provider->retrieveByCredentials($credentials)) {
			if($this->provider->validateCredentials($user, $credentials)) {
				return $user;
			}
		}
		return false;
	}

	public function login($user, $infos) {
		if(!$token = $this->provider->storeToken($user, $infos)){
			return false;
		}
		return $token;
	}

	public function user () {
		if (!is_null($this->user)) {
			return $this->user;
		}

		$user = null;

		// retrieve via token
		$token = $this->getTokenForRequest();

		if (!empty($token)) {
			// the token was found, how you want to pass?
			$user = $this->provider->retrieveByToken($this->storageKey, $token);
		}

		return $this->user = $user;
	}

	public function token() {
		if (!is_null($this->tokenObj)) {
			return $this->tokenObj;
		}

		$tokenObj = null;

		// retrieve via token
		$token = $this->getTokenForRequest();

		if (!empty($token)) {
			// the token was found, how you want to pass?
			$tokenObj = $this->provider->retrieveToken($this->storageKey, $token);
		}

		return $this->tokenObj = $tokenObj;
	}

	/**
	 * Get the token for the current request.
	 * @return string
	 */
	public function getTokenForRequest () {
		$token = $this->request->query($this->inputKey);

		if (empty($token)) {
			$token = $this->request->input($this->inputKey);
		}

		if (empty($token)) {
			$token = $this->request->bearerToken();
		}

		return $token;
	}

	/**
	 * Validate a user's credentials.
	 *
	 * @param  array $credentials
	 *
	 * @return bool
	 */
	public function validate (array $credentials = []) {
		if (empty($credentials[$this->inputKey])) {
			return false;
		}

		$credentials = [ $this->storageKey => $credentials[$this->inputKey] ];

		if ($this->provider->retrieveByCredentials($credentials)) {
			return true;
		}

		return false;
	}
}