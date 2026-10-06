import { useState, useEffect, useRef } from "react";
import "./App.css";
import CursorGrid from "./CursorGrid";
// ===== PREMIUM SVG ICONS =====
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    arrowRight: <path d="M5 12h14 M12 5l7 7-7 7" />,
    github: (
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    ),
    linkedin: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
    mail: (
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
    ),
    externalLink: (
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3" />
    ),
    code: <path d="M16 18l6-6-6-6 M8 6l-6 6 6 6" />,
    zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </>
    ),
    menu: <path d="M4 12h16 M4 6h16 M4 18h16" />,
    x: <path d="M18 6L6 18 M6 6l12 12" />,
    arrowUp: <path d="M12 19V5 M5 12l7-7 7 7" />,
    sparkles: (
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M4 17v4 M21 13h-4 M7 7H3" />
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {icons[name]}
    </svg>
  );
};

// ===== SPOTLIGHT CARD =====
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F11] transition-all duration-300 hover:border-white/20 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative h-full z-10">{children}</div>
    </div>
  );
};

// ===== SCROLL REVEAL =====
const Reveal = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ===== FORMAT NUMBER (1234 → 1.2K) =====
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// ===== LIVE GITHUB STATS =====
const GitHubStats = ({ username = "yourusername" }) => {
  const [stats, setStats] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error("User not found");
        const user = await userRes.json();

        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`
        );
        const repos = await reposRes.json();

        const totalStars = repos.reduce(
          (acc, repo) => acc + (repo.stargazers_count || 0),
          0
        );
        const languages = repos.reduce((acc, repo) => {
          if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
          }
          return acc;
        }, {});

        setStats({
          avatar: user.avatar_url,
          name: user.name || username,
          bio: user.bio,
          followers: user.followers,
          publicRepos: user.public_repos,
          totalStars,
          languages: Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5),
          joined: new Date(user.created_at).getFullYear(),
        });

        try {
          const contribRes = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
          );
          const contribData = await contribRes.json();
          setContributions(contribData.contributions || []);
        } catch {
          setContributions([]);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
        <p className="text-gray-400">
          ⚠️ Could not load GitHub stats. Check the username.
        </p>
      </div>
    );
  }

  const buildWeeks = () => {
    if (!contributions || contributions.length === 0) return [];
    const weeks = [];
    let currentWeek = [];
    contributions.forEach((day, i) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || i === contributions.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeks;
  };

  const weeks = buildWeeks();
  const totalContributions = contributions?.reduce(
    (sum, d) => sum + d.count,
    0
  );

  const getLevelColor = (count) => {
    if (count === 0) return "bg-white/5 border border-white/5";
    if (count <= 2) return "bg-[#0e4429] border border-[#0e4429]";
    if (count <= 5) return "bg-[#006d32] border border-[#006d32]";
    if (count <= 10) return "bg-[#26a641] border border-[#26a641]";
    return "bg-[#39d353] border border-[#39d353]";
  };

  const statCards = [
    {
      label: "Repositories",
      value: stats.publicRepos,
      icon: "📦",
      gradient: "from-indigo-500/20 to-transparent",
      color: "text-indigo-400",
    },
    {
      label: "Total Stars",
      value: stats.totalStars,
      icon: "⭐",
      gradient: "from-yellow-500/20 to-transparent",
      color: "text-yellow-400",
    },
    {
      label: "Followers",
      value: stats.followers,
      icon: "👥",
      gradient: "from-purple-500/20 to-transparent",
      color: "text-purple-400",
    },
    {
      label: "Contributions",
      value: totalContributions || 0,
      icon: "🔥",
      gradient: "from-emerald-500/20 to-transparent",
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity" />
            <img
              src={stats.avatar}
              alt={stats.name}
              className="relative w-20 h-20 rounded-full border-2 border-white/20"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-4 border-[#0F0F11]" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold">{stats.name}</h3>
            {stats.bio && (
              <p className="text-gray-400 text-sm mt-1">{stats.bio}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              <span className="text-xs text-gray-500">
                📅 Joined {stats.joined}
              </span>
              <span className="text-xs text-gray-500">
                🌍 Open Source Contributor
              </span>
            </div>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <Icon name="github" className="w-4 h-4" />
            Follow
          </a>
        </div>
      </SpotlightCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 100}>
            <SpotlightCard
              className={`p-6 text-center bg-gradient-to-br ${stat.gradient}`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* Top Languages */}
      <SpotlightCard className="p-6 sm:p-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>🔥</span> Top Languages
        </h3>
        <div className="space-y-3">
          {stats.languages.map(([lang, count]) => {
            const total = stats.languages.reduce((sum, [, c]) => sum + c, 0);
            const percent = ((count / total) * 100).toFixed(0);
            return (
              <div key={lang}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{lang}</span>
                  <span className="text-gray-500">{percent}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SpotlightCard>

      {/* Contribution Graph */}
      <SpotlightCard className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>📊</span> Contribution Activity
          </h3>
          <span className="text-xs text-gray-500">
            {totalContributions || 0} contributions in the last year
          </span>
        </div>

        {weeks.length > 0 ? (
          <>
            <div className="w-full">
              <div className="flex gap-[2px] sm:gap-[3px] md:gap-1">
                {weeks.map((week, wi) => (
                  <div
                    key={wi}
                    className="flex flex-col gap-[2px] sm:gap-[3px] md:gap-1 flex-1"
                  >
                    {week.map((day, di) => (
                      <div
                        key={di}
                        onMouseEnter={() =>
                          setHoveredDay({
                            date: day.date,
                            count: day.count,
                          })
                        }
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-full aspect-square rounded-[2px] sm:rounded-sm transition-all duration-200 hover:scale-150 hover:z-10 cursor-pointer ${getLevelColor(
                          day.count
                        )}`}
                        title={`${day.count} contributions on ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
              <div className="text-xs text-gray-500 min-h-[20px]">
                {hoveredDay ? (
                  <span className="text-indigo-300">
                    ✨ <strong>{hoveredDay.count}</strong> contribution
                    {hoveredDay.count !== 1 ? "s" : ""} on {hoveredDay.date}
                  </span>
                ) : (
                  <span className="opacity-50">
                    Hover over a square to see details
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5" />
                  <div className="w-3 h-3 rounded-sm bg-[#0e4429] border border-[#0e4429]" />
                  <div className="w-3 h-3 rounded-sm bg-[#006d32] border border-[#006d32]" />
                  <div className="w-3 h-3 rounded-sm bg-[#26a641] border border-[#26a641]" />
                  <div className="w-3 h-3 rounded-sm bg-[#39d353] border border-[#39d353]" />
                </div>
                <span>More</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">
            No contribution data available yet.
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ✅ ADDED — GitHub stats state
  const [githubStats, setGithubStats] = useState({
    stars: 0,
    repos: 0,
    loading: true,
  });

  // ✅ ADDED — Fetch GitHub stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/users/saouchinabil/repos?per_page=100"
        );
        const repos = await res.json();

        const totalStars = repos.reduce(
          (acc, repo) => acc + (repo.stargazers_count || 0),
          0
        );

        setGithubStats({
          stars: totalStars,
          repos: repos.length,
          loading: false,
        });
      } catch (err) {
        console.error("GitHub fetch error:", err);
        setGithubStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      lastScrollY = currentScrollY;
      setScrollY(currentScrollY);
      setShowScrollTop(currentScrollY > 400);

      const sections = ["home", "about", "github", "projects", "contact"];
      const scrollPosition = currentScrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          element.offsetTop <= scrollPosition &&
          element.offsetTop + element.offsetHeight > scrollPosition
        ) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const projects = [
    {
      title: "Coding & AI",
      desc: "Building responsive, high-performance web applications with modern technologies, clean architecture, and seamless user experiences.",
      tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
      gradient: "from-indigo-500/20 via-purple-500/20 to-transparent",
      border: "group-hover:border-indigo-500/50",
      image: "/coding.jpg",
      link: "https://github.com/saouchinabil",
    },
    {
      title: "Photoshop & Illustrator",
      desc: "Crafting professional visual identities and digital designs using Photoshop and Illustrator, with a strong focus on creativity, composition, and visual impact.",
      tags: ["Photoshop", "Illustrator"],
      gradient: "from-cyan-500/20 via-blue-500/20 to-transparent",
      border: "group-hover:border-cyan-500/50",
      image: "/design.jpg",
      link: "https://www.behance.net/nabilsaouchi",
    },
    {
      title: "After Effects",
      desc: "Creating engaging motion graphics and animations with After Effects, combining creativity, smooth motion, and visual impact.",
      tags: ["After Effects"],
      gradient: "from-orange-500/20 via-red-500/20 to-transparent",
      border: "group-hover:border-orange-500/50",
      image: "/motion.jpg",
      link: "https://www.behance.net/nabilsaouchi",
    },
  ];

  const skills = [
    { name: "React / Next.js", level: "Expert" },
    { name: "TypeScript", level: "Advanced" },
    { name: "Tailwind CSS", level: "Advanced" },
    { name: "Photoshop / AI", level: "Expert" },
    { name: "Illustrator", level: "Expert" },
    { name: "After Effects", level: "Advanced" },
  ];

  const socials = [
    {
      name: "github",
      label: "GitHub",
      href: "https://github.com/saouchinabil",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/feed/",
    },
    {
      name: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/nabilxsa/",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 selection:text-indigo-200 font-sans">
      {/* ===== PREMIUM BACKGROUND ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      {/* ===== FLOATING NAVBAR ===== */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
          isNavVisible ? "top-6" : "-top-24"
        } ${scrollY > 50 ? "w-[90%] max-w-2xl" : "w-[95%] max-w-3xl"}`}
      >
        <div className="flex items-center justify-between px-2 py-2 rounded-full bg-[#0F0F11]/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50">
          <button
            onClick={() => scrollToSection("home")}
            className="px-4 py-2 font-bold text-lg tracking-tight hover:text-indigo-400 transition-colors"
          >
            NS<span className="text-indigo-500">.</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {["home", "about", "github", "projects", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                  activeSection === item
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollToSection("contact")}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Let's Talk
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300"
          >
            <Icon name={isMenuOpen ? "x" : "menu"} className="w-6 h-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[#0F0F11]/95 backdrop-blur-2xl border border-white/10 shadow-2xl">
            {["home", "about", "github", "projects", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium capitalize text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* ===== HERO SECTION ===== */}
        <section
  id="home"
  className="relative min-h-screen flex flex-col justify-center mb-20 overflow-hidden"
>
  {/* 🎨 CURSOR GRID — Full section background */}
  <div className="absolute inset-0 z-0">
    <CursorGrid
      cellSize={70}
      color="#dab2e0"
      radius={140}
      falloff="smooth"
      holdTime={400}
      fadeDuration={800}
      lineWidth={1.2}
      maxOpacity={0.35}
      fillOpacity={0}
      gridOpacity={0}
      cellRadius={0}
      clickPulse
      pulseSpeed={600}
    />
  </div>

  {/* 📝 CONTENT — sits above the grid */}
  <div className="relative z-10">
    <Reveal>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium w-fit mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Available for new projects
      </div>
    </Reveal>

    <Reveal delay={100}>
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
        Building digital <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          experiences
        </span>{" "}
        that matter.
      </h1>
    </Reveal>

    <Reveal delay={200}>
      <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed mb-10">
        I'm Nabil Saouchi, a Frontend Developer and Graphic Designer with
        4+ years of experience, combining clean, modern code with creative
        design to build responsive websites and engaging digital
        experiences.
      </p>
    </Reveal>

    <Reveal delay={300}>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => scrollToSection("projects")}
          className="group relative px-8 py-4 rounded-full bg-white text-black font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            View Projects
            <Icon
              name="arrowRight"
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            />
          </span>
        </button>
        <button
          onClick={() => scrollToSection("contact")}
          className="px-8 py-4 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 hover:border-white/20 transition-all"
        >
          Contact Me
        </button>
      </div>
    </Reveal>

    <Reveal delay={400}>
      <div className="mt-20 pt-10 border-t border-white/5">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">
          Tools I Use
        </p>
        <div className="flex flex-wrap gap-8 items-center opacity-60 hover:opacity-100 transition-all duration-500">
          {[
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind",
            "Photoshop",
            "Illustrator",
            "After Effects",
          ].map((tech) => (
            <span
              key={tech}
              className="relative text-xl font-bold text-gray-300 cursor-pointer transition-all duration-300 hover:text-white hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] group"
            >
              {tech}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300 rounded-full" />
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  </div>
</section>

        {/* ===== ABOUT SECTION ===== */}
        <section id="about" className="py-32 mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20 transition-all duration-700 group-hover:opacity-60 group-hover:blur-[100px]" />

                <img
                  src="/profile.png"
                  alt="Nabil Saouchi"
                  className="relative w-full max-w-md mx-auto rounded-3xl border border-white/10 shadow-2xl cursor-pointer transition-all duration-500 ease-out group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_80px_-15px_rgba(99,102,241,0.9)]"
                />
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={100}>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  About <span className="text-indigo-400">Me</span>
                </h2>
              </Reveal>

              <Reveal delay={200}>
                <p className="text-lg text-gray-400 leading-relaxed">
                  I'm Nabil Saouchi, a Frontend Developer and Graphic Designer
                  with 4+ years of experience building modern, high-quality
                  digital products. I specialize in creating responsive,
                  user-focused interfaces that combine clean development, strong
                  visual design, and seamless user experiences. I work with
                  modern web technologies and design tools, while leveraging AI
                  to accelerate development, improve workflows, explore creative
                  solutions, and solve complex problems more efficiently.
                </p>
              </Reveal>

              {/* ✅ CONNECTED TO REAL GITHUB */}
              <Reveal delay={300}>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:border-indigo-500/30">
                    <div className="text-3xl font-bold text-indigo-400 mb-1">
                      {githubStats.loading ? (
                        <span className="inline-block w-16 h-8 bg-white/5 rounded animate-pulse" />
                      ) : (
                        <>
                          {formatNumber(githubStats.stars)}
                          <span className="text-indigo-400">+</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">GitHub Stars</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:border-purple-500/30">
                    <div className="text-3xl font-bold text-purple-400 mb-1">
                      {githubStats.loading ? (
                        <span className="inline-block w-16 h-8 bg-white/5 rounded animate-pulse" />
                      ) : (
                        <>
                          {githubStats.repos}
                          <span className="text-purple-400">+</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      Projects Completed
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===== BENTO GRID ===== */}
        <section className="mb-32">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 flex items-center gap-3">
              <Icon name="zap" className="w-8 h-8 text-yellow-400" />
              About & Expertise
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Reveal delay={100} className="lg:col-span-1">
              <SpotlightCard className="p-8 flex flex-col justify-between h-full min-h-[380px]">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">The Story</h3>
                  <p className="text-gray-400 leading-relaxed">
                    With 4+ years of experience, I specialize in building
                    responsive websites, modern web interfaces, and visual
                    designs. I combine frontend development, UI/UX, and
                    AI-powered tools to turn ideas into fast, polished, and
                    user-friendly digital products.
                  </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                    Remote
                  </span>
                </div>
              </SpotlightCard>
            </Reveal>

            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* ✅ CONNECTED — GitHub Stars */}
                <Reveal delay={200}>
                  <SpotlightCard className="p-6 flex flex-col justify-center items-center text-center min-h-[180px] bg-gradient-to-br from-indigo-500/10 to-transparent">
                    <div className="text-5xl font-bold text-white mb-2">
                      {githubStats.loading ? (
                        <span className="inline-block w-24 h-12 bg-white/5 rounded animate-pulse" />
                      ) : (
                        <>
                          {formatNumber(githubStats.stars)}
                          <span className="text-indigo-400">+</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      GitHub Stars
                    </div>
                  </SpotlightCard>
                </Reveal>

                <Reveal delay={300}>
                  <SpotlightCard className="p-6 flex flex-col justify-center items-center text-center min-h-[180px] bg-gradient-to-br from-purple-500/10 to-transparent">
                    <div className="text-5xl font-bold text-white mb-2">
                      4<span className="text-purple-400">+</span>
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      Years Exp.
                    </div>
                  </SpotlightCard>
                </Reveal>
              </div>

              <Reveal delay={400}>
                <SpotlightCard className="p-8 flex items-center gap-6 min-h-[180px] bg-gradient-to-r from-emerald-500/5 to-transparent">
                  <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    <Icon name="globe" className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      Global Impact
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Creating modern digital experiences for users worldwide.
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>

            <Reveal delay={500} className="lg:col-span-1">
              <SpotlightCard className="p-8 h-full min-h-[380px]">
                <h3 className="text-xl font-semibold mb-6">Core Stack</h3>
                <div className="grid grid-cols-1 gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <span className="font-medium text-gray-200">
                        {skill.name}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </section>

        {/* ===== GITHUB STATS SECTION ===== */}
        <section id="github" className="mb-32">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                  <Icon name="github" className="w-8 h-8 text-white" />
                  Live GitHub Stats
                </h2>
                <p className="text-gray-400">
                  Real-time data from my open-source journey.
                </p>
              </div>
              <a
                href="https://github.com/saouchinabil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Visit Profile <Icon name="externalLink" className="w-4 h-4" />
              </a>
            </div>
          </Reveal>

          <GitHubStats username="saouchinabil" />
        </section>

        {/* ===== PROJECTS SECTION ===== */}
        <section id="projects" className="mb-32">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  Featured Work
                </h2>
                <p className="text-gray-400">
                  A selection of projects that define my craft.
                </p>
              </div>
              <a
                href="https://github.com/saouchinabil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                View GitHub <Icon name="externalLink" className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Reveal key={project.title} delay={index * 150}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <SpotlightCard
                    className={`group h-full flex flex-col cursor-pointer ${project.border}`}
                  >
                    <div className="h-48 sm:h-64 w-full relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                      />

                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} mix-blend-overlay`}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-transparent to-transparent" />

                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white">
                          <Icon name="externalLink" className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-6 leading-relaxed flex-grow">
                        {project.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section id="contact" className="relative">
          <Reveal>
            <div className="rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <Icon
                  name="sparkles"
                  className="w-12 h-12 text-indigo-400 mx-auto mb-6"
                />
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  Ready to build something extraordinary?
                </h2>
                <p className="text-gray-400 text-lg mb-10">
                  I'm currently available for freelance projects and full-time
                  roles. Let's discuss how I can help bring your vision to life.
                </p>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=saouchinabil@gmail.com&su=Project%20Inquiry&body=Hi%20Nabil,%0A%0AI%20came%20across%20your%20portfolio%20and%20I'd%20like%20to%20discuss%20a%20project%20with%20you.%0A%0AThanks!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black text-lg font-bold hover:scale-105 hover:shadow-[0_0_50px_-12px_rgba(255,255,255,0.4)] transition-all duration-300"
                >
                  <Icon name="mail" className="w-5 h-5" />
                  saouchinabil@gmail.com
                </a>

                <div className="flex justify-center gap-6 mt-12">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                      <Icon
                        name={social.name}
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-sm font-medium">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-sm text-gray-600">
        <p>© 2026 Nabil Saouchi. Designed & Built with precision.</p>
      </footer>

      {/* ===== SCROLL TO TOP ===== */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-xl"
        >
          <Icon name="arrowUp" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default App;