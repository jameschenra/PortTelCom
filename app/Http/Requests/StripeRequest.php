<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StripeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'userID' => 'required|exists:users,ID',
            'planID' => 'required|exists:subscription_plans,ID',
            'stripeName' => 'required',
            'stripeNumber' => 'required',
            'stripeYear' => 'required',
            'stripeMonth' => 'required',
            'stripeCVC' => 'required',
            'amount' => 'required',
            'currency' => 'required'
        ];
    }

    public function attributes()
    {
        return [
            'stripeName' => 'card on name',
            'stripeNumber' => 'card number',
            'stripeYear' => 'expire year',
            'stripeMonth' => 'expire month',
            'stripeCVC' => 'card security',
            'stripePostal' => 'post code'
        ];
    }
}
