<?php

use App\Events\StudentEnrolledEvent;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Event;

test('student enrollment dispatches StudentEnrolledEvent for Reverb broadcasting', function () {
    Event::fake([StudentEnrolledEvent::class]);

    $student = User::factory()->create([
        'name' => 'Rahul Sharma',
        'email' => 'rahul@example.com',
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Web Development',
        'slug' => 'web-dev',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Full-Stack Laravel & React Mastery',
        'slug' => 'fullstack-laravel-react-mastery',
        'price' => 0,
        'status' => 'published',
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id));

    $response->assertSessionHas('success');

    Event::assertDispatched(StudentEnrolledEvent::class, function (StudentEnrolledEvent $event) {
        $data = $event->broadcastWith();

        return $data['student_name'] === 'Rahul Sharma'
            && $data['course_title'] === 'Full-Stack Laravel & React Mastery'
            && $event->broadcastAs() === 'student.enrolled'
            && count($event->broadcastOn()) === 1
            && $event->broadcastOn()[0]->name === 'private-admin-notifications';
    });
});

test('only authenticated admin users are authorized to listen on admin-notifications channel', function () {
    config([
        'broadcasting.default' => 'reverb',
        'broadcasting.connections.reverb.key' => 'test-key',
        'broadcasting.connections.reverb.secret' => 'test-secret',
        'broadcasting.connections.reverb.app_id' => 'test-app',
    ]);
    Broadcast::purge();
    require base_path('routes/channels.php');

    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $this->actingAs($admin)
        ->post('/broadcasting/auth', [
            'channel_name' => 'private-admin-notifications',
            'socket_id' => '1234.5678',
        ])
        ->assertOk()
        ->assertJsonStructure(['auth']);

    $student = User::factory()->create([
        'role' => 'student',
    ]);

    $this->actingAs($student)
        ->post('/broadcasting/auth', [
            'channel_name' => 'private-admin-notifications',
            'socket_id' => '1234.5678',
        ])
        ->assertForbidden();
});

test('student enrollment succeeds gracefully even if Reverb broadcast server is offline', function () {
    config([
        'broadcasting.default' => 'reverb',
        'broadcasting.connections.reverb.key' => 'test-key',
        'broadcasting.connections.reverb.secret' => 'test-secret',
        'broadcasting.connections.reverb.app_id' => 'test-app',
        'broadcasting.connections.reverb.options.host' => '127.0.0.1',
        'broadcasting.connections.reverb.options.port' => 8089, // dead port
    ]);
    Broadcast::purge();

    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Design',
        'slug' => 'design',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'UI/UX Design Masterclass',
        'slug' => 'ui-ux-masterclass',
        'price' => 0,
        'status' => 'published',
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id));

    $response->assertSessionHas('success');
    expect(Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeTrue();
});
