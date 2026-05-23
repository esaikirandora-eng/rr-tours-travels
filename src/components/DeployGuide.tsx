import { useState } from 'react';
import {
  Copy, CheckCheck, Terminal, Globe, Zap,
  Server, CloudUpload, BookOpen, ExternalLink,
  ChevronDown, ChevronRight, AlertCircle, Info, Rocket
} from 'lucide-react';

function CopyBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      {label && <p className="text-xs text-slate-400 mb-1 font-medium">{label}</p>}
      <div className="bg-[#0d1b3e] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-amber-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            {copied ? <><CheckCheck size={12} className="text-green-400" /> Copied!</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
        <pre className="px-4 py-3 text-sm text-green-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {code}
        </pre>
      </div>
    </div>
  );
}

function Section({ title, icon, children, defaultOpen = true }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0d1b3e]/8 flex items-center justify-center text-[#0d1b3e]">
            {icon}
          </div>
          <h3 className="font-bold text-slate-900">{title}</h3>
        </div>
        {open ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0d1b3e] text-amber-400 flex items-center justify-center font-bold text-sm">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 mb-2">{title}</p>
        {children}
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: 'green' | 'blue' | 'amber' | 'red'; children: React.ReactNode }) {
  const map = {
    green: 'bg-green-100 text-green-700 border-green-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    red: 'bg-red-100 text-red-700 border-red-200',
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[color]}`}>{children}</span>;
}

export default function DeployGuide() {
  const platforms = [
    { name: 'Vercel', badge: 'Recommended', badgeColor: 'green' as const, icon: '▲', bg: 'from-slate-900 to-slate-700', free: true, custom: true, ci: true, speed: 'Ultra Fast' },
    { name: 'Netlify', badge: 'Popular', badgeColor: 'blue' as const, icon: '◆', bg: 'from-teal-700 to-teal-500', free: true, custom: true, ci: true, speed: 'Fast' },
    { name: 'GitHub Pages', badge: 'Free', badgeColor: 'amber' as const, icon: '⊙', bg: 'from-slate-700 to-slate-500', free: true, custom: false, ci: true, speed: 'Good' },
    { name: 'Render', badge: 'Full-Stack', badgeColor: 'blue' as const, icon: '◉', bg: 'from-violet-700 to-violet-500', free: true, custom: true, ci: false, speed: 'Good' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a6e] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Rocket size={28} className="text-[#0d1b3e]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Deployment Guide</h2>
            <p className="text-blue-200/70 text-sm">How to publish RR Tours & Travels online</p>
          </div>
        </div>
        <p className="text-blue-100/80 text-sm leading-relaxed">
          This app is built with <strong className="text-amber-400">React + Vite + Tailwind CSS</strong> — a modern static web app.
          Deploying it is completely free on multiple platforms. Choose any platform below to publish your travel management system online in minutes.
        </p>
      </div>

      {/* Platform Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Globe size={18} className="text-[#0d1b3e]" /> Platform Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map(p => (
            <div key={p.name} className={`bg-gradient-to-br ${p.bg} rounded-xl p-4 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{p.icon}</span>
                <Badge color={p.badgeColor}>{p.badge}</Badge>
              </div>
              <h4 className="font-bold text-lg mb-3">{p.name}</h4>
              <div className="space-y-1 text-xs text-white/70">
                <div className="flex justify-between"><span>Free Tier</span><span className="text-green-300 font-semibold">{p.free ? '✓ Yes' : '✗ No'}</span></div>
                <div className="flex justify-between"><span>Custom Domain</span><span className={p.custom ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'}>{p.custom ? '✓ Yes' : '✗ No'}</span></div>
                <div className="flex justify-between"><span>Auto Deploy (CI)</span><span className={p.ci ? 'text-green-300 font-semibold' : 'text-red-300 font-semibold'}>{p.ci ? '✓ Yes' : '✗ No'}</span></div>
                <div className="flex justify-between"><span>Speed</span><span className="text-amber-300 font-semibold">{p.speed}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <Section title="Prerequisites — Install These First" icon={<Terminal size={18} />}>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 mb-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          Make sure you have these installed before starting.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Node.js', version: 'v18+', desc: 'JavaScript runtime', url: 'https://nodejs.org' },
            { name: 'Git', version: 'Any', desc: 'Version control', url: 'https://git-scm.com' },
            { name: 'npm', version: 'v9+', desc: 'Package manager (bundled with Node)', url: 'https://npmjs.com' },
          ].map(tool => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <div className="w-9 h-9 bg-[#0d1b3e] rounded-lg flex items-center justify-center flex-shrink-0">
                <Terminal size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm flex items-center gap-1">{tool.name} <ExternalLink size={10} className="text-slate-400 group-hover:text-blue-500" /></p>
                <p className="text-xs text-slate-500">{tool.version} · {tool.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <CopyBlock label="Verify installations:" code={`node --version   # should print v18.x.x or higher\nnpm --version    # should print 9.x.x or higher\ngit --version    # should print git version 2.x.x`} />
      </Section>

      {/* Build App Locally */}
      <Section title="Step 1 — Build the App Locally" icon={<BookOpen size={18} />}>
        <Step n={1} title="Clone or download the project">
          <CopyBlock code={`# If you have the project as a ZIP, extract it first.\n# Then open terminal in the project folder:\ncd rr-tours-travels-app`} />
        </Step>
        <Step n={2} title="Install dependencies">
          <CopyBlock code={`npm install`} />
        </Step>
        <Step n={3} title="Run locally to test">
          <CopyBlock code={`npm run dev\n# Open http://localhost:5173 in your browser`} />
        </Step>
        <Step n={4} title="Build for production">
          <CopyBlock code={`npm run build\n# Creates a 'dist/' folder — this is your deployable app`} />
        </Step>
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          <CheckCheck size={16} className="flex-shrink-0 mt-0.5" />
          After running <code className="font-mono bg-green-100 px-1 rounded">npm run build</code>, a <code className="font-mono bg-green-100 px-1 rounded">dist/</code> folder is created. This is the only folder you need to deploy!
        </div>
      </Section>

      {/* Vercel */}
      <Section title="Option A — Deploy on Vercel (Recommended)" icon={<Zap size={18} />}>
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 mb-3">
          <Info size={16} className="flex-shrink-0 mt-0.5" />
          Vercel is the easiest — connects to GitHub and auto-deploys on every push.
        </div>

        <p className="text-sm font-semibold text-slate-700 mb-3">Method 1: Vercel CLI (Fastest)</p>
        <div className="space-y-3">
          <Step n={1} title="Install Vercel CLI">
            <CopyBlock code={`npm install -g vercel`} />
          </Step>
          <Step n={2} title="Login to Vercel">
            <CopyBlock code={`vercel login\n# Choose: Continue with GitHub / Email`} />
          </Step>
          <Step n={3} title="Deploy">
            <CopyBlock code={`vercel\n# Answer the prompts:\n# ? Set up and deploy? → Y\n# ? Which scope? → your username\n# ? Link to existing project? → N\n# ? What's your project name? → rr-tours-travels\n# ? In which directory? → ./ (press Enter)\n# ✅ Done! Your URL: https://rr-tours-travels.vercel.app`} />
          </Step>
          <Step n={4} title="Deploy to production">
            <CopyBlock code={`vercel --prod\n# 🚀 Live at: https://rr-tours-travels.vercel.app`} />
          </Step>
        </div>

        <hr className="border-slate-200 my-4" />
        <p className="text-sm font-semibold text-slate-700 mb-3">Method 2: Vercel Dashboard (No CLI)</p>
        <div className="space-y-2 text-sm text-slate-600">
          {[
            'Go to https://vercel.com → Sign Up with GitHub',
            'Click "New Project" → Import your GitHub repository',
            'Framework: Vite | Build Command: npm run build | Output: dist',
            'Click Deploy → Your app goes live instantly!',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-[#0d1b3e] text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Netlify */}
      <Section title="Option B — Deploy on Netlify" icon={<CloudUpload size={18} />} defaultOpen={false}>
        <p className="text-sm font-semibold text-slate-700 mb-3">Method 1: Drag & Drop (Simplest)</p>
        <div className="space-y-2 text-sm text-slate-600">
          {[
            'Run: npm run build  (creates the dist/ folder)',
            'Go to https://app.netlify.com → Log in / Sign Up',
            'Drag and drop the entire dist/ folder onto the Netlify dashboard',
            '✅ Your site is live immediately! e.g. https://rr-tours.netlify.app',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <hr className="border-slate-200 my-4" />
        <p className="text-sm font-semibold text-slate-700 mb-3">Method 2: Netlify CLI</p>
        <CopyBlock code={`npm install -g netlify-cli\nnetlify login\nnpm run build\nnetlify deploy --prod --dir=dist\n# ✅ Live at https://your-site.netlify.app`} />
      </Section>

      {/* GitHub Pages */}
      <Section title="Option C — Deploy on GitHub Pages (Free)" icon={<Globe size={18} />} defaultOpen={false}>
        <Step n={1} title="Push code to GitHub">
          <CopyBlock code={`git init\ngit add .\ngit commit -m "Initial commit — RR Tours & Travels"\ngit remote add origin https://github.com/YOUR_USERNAME/rr-tours-travels.git\ngit push -u origin main`} />
        </Step>
        <Step n={2} title="Install gh-pages package">
          <CopyBlock code={`npm install -D gh-pages`} />
        </Step>
        <Step n={3} title="Update vite.config.ts — add base">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 mb-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            Replace YOUR_REPO_NAME with your actual GitHub repository name.
          </div>
          <CopyBlock code={`// vite.config.ts\nexport default defineConfig({\n  base: '/YOUR_REPO_NAME/',   // e.g. '/rr-tours-travels/'\n  plugins: [react()],\n})`} />
        </Step>
        <Step n={4} title='Add deploy script to package.json'>
          <CopyBlock code={`// In package.json → "scripts":\n"predeploy": "npm run build",\n"deploy": "gh-pages -d dist"`} />
        </Step>
        <Step n={5} title="Deploy">
          <CopyBlock code={`npm run deploy\n# ✅ Live at: https://YOUR_USERNAME.github.io/rr-tours-travels/`} />
        </Step>
      </Section>

      {/* Custom Domain */}
      <Section title="Adding a Custom Domain (Optional)" icon={<Globe size={18} />} defaultOpen={false}>
        <p className="text-sm text-slate-600 mb-4">
          Buy a domain from GoDaddy, Namecheap, or Google Domains (e.g., <code className="bg-slate-100 px-1 rounded font-mono">rrtoursodisha.com</code>), then configure it:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-900 text-sm mb-2">Vercel</p>
            <ol className="text-xs text-slate-600 space-y-1">
              <li>1. Vercel Dashboard → Your Project → Settings → Domains</li>
              <li>2. Click "Add Domain" → enter your domain</li>
              <li>3. Copy the DNS records shown by Vercel</li>
              <li>4. Go to your domain registrar → DNS Settings → Add records</li>
              <li>5. Wait 15–60 mins for DNS propagation</li>
            </ol>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-900 text-sm mb-2">Netlify</p>
            <ol className="text-xs text-slate-600 space-y-1">
              <li>1. Netlify → Site Settings → Domain Management</li>
              <li>2. Click "Add custom domain"</li>
              <li>3. Point your domain's nameservers to Netlify's</li>
              <li>4. Netlify auto-provisions SSL/HTTPS certificate</li>
              <li>5. Site is live on your domain in ~1 hour</li>
            </ol>
          </div>
        </div>
      </Section>

      {/* Server / VPS */}
      <Section title="Option D — Deploy on Your Own Server (VPS)" icon={<Server size={18} />} defaultOpen={false}>
        <p className="text-sm text-slate-600 mb-3">
          Use this if you have a VPS (DigitalOcean, AWS EC2, Hostinger VPS, etc.)
        </p>
        <CopyBlock label="Install Nginx web server:" code={`sudo apt update && sudo apt install nginx -y`} />
        <CopyBlock label="Build & upload the app:" code={`npm run build\n# Upload the 'dist/' folder contents to:\n# /var/www/html/ on your server via FTP or SCP\n\n# Using SCP:\nscp -r dist/* user@YOUR_SERVER_IP:/var/www/html/`} />
        <CopyBlock label="Configure Nginx (for SPA routing):" code={`# /etc/nginx/sites-available/rrtours\nserver {\n    listen 80;\n    server_name rrtoursodisha.com www.rrtoursodisha.com;\n    root /var/www/html;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ /index.html;  # Important for SPA!\n    }\n}`} />
        <CopyBlock label="Enable & restart Nginx:" code={`sudo ln -s /etc/nginx/sites-available/rrtours /etc/nginx/sites-enabled/\nsudo nginx -t\nsudo systemctl restart nginx\n# ✅ Live on http://YOUR_SERVER_IP`} />
      </Section>

      {/* FAQ */}
      <Section title="Common Questions & Troubleshooting" icon={<AlertCircle size={18} />} defaultOpen={false}>
        <div className="space-y-3">
          {[
            {
              q: 'The app shows blank page after deploying to GitHub Pages?',
              a: 'Make sure you set base: \'/your-repo-name/\' in vite.config.ts. This is required for GitHub Pages sub-path hosting.',
            },
            {
              q: 'Routing doesn\'t work — I get 404 on page refresh?',
              a: 'For Netlify: Create a _redirects file in the public/ folder with content: /*  /index.html  200\nFor Vercel: Create vercel.json with: { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }',
            },
            {
              q: 'How do I update the app after making changes?',
              a: 'If using Vercel/Netlify with GitHub: just git push — it auto-deploys.\nIf using CLI: run vercel --prod or netlify deploy --prod --dir=dist again.',
            },
            {
              q: 'Is this app suitable for real business data?',
              a: 'Currently data is stored in-memory (resets on refresh). For production, connect it to a backend (Node.js + MongoDB/PostgreSQL) or use Firebase Firestore for persistent data storage.',
            },
            {
              q: 'How do I add a password to protect the app?',
              a: 'The app already has a login system! Use admin@rrenterprises.in / admin@123 for admin access. For extra security, enable Vercel/Netlify password protection in their dashboard settings.',
            },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-semibold text-slate-900 text-sm mb-1">❓ {item.q}</p>
              <p className="text-xs text-slate-600 whitespace-pre-line">💡 {item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick Reference */}
      <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a6e] rounded-2xl p-6 text-white">
        <h3 className="font-bold text-amber-400 mb-4 flex items-center gap-2"><Zap size={18} />Quick Reference — Login Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { role: 'Admin', email: 'admin@rrenterprises.in', pass: 'admin@123', color: 'border-red-400/30 bg-red-500/10', badge: 'Full Access' },
            { role: 'Staff', email: 'arjun@rrenterprises.in', pass: 'staff@123', color: 'border-blue-400/30 bg-blue-500/10', badge: 'Edit Access' },
            { role: 'Viewer', email: 'view@rrenterprises.in', pass: 'view@123', color: 'border-slate-400/30 bg-slate-500/10', badge: 'Read Only' },
          ].map(acc => (
            <div key={acc.role} className={`p-4 rounded-xl border ${acc.color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{acc.role}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">{acc.badge}</span>
              </div>
              <p className="text-xs text-blue-200/70 font-mono">{acc.email}</p>
              <p className="text-xs text-amber-300 font-mono">{acc.pass}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-blue-200/50 mt-4">
          ⚠️ Change these passwords before deploying to production!
        </p>
      </div>
    </div>
  );
}
