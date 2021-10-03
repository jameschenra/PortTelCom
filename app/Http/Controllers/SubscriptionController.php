<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Common\Utils;
use App\Common\SendResponse;
use App\Enums\UserRole;

use App\Http\Requests\SubscriptionRequest;

use App\User;
use App\Models\Country;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;

class SubscriptionController extends Controller
{
    use SendResponse;

    // create subscription end point   - userID, planID, paymentMethod, paymentStatus
    public function create(SubscriptionRequest $request) {

        return $this->createSubscription($request->all());
    }

    public function createSubscription($data) {
        $user = auth()->user();
        
        $userId = isset($data['userID']) ?: null;
        if ($userId) {
            if ($user->roleID == UserRole::REGULAR) {
                return $this->send_access_denied();
            }
        }

        $sbcrPlan = SubscriptionPlan::find($data['planID']);
        if ($user->roleID == UserRole::REGULAR) {
            if (!$sbcrPlan->active) {
                return $this->send_access_denied();
            }
        }

        if ($sbcrPlan->countryID) {
            $userCountryId = $user->countryID;
            if ($userId) {
                $targetUser = User::find($userId);
                $userCountryId = $targetUser->countryID;
            }

            if( $sbcrPlan->countryID != $userCountryId) {
                return $this->send_access_denied();
            }
        }

        $data['userID'] = $userId ?: $user->ID;

        return $this->createSubscriptionWithData($user, $sbcrPlan, $data);
    }

    public function createSubscriptionWithData($user, $sbcrPlan, $data) {
        $vat = null;
        if ($sbcrPlan->countryID) {
            $country = Country::find($sbcrPlan->countryID);
            $vat = $country ? $country->VAT : null;
        } else {
            if (!$user->companyVATNumber) {
                $country = Country::find($user->countryID);
                $vat = $country ? $country->VAT : null;
            }
        }
        $data['appliedVAT'] = $vat;

        $lastSub = Subscription::where('userID', $data['userID'])
            ->where('endDate', '>=', now())
            ->orderBy('endDate', 'DESC')
            ->first();

        if (!$lastSub) {
            $data['startDate'] = now();
        } else {
            $data['startDate'] = Carbon::parse($lastSub->endDate)->addDays(1);
        }
        
        $data['endDate'] = Carbon::parse($data['startDate'])->addDays($sbcrPlan->months*30 + $sbcrPlan->days);
        
        $subscription = Subscription::create($data);

        $subscription['remainingDays'] = Carbon::parse($subscription['endDate'])->diffInDays(now());
        if ($subscription['remainingDays'] < 0) {
            $subscription['remainingDays'] = 0;
            
            $subscription['active'] = false;
        } else {
            $subscription['active'] = true;
        }

        $subscription['startDate'] = $subscription->startDate;
        $subscription['endDate'] = $subscription->endDate;
        $subscription['paymentMethod'] = $data['paymentMethod'];
        $subscription['paymentStatus'] = $data['paymentStatus'];
        
        return $subscription;
    }

    public function list(Request $request) {

        $user = auth()->user();

        $query = new Subscription();

        if ($user->roleID == UserRole::REGULAR) {
            $query = $query->where('userID', $user->ID);
        }

        // for parsing model
        $subscriptionModel = new Subscription();

        $query = $query->select('*', DB::raw('DATEDIFF(endDate, NOW()) as remainingDays'));
        $query = Utils::filterAttributes($query, $request, $subscriptionModel);
        $query = Utils::pagination($query, $request);
        $query = Utils::expandAttributes($query, $request->input('expand'), $subscriptionModel);

        $subscriptions = $query->get()->toArray();
        $subscriptions = Utils::changeUnderScroeToCamelAttr($subscriptions, $request->input('expand'), $subscriptionModel);

        foreach ($subscriptions as $subscription) {
            if ($subscription['remainingDays'] < 0) {
                $subscription['remainingDays'] = 0;
                $subscription['active'] = false;
            } else {
                $subscription['active'] = true;
            }
        }

        return $subscriptions;
    }

    public function get($subscriptionId, Request $request) {

        $user = auth()->user();

        $subscription = Subscription::find($subscriptionId);

        if (!$subscription) {
            return $this->send_not_found('Subscription', 1012);
        }

        if($user->roleID == UserRole::REGULAR && $user->ID != $subscription->userID) {
            return $this->send_access_denied();
        }

        $subscription['remainingDays'] = Carbon::parse(now())->diffInDays($subscription['endDate'], false);
        if ($subscription['remainingDays'] < 0) {
            $subscription['remainingDays'] = 0;
            $subscription['active'] = false;
        } else {
            $subscription['active'] = true;
        }

        $subscription = Utils::expandAttributes(null, $request->input('expand'), $subscription);

        return response()->json($subscription);
    }
}
