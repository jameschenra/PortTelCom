<?php

namespace App\Console\Commands;

use App\Models\Session;
use App\Models\PasswordReset;
use Illuminate\Console\Command;

class CheckSessionTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'session:checkexp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is check expire of session.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        Session::where('expiresIn', '<=', now())->delete();
        //$sessions = Session::whereRaw('expiresIn >= CURDATE()')->get()->toArray();
        PasswordReset::where('expiresIn', '<=', now())->delete();
        EmailVerifyToken::where('expiresIn', '<=', now())->delete();
        // \Log::info('I was here @ ' . now());
        // \Log::info($sessions);
    }
}
