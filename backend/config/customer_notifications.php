<?php

return [
    'email_enabled' => env('ORDER_EMAIL_NOTIFICATIONS', true),
    'sms_enabled' => env('ORDER_SMS_NOTIFICATIONS', true),
    'sms_driver' => env('SMS_DRIVER', 'log'),
];
