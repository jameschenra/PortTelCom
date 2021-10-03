<?php

namespace App\Http\Middleware;

use Closure;
use App\Enums\UserRole;
use App\Common\SendResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\AuthenticationException;


class AdminAuthenticate
{
    use SendResponse;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user && $user->roleID == UserRole::ADMIN) {
                return $next($request);
            }
        }

        return $this->send_access_denied();
    }
}
