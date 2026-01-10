import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Zap, Server, Shield, AlertTriangle, BookOpen, Network, Lock, CheckCircle, XCircle, Lightbulb, TrendingUp, Database, Layers, Activity, Monitor, Wifi, Package, Image as ImageIcon } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const definitions = {
  'Scaling & Performance': {
    'Horizontal Scaling': 'Adding more machines to handle increased load. Better for stateless services.',
    'Vertical Scaling': 'Adding more power (CPU, RAM) to existing machines. Limited by hardware constraints.',
    'Load Balancing': 'Distributing incoming requests across multiple servers to prevent overload.',
    'CDN (Content Delivery Network)': 'Geographically distributed servers that cache static content closer to users.',
    'Caching': 'Storing frequently accessed data in fast storage (memory) to reduce database load.',
  },
  'Data & Storage': {
    'Database Sharding': 'Partitioning data across multiple databases based on a shard key.',
    'Replication': 'Copying data across multiple database servers for redundancy and read scaling.',
    'Consistency': 'All nodes see the same data at the same time (strong) vs eventually consistent.',
    'Eventual Consistency': 'System will become consistent over time, but not immediately.',
  },
  'Architecture Patterns': {
    'Microservices': 'Architecture pattern where applications are built as independent services.',
    'API Gateway': 'Single entry point that routes requests to appropriate microservices.',
    'Message Queue': 'Asynchronous communication between services using a queue (e.g., RabbitMQ, Kafka).',
  },
  'Reliability & Consistency': {
    'Availability': 'System remains operational even if some components fail.',
    'Partition Tolerance': 'System continues operating despite network partitions.',
    'CAP Theorem': 'Can only guarantee 2 of 3: Consistency, Availability, Partition tolerance.',
    'Idempotency': 'Operation produces the same result regardless of how many times it\'s executed.',
  },
  'Security & Access Control': {
    'Rate Limiting': 'Controlling the number of requests a user can make in a time period.',
  },
}

const keyConcepts = [
  {
    title: 'Scalability Patterns',
    items: [
      'Horizontal vs Vertical Scaling: Prefer horizontal for cloud-native systems',
      'Database Read Replicas: Scale reads by replicating data',
      'Caching Strategy: Cache at multiple levels (browser, CDN, application, database)',
      'Database Sharding: Partition by user_id, geographic region, or hash',
      'Stateless Services: Enable easy horizontal scaling',
    ],
  },
  {
    title: 'Performance Optimization',
    items: [
      'CDN for static assets: Images, CSS, JS files',
      'Database Indexing: Speed up queries on frequently searched fields',
      'Connection Pooling: Reuse database connections',
      'Async Processing: Use queues for non-critical operations',
      'Pagination: Limit result sets to manageable sizes',
    ],
  },
  {
    title: 'Reliability & Availability',
    items: [
      'Redundancy: Multiple instances of critical components',
      'Health Checks: Monitor and replace failing services',
      'Circuit Breakers: Prevent cascading failures',
      'Graceful Degradation: System works with reduced functionality',
      'Data Backup & Replication: Prevent data loss',
    ],
  },
  {
    title: 'Security',
    items: [
      'Authentication: Verify user identity (JWT, OAuth)',
      'Authorization: Control what users can access (RBAC)',
      'HTTPS: Encrypt data in transit',
      'Input Validation: Prevent injection attacks',
      'Rate Limiting: Prevent abuse and DDoS',
    ],
  },
]

const cheatSheet = {
  'Step 1: Requirements': [
    'Functional: What features? (read/write ratio, data size)',
    'Non-functional: Scale (users, QPS), latency, availability',
    'Clarify: Traffic estimates, storage needs, consistency requirements',
  ],
  'Step 2: API Design': [
    'Define endpoints: RESTful routes (GET /users/:id, POST /users, PUT /users/:id)',
    'Request/Response: Data formats (JSON), required fields, optional params',
    'Authentication: How clients authenticate? (JWT, API keys, OAuth)',
    'Pagination: Limit, offset, or cursor-based for list endpoints',
    'Versioning: /v1/, /v2/ to support backward compatibility',
    'Error handling: Consistent error format, HTTP status codes',
    'Rate limiting: Requests per user/IP to prevent abuse',
  ],
  'Step 3: High-Level Design': [
    'Draw: Client → Load Balancer → App Servers → Database',
    'Identify: Read-heavy vs write-heavy patterns',
    'Estimate: Storage, bandwidth, server capacity',
  ],
  'Step 4: Deep Dive': [
    'Database: SQL vs NoSQL, sharding strategy, replication',
    'Caching: What to cache? (Redis, Memcached)',
    'CDN: Static content delivery',
    'Message Queue: Async processing (Kafka, RabbitMQ)',
    'Security: Auth, encryption, rate limiting',
  ],
  'Step 5: Scale': [
    'Load Balancing: Round-robin, least connections, IP hash',
    'Database: Read replicas, sharding, caching',
    'Monitoring: Logging, metrics, alerting',
    'Bottlenecks: Identify and optimize',
  ],
}

const infrastructureComponents = {
  'Load Balancers': {
    types: [
      'Application Load Balancer (Layer 7): Routes based on HTTP/HTTPS content',
      'Network Load Balancer (Layer 4): Routes based on IP and port',
      'Classic Load Balancer: Basic load balancing',
    ],
    algorithms: [
      'Round Robin: Distribute requests sequentially',
      'Least Connections: Route to server with fewest active connections',
      'IP Hash: Route based on client IP (session affinity)',
      'Weighted: Assign different weights to servers',
    ],
    benefits: [
      'High Availability: Automatic failover',
      'Scalability: Add/remove servers dynamically',
      'SSL Termination: Handle HTTPS at load balancer',
      'Health Checks: Remove unhealthy servers',
    ],
  },
  'CDNs (Content Delivery Network)': {
    purpose: 'Serve static content from edge locations closer to users',
    useCases: [
      'Static Assets: Images, CSS, JavaScript files',
      'Video Streaming: Deliver video content efficiently',
      'API Responses: Cache API responses (with TTL)',
      'Large Files: Software downloads, documents',
    ],
    benefits: [
      'Reduced Latency: Content served from nearby edge servers',
      'Lower Bandwidth Costs: Offload traffic from origin servers',
      'Better Performance: Faster page loads',
      'DDoS Protection: Absorb attack traffic',
    ],
    providers: ['CloudFlare', 'AWS CloudFront', 'Fastly', 'Akamai'],
  },
}

const frontendSystemDesignPerformance = {
  'Code Splitting & Lazy Loading': {
    icon: Package,
    description: 'Load only what users need, when they need it. Reduces initial bundle size and improves Time to Interactive (TTI).',
    items: [
      {
        technique: 'Route-based code splitting',
        explanation: 'Load only the code needed for the current page/route',
        realWorld: '🎬 Netflix: Separate bundles for Browse (~200KB), Watch (~500KB), Account (~100KB) pages. Initial load is 200KB instead of 2MB total.',
        implementation: 'React: React.lazy(() => import("./Dashboard")), Vue: () => import("./Dashboard.vue")',
        impact: 'Reduces initial bundle by 60-80%. Improves TTI by 2-4 seconds.',
      },
      {
        technique: 'Infinite scroll / Pagination',
        explanation: 'Load content in chunks as user scrolls or navigates',
        realWorld: '📸 Instagram: Loads 12 posts initially (~500KB), fetches next 12 when you scroll 80% down. Twitter loads 20 tweets at a time. Reddit loads 25 posts per page.',
        implementation: 'Intersection Observer API to detect when user nears bottom, then fetch next page. Libraries: react-infinite-scroll, react-window.',
        impact: 'Initial load: 12 posts (500KB) vs all posts (50MB). 100x reduction. Saves bandwidth and memory.',
      },
      {
        technique: 'Component lazy loading',
        explanation: 'Defer loading of heavy components until needed (modals, charts, video players, rich editors)',
        realWorld: '🎥 YouTube: Video player code (2MB) only loads when you click play. LinkedIn: Rich text editor (500KB) loads when you click "Start a post". Figma: Design tools load on-demand.',
        implementation: 'React.lazy + Suspense, or dynamic import() on user interaction (click, hover, scroll into view)',
        impact: 'Saves 1-3MB on initial load. Improves TTI by 1-2 seconds. Better mobile experience.',
      },
      {
        technique: 'Prefetching & Preloading',
        explanation: 'Load resources for likely next navigation before user clicks',
        realWorld: '🛒 Amazon: Prefetches product detail page when you hover over a product for 300ms. Google Search: Prefetches top result. Next.js: Prefetches links in viewport.',
        implementation: '<link rel="prefetch" href="/next-page.js"> or on mouseenter event. Next.js does this automatically.',
        impact: 'Next page loads 200-500ms faster. Navigation feels instant.',
      },
      {
        technique: 'Tree-shaking & Bundle analysis',
        explanation: 'Remove unused code from final bundle',
        realWorld: '📦 Shopify: Found moment.js (500KB) was imported but unused. Removed, saved 500KB. Replaced lodash with lodash-es for tree-shaking.',
        implementation: 'webpack-bundle-analyzer, @next/bundle-analyzer. Use ESM imports. Avoid barrel exports.',
        impact: 'Identify large dependencies. Reduce bundle by 20-50%. Common wins: date libs, icon libs.',
      },
    ],
  },
  'Network & Caching': {
    icon: Wifi,
    description: 'Minimize network requests and reuse previously fetched resources.',
    items: [
      {
        technique: 'CDN for static assets',
        explanation: 'Serve JS/CSS/images from edge locations close to users',
        realWorld: '🛍️ Shopify: Serves all static assets from CDN. User in Tokyo gets assets from Tokyo edge server (20ms) vs US origin (200ms). Vercel: Automatic edge caching.',
        implementation: 'CloudFlare, AWS CloudFront, Fastly, Vercel Edge. Configure Cache-Control headers. Use versioned filenames (app.abc123.js).',
        impact: 'Reduces latency by 80-90%. Saves 150-180ms per asset. Global users get fast loads.',
      },
      {
        technique: 'HTTP caching headers',
        explanation: 'Tell browser to cache resources for X time (Cache-Control, ETag)',
        realWorld: '📘 Facebook: Caches JS bundles for 1 year (immutable), uses versioned filenames. CSS cached for 7 days. HTML never cached (must-revalidate).',
        implementation: 'Cache-Control: max-age=31536000, immutable for versioned assets. ETag for HTML/API responses.',
        impact: 'Repeat visits: 0 network requests for cached assets. 2-3 second improvement on repeat visits.',
      },
      {
        technique: 'Request deduplication',
        explanation: 'Prevent duplicate API calls when multiple components need same data',
        realWorld: '🏠 Airbnb: Multiple components need user data. Single request, shared cache. React Query/SWR handle this automatically. Prevents 5-10 duplicate calls.',
        implementation: 'React Query, SWR, Apollo Client (automatic), or manual cache with Map/WeakMap',
        impact: 'Reduces API calls by 40-60%. Saves 200-500ms per duplicate. Less server load.',
      },
      {
        technique: 'API Response Compression',
        explanation: 'Compress JSON responses with gzip/brotli',
        realWorld: '💳 Stripe Dashboard: 500KB JSON response → 50KB gzipped (10x). Reddit API: 2MB → 200KB brotli. GitHub API uses gzip for all responses.',
        implementation: 'Server: Enable gzip/brotli compression. Client: Accept-Encoding: gzip, br header (automatic in browsers)',
        impact: 'Reduces payload by 80-90%. Saves 1-3 seconds on slow networks. Critical for mobile.',
      },
      {
        technique: 'Service Workers (PWA)',
        explanation: 'Offline support, advanced caching, background sync',
        realWorld: '🐦 Twitter Lite: Works offline, caches tweets/images. Starbucks PWA: Order coffee offline, syncs when online. Spotify: Downloads for offline playback.',
        implementation: 'Workbox library, cache-first or network-first strategies. Register service worker in main.js.',
        impact: 'Offline support. 50-90% faster repeat visits. App-like experience on web.',
      },
    ],
  },
  'Rendering & React Optimization': {
    icon: Layers,
    description: 'Minimize unnecessary re-renders and optimize component updates.',
    items: [
      {
        technique: 'Minimize re-renders',
        explanation: 'Prevent components from re-rendering when props/state haven\'t changed',
        realWorld: '📝 Notion: Editor with 1000+ blocks. Each block is memoized with React.memo. Typing in one block doesn\'t re-render others. 60fps maintained even with huge docs.',
        implementation: 'React.memo for components, useMemo for expensive calculations, useCallback for stable function references. Vue: computed properties.',
        impact: 'Reduces renders by 70-90%. Maintains 60fps in complex UIs. Critical for editors, dashboards.',
      },
      {
        technique: 'Virtual scrolling / Windowing',
        explanation: 'Render only visible items in long lists (1000+ items)',
        realWorld: '📧 Gmail: Inbox with 10,000 emails. Only renders ~20 visible emails. Scroll performance: 60fps. Slack: Channels list with 1000+ channels renders ~30 visible.',
        implementation: 'react-window, react-virtualized, or custom Intersection Observer. Render only items in viewport + buffer.',
        impact: 'Renders 20 items instead of 10,000. 500x performance improvement. Smooth scrolling on any device.',
      },
      {
        technique: 'Debounce/Throttle',
        explanation: 'Limit expensive operations (search, scroll, resize)',
        realWorld: '🔍 Google Search: Autocomplete waits 300ms after you stop typing before fetching. Twitter: Infinite scroll throttled to 200ms. Prevents 100s of unnecessary calls.',
        implementation: 'lodash.debounce (wait for pause), lodash.throttle (limit rate), or custom setTimeout/requestAnimationFrame',
        impact: 'Search: 10 API calls → 1 call. Scroll: 100 events/sec → 5 events/sec. Saves bandwidth and CPU.',
      },
      {
        technique: 'Web Workers',
        explanation: 'Offload heavy computation from main thread (parsing, encryption, image processing)',
        realWorld: '🎨 Figma: Renders canvas in Web Worker. Main thread stays responsive for UI. Photoshop Web: Image filters in workers. Excel Online: Formula calculations in workers.',
        implementation: 'new Worker("worker.js"), postMessage/onmessage for communication. Libraries: comlink, workerize.',
        impact: 'Main thread free for UI. No jank during heavy computation. Maintains 60fps.',
      },
      {
        technique: 'Concurrent Rendering (React 18+)',
        explanation: 'Prioritize urgent updates (typing) over non-urgent (search results)',
        realWorld: '📘 Facebook: Typing in search stays smooth (16ms) while results load in background. useTransition marks result updates as low priority. No input lag.',
        implementation: 'useTransition, useDeferredValue in React 18+. Wrap expensive state updates in startTransition.',
        impact: 'Input latency: 16ms (60fps) even during heavy renders. Better perceived performance.',
      },
    ],
  },
  'Images & Media': {
    icon: ImageIcon,
    description: 'Images are often 50-70% of page weight. Optimize aggressively.',
    items: [
      {
        technique: 'Responsive images',
        explanation: 'Serve different image sizes for different screen sizes/resolutions',
        realWorld: '📰 Medium: Mobile gets 400px image (50KB), desktop gets 1200px (200KB). Pinterest: 6 different sizes per image. Unsplash: Serves optimal size based on viewport.',
        implementation: '<img srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w" sizes="(max-width: 600px) 400px, 1200px">',
        impact: 'Mobile: 50KB vs 200KB. Saves 150KB per image. 2-3 second improvement on mobile.',
      },
      {
        technique: 'Lazy loading images',
        explanation: 'Load images only when they\'re about to enter viewport',
        realWorld: '📸 Instagram: Loads images 500px before they\'re visible. Unsplash: Lazy loads all images, shows blur placeholder first. Medium: Lazy loads all article images.',
        implementation: '<img loading="lazy" src="..."> (native) or Intersection Observer + data-src for custom control',
        impact: 'Initial load: 5 images (500KB) vs 50 images (5MB). 10x reduction. Faster initial page load.',
      },
      {
        technique: 'Modern image formats',
        explanation: 'WebP (30% smaller), AVIF (50% smaller) vs JPEG/PNG',
        realWorld: '🎥 YouTube thumbnails: WebP saves 30% bandwidth. Netflix: AVIF for hero images, 50% smaller than JPEG. Shopify: Auto-converts to WebP.',
        implementation: '<picture><source type="image/avif" srcset="img.avif"><source type="image/webp" srcset="img.webp"><img src="img.jpg"></picture>',
        impact: 'Same quality, 30-50% smaller. Saves 100-300KB per page. Faster loads, less bandwidth.',
      },
      {
        technique: 'Image CDN & Optimization',
        explanation: 'Automatic compression, resizing, format conversion via URL params',
        realWorld: '🛍️ Shopify: Imgix/Cloudinary auto-optimizes product images. Add ?w=400&q=80 to URL for 400px width, 80% quality. Automatic WebP/AVIF conversion.',
        implementation: 'Cloudinary, Imgix, Cloudflare Images. URL-based transforms: /image.jpg?w=400&h=300&q=80&f=webp',
        impact: 'Automatic 40-60% size reduction. No manual optimization needed. Responsive images via URL.',
      },
      {
        technique: 'Blur placeholder / LQIP',
        explanation: 'Show low-quality placeholder while full image loads (Low Quality Image Placeholder)',
        realWorld: '📰 Medium: Tiny 20px blurred image (2KB) loads instantly, full image fades in. Prevents layout shift. Unsplash: Blurhash for instant placeholders.',
        implementation: 'Generate 20px blur at build time, CSS blur filter, fade in full image. Libraries: blurhash, lqip.',
        impact: 'Perceived performance: Feels 2x faster. Prevents CLS (Cumulative Layout Shift). Better UX.',
      },
    ],
  },
  'SSR, SSG & Hydration': {
    icon: Monitor,
    description: 'Choose the right rendering strategy for your use case.',
    items: [
      {
        technique: 'Server-Side Rendering (SSR)',
        explanation: 'Render HTML on server for each request. Faster initial paint, better SEO.',
        realWorld: '🏠 Airbnb: Listing pages SSR\'d for SEO and fast initial load. User sees content in 500ms vs 2s with CSR. Next.js getServerSideProps for dynamic pages.',
        implementation: 'Next.js (getServerSideProps), Nuxt.js, Remix. Render React/Vue on server, send HTML, hydrate on client.',
        impact: 'FCP (First Contentful Paint): 500ms vs 2s. LCP: 1s vs 3s. Better SEO. Good for content sites.',
      },
      {
        technique: 'Static Site Generation (SSG)',
        explanation: 'Pre-render pages at build time. Serve static HTML from CDN.',
        realWorld: '📚 Gatsby blog: All pages generated at build. Served from CDN. 50ms load time. Docs sites (React, Vue, Next.js docs) use SSG for all documentation.',
        implementation: 'Next.js (getStaticProps), Gatsby, Astro, 11ty. Build once, serve forever from CDN.',
        impact: 'TTFB: 20-50ms (CDN). FCP: 200-500ms. Perfect Lighthouse score (100). Best for blogs, docs, marketing.',
      },
      {
        technique: 'Incremental Static Regeneration (ISR)',
        explanation: 'Update static pages without full rebuild. Best of SSG + SSR.',
        realWorld: '📰 Hacker News clone: Pages regenerate every 60s. Stale-while-revalidate. User gets cached page instantly, background update happens. Vercel commerce demo uses ISR.',
        implementation: 'Next.js: getStaticProps with revalidate: 60. Page regenerates in background every 60 seconds.',
        impact: 'Fast as SSG (50ms TTFB), fresh as SSR. No build time for 10,000 pages. Best of both worlds.',
      },
      {
        technique: 'Streaming SSR',
        explanation: 'Send HTML in chunks as components finish rendering (React 18+)',
        realWorld: '📘 React 18 Suspense: Send shell (header/nav) instantly, stream in data as it loads. User sees header/nav immediately (100ms), content streams in (500ms).',
        implementation: 'React 18 renderToPipeableStream, Next.js 13+ app directory with Suspense boundaries',
        impact: 'TTFB: 100ms (shell) vs 1s (full page). Perceived 5x faster. Progressive rendering.',
      },
      {
        technique: 'Partial Hydration / Islands',
        explanation: 'Only hydrate interactive components, leave static content as HTML',
        realWorld: '🏝️ Astro: Blog post (static HTML) + comment form (interactive React). Only comment form hydrates. 90% less JS. Qwik: Resumability instead of hydration.',
        implementation: 'Astro (island architecture), Qwik (resumability), or manual selective hydration with React',
        impact: 'JS bundle: 50KB vs 500KB. TTI: 500ms vs 3s. Better mobile performance.',
      },
    ],
  },
  'Performance Metrics & Monitoring': {
    icon: Activity,
    description: 'Measure what matters. Core Web Vitals are ranking factors for Google.',
    items: [
      {
        technique: 'Core Web Vitals',
        explanation: 'LCP (Largest Contentful Paint), FID/INP (Input responsiveness), CLS (Layout Shift)',
        realWorld: '🔍 Google Search: Sites with good CWV rank higher. Amazon: 100ms LCP improvement = 1% revenue increase. Walmart: 1s improvement = 2% conversion increase.',
        implementation: 'Lighthouse, PageSpeed Insights, Chrome DevTools, web-vitals library. Monitor in production with RUM.',
        impact: 'LCP < 2.5s (good), INP < 200ms, CLS < 0.1. Better SEO, higher conversions.',
      },
      {
        technique: 'Real User Monitoring (RUM)',
        explanation: 'Measure performance for real users in production (not just lab)',
        realWorld: '🛍️ Shopify: Tracks LCP for every page load. Alerts if p95 > 3s. Datadog RUM for all metrics. Sees performance by device, location, network.',
        implementation: 'Datadog, New Relic, Sentry Performance, Vercel Analytics, or custom analytics with web-vitals',
        impact: 'See real-world performance by device, location, network. Catch regressions before users complain.',
      },
      {
        technique: 'Bundle Analysis',
        explanation: 'Visualize what\'s in your JS bundle, find bloat',
        realWorld: '📦 Webpack Bundle Analyzer: Found moment.js (500KB) was imported but unused. Removed, saved 500KB. Found duplicate lodash versions (300KB saved).',
        implementation: 'webpack-bundle-analyzer, @next/bundle-analyzer, rollup-plugin-visualizer. Run on every PR.',
        impact: 'Identify large dependencies. Reduce bundle by 20-50%. Common wins: date libs, icon libs, duplicate deps.',
      },
    ],
  },
}

const frontendPerformanceCodeSnippets = [
  {
    title: 'Lazy-load a screen (React)',
    code: `import { Suspense, lazy } from "react";

const Settings = lazy(() => import("./Settings"));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Settings />
    </Suspense>
  );
}`,
  },
  {
    title: 'Infinite scroll with Intersection Observer',
    code: `function InfiniteScroll() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1); // Load next page
        }
      },
      { threshold: 0.5 }
    );
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(\`/api/posts?page=\${page}\`)
      .then(res => res.json())
      .then(data => setPosts(prev => [...prev, ...data]));
  }, [page]);

  return (
    <div>
      {posts.map(post => <Post key={post.id} {...post} />)}
      <div ref={loaderRef}>Loading more...</div>
    </div>
  );
}`,
  },
  {
    title: 'Prefetch on intent (hover)',
    code: `const loadHeavy = () => import("./HeavyWidget");

function ProductCard({ id }) {
  return (
    <Link 
      to={\`/product/\${id}\`}
      onMouseEnter={() => loadHeavy()} // Prefetch on hover
      onFocus={() => loadHeavy()}      // Prefetch on keyboard focus
    >
      View Product
    </Link>
  );
}`,
  },
  {
    title: 'Virtual scrolling with react-window',
    code: `import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}        // Viewport height
      itemCount={10000}   // Total items
      itemSize={50}       // Height per item
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
// Only renders ~12 visible items instead of 10,000!`,
  },
  {
    title: 'Debounced search (React)',
    code: `function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Debounce: wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetch(\`/api/search?q=\${query}\`)
          .then(res => res.json())
          .then(setResults);
      }
    }, 300);
    
    return () => clearTimeout(timer); // Cancel previous timer
  }, [query]);

  return (
    <input 
      value={query} 
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
  },
  {
    title: 'Responsive images with srcset',
    code: `<!-- Serve different sizes based on viewport width -->
<img
  srcset="
    small.jpg 400w,
    medium.jpg 800w,
    large.jpg 1200w
  "
  sizes="(max-width: 600px) 400px, 
         (max-width: 1000px) 800px, 
         1200px"
  src="medium.jpg"
  alt="Product"
  loading="lazy"
/>

<!-- Mobile gets 400px (50KB), Desktop gets 1200px (200KB) -->`,
  },
  {
    title: 'Modern image formats with <picture>',
    code: `<picture>
  <!-- Browser picks first supported format -->
  <source type="image/avif" srcset="hero.avif" />
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="Hero" />
</picture>

<!-- AVIF: 50% smaller, WebP: 30% smaller, JPEG: fallback -->`,
  },
]

const jwtAuth = {
  overview: 'JSON Web Tokens are stateless authentication tokens containing user claims.',
  structure: {
    header: 'Algorithm (HS256, RS256) and token type',
    payload: 'Claims (user_id, exp, iat, roles)',
    signature: 'HMAC or RSA signature to verify authenticity',
  },
  flow: [
    '1. User logs in with credentials',
    '2. Server validates and generates JWT',
    '3. Client stores JWT (localStorage, cookie, or memory)',
    '4. Client sends JWT in Authorization header: "Bearer <token>"',
    '5. Server validates signature and extracts claims',
  ],
  bestPractices: [
    'Use HTTPS: Prevent token interception',
    'Short Expiration: Refresh tokens for long sessions',
    'Secure Storage: Avoid localStorage (XSS risk), prefer httpOnly cookies',
    'Token Refresh: Implement refresh token rotation',
    'Blacklisting: Store revoked tokens in Redis for logout',
    'Validate Signature: Always verify token signature',
  ],
  security: [
    'XSS Protection: Use httpOnly cookies instead of localStorage',
    'CSRF Protection: Use SameSite cookie attribute',
    'Token Rotation: Rotate refresh tokens on use',
    'Scope Limitation: Include minimal necessary claims',
  ],
}

const bestPractices = [
  {
    category: 'Design Principles',
    items: [
      'Start simple, scale as needed: Don\'t over-engineer initially',
      'Design for failure: Assume components will fail',
      'Decouple services: Use message queues for async communication',
      'Cache aggressively: Cache at multiple levels',
      'Monitor everything: Logs, metrics, traces',
    ],
  },
  {
    category: 'Database Design',
    items: [
      'Normalize for writes, denormalize for reads',
      'Index frequently queried fields',
      'Use connection pooling',
      'Implement read replicas for read-heavy workloads',
      'Partition/shard large tables',
    ],
  },
  {
    category: 'API Design',
    items: [
      'RESTful principles: Use proper HTTP methods',
      'Version APIs: /v1/, /v2/',
      'Pagination: Limit, offset, or cursor-based',
      'Rate limiting: Prevent abuse',
      'Idempotency keys: For POST/PUT operations',
    ],
  },
  {
    category: 'Caching Strategy',
    items: [
      'Cache-aside: App checks cache, then DB',
      'Write-through: Write to cache and DB simultaneously',
      'Write-back: Write to cache, async to DB',
      'TTL: Set appropriate expiration times',
      'Cache invalidation: Invalidate on updates',
    ],
  },
]

const commonGotchas = [
  {
    issue: 'Single Point of Failure',
    description: 'Having only one instance of a critical component',
    solution: 'Always have redundancy: multiple servers, databases, load balancers',
  },
  {
    issue: 'Ignoring Read/Write Ratio',
    description: 'Not optimizing for the actual traffic pattern',
    solution: 'Analyze read vs write ratio. Read-heavy? Use caching and read replicas',
  },
  {
    issue: 'Forgetting About Consistency',
    description: 'Not considering CAP theorem trade-offs',
    solution: 'Clarify consistency requirements. Eventual consistency is often acceptable',
  },
  {
    issue: 'No Rate Limiting',
    description: 'System vulnerable to abuse and DDoS',
    solution: 'Implement rate limiting at API gateway and application level',
  },
  {
    issue: 'Database Bottleneck',
    description: 'All traffic hitting single database',
    solution: 'Use read replicas, caching, connection pooling, and sharding',
  },
  {
    issue: 'Not Considering Scale',
    description: 'Designing for current load, not future growth',
    solution: 'Design for 10x-100x current load. Plan for horizontal scaling',
  },
  {
    issue: 'Ignoring Security',
    description: 'Not addressing authentication, authorization, encryption',
    solution: 'Always include: JWT/OAuth, HTTPS, input validation, rate limiting',
  },
  {
    issue: 'No Monitoring',
    description: 'No visibility into system health and performance',
    solution: 'Implement logging, metrics (CPU, memory, latency), and alerting',
  },
  {
    issue: 'Over-Engineering',
    description: 'Adding unnecessary complexity',
    solution: 'Start simple. Add complexity only when needed. YAGNI principle',
  },
  {
    issue: 'Not Handling Edge Cases',
    description: 'Not considering failure scenarios',
    solution: 'Plan for: network failures, database downtime, cache misses, partial failures',
  },
]

const designQuestions = {
  'Design URL Shortener (like bit.ly)': {
    requirements: [
      'Shorten long URLs to 6-8 character codes',
      'Redirect short URL to original URL',
      'Handle 100M URLs, 100M reads/day, 1M writes/day',
    ],
    design: [
      'Encoding: Base62 (a-z, A-Z, 0-9) for 6 chars = 56.8B unique URLs',
      'Database: Key-value store (shortURL → longURL)',
      'API: POST /api/v1/shorten, GET /{shortCode}',
      'Caching: Cache popular URLs in Redis (80-20 rule)',
      'Load Balancer: Distribute traffic across app servers',
      'Database Sharding: Partition by hash of shortCode',
    ],
    scale: [
      'Storage: 100M URLs × 500 bytes = 50GB (single server OK initially)',
      'Reads: 100M/day = ~1,200 QPS (need multiple app servers)',
      'Writes: 1M/day = ~12 QPS (single server sufficient)',
      'Cache: 20% of URLs get 80% of traffic → cache top 20M URLs',
    ],
  },
  'Design YouTube': {
    requirements: [
      'Upload, store, and stream videos',
      '1B users, 500M hours watched/day',
      '5M video uploads/day',
    ],
    design: [
      'Video Upload: Client → Load Balancer → App Server → Object Storage (S3)',
      'Video Processing: Transcode to multiple formats/resolutions (queue-based)',
      'Video Streaming: CDN for popular videos, origin server for long tail',
      'Metadata DB: SQL for video info (title, description, user_id)',
      'Recommendations: ML service analyzing watch history',
      'Comments: Separate service with its own database',
    ],
    components: [
      'CDN: Serve popular videos from edge locations',
      'Object Storage: S3/GCS for video files',
      'Transcoding Service: Convert to multiple formats (H.264, VP9)',
      'Database: SQL for metadata, NoSQL for comments/views',
      'Cache: Redis for trending videos, user sessions',
      'Message Queue: Process uploads and transcoding asynchronously',
    ],
    scale: [
      'Storage: 5M uploads/day × 100MB avg = 500TB/day (need distributed storage)',
      'Bandwidth: 500M hours/day × 5Mbps = 2.5Tbps (massive CDN needed)',
      'Reads: Billions of video views/day (CDN critical)',
      'Writes: 5M uploads/day = ~60 QPS (manageable with queue)',
    ],
  },
}

function SystemDesign() {
  const [expandedSections, setExpandedSections] = useState(new Set(['cheatsheet', 'gotchas']))
  const [expandedDef, setExpandedDef] = useState(null)
  const [viewedConcepts, setViewedConcepts] = useState(new Set())

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('systemDesignProgress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        setViewedConcepts(new Set(Object.keys(progress).filter(key => progress[key])))
      } catch (e) {
        console.error('Error loading system design progress:', e)
      }
    }
  }, [])

  // Track when concepts are viewed
  const markConceptViewed = (conceptKey) => {
    if (!viewedConcepts.has(conceptKey)) {
      const newViewed = new Set([...viewedConcepts, conceptKey])
      setViewedConcepts(newViewed)
      
      // Save to localStorage
      const progress = {}
      Array.from(newViewed).forEach(key => {
        progress[key] = true
      })
      localStorage.setItem('systemDesignProgress', JSON.stringify(progress))
      
      // Dispatch event for GameMode to listen
      window.dispatchEvent(new CustomEvent('systemDesignProgress'))
    }
  }

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
      // Track progress when section is expanded
      markConceptViewed(`section-${sectionId}`)
    }
    setExpandedSections(newExpanded)
  }

  const toggleDef = (term) => {
    setExpandedDef(expandedDef === term ? null : term)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-6 h-6 text-salesforce-blue" />
          <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white">
            System Design Interview Prep
          </h2>
        </div>
        <p className="text-salesforce-gray dark:text-slate-400">
          Comprehensive guide to system design interviews - definitions, concepts, cheat sheets, and common questions
        </p>
      </div>

      {/* System Design in a Hurry Cheat Sheet */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg shadow-sm border-2 border-yellow-200 dark:border-yellow-800/40 overflow-hidden">
        <button
          onClick={() => toggleSection('cheatsheet')}
          className="w-full text-left p-5 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                System Design in a Hurry - Cheat Sheet
              </h3>
            </div>
            {expandedSections.has('cheatsheet') ? (
              <ChevronUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            )}
          </div>
        </button>

        {expandedSections.has('cheatsheet') && (
          <div className="px-5 pb-5 border-t border-yellow-200 dark:border-yellow-800/40">
            <div className="pt-5 space-y-4">
              {Object.entries(cheatSheet).map(([step, items]) => (
                <div key={step} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/40">
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">{step}</h4>
                  <ul className="space-y-1">
                    {items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Definitions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-salesforce-blue" />
            <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
              Key Definitions
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-6">
          {Object.entries(definitions).map(([category, terms]) => {
            const categoryIcons = {
              'Scaling & Performance': TrendingUp,
              'Data & Storage': Database,
              'Architecture Patterns': Layers,
              'Reliability & Consistency': Activity,
              'Security & Access Control': Shield,
            }
            const CategoryIcon = categoryIcons[category] || Network
            return (
              <div key={category} className="border-b border-gray-200 dark:border-slate-700 last:border-b-0 pb-6 last:pb-0">
                <h4 className="font-bold text-lg text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
                  <CategoryIcon className="w-5 h-5 text-salesforce-blue" />
                  {category}
                </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(terms).map(([term, definition]) => {
                  const fullTerm = `${category}-${term}`
                  return (
                    <button
                      key={term}
                      onClick={() => toggleDef(fullTerm)}
                      className={`text-left p-4 rounded-lg border transition-all ${
                        expandedDef === fullTerm
                          ? 'border-salesforce-blue bg-salesforce-light-blue/50 dark:bg-slate-700'
                          : 'border-gray-200 dark:border-slate-700 hover:border-salesforce-blue/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-1">
                            {term}
                          </h5>
                          {expandedDef === fullTerm && (
                            <p className="text-sm text-gray-700 dark:text-slate-300 mt-2">
                              {definition}
                            </p>
                          )}
                        </div>
                        {expandedDef === fullTerm ? (
                          <ChevronUp className="w-4 h-4 text-salesforce-blue flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            )
          })}
        </div>
      </div>

      {/* Key Concepts */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-salesforce-blue" />
            <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
              Key Concepts
            </h3>
          </div>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {keyConcepts.map((concept, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-3">
                  {concept.title}
                </h4>
                <ul className="space-y-2">
                  {concept.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frontend System Design: Performance Optimizations */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => toggleSection('frontend-performance')}
          className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-salesforce-blue" />
              <div>
                <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
                  Frontend System Design: Performance Optimizations
                </h3>
                <p className="text-sm text-salesforce-gray dark:text-slate-400 mt-1">
                  Lazy loading, caching, rendering strategy, images, and SSR/CSR tradeoffs
                </p>
              </div>
            </div>
            {expandedSections.has('frontend-performance') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('frontend-performance') && (
          <div className="p-5 space-y-6">
            {Object.entries(frontendSystemDesignPerformance).map(([category, details]) => {
              const Icon = details.icon
              return (
                <div key={category} className="border-b border-gray-200 dark:border-slate-700 last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-salesforce-blue" />
                    <div>
                      <h4 className="font-bold text-lg text-salesforce-dark-blue dark:text-white">
                        {category}
                      </h4>
                      {details.description && (
                        <p className="text-sm text-salesforce-gray dark:text-slate-400 mt-1">
                          {details.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {details.items.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                        <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          {item.technique}
                        </h5>
                        
                        <div className="space-y-2 ml-6">
                          <p className="text-sm text-gray-700 dark:text-slate-300">
                            <strong className="text-salesforce-dark-blue dark:text-white">What:</strong> {item.explanation}
                          </p>
                          
                          <p className="text-sm text-gray-700 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 rounded p-2 border-l-2 border-blue-400">
                            <strong className="text-blue-700 dark:text-blue-300">Real-world:</strong> {item.realWorld}
                          </p>
                          
                          <p className="text-sm text-gray-700 dark:text-slate-300">
                            <strong className="text-salesforce-dark-blue dark:text-white">How:</strong> {item.implementation}
                          </p>
                          
                          <p className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 rounded p-2">
                            <strong>Impact:</strong> {item.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            <div className="border-t border-gray-200 dark:border-slate-700 pt-5">
              <h4 className="font-bold text-lg text-salesforce-dark-blue dark:text-white mb-3">
                Quick code patterns
              </h4>
              <div className="space-y-4">
                {frontendPerformanceCodeSnippets.map((snippet) => (
                  <div key={snippet.title} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                      <p className="font-semibold text-salesforce-dark-blue dark:text-white text-sm">
                        {snippet.title}
                      </p>
                    </div>
                    <div className="rounded-b-lg overflow-hidden">
                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                        }}
                        showLineNumbers={true}
                      >
                        {snippet.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Infrastructure Components */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => toggleSection('infrastructure')}
          className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-salesforce-blue" />
              <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
                Infrastructure Components
              </h3>
            </div>
            {expandedSections.has('infrastructure') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('infrastructure') && (
          <div className="p-5 space-y-6">
            {/* Load Balancers */}
            <div>
              <h4 className="font-bold text-lg text-salesforce-dark-blue dark:text-white mb-3">
                Load Balancers
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Types:</h5>
                  <ul className="space-y-1">
                    {infrastructureComponents['Load Balancers'].types.map((type, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-salesforce-blue mt-1">•</span>
                        <span>{type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Algorithms:</h5>
                  <ul className="space-y-1">
                    {infrastructureComponents['Load Balancers'].algorithms.map((alg, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-salesforce-blue mt-1">•</span>
                        <span>{alg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Benefits:</h5>
                  <ul className="space-y-1">
                    {infrastructureComponents['Load Balancers'].benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CDNs */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <h4 className="font-bold text-lg text-salesforce-dark-blue dark:text-white mb-3">
                CDNs (Content Delivery Network)
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 dark:text-slate-300 mb-3">
                    <strong>Purpose:</strong> {infrastructureComponents['CDNs (Content Delivery Network)'].purpose}
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Use Cases:</h5>
                  <ul className="space-y-1">
                    {infrastructureComponents['CDNs (Content Delivery Network)'].useCases.map((useCase, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-salesforce-blue mt-1">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Benefits:</h5>
                  <ul className="space-y-1">
                    {infrastructureComponents['CDNs (Content Delivery Network)'].benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Popular Providers:</h5>
                  <div className="flex flex-wrap gap-2">
                    {infrastructureComponents['CDNs (Content Delivery Network)'].providers.map((provider, idx) => (
                      <span key={idx} className="px-3 py-1 bg-salesforce-light-blue text-salesforce-blue rounded-lg text-sm font-medium">
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* JWT Authentication */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => toggleSection('jwt')}
          className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-salesforce-blue" />
              <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
                JWT Authentication
              </h3>
            </div>
            {expandedSections.has('jwt') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('jwt') && (
          <div className="p-5 space-y-4">
            <div>
              <p className="text-sm text-gray-700 dark:text-slate-300 mb-4">
                <strong>Overview:</strong> {jwtAuth.overview}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Structure:</h4>
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 space-y-1">
                {Object.entries(jwtAuth.structure).map(([part, description]) => (
                  <div key={part} className="text-sm">
                    <span className="font-medium text-salesforce-blue">{part}:</span>{' '}
                    <span className="text-gray-700 dark:text-slate-300">{description}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Authentication Flow:</h4>
              <ol className="space-y-1 list-decimal list-inside">
                {jwtAuth.flow.map((step, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-slate-300">{step}</li>
                ))}
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Best Practices:</h4>
              <ul className="space-y-1">
                {jwtAuth.bestPractices.map((practice, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Security Considerations:</h4>
              <ul className="space-y-1">
                {jwtAuth.security.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Best Practices */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => toggleSection('bestpractices')}
          className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-salesforce-blue" />
              <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
                Best Practices
              </h3>
            </div>
            {expandedSections.has('bestpractices') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('bestpractices') && (
          <div className="p-5">
            <div className="space-y-4">
              {bestPractices.map((category, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4">
                  <h4 className="font-semibold text-salesforce-dark-blue dark:text-white mb-3">
                    {category.category}
                  </h4>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Common Interview Gotchas */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => toggleSection('gotchas')}
          className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
                Common Interview Gotchas
              </h3>
            </div>
            {expandedSections.has('gotchas') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('gotchas') && (
          <div className="p-5">
            <div className="space-y-4">
              {commonGotchas.map((gotcha, idx) => (
                <div key={idx} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/40">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        {gotcha.issue}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">
                        {gotcha.description}
                      </p>
                      <div className="bg-white dark:bg-slate-800 rounded p-2 mt-2">
                        <p className="text-sm text-gray-700 dark:text-slate-300">
                          <strong className="text-green-700 dark:text-green-400">Solution:</strong>{' '}
                          {gotcha.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Common Design Questions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => toggleSection('designquestions')}
          className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 text-salesforce-blue" />
              <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">
                Common Design Questions
              </h3>
            </div>
            {expandedSections.has('designquestions') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {expandedSections.has('designquestions') && (
          <div className="p-5 space-y-6">
            {Object.entries(designQuestions).map(([question, details]) => (
              <div key={question} className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-5 border border-gray-200 dark:border-slate-700">
                <h4 className="font-bold text-lg text-salesforce-dark-blue dark:text-white mb-4">
                  {question}
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Requirements:</h5>
                    <ul className="space-y-1">
                      {details.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="text-salesforce-blue mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Design:</h5>
                    <ul className="space-y-1">
                      {details.design.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {details.scale && (
                    <div>
                      <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Scaling Considerations:</h5>
                      <ul className="space-y-1">
                        {details.scale.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                            <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {details.components && (
                    <div>
                      <h5 className="font-semibold text-salesforce-dark-blue dark:text-white mb-2">Key Components:</h5>
                      <ul className="space-y-1">
                        {details.components.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-slate-300 flex items-start gap-2">
                            <Server className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SystemDesign
