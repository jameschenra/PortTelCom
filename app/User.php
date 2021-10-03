<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    protected $guard_name = 'access_token';

    protected $primaryKey = 'ID';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstName', 'lastName', 'email', 'emailVerified', 'password', 'type', 'roleID', 'countryID',
        'locked', 'loginAttempt', 'lockExpired', 'companyName', 'companyAddress', 'companyRegistrationNumber', 'companyVATNumber',
        'contactFirstName', 'contactLastName'
    ];

    const companyFields = [
        'companyName',
        'companyAddress',
        'companyRegistrationNumber',
        'companyVATNumber',
        'contactFirstName',
        'contactLastName'
    ];

    public $expands = [
        'country', 'role'
    ];

    public $expandsUnderScore = [ ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'created_at', 'updated_at'
    ];

    public function setPasswordAttribute($value) {
        $this->attributes['password'] = bcrypt($value);
    }

    public function getLockedAttribute($value) {
        if ($value) {
            return true;
        }
        return false;
    }

    public function getEmailVerifiedAttribute($value) {
        if ($value) {
            return true;
        }
        return false;
    }

    public function country() {
        return $this->belongsTo('App\Models\Country', 'countryID', 'ID');
    }

    public function role() {
        return $this->belongsTo('App\Models\Role', 'roleID', 'id');
    }

    public function toArray()
    {
        return $this->attributesToArray() + $this->relationsToArray();
    }
}
