<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyMail extends Mailable
{
    use Queueable, SerializesModels;

    private $email;
    private $verifyCode;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email, $verifyCode)
    {
        $this->email = $email;
        $this->verifyCode = $verifyCode;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $verifyLink = env('APP_CLIENT_URL') . '/auth/verifyemail?' .
            'email=' . $this->email;

        return $this->markdown('emails.verifyemail')
            ->with([
                'verifyLink' => $verifyLink,
                'verifyCode' => $this->verifyCode
            ]);
    }
}
