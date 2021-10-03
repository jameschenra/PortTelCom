<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Common\Utils;
use App\Common\SendResponse;
use App\Enums\UserRole;
use App\Http\Requests\CountryRequest;
use App\User;
use App\Models\Server;
use App\Models\Country;
use App\Models\SubscriptionPlan;

class CountryController extends Controller
{
    use SendResponse;
    
    public function create(CountryRequest $request) {
        $country = Country::create($request->all());
        $country->VAT = $country->VAT;
        return response()->json($country);
    }

    public function update($countryId, CountryRequest $request) {
        $country = Country::find($countryId);
        if (!$country) {
            return $this->send_not_found('Country', 1013);
        }

        $country->update($request->all());
        $country->VAT = $country->VAT;
        return response()->json($country);
    }

    public function list(Request $request) {
        $authUser = $request->user('token');

        $query = new Country();
        if (!$authUser || $authUser->roleID == UserRole::REGULAR) {
            $query = $query->where('active', true);
        }

        $query = $query->select('*');
        $query = Utils::filterAttributes($query, $request, new Country());
        $query = Utils::pagination($query, $request);

        $countries = $query->get();

        return response()->json($countries);
    }

    public function get($countryId, Request $request) {
        $authUser = $request->user('token');

        $country = Country::find($countryId);
        if (!$country) {
            return $this->send_not_found('Country', 1013);
        }

        if (!$authUser || $authUser->roleID == UserRole::REGULAR) {
            if (!$country->active) {
                return $this->send_access_denied();
            }
        }
        
        // $country->VAT = $country->VAT;
        return response()->json($country);
    }

    public function delete($countryId) {
        $country = Country::find($countryId);
        if (!$country) {
            return $this->send_not_found('Country', 1013);
        }

        if (User::where('countryID', $countryId)->first()
            || Server::where('countryID', $countryId)->first()
            || SubscriptionPlan::where('countryID', $countryId)->first()) {
            return $this->send_error(400, 1014, 'Country already in use!');
        }

        $country->delete();
    }
}
