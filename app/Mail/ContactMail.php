<?php

namespace App\Mail;

use App\Enums\ExpireType;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    private $name;
    private $message;
    private $email;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email, $name, $subject, $message)
    {
        $this->email = $email;
        $this->name = $name;
        $this->subject = $subject;
        $this->message = $message;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($this->email)
            ->subject($this->subject)
            ->markdown('emails.contactemail')
            ->with([
                'name' => $this->name,
                'message' => $this->message
            ]);
    }
}
