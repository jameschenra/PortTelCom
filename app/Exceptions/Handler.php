<?php

namespace App\Exceptions;

use Exception;
use App\Exceptions\ValidateException;
use Http\Client\Exception\HttpException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        \App\Exceptions\ValidateException::class,
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if ($exception instanceof ValidationException) {
            throw new ValidateException($exception->validator);
        }

        if ($exception instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
            if( $exception->getStatusCode() == 403) {
                return response()->json([
                    'error' => 1005,
                    'description' => 'Access denied!'
                ], 403);
            }

            if( $exception->getStatusCode() == 401) {
                return response()->json([
                    'error' => 1004,
                    'description' => 'Invalid or expired session ID!'
                ], 401);
            }
        }

        return parent::render($request, $exception);
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return $request->expectsJson()
            ? response()->json([
                'error' => 1004,
                'description' => 'Invalid or expired session ID!'
            ], 401)
            : redirect()->guest($exception->redirectTo() ?? route('login'));
    }
}
