<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller; use App\Models\Address; use Illuminate\Http\Request; use Illuminate\Support\Facades\DB;
class AddressController extends Controller {
 public function index(Request $request) { return response()->json(['success'=>true,'addresses'=>$request->user()->addresses()->latest('is_default')->get()]); }
 public function store(Request $request) { $data=$this->data($request); $address=DB::transaction(function() use($request,$data){ if(($data['is_default']??false)||!$request->user()->addresses()->exists()) $request->user()->addresses()->update(['is_default'=>false]); return $request->user()->addresses()->create($data); }); return response()->json(['success'=>true,'address'=>$address],201); }
 public function update(Request $request, Address $address) { abort_unless($address->user_id===$request->user()->id,403); $data=$this->data($request); if(($data['is_default']??false)) $request->user()->addresses()->whereKeyNot($address->id)->update(['is_default'=>false]); $address->update($data); return response()->json(['success'=>true,'address'=>$address->fresh()]); }
 public function destroy(Request $request, Address $address) { abort_unless($address->user_id===$request->user()->id,403); $address->delete(); return response()->json(['success'=>true]); }
 private function data(Request $request): array { return $request->validate(['label'=>'required|string|max:50','recipient_name'=>'required|string|max:255','phone'=>'required|string|max:20','address'=>'required|string|max:2000','is_default'=>'sometimes|boolean']); }
}
