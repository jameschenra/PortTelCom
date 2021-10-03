<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Common\Utils;
use App\Common\SendResponse;
use App\Enums\UserRole;
use App\Http\Requests\SubscriptionPlanRequest;
use App\Rules\BooleanText;
use App\Models\Country;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;

class SubscriptionPlanController extends Controller
{
    use SendResponse;
    
    public function create(SubscriptionPlanRequest $request) {

        $sp = SubscriptionPlan::create($request->all());

        $countryId = $request->input('countryID');
        if ($countryId) {
            $country = Country::find($countryId);
            $sp['VAT'] = $country->VAT;
            $finalPrice = $sp->price + ($sp->price * $sp['VAT'] / 100);
            $sp['finalPrice'] = number_format($finalPrice, 2, '.', '');
        } else {
            $sp['VAT'] = null;
            $sp['finalPrice'] = $sp->price;
        }

        return response()->json($sp, 200);
    }

    public function readAvailable(Request $request) {

        $authUser = $request->user('token');
        $subPlans = [];

        $countryId = $request->input('countryID');

        $vat = null;

        if ($authUser) {
            if ($countryId) {
                return response()->json([
                    'validationErrors' => [
                        'countryID' => [
                            'invalidUsage' => 'Country cannot be specified by authenticated users!'
                        ]
                    ]
                ]);
            }

            $query = SubscriptionPlan::where('active', 1)
                ->where('countryID', $authUser->countryID);
            $query = Utils::filterAttributes($query, $request, new SubscriptionPlan(), ['countryID']);
            $query = Utils::pagination($query, $request);
            $query = Utils::expandAttributes($query, 
                $request->input('expand') . ',currency', 
                new SubscriptionPlan()
            );

            $subPlans = $query->get();

            $country = Country::find($authUser->countryID);
            $vat = $country ? $country->VAT : null;

            if (count($subPlans) > 0) {
                if ($authUser->companyVATNumber) {
                    $subPlans = $this->calcFillVat($subPlans, null);
                } else {       
                    $subPlans = $this->calcFillVat($subPlans, $vat);
                }
                return response()->json($subPlans);
            }
        } else {
            if ($countryId) {
                $query = SubscriptionPlan::where('active', 1)
                    ->where('countryID', $countryId);
                
                $query = Utils::filterAttributes($query, $request, new SubscriptionPlan(), ['countryID']);
                $query = Utils::pagination($query, $request);
                $query = Utils::expandAttributes($query, 
                    $request->input('expand') . ',currency', 
                    new SubscriptionPlan()
                );

                $subPlans = $query->get();

                $country = Country::find($countryId);
                $vat = $country ? $country->VAT : null;

                if (count($subPlans) > 0) {
                    $subPlans = $this->calcFillVat($subPlans, $vat);
                    return response()->json($subPlans);
                }
            }
        }

        $vatQueryString = 'NULL as VAT, FORMAT(price, 2) as finalPrice';
        if ($vat) {
            $vatQueryString = $vat . ' as VAT, FORMAT(price+price*' .$vat . '/100, 2) as finalPrice';
        }

        $query = SubscriptionPlan::where('active', 1)
            ->where('countryID', null)
            ->select('*', DB::raw($vatQueryString));

        $query = Utils::filterAttributes($query, $request, new SubscriptionPlan(), ['countryID']);
        $query = Utils::pagination($query, $request);
        $query = Utils::expandAttributes($query, 
            $request->input('expand') . ',currency', 
            new SubscriptionPlan()
        );

        $subPlans = $query->get();

        return response()->json($subPlans);
    }

    public function list(Request $request) {

        $user = auth()->user();

        if($user->roleID == UserRole::REGULAR) {
            return $this->send_access_denied();
        }

        $this->validate($request, [
            'countryID' => 'exists:countries,id',
            'active' => new BooleanText
        ], [],[
            'active' => 'Active',
            'countryID' => 'country'
        ]);

        $countryId = $request->input('countryID');

        $query = new SubscriptionPlan();

        if ($countryId) {
            $query = $query->where('countryID', $countryId);
        } else {
            $query = $query->leftJoin('countries', 'subscription_plans.countryID', 'countries.id')
                ->select('subscription_plans.*', DB::raw('FORMAT(countries.VAT,2) as VAT'));
        }

        if ($request->input('active') !== null) {
            $active = Utils::is_true($request->input('active'));
            $query = $query->where('subscription_plans.active', $active);
        }

        $query = Utils::filterAttributes($query, $request, new SubscriptionPlan(), ['countryID', 'active']);
        $query = Utils::pagination($query, $request);
        $query = Utils::expandAttributes($query, $request->input('expand'), new SubscriptionPlan());
        
        $subPlans = $query->get();

        $vat = null;
        if ($countryId && !$user->companyVATNumber) {
            $country = Country::find($countryId);
            $vat = $country ? $country->VAT : null;
            $subPlans = $this->calcFillVat($subPlans, $vat);
        } else {
            $subPlans = $this->calcFillVat($subPlans, $vat, true, false);    
        }

        return response()->json($subPlans);
    }

    public function get($subPlanId, Request $request) {

        $authUser = $request->user('token');
        $countryId = $request->input('countryID');

        if ($countryId && $authUser && $authUser->roleID == UserRole::REGULAR) {
            return  $this->send_access_denied();
        }

        $query = SubscriptionPlan::where('id', $subPlanId);
        if ($authUser) {
            if ($authUser->roleID == UserRole::REGULAR) {
                $query = $query->where('active', true);
            }
        } else {
            $query = $query->where('active', true);
        }

        $subPlan = $query->first();

        if (!$subPlan) {
            return $this->send_not_found('Subscription plan', 1010);
        }

        $vat = null;
        if ($countryId) {
            $country = Country::find($countryId);
            $vat = $country ? $country->VAT : null;
        } else {
            if ($authUser && !$authUser->companyVATNumber) {
                $country = Country::find($authUser->countryID);
                $vat = $country ? $country->VAT : null;
            }
        }

        $subPlan = $this->calcFillVat($subPlan, $vat, false);
        $subPlan = Utils::expandAttributes(null, $request->input('expand'), $subPlan);

        return response()->json($subPlan);
    }

    public function update($subPlanId, Request $request) {

        $this->validate($request, [
            'active' => 'required|boolean'
        ],[],[
            'active' => 'Active'
        ]);

        $subPlan = SubscriptionPlan::find($subPlanId);
        if ($subPlan) {
            $subPlan->active = $request->input('active');
            $subPlan->save();
        } else {
            return $this->send_error('404', '1010', 'Subscription plan not found!');
        }

        $vat = null;
        if ($subPlan->countryID) {
            $country = Country::find($subPlan->countryID);
            $vat = $country ? $country->VAT : null;
        }
        $subPlan = $this->calcFillVat($subPlan, $vat, false);

        return response()->json($subPlan, 200);
    }

    public function delete($subPlanId) {

        $refSub = Subscription::where('planID', $subPlanId)->first();
        if ($refSub) {
            return $this->send_error(400, 1011, 'Subscription plan already in use!');
        }
        
        $sp = SubscriptionPlan::find($subPlanId);

        if (!$sp) {
            return $this->send_not_found('Subscription plan', 1010);
        }

        $sp->delete();
    }

    private function calcFillVat($subPlans, $vat, $isArray = true, $vatFixed = true) {
        $strVat = null;
        if ($vat !== null) {
            $strVat = number_format((float)$vat, 2, '.', '');
        }
        
        if(!$isArray) {
            $subPlans = [ $subPlans ];
        }

        foreach ($subPlans as $sp) {
            if ($vatFixed) {
                $sp['VAT'] = $strVat;
            } else {
                $vat = $sp->VAT;
            }

            if ($vat == null) {
                $sp['finalPrice'] = $sp->price;
            } else {
                $finalPrice = $sp->price + ($sp->price * $vat / 100);
                $sp['finalPrice'] = number_format((float)$finalPrice, 2, '.', '');
            }
        }
        
        if ($isArray) {
            return $subPlans;
        } else {
            return $subPlans[0];
        }
    }
}
