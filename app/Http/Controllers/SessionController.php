<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Common\Utils;
use App\Common\SendResponse;
use App\Enums\UserRole;
use App\Http\Requests\LoginRequest;
use App\User;
use App\Models\Session;
use Carbon\Carbon;
use App\Http\Controllers\UserController;

class SessionController extends Controller
{
    use SendResponse;

    private $sessionFields = ['userID', 'sessionID', 'deviceID', 'deviceName', 'expiresIn'];
    
    //create session
    public function create(LoginRequest $request)
    {
        $credentials = [
            'email' => $request->input('username'),
            'password' => $request->input('password')
        ];

        $emailUser = User::where('email', $request->input('username'))->first();
        if ($emailUser) {
            $this->checkLockedExpire($emailUser);

            if($emailUser->locked) {
                return $this->send_error(403, 1003, 'User account temporary locked!');
            }
        }

        if (!$user = Auth::attempt($credentials)) {
            if ($emailUser) {
                $emailUser->loginAttempt++;

                if($emailUser->loginAttempt >= 3) {
                    $emailUser->locked = true;
                    $emailUser->lockExpired = now()->addMinutes(30);
                }
    
                $emailUser->save();
            }

            return $this->send_error(401, 1001, 'Invalid username or password!');
        }

        $user->loginAttempt = 0;
        $user->save();

        // if user not verified email
        if(!$user->emailVerified) {
            // send verify email
            $userController = new UserController();
            $userController->sendVerifyCode($user->email);

            return $this->send_error(403, 1002, 'User email not verified!');
        }

        $infos = $request->only(['deviceID', 'deviceName']);
        if(!$session = Auth::login($user, $infos)){
            return response()->json(['error' => 'Error occured while generate session!'], 500);
        }

        return $this->respondWithSession($session, $user, $infos);
    }

    public function checkLockedExpire($user) {
        if ($user->locked && Carbon::parse($user->lockExpired)->lt(now())) {
            $user->loginAttempt = 0;
            $user->locked = false;
            $user->save();
        }
    }

    protected function respondWithSession($session, $user, $infos)
    {
        return response()->json([
            'sessionID' => $session,
            'userID' => $user->ID,
            'user' => $user,
            'deviceID' => $infos['deviceID'],
            'deviceName' => $infos['deviceName'],
        ]);
    }

    public function keepAlive()
    {
        return;
    }

    //refresh session
    public function refresh()
    {
        return $this->respondWithSession(auth()->refresh());
    }
    
    // return sessions
    public function list(Request $request) {

        $userId = $request->input('userID');

        $user = auth()->user();

        $sessions = [];

        if ($userId) {
            if ($user->roleID == UserRole::REGULAR) {
                return $this->send_access_denied();
            } else {
                $targetUser = User::find($userId);
                if (!$targetUser) {
                    return $this->send_not_found('User', 1006);
                }
                if ($user->roleID == UserRole::SUPPORT && $targetUser->roleID == UserRole::ADMIN) {
                    return $this->send_access_denied();
                }

                $query = Session::where('userID', $userId);
                $query = Utils::filterAttributes($query, $request, new Session(), ['userID']);
                $query = Utils::pagination($query, $request);
                $query = Utils::expandAttributes($query, $request->input('expand'), new Session());

                $sessions = $query->get();
            }
        } else {
            $query = new Session();

            switch ($user->roleID) {
                case UserRole::ADMIN:
                    break;
                case UserRole::SUPPORT:
                    $query = Session::leftJoin('users', 'sessions.userID', 'users.ID')
                        ->where('users.roleID', '<>', UserRole::ADMIN);
                    break;
                case UserRole::REGULAR:
                default:
                    $query = Session::where('userID', $user->ID);
                    break;
            }
            
            $query = $query->select($this->sessionFields)
                ->orderBy('userID');
            $query = Utils::filterAttributes($query, $request, new Session(), ['userID']);
            $query = Utils::pagination($query, $request);
            $query = Utils::expandAttributes($query, $request->input('expand'), new Session());

            $sessions = $query->get();
        }
        
        return response()->json($sessions);
    }

    public function get($sessionId, Request $request) {
        $user = auth()->user();

        $sessionObj = Session::where('sessionID', $sessionId)
            ->with('user')
            ->select($this->sessionFields)
            ->first();
        
        if (!$sessionObj) {
            return $this->send_not_found('Session', 1007);
        }

        if ($user->roleID == UserRole::REGULAR) {
            if ($sessionObj->user->roleID != UserRole::REGULAR) {
                return $this->send_access_denied();
            }
        }

        if ($user->roleID == UserRole::SUPPORT) {
            if ($sessionObj->user->roleID == UserRole::ADMIN) {
                return $this->send_access_denied();
            }
        }

        if ($request->input('expand') != 'user') {
            unset($sessionObj->user);
        }
        
        return response()->json($sessionObj);
    }

    public function delete($otherSession = null) {
        $user = auth()->user();
        $sessionId = auth()->getTokenForRequest();

        if ($otherSession) {
            $otherUser = Session::with('user')->where('sessionID', $otherSession)->first();
            if ($otherUser) {
                if ($user->roleID == UserRole::REGULAR) {
                    if ($user->ID != $otherUser->user->ID) {
                        return $this->send_access_denied();
                    }
                } else if ( $user->roleID == UserRole::SUPPORT ) {
                    if ( $otherUser->user->roleID == UserRole::ADMIN ) {
                        return $this->send_access_denied();
                    }

                    if ($otherUser->user->roleID == UserRole::SUPPORT
                        && $user->ID != $otherUser->user->ID) {
                            return $this->send_access_denied();
                    }
                } else {
                    if ( $user->ID != 1 && $otherUser->userID == 1 ) {
                        return $this->send_access_denied();
                    }
                }
                $otherUser->delete();
            } else {
                return $this->send_not_found('Session',1007);
            }
            return;
        }

        Session::where('sessionID', $sessionId)->delete();
    }

    public function test(Request $request) {
        /* Mail::to($beforeWeeks)
                ->send(new ExpireMail(ExpireType::EXPIRE_WEEK, 7, 'plan')); */

        return response()->json(['floaing' => 1.25]);
        return [filter_var('true', FILTER_VALIDATE_BOOLEAN)];
    }
}
