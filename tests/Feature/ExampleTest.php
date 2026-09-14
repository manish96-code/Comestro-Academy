<?php

use App\Models\Category;
use App\Models\Course;
use Inertia\Testing\AssertableInertia as Assert;

it('returns a successful response with published courses', function () {
    $category = Category::factory()->create();
    Course::factory()->count(3)->create([
        'category_id' => $category->id,
        'status' => 'published',
    ]);

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Welcome')
        ->has('courses', 3)
    );
});
