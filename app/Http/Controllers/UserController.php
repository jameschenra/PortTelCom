<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;

use App\Common\Utils;
use App\Common\SendResponse;
use App\Enums\UserRole;
use App\Enums\UserType;
use App\Enums\PaymentType;

use App\Mail\VerifyMail;
use App\Mail\ResetPassword;

use App\User;
use App\Models\Subscription;
use App\Models\PasswordReset;
use App\Models\EmailVerifyToken;

use App\Http\Controllers\SubscriptionController;

class UserController extends Controller
{
    use SendResponse;
    
    // register user (any user)
    public function register(RegisterRequest $request) {
        $user = User::create(array_merge($request->all(), [
            'roleID' => UserRole::REGULAR
        ]));

        $response = [
            'ID' => $user->ID,
            'type' => $user->type,
            'roleID' => UserRole::REGULAR,
            'email' => $user->email,
            'emailVerified' => false,
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'countryID' => $user->countryID,
            'activeSubscriptionID' => null,
            'locked' => $user->locked
        ];

        if($user->type == UserType::COMPANY) {
            foreach (User::companyFields as $field) {
                $response[$field] = $user[$field];
            }
        }
        
        $this->sendVerifyCode($user->email);

        return response()->json($response, 201);
    }

    // create user for only by administrator
    public function create(RegisterRequest $request) {
        $user = User::create(array_merge(['emailVerified' => true], $request->all()));

        $response = [
            'ID' => $user->ID,
            'type' => $user->type,
            'roleID' => $user->roleID,
            'email' => $user->email,
            'emailVerified' => true,
            'firstName' => $user->firstName,
            'lastName' => $user->lastName,
            'countryID' => $user->countryID,
            'activeSubscriptionID' => null,
            'locked' => $user->locked
        ];

        if ($user->type == UserType::COMPANY) {
            foreach (User::companyFields as $field) {
                $response[$field] = $user[$field];
            }
        }

        return response()->json($response, 201);
    }
    
    // get users list
    public function list(Request $request) {
        $user = auth()->user();

        $users = [];

        $expands = $request->input('expand');
        $expandArray = $expands ? explode(',', $expands) : [];
        $expandActiveSub = in_array('activeSubscription', $expandArray);

        $subsrAttrs = (new Subscription())->getFillable();
        unset($subsrAttrs[array_search('expireStatus', $subsrAttrs)]);

        if ($user->roleID == UserRole::REGULAR) {
            $user = Utils::expandAttributes(null, $expands, $user);

            $subsrFields = array_merge(['ID'], $subsrAttrs, [DB::raw('DATEDIFF(endDate, NOW()) as remainingDays')]);
            $activeSubscription = Subscription::where('userID', $user['ID'])
                ->whereRaw('endDate >= CURDATE()')
                ->select($subsrFields)
                ->first();

            $user['activeSubscriptionID'] = $activeSubscription ? $activeSubscription->ID : null;

            if ($expandActiveSub) {
                if ($activeSubscription) {
                    $user['activeSubscription'] = $activeSubscription->toArray();
                    $user['activeSubscription']['remainingDays'] = $activeSubscription->remainingDays;
                    $user['activeSubscription']['active'] = true;
                } else {
                    $user['activeSubscription'] = null;
                }
            }

            $users[] = $user;
        } else {
            $query = new User();
            if ($user->roleID == UserRole::SUPPORT) {
                $query = $query->where('roleID', '<>', UserRole::ADMIN);
            }

            // for parsing model
            $userModel = new User();

            $query = $query->leftJoin('subscriptions as s', 'users.ID', 's.userID');

            $query = Utils::filterAttributes($query, $request, $userModel);
            $query = Utils::pagination($query, $request);
            $query = Utils::expandAttributes($query, $expands, $userModel);

            $attributes = array_merge(['users.ID'], $userModel->getFillable());
            $fields = array_merge($attributes,
                [DB::raw('IF(s.endDate >= CURDATE(), s.ID, NULL) as activeSubscriptionID')
            ]);

            if ($expandActiveSub) {
                $subsrFields = [];
                foreach($subsrAttrs as $attr) {
                    $subsrFields[] = 's.' . $attr;
                }

                $fields = array_merge($fields, $subsrFields, [
                    DB::raw('DATEDIFF(endDate, NOW()) as remainingDays'),
                    DB::raw('IF(s.endDate >= CURDATE(), true, false) as active')
                ]);
            }

            $users = $query->select($fields)
                ->groupBy($attributes)
                ->get()
                ->toArray();
            
            if($expandActiveSub) {
                $subsrAttrs = array_merge($subsrAttrs, ['remainingDays', 'active']);

                foreach ($users as &$user) {
                    if ($user['activeSubscriptionID']) {
                        $user['activeSubscription'] = [
                            'ID' => $user['activeSubscriptionID']
                        ];

                        foreach ($subsrAttrs as $attr) {
                            $user['activeSubscription'][$attr] = $user[$attr];
                        }
                    } else {
                        $user['activeSubscription'] = null;
                    }
                    foreach ($subsrAttrs as $attr) {
                        unset($user[$attr]);
                    }
                }
            }
            // $users = Utils::changeUnderScroeToCamelAttr($users, $request->input('expand'), $userModel);
        }

        foreach ($users as &$user) {
            if($user['type'] == UserType::INDIVIDUAL) {
                $user = $this->removeComapnyFields($user);
            }

            $user['emailVerified'] = Utils::is_true($user['emailVerified']);
        }
        
        return response()->json($users);
    }

    // get user by id
    public function get($userId, Request $request) {
        $user = auth()->user();

        $targetUser = null;

        if ($user->roleID == UserRole::REGULAR) {
            if ($user->ID != $userId) {
                return $this->send_access_denied();
            } else {
                $targetUser = $user;
            }
        } else {
            $targetUser = User::find($userId);
            if ($targetUser) {
                if ($user->roleID == UserRole::SUPPORT) {
                    if ($targetUser->roleID == UserRole::ADMIN) {
                        return $this->send_access_denied();
                    }
                }
            } else {
                return $this->send_not_found('User', 1006);
            }
        }

        if ($targetUser) {
            if($targetUser->type == UserType::INDIVIDUAL) {
                $targetUser = $this->removeComapnyFields($targetUser);
            }

            $expands = $request->input('expand');

            $targetUser = Utils::expandAttributes(null, $expands, $targetUser);

            $expandArray = $expands ? explode(',', $expands) : [];
            $expandActiveSub = in_array('activeSubscription', $expandArray);

            $subsrAttrs = (new Subscription())->getFillable();
            unset($subsrAttrs[array_search('expireStatus', $subsrAttrs)]);

            $subsrFields = array_merge(['ID'], $subsrAttrs, [DB::raw('DATEDIFF(endDate, NOW()) as remainingDays')]);
            $activeSubscription = Subscription::where('userID', $userId)
                ->whereRaw('endDate >= CURDATE()')
                ->select($subsrFields)
                ->first();
                
            $targetUser['activeSubscriptionID'] = $activeSubscription ? $activeSubscription->ID : null;

            if ($expandActiveSub) {

                if ($activeSubscription) {
                    $targetUser['activeSubscription'] = $activeSubscription->toArray();
                    $targetUser['activeSubscription']['remainingDays'] = $activeSubscription->remainingDays;
                    $targetUser['activeSubscription']['active'] = true;
                } else {
                    $targetUser['activeSubscription'] = null;
                }
            }

            $targetUser['emailVerified'] = Utils::is_true($targetUser['emailVerified']);
            
            return response()->json($targetUser);
        }
    }

    //delete user for only by userid=1
    public function delete($userId) {
        if(auth()->id() != 1 || $userId == 1) {
            return $this->send_access_denied();
        } else {
            $user = User::find($userId);
            if ($user) {
                $user->delete();
            } else {
                return $this->send_not_found('User', 1006);
            }
        }
    }

    private function removeComapnyFields($user) {
        foreach (User::companyFields as $field) {
            unset($user[$field]);
        }

        return $user;
    }

    //send request to verify email address
    public function requestEmailVerification(Request $request) {
        $this->validate($request, [
            'email' => 'required|email'
        ], [], [
            'email' => 'Email'
        ]);

        if (!User::where('email', $request->input('email'))->first()) {
            return $this->send_not_found('User', 1006);
        }

        $this->sendVerifyCode($request->input('email'));
    }

    public function verifyEmail(Request $request) {
        $this->validate($request, [
            'email' => 'required|email|exists:users',
            'verificationCode' => 'required'
        ], [
            'email.exists' => 'notFound' . '#' . 'User with the specified email address does not exist!'
        ],[
            'email' => 'Email',
            'verificationCode' => 'Verification code'
        ]);


        $verifyToken = EmailVerifyToken::where('email', $request->input('email'))
            ->first();
        
        if ($verifyToken) {
            if ($verifyToken->verificationCode == $request->input('verificationCode')){
                if (Carbon::parse($verifyToken->expiresIn)->gt(now())) {

                    $user = User::where('email', $request->input('email'))->first();
                    if ($user) {
                        $user->emailVerified = true;
                        $user->save();
                        $verifyToken->delete();

                        $infos = $request->only(['deviceID', 'deviceName']);
                        if(!$session = Auth::login($user, $infos)){
                            return response()->json(['status' => 'login_error'], 200);
                        }

                        return response()->json([
                            'status' => 'login_success',
                            'sessionID' => $session,
                            'userID' => $user->ID,
                            'user' => $user,
                            'deviceID' => $infos['deviceID'],
                            'deviceName' => $infos['deviceName'],
                        ]);
                    }
                }

                $verifyToken->delete();
            } else {
                $verifyToken->verifyAttempt++;
                if($verifyToken->verifyAttempt >= 3) {
                    $verifyToken->delete();
                } else {
                    $verifyToken->save();
                }
            }
        }

        return $this->send_error(404, 1008, 'Invalid or expired verification code!');
    }

    public function requestPasswordReset(Request $request) {
        $this->validate($request, [
            'username' => 'required|email'
        ], [], [
            'username' => 'Username'
        ]);

        if (!User::where('email', $request->input('username'))->first()) {
            return $this->send_not_found('User', 1006);
        }

        $verifyCode = rand(100000, 999999);
        $expiresIn = now()->addMinutes(30);

        PasswordReset::updateOrCreate(
            ['email' => $request->input('username')],
            [
                'verificationCode' => $verifyCode,
                'expiresIn' => $expiresIn
            ]
        );

        Mail::to($request->input('username'))->send(new ResetPassword($verifyCode));
    }

    public function resetPassword(Request $request) {
        $this->validate($request, [
            'username' => 'required|email|exists:users,email',
            'verificationCode' => 'required',
            'newPassword' => 'required|min:6|max:40|regex:/^[A-Za-z0-9-_]+$/D'
        ], [
            'email.exists' => 'Email not found!',
            'newPassword.regex' => 'format' . '#' . 'Password contains unacceptable characters!',
        ],[
            'newPassword' => 'new password',
            'username' => 'username',
            'verificationCode' => 'verification code'
        ]);

        $verifyToken = PasswordReset::where('email', $request->input('username'))
            ->first();
        
        if ($verifyToken) {
            if ($verifyToken->verificationCode == $request->input('verificationCode')){
                if (Carbon::parse($verifyToken->expiresIn)->gt(now())) {
                    $user = User::where('email', $request->input('username'))->first();
                    if ($user) {
                        $user->password = $request->input('newPassword');
                        $user->save();
                    }
    
                    $verifyToken->delete();
                    return;
                }
    
                $verifyToken->delete();
            } else {
                $verifyToken->attempt++;
                if($verifyToken->attempt >= 3) {
                    $verifyToken->delete();
                } else {
                    $verifyToken->save();
                }
            }
        }

        return $this->send_error(404, 1008, 'Invalid or expired verification code!');
    }

    public function changePassword(Request $request) {
        $this->validate($request, [
            'oldPassword' => 'required',
            'newPassword' => 'required|min:6|max:40|regex:/^[A-Za-z0-9-_]+$/D'
        ], [
            'newPassword.regex' => 'format' . '#' . 'Password contains unacceptable characters!',
        ],[
            'oldPassword' => 'old password',
            'newPassword' => 'new password'
        ]);

        $user = auth()->user();
        $curPwd = $user->getAuthPassword();
        if (!Hash::check($request->input('oldPassword'), $curPwd)) {
            return response()->json([
                'validationErrors' => [
                    'oldPassword' => [
                        'notFound',
                        'Invalid old password!'
                    ]
                ]
            ], 400);
        }

        $user->password = $request->input('newPassword');
        $user->save();
        return;
    }

    public function sendVerifyCode($email) {
        $verifyCode = rand(100000, 999999);
        $expiresIn = now()->addMinutes(30);

        EmailVerifyToken::updateOrCreate(
            ['email' => $email],
            [
                'verificationCode' => $verifyCode,
                'expiresIn' => $expiresIn
            ]
        );

        Mail::to($email)->send(new VerifyMail($email, $verifyCode));

        return $verifyCode;
    }
}
