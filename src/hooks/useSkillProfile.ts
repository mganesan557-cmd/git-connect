import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SkillKey =
    | "variables"
    | "loops"
    | "functions"
    | "arrays"
    | "recursion"
    | "sorting"
    | "trees"
    | "dynamic_programming"
    | "graphs"
    | "complexity";

export type SkillMap = Record<SkillKey, number>;

export const SKILL_LABELS: Record<SkillKey, string> = {
    variables: "Variables",
    loops: "Loops",
    functions: "Functions",
    arrays: "Arrays",
    recursion: "Recursion",
    sorting: "Sorting",
    trees: "Trees",
    dynamic_programming: "Dynamic Prog.",
    graphs: "Graphs",
    complexity: "Complexity",
};

export const DEFAULT_SKILLS: SkillMap = {
    variables: 0.1,
    loops: 0.1,
    functions: 0.1,
    arrays: 0.1,
    recursion: 0.1,
    sorting: 0.1,
    trees: 0.1,
    dynamic_programming: 0.1,
    graphs: 0.1,
    complexity: 0.1,
};

// Topic to skill key mapping for the Learn tracks
export const LESSON_SKILL_MAP: Record<string, SkillKey> = {
    // Python track
    "py-basics": "variables",
    "py-variables": "variables",
    "py-loops": "loops",
    "py-functions": "functions",
    "py-arrays": "arrays",
    "py-lists": "arrays",
    "py-recursion": "recursion",
    "py-sorting": "sorting",
    "py-trees": "trees",
    "py-dp": "dynamic_programming",
    "py-graphs": "graphs",
    // JavaScript track
    "js-variables": "variables",
    "js-loops": "loops",
    "js-functions": "functions",
    "js-arrays": "arrays",
    "js-recursion": "recursion",
    // DSA track
    "dsa-arrays": "arrays",
    "dsa-loops": "loops",
    "dsa-recursion": "recursion",
    "dsa-sorting": "sorting",
    "dsa-trees": "trees",
    "dsa-dp": "dynamic_programming",
    "dsa-graphs": "graphs",
};

const SKILL_STORAGE_KEY = "skill-profile-cache-v1";

function clamp(val: number, min = 0, max = 1) {
    return Math.min(max, Math.max(min, val));
}

export function useSkillProfile() {
    const [skills, setSkills] = useState<SkillMap>(DEFAULT_SKILLS);
    const [totalXp, setTotalXp] = useState(0);
    const [streakDays, setStreakDays] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from local cache first, then Supabase
    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);

            // Try local cache first for instant rendering
            try {
                const cached = localStorage.getItem(SKILL_STORAGE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached) as { skills: SkillMap; totalXp: number; streakDays: number };
                    if (parsed.skills) setSkills(parsed.skills);
                    if (typeof parsed.totalXp === "number") setTotalXp(parsed.totalXp);
                    if (typeof parsed.streakDays === "number") setStreakDays(parsed.streakDays);
                }
            } catch { /* ignore */ }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }
            setUserId(user.id);

            const { data, error } = await supabase
                .from("student_skill_profiles")
                .select("skills, total_xp, streak_days")
                .eq("user_id", user.id)
                .single();

            if (error || !data) {
                // Create default profile
                await supabase.from("student_skill_profiles").insert({
                    user_id: user.id,
                    skills: DEFAULT_SKILLS,
                    total_xp: 0,
                    streak_days: 0,
                });
                setLoading(false);
                return;
            }

            const profileSkills = (data.skills as SkillMap) || DEFAULT_SKILLS;
            const profileXp = data.total_xp || 0;
            const profileStreak = data.streak_days || 0;

            setSkills(profileSkills);
            setTotalXp(profileXp);
            setStreakDays(profileStreak);

            // Update local cache
            try {
                localStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify({
                    skills: profileSkills,
                    totalXp: profileXp,
                    streakDays: profileStreak,
                }));
            } catch { /* ignore */ }

            setLoading(false);
        };

        loadProfile();
    }, []);

    /**
     * Update skill after a quiz or practice session
     * @param skillKey - which skill to update
     * @param correct  - number correct
     * @param total    - total questions
     */
    const updateSkillFromQuiz = useCallback(async (skillKey: SkillKey, correct: number, total: number) => {
        if (total === 0) return;
        const ratio = correct / total;

        // Delta: good performance boosts skill, poor decays
        const delta = ratio >= 0.7 ? 0.05 * ratio : -0.02 * (1 - ratio);
        const xpGained = Math.round(correct * 10);

        setSkills((prev) => {
            const updated = { ...prev, [skillKey]: clamp(prev[skillKey] + delta) };
            const newXp = totalXp + xpGained;

            // Persist to Supabase async
            if (userId) {
                supabase.from("student_skill_profiles").upsert({
                    user_id: userId,
                    skills: updated,
                    total_xp: newXp,
                }, { onConflict: "user_id" }).then(() => { });
            }

            // Update local cache
            try {
                localStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify({
                    skills: updated,
                    totalXp: newXp,
                    streakDays,
                }));
            } catch { /* ignore */ }

            return updated;
        });

        setTotalXp((prev) => prev + xpGained);
    }, [userId, totalXp, streakDays]);

    /**
     * Update skill after a practice attempt
     */
    const updateSkillFromPractice = useCallback(async (skillKey: SkillKey, passed: boolean) => {
        const delta = passed ? 0.04 : -0.01;
        const xpGained = passed ? 15 : 0;

        setSkills((prev) => {
            const updated = { ...prev, [skillKey]: clamp(prev[skillKey] + delta) };
            const newXp = totalXp + xpGained;

            if (userId) {
                supabase.from("student_skill_profiles").upsert({
                    user_id: userId,
                    skills: updated,
                    total_xp: newXp,
                }, { onConflict: "user_id" }).then(() => { });
            }

            try {
                localStorage.setItem(SKILL_STORAGE_KEY, JSON.stringify({
                    skills: updated,
                    totalXp: newXp,
                    streakDays,
                }));
            } catch { /* ignore */ }

            return updated;
        });

        if (xpGained > 0) setTotalXp((prev) => prev + xpGained);
    }, [userId, totalXp, streakDays]);

    return {
        skills,
        totalXp,
        streakDays,
        loading,
        userId,
        updateSkillFromQuiz,
        updateSkillFromPractice,
    };
}
