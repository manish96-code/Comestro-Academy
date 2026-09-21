<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use Laravel\Socialite\Two\User as SocialiteUser;

test('redirect to google redirects back to login if credentials are not configured', function () {
    config([
        'services.google.client_id' => null,
        'services.google.client_secret' => null,
    ]);

    $response = $this->get(route('auth.google'));

    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['google']);
});

test('redirect to google redirects to provider when configured', function () {
    config([
        'services.google.client_id' => 'test-client-id',
        'services.google.client_secret' => 'test-client-secret',
    ]);

    $response = $this->get(route('auth.google'));

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('accounts.google.com');
});

test('google callback registers and logs in a new student', function () {
    config([
        'services.google.client_id' => 'test-client-id',
        'services.google.client_secret' => 'test-client-secret',
    ]);

    $abstractUser = Mockery::mock(SocialiteUser::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-unique-id-12345');
    $abstractUser->shouldReceive('getName')->andReturn('Google Student');
    $abstractUser->shouldReceive('getEmail')->andReturn('googlestudent@example.com');
    $abstractUser->shouldReceive('getAvatar')->andReturn('https://avatar.url/photo.jpg');

    $provider = Mockery::mock(GoogleProvider::class);
    $provider->shouldReceive('stateless')->andReturnSelf();
    $provider->shouldReceive('user')->andReturn($abstractUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback'));

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'email' => 'googlestudent@example.com',
        'google_id' => 'google-unique-id-12345',
        'role' => 'student',
    ]);
    $response->assertRedirect(route('student.dashboard', absolute: false));
});

test('google callback links to existing user by email and preserves role redirect', function () {
    config([
        'services.google.client_id' => 'test-client-id',
        'services.google.client_secret' => 'test-client-secret',
    ]);

    $admin = User::factory()->create([
        'email' => 'admin_google@example.com',
        'role' => 'admin',
        'google_id' => null,
    ]);

    $abstractUser = Mockery::mock(SocialiteUser::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-admin-id-999');
    $abstractUser->shouldReceive('getName')->andReturn('Admin User');
    $abstractUser->shouldReceive('getEmail')->andReturn('admin_google@example.com');
    $abstractUser->shouldReceive('getAvatar')->andReturn(null);

    $provider = Mockery::mock(GoogleProvider::class);
    $provider->shouldReceive('stateless')->andReturnSelf();
    $provider->shouldReceive('user')->andReturn($abstractUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback'));

    $this->assertAuthenticatedAs($admin);
    expect($admin->fresh()->google_id)->toBe('google-admin-id-999');
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('google callback redirects to login if provider throws exception', function () {
    config([
        'services.google.client_id' => 'test-client-id',
        'services.google.client_secret' => 'test-client-secret',
    ]);

    $provider = Mockery::mock(GoogleProvider::class);
    $provider->shouldReceive('stateless')->andReturnSelf();
    $provider->shouldReceive('user')->andThrow(new Exception('OAuth error'));

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get(route('auth.google.callback'));

    $this->assertGuest();
    $response->assertRedirect(route('login'));
    $response->assertSessionHasErrors(['google']);
});
