<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;

Product::where('id', 4)->update(['image' => '/images/products/iphone14.jpg']);
echo "updated product 4 image\n";
