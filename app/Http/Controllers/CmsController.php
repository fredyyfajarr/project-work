<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCmsRequest;
use App\Models\Cms;
use App\Services\CmsContentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class CmsController extends Controller
{
    public function __construct(private readonly CmsContentService $cmsService)
    {
    }

    public function index(): Response
    {
        $this->cmsService->ensureDefaults();

        return Inertia::render('Admin/Cms/Index', [
            'items' => Cms::orderBy('kategori')->orderBy('menu_slug')->orderBy('urutan')->orderByDesc('idCms')->get()->groupBy('menu_slug'),
            'definitions' => $this->cmsService->definitions(),
        ]);
    }

    public function store(StoreCmsRequest $request): RedirectResponse
    {
        $this->cmsService->ensureDefaults();
        $data = $request->validated();
        $definition = $this->cmsService->definition($data['menu_slug'] ?? '');

        if (! $definition) {
            return back()->withErrors(['menu_slug' => 'Menu CMS tidak valid.'])->withInput();
        }

        Cms::create([
            'slug' => $this->cmsService->makeUniqueSlug($data['menu_slug'], $data['judul']),
            'menu_slug' => $data['menu_slug'], 'kategori' => $definition['kategori'], 'nama_menu' => $definition['nama_menu'],
            'judul' => $data['judul'], 'deskripsi' => $data['deskripsi'] ?? null,
            'gambar' => $this->uploadImage($request) ?: $definition['default_gambar'],
            'link_berita' => ($definition['allow_link'] ?? false) ? ($data['link_berita'] ?? null) : null,
            'urutan' => $data['urutan'] ?? 1, 'status' => $data['status'], 'tanggalUpdate' => now(),
        ]);

        return redirect()->route('admin.cms.index')->with('success', 'Konten CMS baru berhasil ditambahkan dan langsung tampil di company profile.');
    }

    public function update(StoreCmsRequest $request, int $id): RedirectResponse
    {
        $this->cmsService->ensureDefaults();
        $cms = Cms::findOrFail($id);
        $data = $request->validated();
        $definition = $this->cmsService->definition($cms->menu_slug);

        $payload = [
            'judul' => $data['judul'], 'deskripsi' => $data['deskripsi'] ?? null,
            'link_berita' => ($definition['allow_link'] ?? false) ? ($data['link_berita'] ?? null) : null,
            'urutan' => $data['urutan'] ?? $cms->urutan, 'status' => $data['status'], 'tanggalUpdate' => now(),
        ];
        if ($request->hasFile('gambar') && ($path = $this->uploadImage($request))) {
            $payload['gambar'] = $path;
        }
        $cms->update($payload);

        return redirect()->route('admin.cms.index')->with('success', 'Konten CMS berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        Cms::findOrFail($id)->delete();

        return redirect()->route('admin.cms.index')->with('success', 'Konten CMS berhasil dihapus.');
    }

    private function uploadImage(Request $request): ?string
    {
        if (! $request->hasFile('gambar')) {
            return null;
        }

        $folder = public_path('uploads/cms');
        if (! File::exists($folder)) {
            File::makeDirectory($folder, 0755, true);
        }

        $file = $request->file('gambar');
        $filename = 'cms-'.time().'-'.uniqid().'.'.$file->getClientOriginalExtension();
        $file->move($folder, $filename);

        return 'uploads/cms/'.$filename;
    }
}
