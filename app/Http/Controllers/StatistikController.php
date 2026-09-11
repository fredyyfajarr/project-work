<?php

namespace App\Http\Controllers;

use App\Services\StatistikService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class StatistikController extends Controller
{
    public function __construct(private readonly StatistikService $statistik)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Public/Statistik', [
            'pageTitle' => 'Statistik Lengkap — LLD UNPAM',
            'statistik' => $this->statistik->detail(),
        ]);
    }

    public function data(): JsonResponse
    {
        return response()->json([
            'cards' => $this->statistik->publicCards(),
            'updated_at' => now()->format('d M Y H:i:s'),
        ]);
    }
}
