<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Common\Utils;
use App\Common\SendResponse;
use App\Enums\UserRole;
use App\Http\Requests\ServerRequest;
use App\Models\Server;

class ServerController extends Controller
{
    use SendResponse;
    
    // create server
    public function create(ServerRequest $request) {
        $server = Server::create($request->all());
        
        unset($server['created_at'], $server['updated_at']);
        return response()->json($server, 200);
    }

    // update server
    public function update($serverId, Request $request) {
        $server = Server::find($serverId);
        if(!$server) {
            return $this->send_not_found('Server', 1009);
        }

        app('App\Http\Requests\ServerRequest');

        $server->update($request->all());
        return response()->json($server, 200);
    }

    // get server list
    public function list(Request $request) {
        $user = auth()->user();

        $query = new Server();
        if ($user->roleID != UserRole::ADMIN) {
            $query = $query->where('active', true);
        } else {
            $active = $request->input('active');
            if($active !== null) {
                $active = Utils::is_true($active);
                $query = $query->where('active', $active);
            }
        }
        
        $query = $query->select(array_merge(['ID'], (new Server())->getFillable()));
        $query = Utils::filterAttributes($query, $request, new Server());
        $query = Utils::pagination($query, $request);
        $query = Utils::expandAttributes($query, $request->input('expand'), new Server(), ['active']);

        $servers = $query->get();
        
        return response()->json($servers, 200);
    }

    // get one server
    public function get($serverId, Request $request) {
        $server = Server::find($serverId);
        
        if (!$server) {
            return $this->send_not_found('Server', 1009);
        }

        $user = auth()->user();
        if ($user->roleID != UserRole::ADMIN) {
            if (!$server->active) {
                return $this->send_access_denied();
            }
        }

        $server = Utils::expandAttributes(null, $request->input('expand'), $server);

        return response()->json($server, 200);
    }

    // delete server
    public function delete($serverId) {
        $server = Server::find($serverId);
        if(!$server) {
            return $this->send_not_found('Server', 1009);
        }

        $server->delete();
    }
}
