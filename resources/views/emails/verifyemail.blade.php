@component('mail::message')
Welcome to PortTel Api.

Your verification code is <br />
<h2>{{$verifyCode}}</h2>
{{-- Please verify code here <a href="http://localhost:4200/verifymail" target="_blank">http://localhost:4200/verifymail</a>. <br/><br/> --}}
{{-- Please verify code <a href="{{$verifyLink}}" target="_blank">here</a>. <br/><br/> --}}
Thank you,<br /><br />
PortTel
@endcomponent
