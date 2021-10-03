<?php

namespace App\Console\Commands;

use App\Mail\ExpireMail;
use App\Enums\ExpireType;
use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class SubscriptionTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscription:checkexp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is scheduled task.';

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
        $subscriptions = Subscription::leftJoin('subscription_plans as sp', 'subscriptions.planID', 'sp.id')
            ->leftJoin('users', 'subscriptions.userID', 'users.ID')
            ->select('subscriptions.*',
                DB::raw('DATEDIFF(endDate, NOW()) as remainingDays'),
                'sp.name as planName',
                'users.email as email')
            ->get();

        $expireGroups = [
            ExpireType::EXPIRE_WEEK => [],
            ExpireType::EXPIRE_THREE_DAYS => [],
            ExpireType::EXPIRE_END => [],
            ExpireType::EXPIRE_AFTER_WEEK => [],
        ];

        foreach($subscriptions as $subscription) {
            switch($subscription->expireStatus) {
                case ExpireType::EXPIRE_NORMAL:
                    if($subscription->remainingDays <= 7) {
                        $expireGroups[ExpireType::EXPIRE_WEEK][] = $subscription;
                    }
                    break;
                case ExpireType::EXPIRE_WEEK:
                    if($subscription->remainingDays <= 3) {
                        $expireGroups[ExpireType::EXPIRE_THREE_DAYS][] = $subscription;
                    }
                    break;
                case ExpireType::EXPIRE_THREE_DAYS:
                    if($subscription->remainingDays <= 0) {
                        $expireGroups[ExpireType::EXPIRE_END][] = $subscription;
                    }
                    break;
                case ExpireType::EXPIRE_END:
                    if($subscription->remainingDays <= -7) {
                        $expireGroups[ExpireType::EXPIRE_AFTER_WEEK][] = $subscription;
                    }
                    break;
                default:
                    break;
            }
        }

        foreach($expireGroups as $key => $expireGroup) {
            foreach($expireGroup as $subscription) {
                Mail::to($subscription->email)
                    ->send(new ExpireMail($key, $subscription->planName));
                $subscription->expireStatus = $key;
                $subscription->save();
            }
        }
        // \Log::info('I was here @ ' . now());
    }
}
