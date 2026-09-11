<?php

namespace App\Http\Controllers;

use App\Models\Aktivitas;
use App\Services\StatistikService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly StatistikService $statistik)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $cards = $this->statistik->dashboardCards();

        $aktivitasTerbaru = Aktivitas::with('user')->latest()->take(10)
            ->when($user->role !== 'admin', fn ($q) => $q->where('user_id', $user->idUser))
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'total' => $cards['total'],
            'netra' => $cards['netra'],
            'rungu' => $cards['rungu'],
            'daksa' => $cards['daksa'],
            'jurusan' => $this->statistik->jurusanUntukDashboard(),
            'aktivitasTerbaru' => $aktivitasTerbaru,
        ]);
    }
}
