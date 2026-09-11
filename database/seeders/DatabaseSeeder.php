<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Instructor;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'manish@gmail.com'],
            [
                'name' => 'Manish Kumar',
                'phone' => '7987878900',
                'password' => Hash::make('123456789'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // -------------------------------------------------------------
        // INSTRUCTORS (5 Teachers)
        // -------------------------------------------------------------
        $instructorsData = [
            [
                'name' => 'Dr. Rajesh Sharma',
                'email' => 'rajesh@example.com',
                'phone' => '9876543210',
                'designation' => 'Senior Web Instructor & Tech Lead',
                'qualification' => 'M.Tech in Computer Science',
                'expertise' => 'PHP, Laravel, React, MySQL, Architecture',
                'experience_years' => 7,
                'bio' => 'Passionate instructor with over 7 years of teaching full-stack web development and scalable cloud architectures.',
            ],
            [
                'name' => 'Priya Patel',
                'email' => 'priya@example.com',
                'phone' => '9876543211',
                'designation' => 'Principal Product Designer',
                'qualification' => 'B.Des in Visual & Interaction Design',
                'expertise' => 'UI/UX, Figma, Design Systems, Mobile App UI',
                'experience_years' => 6,
                'bio' => 'Design systems architect and product consultant specializing in modern digital UI/UX and interactive prototypes.',
            ],
            [
                'name' => 'Amitav Roy',
                'email' => 'amitav.roy@example.com',
                'phone' => '9876543212',
                'designation' => 'Cloud Architect & DevOps Specialist',
                'qualification' => 'M.S. in Software Systems',
                'expertise' => 'Docker, Kubernetes, AWS, CI/CD Pipelines, Linux',
                'experience_years' => 8,
                'bio' => 'DevOps and cloud infrastructure engineer helping developers build reliable and automated containerized delivery pipelines.',
            ],
            [
                'name' => 'Ananya Gupta',
                'email' => 'ananya.gupta@example.com',
                'phone' => '9876543213',
                'designation' => 'Lead Mobile Application Engineer',
                'qualification' => 'B.Tech in Computer Engineering',
                'expertise' => 'Flutter, React Native, Dart, iOS, Android',
                'experience_years' => 5,
                'bio' => 'Mobile application architect with deep expertise in cross-platform state management and high-performance native bridges.',
            ],
            [
                'name' => 'Vikramaditya Sengupta',
                'email' => 'vikram.sengupta@example.com',
                'phone' => '9876543214',
                'designation' => 'Staff Engineer & Python Specialist',
                'qualification' => 'Ph.D. in Artificial Intelligence',
                'expertise' => 'Python, Django REST Framework, FastAPI, Machine Learning',
                'experience_years' => 9,
                'bio' => 'Staff engineer and researcher passionate about backend system design, microservices, and practical AI integrations.',
            ],
        ];

        foreach ($instructorsData as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'password' => Hash::make('123456789'),
                    'role' => 'instructor',
                    'status' => 'active',
                ]
            );

            Instructor::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'designation' => $data['designation'],
                    'qualification' => $data['qualification'],
                    'expertise' => $data['expertise'],
                    'experience_years' => $data['experience_years'],
                    'bio' => $data['bio'],
                ]
            );
        }

        // -------------------------------------------------------------
        // STUDENTS (15 Students)
        // -------------------------------------------------------------
        $studentsData = [
            [
                'name' => 'Rahul Verma',
                'email' => 'rahul@example.com',
                'phone' => '8887776665',
                'qualification' => 'B.Tech in Computer Science',
                'college_name' => 'National Institute of Technology',
                'bio' => 'Aspiring Full-Stack Software Engineer passionate about Laravel, Inertia React, and cloud applications.',
                'github_url' => 'https://github.com/rahulverma-demo',
                'linkedin_url' => 'https://linkedin.com/in/rahulverma-demo',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'name' => 'Aarav Mehta',
                'email' => 'aarav.mehta@example.com',
                'phone' => '9811223344',
                'qualification' => 'B.E. in Information Technology',
                'college_name' => 'BITS Pilani',
                'bio' => 'Frontend enthusiast focused on building high-performance React and Next.js applications.',
                'github_url' => 'https://github.com/aaravmehta-demo',
                'linkedin_url' => 'https://linkedin.com/in/aaravmehta-demo',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
            ],
            [
                'name' => 'Sneha Reddy',
                'email' => 'sneha.reddy@example.com',
                'phone' => '9822334455',
                'qualification' => 'B.Tech in Computer Science',
                'college_name' => 'IIT Hyderabad',
                'bio' => 'Backend developer who loves database query optimization, Redis caching, and microservices.',
                'github_url' => 'https://github.com/snehareddy-demo',
                'linkedin_url' => 'https://linkedin.com/in/snehareddy-demo',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
            [
                'name' => 'Rohan Joshi',
                'email' => 'rohan.joshi@example.com',
                'phone' => '9833445566',
                'qualification' => 'B.Sc in Computer Applications',
                'college_name' => 'Symbiosis Institute of Technology',
                'bio' => 'Self-taught web developer leveling up skills in enterprise PHP, REST APIs, and automated Pest tests.',
                'github_url' => 'https://github.com/rohanjoshi-demo',
                'linkedin_url' => 'https://linkedin.com/in/rohanjoshi-demo',
                'city' => 'Pune',
                'state' => 'Maharashtra',
            ],
            [
                'name' => 'Kavya Nair',
                'email' => 'kavya.nair@example.com',
                'phone' => '9844556677',
                'qualification' => 'B.Des in Product Design',
                'college_name' => 'National Institute of Design',
                'bio' => 'Passionate UI/UX designer blending design systems in Figma with frontend CSS implementations.',
                'github_url' => 'https://github.com/kavyanair-demo',
                'linkedin_url' => 'https://linkedin.com/in/kavyanair-demo',
                'city' => 'Kochi',
                'state' => 'Kerala',
            ],
            [
                'name' => 'Ishaan Kapoor',
                'email' => 'ishaan.kapoor@example.com',
                'phone' => '9855667788',
                'qualification' => 'B.Tech in Electronics & Communication',
                'college_name' => 'Delhi Technological University',
                'bio' => 'Exploring modern full-stack web frameworks and cloud deployment with Docker.',
                'github_url' => 'https://github.com/ishaankapoor-demo',
                'linkedin_url' => 'https://linkedin.com/in/ishaankapoor-demo',
                'city' => 'New Delhi',
                'state' => 'Delhi',
            ],
            [
                'name' => 'Pooja Iyer',
                'email' => 'pooja.iyer@example.com',
                'phone' => '9866778899',
                'qualification' => 'M.C.A.',
                'college_name' => 'Anna University',
                'bio' => 'Full-stack developer with an interest in clean code, design patterns, and test-driven development.',
                'github_url' => 'https://github.com/poojaiyer-demo',
                'linkedin_url' => 'https://linkedin.com/in/poojaiyer-demo',
                'city' => 'Chennai',
                'state' => 'Tamil Nadu',
            ],
            [
                'name' => 'Aditya Choudhury',
                'email' => 'aditya.c@example.com',
                'phone' => '9877889900',
                'qualification' => 'B.Tech in Software Engineering',
                'college_name' => 'Jadavpur University',
                'bio' => 'Enthusiastic coder building real-time collaboration tools and exploring Inertia.js SPAs.',
                'github_url' => 'https://github.com/adityac-demo',
                'linkedin_url' => 'https://linkedin.com/in/adityac-demo',
                'city' => 'Kolkata',
                'state' => 'West Bengal',
            ],
            [
                'name' => 'Rhea Bhatia',
                'email' => 'rhea.bhatia@example.com',
                'phone' => '9888990011',
                'qualification' => 'B.Tech in Computer Science',
                'college_name' => 'Manipal Institute of Technology',
                'bio' => 'Passionate about building intuitive developer tooling and responsive SaaS dashboards.',
                'github_url' => 'https://github.com/rheabhatia-demo',
                'linkedin_url' => 'https://linkedin.com/in/rheabhatia-demo',
                'city' => 'Jaipur',
                'state' => 'Rajasthan',
            ],
            [
                'name' => 'Siddharth Malhotra',
                'email' => 'siddharth.m@example.com',
                'phone' => '9899001122',
                'qualification' => 'B.Tech in Information Science',
                'college_name' => 'PES University',
                'bio' => 'Junior developer aiming to master Laravel ecosystem, queue workers, and background processing.',
                'github_url' => 'https://github.com/siddharthm-demo',
                'linkedin_url' => 'https://linkedin.com/in/siddharthm-demo',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'name' => 'Tanvi Deshmukh',
                'email' => 'tanvi.d@example.com',
                'phone' => '9911002233',
                'qualification' => 'B.E. in Computer Engineering',
                'college_name' => 'College of Engineering, Pune',
                'bio' => 'Interested in API architecture, security boundaries, and responsive component libraries.',
                'github_url' => 'https://github.com/tanvid-demo',
                'linkedin_url' => 'https://linkedin.com/in/tanvid-demo',
                'city' => 'Pune',
                'state' => 'Maharashtra',
            ],
            [
                'name' => 'Varun Nambiar',
                'email' => 'varun.n@example.com',
                'phone' => '9922113344',
                'qualification' => 'B.Tech in Computer Science',
                'college_name' => 'NIT Calicut',
                'bio' => 'Building mobile-friendly responsive websites with modern Tailwind and JavaScript.',
                'github_url' => 'https://github.com/varunn-demo',
                'linkedin_url' => 'https://linkedin.com/in/varunn-demo',
                'city' => 'Thiruvananthapuram',
                'state' => 'Kerala',
            ],
            [
                'name' => 'Meera Singhania',
                'email' => 'meera.s@example.com',
                'phone' => '9933224455',
                'qualification' => 'B.Des in Interaction Design',
                'college_name' => 'Srishti Institute of Art, Design and Technology',
                'bio' => 'Visual designer passionate about typography, micro-interactions, and accessible web standards.',
                'github_url' => 'https://github.com/meeras-demo',
                'linkedin_url' => 'https://linkedin.com/in/meeras-demo',
                'city' => 'Bengaluru',
                'state' => 'Karnataka',
            ],
            [
                'name' => 'Karan Saxena',
                'email' => 'karan.saxena@example.com',
                'phone' => '9944335566',
                'qualification' => 'B.Tech in Information Technology',
                'college_name' => 'IIT Roorkee',
                'bio' => 'Aspiring software architect diving into database schemas, indexes, and full-stack Laravel SPAs.',
                'github_url' => 'https://github.com/karansaxena-demo',
                'linkedin_url' => 'https://linkedin.com/in/karansaxena-demo',
                'city' => 'Lucknow',
                'state' => 'Uttar Pradesh',
            ],
            [
                'name' => 'Divya Pillai',
                'email' => 'divya.pillai@example.com',
                'phone' => '9955446677',
                'qualification' => 'B.Tech in Computer Science',
                'college_name' => 'Amrita Vishwa Vidyapeetham',
                'bio' => 'Student developer keen on writing automated feature tests with Pest PHP and building SaaS products.',
                'github_url' => 'https://github.com/divyapillai-demo',
                'linkedin_url' => 'https://linkedin.com/in/divyapillai-demo',
                'city' => 'Coimbatore',
                'state' => 'Tamil Nadu',
            ],
        ];

        foreach ($studentsData as $sData) {
            $user = User::updateOrCreate(
                ['email' => $sData['email']],
                [
                    'name' => $sData['name'],
                    'phone' => $sData['phone'],
                    'password' => Hash::make('123456789'),
                    'role' => 'student',
                    'status' => 'active',
                ]
            );

            StudentProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'qualification' => $sData['qualification'],
                    'college_name' => $sData['college_name'],
                    'bio' => $sData['bio'],
                    'github_url' => $sData['github_url'],
                    'linkedin_url' => $sData['linkedin_url'],
                    'city' => $sData['city'],
                    'state' => $sData['state'],
                ]
            );
        }

        // Course Categories
        $webDev = Category::updateOrCreate(
            ['slug' => 'web-development'],
            [
                'name' => 'Web Development',
                'description' => 'Frontend & Backend web development courses covering HTML, CSS, JS, Laravel, React.',
                'status' => 'active',
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'laravel-framework'],
            [
                'name' => 'Laravel Framework',
                'description' => 'Master full-stack Laravel framework architecture, APIs, and Inertia React.',
                'parent_id' => $webDev->id,
                'status' => 'active',
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'ui-ux-design'],
            [
                'name' => 'UI/UX & Graphic Design',
                'description' => 'User interface design, prototyping with Figma, and visual aesthetics.',
                'status' => 'active',
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'mobile-development'],
            [
                'name' => 'Mobile App Development',
                'description' => 'Cross-platform mobile application development with Flutter and React Native.',
                'status' => 'active',
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'cloud-devops'],
            [
                'name' => 'Cloud & DevOps Engineering',
                'description' => 'Docker containerization, Kubernetes clusters, AWS cloud infrastructure, and CI/CD pipelines.',
                'status' => 'active',
            ]
        );

        Category::updateOrCreate(
            ['slug' => 'python-ai'],
            [
                'name' => 'Python, APIs & AI Engineering',
                'description' => 'Enterprise Python backends with Django REST Framework, FastAPI, and practical AI integrations.',
                'status' => 'active',
            ]
        );

        $this->call(CourseSeeder::class);
    }
}
