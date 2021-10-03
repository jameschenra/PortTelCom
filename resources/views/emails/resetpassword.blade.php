@component('mail::message')
Welcome to PortTel Api.

You sent the request to reset password.<br />
Your Reset Password Token is <br />
<h2>{{$verifyCode}}</h2>
Thank you,<br /><br />
PortTel
@endcomponent
