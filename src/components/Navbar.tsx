"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, Zap, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
    { href: "/#inventory", label: "Arsenal" },
    { href: "/#value", label: "Sell / Value" },
    { href: "/#how-it-works", label: "How It Works" },
];

export default function Navbar() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Check auth state
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(async ({ data }) => {
            if (data.user) {
                setUser({
                    email: data.user.email,
                    name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
                });
                // Check admin role
                const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
                if (profile?.role === "admin") setIsAdmin(true);
            }
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
                });
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setUserMenuOpen(false);
        router.push("/");
        router.refresh();
    };

    // Get initials for avatar
    const initials = user?.name
        ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "border-b shadow-[0_8px_32px_rgba(0,0,0,0.5)]" : "bg-transparent"}`}
                style={scrolled ? {
                    background: "rgba(7, 7, 26, 0.88)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderBottomColor: "rgba(30, 30, 74, 0.9)",
                } : {}}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-shadow duration-300 group-hover:shadow-indigo"
                                style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                <Gamepad2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-300 border-2 border-[#07071a] animate-pulse" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-heading font-bold text-base text-white tracking-tight">PGH</span>
                            <span className="label text-[9px] text-indigo-400 tracking-[0.18em]">Gaming Hub</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}
                                className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side — Auth aware */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            // LOGGED IN STATE
                            <div className="hidden md:flex items-center gap-2 relative">
                                <Link href="/dashboard"
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-muted hover:text-white rounded-lg transition-colors hover:bg-white/5">
                                    <LayoutDashboard className="w-3.5 h-3.5" />
                                    Dashboard
                                </Link>

                                {/* User avatar dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl transition-all hover:bg-white/5"
                                    >
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                            {initials}
                                        </div>
                                        <span className="text-xs font-medium text-ink-muted max-w-[100px] truncate">{user.name}</span>
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl z-50"
                                                style={{ background: "#0d0d2b", border: "1px solid rgba(30,30,74,0.9)" }}
                                            >
                                                <div className="p-3 border-b" style={{ borderColor: "rgba(30,30,74,0.9)" }}>
                                                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                                    <p className="text-[10px] text-ink-muted truncate">{user.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-ink-muted hover:text-white hover:bg-white/5 transition-colors w-full">
                                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                    </Link>
                                                    {isAdmin && (
                                                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-colors w-full"
                                                            style={{ color: "#a5b4fc" }}>
                                                            <ShieldCheck className="w-4 h-4" /> Admin Panel
                                                        </Link>
                                                    )}
                                                    <button onClick={handleLogout}
                                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm w-full text-left transition-colors"
                                                        style={{ color: "#fca5a5" }}
                                                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
                                                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                                                    >
                                                        <LogOut className="w-4 h-4" /> Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            // LOGGED OUT STATE
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login"
                                    className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-white rounded-xl transition-colors hover:bg-white/5">
                                    Login
                                </Link>
                                <Link href="/#inventory"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden group"
                                    style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", boxShadow: "0 0 12px rgba(99,102,241,0.3)" }}>
                                    <div className="absolute inset-0 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] bg-white/20 transition-transform duration-700" />
                                    <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    Book Now
                                </Link>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileOpen(true)}
                            className="md:hidden p-2 rounded-lg text-ink-muted hover:text-white hover:bg-white/5 transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Click-away for user menu */}
            {userMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            )}

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
                            onClick={() => setMobileOpen(false)} />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 z-[70] w-72 p-6 flex flex-col"
                            style={{ background: "#0d0d2b", borderLeft: "1px solid rgba(30,30,74,0.9)" }}
                        >
                            <div className="flex justify-between items-center mb-8">
                                {user ? (
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{user.name}</p>
                                            <p className="text-[10px] text-ink-muted">Gamer</p>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="font-heading font-bold text-white text-lg">Menu</span>
                                )}
                                <button onClick={() => setMobileOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-ink-muted hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                                        className="px-4 py-3 text-sm font-medium text-ink-muted hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto flex flex-col gap-2.5">
                                {user ? (
                                    <>
                                        <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-white rounded-xl"
                                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <button onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-colors"
                                            style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-ink-muted hover:text-white rounded-xl transition-colors"
                                            style={{ border: "1px solid rgba(30,30,74,0.9)" }}>
                                            <LogOut className="w-4 h-4 rotate-180" /> Login
                                        </Link>
                                        <Link href="/#inventory" onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-white rounded-xl"
                                            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
                                            <Zap className="w-4 h-4" strokeWidth={2.5} /> Book Now
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
