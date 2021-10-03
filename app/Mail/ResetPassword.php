<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ResetPassword extends Mailable
{
    use Queueable, SerializesModels;

    private $verifyCode;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($verifyCode)
    {
        $this->verifyCode = $verifyCode;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.resetpassword')
            ->with(['verifyCode' => $this->verifyCode]);
    }
}
