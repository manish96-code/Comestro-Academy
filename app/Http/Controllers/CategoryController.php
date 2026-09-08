<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    // Display a list of course categories
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = Category::with('parent');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Show form to create a new category
    public function create(): Response
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('status', 'active')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => $parentCategories,
        ]);
    }

    // Store a newly created category
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:50'],
            'parent_id' => ['nullable', 'exists:categories,id'],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    // Display / edit form for a single category
    public function show(Category $category): Response
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->where('status', 'active')
            ->get(['id', 'name']);

        $category->load('parent');

        return Inertia::render('Admin/Categories/Create', [
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }

    // Update category.
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:50'],
            'parent_id' => ['nullable', 'exists:categories,id', Rule::notIn([$category->id])],
            'status' => ['required', 'in:active,inactive'],
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category details updated successfully.');
    }
}
