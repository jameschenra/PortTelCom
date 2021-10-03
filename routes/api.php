<?php

use Illuminate\Http\Request;

Route::get('test','SessionController@test');

//-- session routes --
Route::group(['prefix' => 'session'], function () {
    Route::post('create', 'SessionController@create');
    Route::post('refresh', 'SessionController@refresh');

    // authenticated
    Route::group(['middleware' => 'auth'], function() {
        Route::get('/', 'SessionController@list');
        Route::get('/keepAlive', 'SessionController@keepAlive');
        Route::get('delete/{sessionId?}', 'SessionController@delete');
        Route::get('/{sessionId}', 'SessionController@get');
    });
});

//-- user routes --
Route::group(['prefix' => 'user'], function () {
    Route::post('register', 'UserController@register');
    Route::post('requestEmailVerification', 'UserController@requestEmailVerification');
    Route::post('verifyEmail', 'UserController@verifyEmail');
    Route::post('requestPasswordReset', 'UserController@requestPasswordReset');
    Route::post('resetPassword', 'UserController@resetPassword');

    // authenticated
    Route::group(['middleware' => 'auth'], function() {
        Route::post('create', 'UserController@create')->middleware('auth.admin');
        Route::get('/', 'UserController@list');
        Route::get('/{userId}', 'UserController@get');
        Route::get('delete/{userId}', 'UserController@delete');
        Route::post('changePassword', 'UserController@changePassword');
    });
});

//-- server routes --
Route::group(['prefix' => 'server', 'middleware' => 'auth'], function(){
    Route::get('/', 'ServerController@list');
    Route::get('/{serverId}', 'ServerController@get');

    // Admin role
    Route::group(['middleware' => 'auth.admin'], function() {
        Route::post('/create', 'ServerController@create');
        Route::post('/update/{serverId}', 'ServerController@update');
        Route::post('/delete/{serverId}', 'ServerController@delete');
    });
});

//-- subscription plan routes --
Route::group(['prefix' => 'subscriptionPlan'], function () {
    Route::get('readAvailable', 'SubscriptionPlanController@readAvailable')->middleware('auth.public');
    Route::get('/{id}', 'SubscriptionPlanController@get')->middleware('auth.public');

    // authenticated
    Route::group(['middleware' => 'auth'], function(){
        Route::get('/', 'SubscriptionPlanController@list');
        Route::group(['middleware' => 'auth.admin'], function() {
            Route::post('/create', 'SubscriptionPlanController@create');
            Route::post('/update/{id}', 'SubscriptionPlanController@update');
            Route::post('/delete/{id}', 'SubscriptionPlanController@delete');
        });
    });
});

//-- subscription routes --
Route::group(['prefix' => 'subscription', 'middleware' => 'auth'], function(){
    Route::get('/', 'SubscriptionController@list');
    Route::get('/{id}', 'SubscriptionController@get');
    Route::post('/create', 'SubscriptionController@create');
});

//-- payment routes --
Route::group(['prefix' => 'payment'], function(){
    
    Route::group(['middleware' => 'auth'], function(){
        Route::post('stripe', 'PaymentController@stripePayment');
        Route::post('paypal', 'PaymentController@paypalPayment');
    });
});

//-- country routes --
Route::group(['prefix' => 'country'], function () {
    Route::get('/', 'CountryController@list')->middleware('auth.public');
    Route::get('/{id}', 'CountryController@get')->middleware('auth.public');

    //authenticated
    Route::group(['middleware' => 'auth'], function(){
        Route::group(['middleware' => 'auth.admin'], function() {
            Route::post('/create', 'CountryController@create');
            Route::post('/update/{id}', 'CountryController@update');
            Route::post('/delete/{id}', 'CountryController@delete');
        });
    });
});

//-- list routes --
Route::group(['prefix' => 'list', 'middleware' => 'auth'], function(){
    Route::get('/{table}', 'ListController@getAll');
});


//-- contact route --
Route::post('/contact', 'ContactController@sendContact');
