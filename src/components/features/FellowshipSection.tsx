"use client";

import { useState, useEffect } from "react";
import { HeartHandshake, X, MapPin, Phone, Plus, Users, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  nickname: string;
  phone: string;
  city: string;
  joinedAt: string;
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  const prefix = phone.slice(0, phone.indexOf(digits[0]) + 3);
  const last = phone.slice(-2);
  const midLen = phone.length - prefix.length - last.length;
  return prefix + "•".repeat(Math.max(midLen, 3)) + last;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const colors = [
    "bg-[var(--accent-sage-light)] text-[var(--accent-sage)]",
    "bg-[var(--accent-serenity-light)] text-[var(--accent-serenity)]",
    "bg-[var(--accent-amber-light)] text-[var(--accent-amber)]",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <span className={cn("w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0", color)}>
      {initials}
    </span>
  );
}

export default function FellowshipSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nickname: "", phone: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    fetch("/api/fellowship")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nickname.trim() || !form.phone.trim() || !form.city.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/fellowship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setMembers(data.members ?? []);
      setJoined(true);
      setShowForm(false);
      setForm({ nickname: "", phone: "", city: "" });
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="fellowship-heading" className="px-4 sm:px-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[var(--accent-amber-light)] flex items-center justify-center flex-shrink-0" aria-hidden>
            <HeartHandshake className="w-5 h-5 text-[var(--accent-amber)]" />
          </div>
          <div>
            <h2 id="fellowship-heading" className="text-lg font-semibold text-[var(--text-primary)]">
              Fellowship
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              We are stronger together. No one recovers alone.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
            <Users className="w-4 h-4" aria-hidden />
            {members.length} members
          </span>
          {!joined && (
            <button
              onClick={() => setShowForm(true)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium transition-calm",
                "bg-[var(--accent-amber)] text-white hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-amber)]"
              )}
            >
              <Plus className="w-4 h-4" aria-hidden />
              Join fellowship
            </button>
          )}
          {joined && (
            <span className="text-sm text-[var(--accent-sage)] font-medium">Welcome to the fellowship ♥</span>
          )}
        </div>
      </div>

      {/* Member list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {members.map((m) => (
          <Card key={m.id} padding="md" className="flex items-center gap-3">
            <Avatar name={m.nickname} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{m.nickname}</p>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden />
                {m.city}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 flex-shrink-0 text-[var(--text-muted)]" aria-hidden />
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {revealed.has(m.id) ? m.phone : maskPhone(m.phone)}
                </span>
                <button
                  onClick={() => toggleReveal(m.id)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-calm focus-visible:outline-none"
                  aria-label={revealed.has(m.id) ? "Hide phone number" : "Reveal phone number"}
                >
                  {revealed.has(m.id)
                    ? <EyeOff className="w-3 h-3" />
                    : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal form */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-label="Join the fellowship"
          aria-modal="true"
        >
          <button
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
            aria-label="Close"
          />
          <div className={cn(
            "relative z-10 w-full max-w-md",
            "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-3xl shadow-calm-lg",
            "p-8 animate-fade-up"
          )}>
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-calm"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-amber-light)] flex items-center justify-center" aria-hidden>
                <HeartHandshake className="w-5 h-5 text-[var(--accent-amber)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Join the Fellowship</h3>
                <p className="text-xs text-[var(--text-muted)]">Share your contact to connect with others in recovery.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5" htmlFor="f-nickname">
                  Nickname
                </label>
                <input
                  id="f-nickname"
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))}
                  placeholder="e.g. Michael O."
                  autoComplete="off"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-sm",
                    "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] transition-calm"
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5" htmlFor="f-phone">
                  Phone number
                </label>
                <input
                  id="f-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+31 6 12 34 56 78"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-sm font-mono",
                    "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] transition-calm"
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5" htmlFor="f-city">
                  Country / City
                </label>
                <input
                  id="f-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="e.g. Amsterdam, NL"
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-sm",
                    "bg-[var(--bg-secondary)] border border-[var(--border-soft)]",
                    "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] transition-calm"
                  )}
                />
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Your phone number will be partially masked in the list. Only share what you are comfortable with.
              </p>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "w-full py-3 rounded-2xl text-sm font-medium transition-calm",
                  "bg-[var(--accent-amber)] text-white hover:opacity-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-amber)]",
                  "disabled:opacity-60"
                )}
              >
                {submitting ? "Adding you…" : "Join the fellowship"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
