<?php

namespace App\Mail;

use App\Enums\ExpireType;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ExpireMail extends Mailable
{
    use Queueable, SerializesModels;

    private $expireType;
    private $planName;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($expireType, $planName)
    {
        $this->expireType = $expireType;
        $this->planName = $planName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $expireSentence = 'Your subscription plan of "' . $this->planName . '" ';

        switch ($this->expireType) {
            case ExpireType::EXPIRE_WEEK:
                $expireSentence .= 'will be expired in a week.';
                break;
            case ExpireType::EXPIRE_THREE_DAYS:
                $expireSentence .= 'will be expired in 3days.';
                break;
            case ExpireType::EXPIRE_END:
                $expireSentence .= 'has been expired.';
                break;
            case ExpireType::EXPIRE_END:
                $expireSentence .= 'has already been expired before a week.';
                break;
            default:
                $expireSentence .= 'has been expired.';
                break;
        }
        return $this->markdown('emails.expireemail')
            ->with(['expireSentence' => $expireSentence]);
    }
}
