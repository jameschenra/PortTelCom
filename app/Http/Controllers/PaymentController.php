<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StripeRequest;
use App\Common\SendResponse;

use App\Enums\UserRole;

use App\User;

// stripe
use Cartalyst\Stripe\Stripe;

use App\Enums\PaymentType;
use App\Models\SubscriptionPlan;
use App\Http\Controllers\SubscriptionController;
use App\Models\PaymentTransaction;
use App\Enums\PaymentStatus;

class PaymentController extends Controller
{
    use SendResponse;
    
    public function stripePayment(StripeRequest $request) {
        return $this->stripePaymentProceed($request);
    }

    public function stripePaymentProceed($request) {
        $user = User::find($request->input('userID'));
        $sbcrPlan = SubscriptionPlan::find($request->input('planID'));

        $amount = $request->input('amount');
        $currency = $request->input('currency') ?: 'USD';

        try{
            $stripe = Stripe::make(config('stripe.secret'));
            $token = $stripe->tokens()->create([
                'card' => [
                    'name' => $request->input('stripeName'),
                    'number' => $request->input('stripeNumber'),
                    'exp_month' => $request->input('stripeMonth'),
                    'exp_year' => $request->input('stripeYear'),
                    'cvc' => $request->input('stripeCVC'),
                    'address_zip' => $request->input('stripePostal')
                ],
            ]);

            if (!isset($token['id'])) {
                return $this->send_error(500, 1090, 'Error occured while get stripe token!');
            }
    
            $charge = $stripe->charges()->create([
                'card' => $token['id'],
                'currency' => $currency,
                'amount' => $amount,
                'description' => 'Purchased zaubervpn subscription.',
            ]);

            $paymentTransaction = PaymentTransaction::create([
                'userID' => $user->ID,
                'userEmail' => $user->email,
                'userName' => $user->firstName . ' ' . $user->lastName,
                'paymentType' => PaymentType::STRIPE,
                'transaction_id' => $charge['id'],
                'amount' => $amount,
                'currency' => $currency,
                'paymentStatus' => $charge['status'],
                'subscriptionStatus' => 0   // subscription not created yet.
            ]);

            $paymentStatus = PaymentStatus::PROCESSING;
            if ($charge['status'] == 'pending') {
                $paymentStatus = PaymentStatus::PENDING;
            } else if($charge['status'] == 'succeeded') {
                $paymentStatus = PaymentStatus::PAID;
            } else if($charge['status'] == 'failed') {
                $paymentStatus = PaymentStatus::FAILED;
            }

            $subscriptionController = new SubscriptionController();
            $subscription = $subscriptionController->createSubscriptionWithData($user, $sbcrPlan, [
                'userID' => $user->ID,
                'planID' => $sbcrPlan->ID,
                'paymentMethod' => PaymentType::STRIPE,
                'paymentStatus' => $paymentStatus
            ]);

            // set subscription info to transaction
            $paymentTransaction->subscriptionID = $subscription->ID;
            $paymentTransaction->subscriptionStatus = 1;    // subscription created
            $paymentTransaction->save();

            return response()->json($subscription);

        } catch ( \Exception $e ) {
            return $this->send_error(500, 1090, $e->getMessage());
        } catch( \Cartalyst\Stripe\Exception\CardErrorException $e ) {
            return $this->send_error(500, 1090, $e->getMessage());
        } catch( \Cartalyst\Stripe\Exception\MissingParameterException $e ) {
            return $this->send_error(500, 1090, $e->getMessage());
        }
    }

    public function paypalPayment(Request $request) {
        
        $payerInfo = $request->input('payer');
        $paymentInfo = $request->input('purchase_units');

        if (empty($payerInfo['payer_id']) || empty($paymentInfo)) {
            return $this->send_error(500, 1090, 'payment information is not correct.');
        }

        $transactionId = $paymentInfo[0]['payments']['captures'][0]['id'];
        $amount = $paymentInfo[0]['payments']['captures'][0]['amount']['value'];
        $currency = $paymentInfo[0]['payments']['captures'][0]['amount']['currency_code'];
        $paymentStatus = $paymentInfo[0]['payments']['captures'][0]['status'];

        $paymentTransaction = PaymentTransaction::where('transaction_id', $transactionId)->first();
        if ($paymentTransaction && $paymentTransaction->subscriptionStatus) {
            return $this->send_error(500, 1090, 'This payment has already been processed.');
        }

        $user = auth()->user();

        $paymentTransaction = PaymentTransaction::create([
            'userID' => $user->ID,
            'userEmail' => $user->email,
            'userName' => $user->firstName . ' ' . $user->lastName,
            'paymentType' => PaymentType::PAYPAL,
            'transaction_id' => $transactionId,
            'amount' => $amount,
            'currency' => $currency,
            'paymentStatus' => $paymentStatus,
            'subscriptionStatus' => 0
        ]);
        
        $sbcrPlan = SubscriptionPlan::find($request->input('planID'));
        $subscriptionController = new SubscriptionController();

        if ($paymentStatus == 'COMPLETED') {
            $paymentStatus = PaymentStatus::PAID;
        } else if($paymentStatus == 'FAILED') {
            $paymentStatus = PaymentStatus::FAILED;
        } else {
            $paymentStatus = PaymentStatus::PENDING;
        }

        $subscription = $subscriptionController->createSubscriptionWithData($user, $sbcrPlan, [
            'userID' => $user->ID,
            'planID' => $sbcrPlan->ID,
            'paymentMethod' => PaymentType::PAYPAL,
            'paymentStatus' => $paymentStatus
        ]);

        // set subscription info to transaction
        $paymentTransaction->subscriptionID = $subscription->ID;
        $paymentTransaction->subscriptionStatus = 1;    // subscription created
        $paymentTransaction->save();

        return response()->json($subscription);
    }
}
