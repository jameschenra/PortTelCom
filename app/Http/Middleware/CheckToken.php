<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use App\Models\Session;
use Illuminate\Auth\AuthenticationException;

class CheckToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        if ($token) {
            $session = Session::where('sessionID', $token)->first();
            if (!$session) {
                throw new AuthenticationException(
                    'Unauthenticated.'
                );
            } else {
                if (!$session->expiresIn || Carbon::parse($session->expiresIn)->lte(now())) {
                    $session->delete();
                    throw new AuthenticationException(
                        'Unauthenticated.'
                    );
                }
            }
        }
        return $next($request);
    }
}
