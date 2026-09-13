import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Star,
    Clock,
    BookOpen,
    Users,
    CheckCircle2,
    Sparkles,
    Code2,
    Terminal,
    Layers,
    Cpu,
    ExternalLink
} from 'lucide-react';

export const COURSES_DATA = [
    {
        id: 'java-backend',
        title: 'Enterprise Java & Spring Boot 3 Microservices',
        slug: 'java-spring-boot-microservices',
        category: 'Backend Engineering',
        badge: 'Top Rated',
        level: 'Intermediate to Advanced',
        duration: '14 Weeks',
        modules: 18,
        rating: '4.96',
        reviewsCount: '1,420',
        studentsCount: '4,850+',
        price: '₹14,999',
        originalPrice: '₹24,999',
        discount: '40% OFF',
        image: '/images/courses/course-java.svg',
        instructor: {
            name: 'Rahul Sharma',
            role: 'Ex-Tech Lead, 8+ Yrs',
            avatar: 'RS',
        },
        description: 'Architect distributed fault-tolerant microservices with Java 21, Spring Boot 3, Kafka event streaming, Docker, and PostgreSQL.',
        stack: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL', 'Docker'],
        codeSnippet: {
            filename: '⚡ OrderSagaCoordinator.java',
            status: '● Build Succeeded · Kafka Stream Active · 0 errors',
            lines: [
                { text: '@Service', color: '#c084fc' },
                { text: 'public class OrderSagaCoordinator {', color: '#f8fafc' },
                { text: '    @Autowired private KafkaTemplate<String, Event> kafka;', color: '#94a3b8' },
                { text: '    @Transactional', color: '#c084fc' },
                { text: '    public Receipt processOrder(OrderPayload payload) {', color: '#38bdf8' },
                { text: '        Event event = Event.builder()', color: '#f8fafc' },
                { text: '            .sagaId(UUID.randomUUID())', color: '#f59e0b' },
                { text: '            .order(payload)', color: '#38bdf8' },
                { text: '            .timestamp(Instant.now()).build();', color: '#f59e0b' },
                { text: '        kafka.send("orders.saga.v1", event);', color: '#10b981' },
                { text: '        return new Receipt(event.getSagaId(), Status.PENDING);', color: '#38bdf8' },
                { text: '    }', color: '#f8fafc' },
                { text: '}', color: '#f8fafc' },
            ]
        }
    },
    {
        id: 'fullstack-nextjs',
        title: 'Full-Stack Next.js 15 & React 19 Architecture',
        slug: 'fullstack-nextjs-react19',
        category: 'Full-Stack & Web',
        badge: 'Most Popular',
        level: 'All Levels',
        duration: '12 Weeks',
        modules: 16,
        rating: '4.98',
        reviewsCount: '2,150',
        studentsCount: '6,200+',
        price: '₹12,999',
        originalPrice: '₹19,999',
        discount: '35% OFF',
        image: '/images/courses/course-nextjs.svg',
        instructor: {
            name: 'Ananya Verma',
            role: 'Staff UI Architect, 7+ Yrs',
            avatar: 'AV',
        },
        description: 'Master server actions, React 19 concurrent features, streaming SSR, TypeScript, Tailwind CSS, and real-time collaboration engines.',
        stack: ['Next.js 15', 'React 19', 'TypeScript', 'WebSockets', 'Prisma'],
        codeSnippet: {
            filename: '⚡ RealtimeCollaborator.tsx',
            status: '● WebSockets Connected · React 19 SSR · Fast Refresh',
            lines: [
                { text: 'import { useOptimistic, useTransition } from "react";', color: '#c084fc' },
                { text: 'export default function CollaborativeCanvas({ docId }) {', color: '#f8fafc' },
                { text: '  const [state, updateState] = useOptimistic(docState);', color: '#38bdf8' },
                { text: '  const [isPending, startTransition] = useTransition();', color: '#94a3b8' },
                { text: '  const broadcastChange = (delta: TextDelta) => {', color: '#f8fafc' },
                { text: '    startTransition(async () => {', color: '#c084fc' },
                { text: '      updateState((prev) => ({ ...prev, ...delta }));', color: '#10b981' },
                { text: '      await wsClient.send("DOC_SYNC", { docId, delta });', color: '#f59e0b' },
                { text: '    });', color: '#c084fc' },
                { text: '  };', color: '#f8fafc' },
                { text: '  return <LiveEditor buffer={state.content} onDelta={broadcastChange} />;', color: '#38bdf8' },
                { text: '}', color: '#f8fafc' },
            ]
        }
    },
    {
        id: 'cloud-devops',
        title: 'Cloud DevOps, Kubernetes & AWS Platform Engineering',
        slug: 'cloud-devops-kubernetes-aws',
        category: 'DevOps & Cloud',
        badge: 'Enterprise',
        level: 'Intermediate',
        duration: '10 Weeks',
        modules: 14,
        rating: '4.94',
        reviewsCount: '890',
        studentsCount: '3,100+',
        price: '₹15,999',
        originalPrice: '₹26,999',
        discount: '41% OFF',
        image: '/images/courses/course-devops.svg',
        instructor: {
            name: 'Vikramaditya Das',
            role: 'Principal SRE, 11+ Yrs',
            avatar: 'VD',
        },
        description: 'Build enterprise production infrastructure with Kubernetes clusters, Terraform IaC, Istio Service Mesh, Prometheus, and AWS ECS/EKS.',
        stack: ['Kubernetes', 'AWS', 'Terraform', 'Docker', 'Istio'],
        codeSnippet: {
            filename: '⚡ cluster-deployment.yaml',
            status: '● EKS v1.30 Active · Istio Mesh Ingress Healthy · 0 errors',
            lines: [
                { text: 'apiVersion: apps/v1', color: '#c084fc' },
                { text: 'kind: Deployment', color: '#f8fafc' },
                { text: 'metadata:', color: '#94a3b8' },
                { text: '  name: academy-core-service', color: '#38bdf8' },
                { text: 'spec:', color: '#94a3b8' },
                { text: '  replicas: 5', color: '#f59e0b' },
                { text: '  strategy:', color: '#94a3b8' },
                { text: '    type: RollingUpdate', color: '#10b981' },
                { text: '  template:', color: '#94a3b8' },
                { text: '    spec:', color: '#94a3b8' },
                { text: '      containers:', color: '#f8fafc' },
                { text: '      - name: app', color: '#38bdf8' },
                { text: '        image: registry.comestro.io/core:v2.4.0', color: '#10b981' },
            ]
        }
    },
    {
        id: 'genai-python',
        title: 'GenAI, Autonomous Agents & Python AI Engineering',
        slug: 'genai-autonomous-agents-python',
        category: 'Artificial Intelligence',
        badge: 'Trending 2026',
        level: 'All Levels',
        duration: '10 Weeks',
        modules: 15,
        rating: '4.97',
        reviewsCount: '1,890',
        studentsCount: '5,400+',
        price: '₹13,999',
        originalPrice: '₹22,999',
        discount: '39% OFF',
        image: '/images/courses/course-ai.svg',
        instructor: {
            name: 'Dr. Priya Nair',
            role: 'AI Research Lead, Ex-FAANG',
            avatar: 'PN',
        },
        description: 'Develop production RAG pipelines, autonomous multi-agent swarms, local LLM fine-tuning, vector databases, and LangChain/LlamaIndex apps.',
        stack: ['Python 3.12', 'LangChain', 'FastAPI', 'Qdrant', 'PyTorch'],
        codeSnippet: {
            filename: '⚡ autonomous_rag_agent.py',
            status: '● Vector DB Synced · 1,500+ Embeddings / sec · Low Latency',
            lines: [
                { text: 'from fastapi import FastAPI', color: '#c084fc' },
                { text: 'from langchain_core.prompts import ChatPromptTemplate', color: '#c084fc' },
                { text: 'app = FastAPI(title="AgenticRAG")', color: '#38bdf8' },
                { text: '@app.post("/api/v1/chat")', color: '#f59e0b' },
                { text: 'async def query_agent(prompt: QueryRequest):', color: '#f8fafc' },
                { text: '    docs = await vector_store.similarity_search(prompt.query, k=5)', color: '#38bdf8' },
                { text: '    context = "\\n".join([d.page_content for d in docs])', color: '#94a3b8' },
                { text: '    response = await llm_engine.generate_stream(', color: '#10b981' },
                { text: '        prompt=prompt.query, context=context', color: '#f8fafc' },
                { text: '    )', color: '#10b981' },
                { text: '    return StreamingResponse(response, media_type="text/event-stream")', color: '#38bdf8' },
            ]
        }
    },
    {
        id: 'system-design',
        title: 'System Design & High Concurrency Distributed Architectures',
        slug: 'system-design-distributed-architectures',
        category: 'System Architecture',
        badge: 'Leadership',
        level: 'Advanced',
        duration: '8 Weeks',
        modules: 12,
        rating: '4.99',
        reviewsCount: '950',
        studentsCount: '2,900+',
        price: '₹16,999',
        originalPrice: '₹28,999',
        discount: '41% OFF',
        image: '/images/courses/course-system-design.svg',
        instructor: {
            name: 'Siddharth Malhotra',
            role: 'Chief Architect, 14+ Yrs',
            avatar: 'SM',
        },
        description: 'Design systems handling 10M+ concurrent users. Deep dive into database sharding, consistency models, Raft consensus, and rate limiters.',
        stack: ['Distributed Systems', 'Raft', 'Redis', 'Kafka', 'Sharding'],
        codeSnippet: {
            filename: '⚡ distributed_rate_limiter.go',
            status: '● Sliding Window Limiter Active · 50k Req/sec · Consensus OK',
            lines: [
                { text: 'package ratelimit', color: '#c084fc' },
                { text: 'type DistributedLimiter struct {', color: '#f8fafc' },
                { text: '    redisCluster *redis.ClusterClient', color: '#38bdf8' },
                { text: '    capacity     int64', color: '#f59e0b' },
                { text: '}', color: '#f8fafc' },
                { text: 'func (l *DistributedLimiter) Allow(ctx context.Context, key string) (bool, error) {', color: '#38bdf8' },
                { text: '    now := time.Now().UnixNano()', color: '#94a3b8' },
                { text: '    res, err := l.redisCluster.EvalSha(ctx, slidingWindowSha, []string{key}, now, l.capacity).Result()', color: '#10b981' },
                { text: '    return res.(int64) == 1, err', color: '#38bdf8' },
                { text: '}', color: '#f8fafc' },
            ]
        }
    }
];

export default function SwappableCourseCards({
    onSelectCourse,
    activeCourseIndex = 0,
    theme = 'light'
}) {
    const [currentIndex, setCurrentIndex] = useState(activeCourseIndex);
    const isDark = theme === 'dark';

    const handleSelect = (idx) => {
        setCurrentIndex(idx);
        if (onSelectCourse) {
            onSelectCourse(COURSES_DATA[idx], idx);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* 5 Course Cards in One Responsive Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4.5">
                {COURSES_DATA.map((course, idx) => {
                    const isActive = idx === currentIndex;

                    return (
                        <div
                            key={course.id}
                            onClick={() => handleSelect(idx)}
                            className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-none ${
                                isActive
                                    ? isDark
                                        ? 'border-blue-500 bg-[#0f172a] ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/10 -translate-y-1'
                                        : 'border-blue-600 bg-white ring-2 ring-blue-600/40 shadow-xl shadow-blue-500/15 -translate-y-1'
                                    : isDark
                                        ? 'border-slate-800 bg-[#0d121f] hover:border-slate-700 hover:bg-[#111827]'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                            }`}
                        >
                            {/* Card Image Banner */}
                            <div className="relative w-full h-32 overflow-hidden bg-slate-950">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Category Pill Over Image */}
                                <div className="absolute top-2 left-2">
                                    <span className="rounded-md bg-slate-950/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-medium text-blue-400 border border-white/10">
                                        {course.category.split(' ')[0]}
                                    </span>
                                </div>
                                {/* Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className="rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2 py-0.5 shadow">
                                        {course.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3.5 flex flex-col flex-1 justify-between space-y-3">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold tracking-tight line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
                                        {course.title}
                                    </h3>

                                    {/* Instructor Info */}
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                            {course.instructor.avatar}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                {course.instructor.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate">
                                                {course.instructor.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating & Duration */}
                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="h-3 w-3 fill-amber-500" />
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{course.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3 text-slate-400" />
                                        <span>{course.duration}</span>
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                            {course.price}
                                        </span>
                                        <span className="block text-[10px] text-slate-400 line-through leading-none">
                                            {course.originalPrice}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('courses.index')}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                                            isActive
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                                : isDark
                                                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        Enroll →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Click-to-Inspect hint */}
            <p className="text-center text-[11px] font-mono text-slate-400 dark:text-slate-500">
                ⚡ Click any course card to inspect its live code editor &amp; terminal on the 3D MacBook Air above
            </p>
        </div>
    );
}
