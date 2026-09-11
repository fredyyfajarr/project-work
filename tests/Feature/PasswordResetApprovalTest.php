<?php

namespace Tests\Feature;

use App\Models\Mahasiswa;
use App\Models\PasswordResetRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordResetApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_submit_forgot_password_request_with_valid_username_and_email(): void
    {
        $user = User::create([
            'username' => 'testuser99',
            'email' => 'testuser99@unpam.ac.id',
            'password' => Hash::make('oldpassword123'),
            'role' => 'staff',
            'status' => 'aktif',
        ]);

        $response = $this->post(route('password.email'), [
            'username' => 'testuser99',
            'email' => 'testuser99@unpam.ac.id',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('password_reset_requests', [
            'username' => 'testuser99',
            'email' => 'testuser99@unpam.ac.id',
            'status' => 'pending',
        ]);
    }

    public function test_forgot_password_fails_if_email_does_not_match(): void
    {
        $user = User::create([
            'username' => 'testuser98',
            'email' => 'correct@unpam.ac.id',
            'password' => Hash::make('oldpassword123'),
            'role' => 'staff',
            'status' => 'aktif',
        ]);

        $response = $this->post(route('password.email'), [
            'username' => 'testuser98',
            'email' => 'wrong@unpam.ac.id',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_admin_can_approve_reset_request_and_user_can_complete_reset(): void
    {
        $admin = User::create([
            'username' => 'admin_test',
            'email' => 'admin@unpam.ac.id',
            'password' => Hash::make('adminpassword'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $user = User::create([
            'username' => 'user_test',
            'email' => 'user_test@unpam.ac.id',
            'password' => Hash::make('initialpass123'),
            'role' => 'staff',
            'status' => 'aktif',
        ]);

        $resetReq = PasswordResetRequest::create([
            'user_id' => $user->idUser,
            'username' => $user->username,
            'email' => $user->email,
            'status' => 'pending',
        ]);

        // Admin approves request
        $response = $this->actingAs($admin)->post(route('admin.permohonan-reset.approve', $resetReq->id));
        $response->assertSessionHas('success');

        $resetReq->refresh();
        $this->assertEquals('approved', $resetReq->status);
        $this->assertNotNull($resetReq->token);
        $this->assertNotNull($resetReq->approved_at);

        // Admin logs out, user visits reset form as guest
        $this->post('/logout');

        // User visits reset form with token
        $viewResponse = $this->get(route('password.reset', $resetReq->token));
        $viewResponse->assertStatus(200);

        // User posts new password
        $resetResponse = $this->post(route('password.store'), [
            'token' => $resetReq->token,
            'username' => $user->username,
            'password' => 'NewSecurePassword123!',
            'password_confirmation' => 'NewSecurePassword123!',
        ]);

        $resetResponse->assertRedirect(route('login'));
        $resetResponse->assertSessionHas('success');

        $user->refresh();
        $this->assertTrue(Hash::check('NewSecurePassword123!', $user->password));

        $resetReq->refresh();
        $this->assertEquals('completed', $resetReq->status);
    }

    public function test_student_can_change_password_self_service(): void
    {
        $mahasiswa = Mahasiswa::create([
            'nim' => '2026999999',
            'nama' => 'Budi Santoso',
            'email' => 'budi@unpam.ac.id',
            'jurusan' => 'Teknik Informatika',
            'angkatan' => 2024,
            'status' => 'aktif',
        ]);

        $user = User::create([
            'username' => $mahasiswa->nim,
            'idMahasiswa' => $mahasiswa->idMahasiswa,
            'email' => $mahasiswa->email,
            'password' => Hash::make('oldPass123'),
            'role' => 'mahasiswa',
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($user)->post('/mahasiswa/ganti-password', [
            'current_password' => 'oldPass123',
            'password' => 'MyNewPassword888',
            'password_confirmation' => 'MyNewPassword888',
        ]);

        $response->assertSessionHas('success');

        $user->refresh();
        $this->assertTrue(Hash::check('MyNewPassword888', $user->password));
    }

    public function test_admin_can_view_reset_requests_page(): void
    {
        $admin = User::create([
            'username' => 'admin_viewer',
            'email' => 'admin_viewer@unpam.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($admin)->get('/admin/permohonan-reset');
        $response->assertStatus(200);
    }

    public function test_admin_can_reject_reset_request(): void
    {
        $admin = User::create([
            'username' => 'admin_rejector',
            'email' => 'admin_rejector@unpam.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $user = User::create([
            'username' => 'user_rejected',
            'email' => 'rejected@unpam.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'status' => 'aktif',
        ]);

        $resetReq = PasswordResetRequest::create([
            'user_id' => $user->idUser,
            'username' => $user->username,
            'email' => $user->email,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post("/admin/permohonan-reset/{$resetReq->id}/reject");
        $response->assertSessionHas('success');

        $resetReq->refresh();
        $this->assertEquals('rejected', $resetReq->status);
    }

    public function test_admin_can_change_own_password_self_service(): void
    {
        $admin = User::create([
            'username' => 'admin_changer',
            'email' => 'admin_changer@unpam.ac.id',
            'password' => Hash::make('oldAdminPass123'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $response = $this->actingAs($admin)->post('/admin/ganti-password', [
            'current_password' => 'oldAdminPass123',
            'password' => 'NewAdminPass999!',
            'password_confirmation' => 'NewAdminPass999!',
        ]);

        $response->assertSessionHas('success');

        $admin->refresh();
        $this->assertTrue(Hash::check('NewAdminPass999!', $admin->password));
    }
}
