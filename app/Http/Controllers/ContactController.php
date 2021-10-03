<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Common\SendResponse;
use App\Mail\ContactMail;

class ContactController extends Controller
{
    use SendResponse;
    
    public function sendContact(Request $request) {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email',
            'subject' => 'required',
            'message' => 'required'
        ]);

        Mail::to(env('ADMIN_EMAIL'))->send(new ContactMail(
            $request->input('email'),
            $request->input('name'), 
            $request->input('subject'),
            $request->input('message')
        ));
    }

}
