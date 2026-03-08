import { useMemo } from "react";
import { SkillMap, SkillKey, SKILL_LABELS } from "./useSkillProfile";

export type Recommendation = {
    skillKey: SkillKey;
    label: string;
    reason: string;
    action: string;
    route: string;
    priority: "high" | "medium" | "low";
    currentLevel: number;
};

// Maps skill keys to relevant learn track/topic routes
const SKILL_TO_TRACK: Record<SkillKey, { route: string; trackId: string }> = {
    variables: { route: "/learn?track=python&topic=py-basics", trackId: "python" },
    loops: { route: "/learn?track=python&topic=py-loops", trackId: "python" },
    functions: { route: "/learn?track=python&topic=py-functions", trackId: "python" },
    arrays: { route: "/learn?track=dsa&topic=dsa-arrays", trackId: "dsa" },
    recursion: { route: "/learn?track=dsa&topic=dsa-recursion", trackId: "dsa" },
    sorting: { route: "/learn?track=dsa&topic=dsa-sorting", trackId: "dsa" },
    trees: { route: "/learn?track=dsa&topic=dsa-trees", trackId: "dsa" },
    dynamic_programming: { route: "/learn?track=dsa&topic=dsa-dp", trackId: "dsa" },
    graphs: { route: "/learn?track=dsa&topic=dsa-graphs", trackId: "dsa" },
    complexity: { route: "/algorithms", trackId: "algorithms" },
};

function getReasonText(skill: SkillKey, level: number): string {
    if (level < 0.2) return `You haven't started ${SKILL_LABELS[skill]} yet — great place to begin!`;
    if (level < 0.45) return `Your ${SKILL_LABELS[skill]} skill is emerging. More practice will solidify it.`;
    if (level < 0.7) return `Solid foundation in ${SKILL_LABELS[skill]} — push to the next level.`;
    return `You're strong in ${SKILL_LABELS[skill]}. Try advanced challenges!`;
}

function getActionText(skill: SkillKey, level: number): string {
    if (level < 0.2) return "Start Learning";
    if (level < 0.45) return "Practice More";
    if (level < 0.7) return "Go Advanced";
    return "Master Level";
}

export function useAdaptiveLearning(skills: SkillMap) {
    const recommendations = useMemo<Recommendation[]>(() => {
        const entries = Object.entries(skills) as [SkillKey, number][];

        // Sort: lowest skill first (most needing work), then medium
        const sorted = [...entries].sort(([, a], [, b]) => a - b);

        return sorted.slice(0, 5).map(([key, level]) => {
            const track = SKILL_TO_TRACK[key];
            const priority: Recommendation["priority"] =
                level < 0.3 ? "high" : level < 0.6 ? "medium" : "low";

            return {
                skillKey: key,
                label: SKILL_LABELS[key],
                reason: getReasonText(key, level),
                action: getActionText(key, level),
                route: track?.route ?? "/learn",
                priority,
                currentLevel: level,
            };
        });
    }, [skills]);

    const nextUnlockedSkills = useMemo(() => {
        // Skills that are "ready" (prerequisites mastered to 0.8+)
        const unlocked: SkillKey[] = [];
        if (skills.arrays > 0.8 && skills.loops > 0.8) unlocked.push("sorting");
        if (skills.recursion > 0.8) unlocked.push("trees");
        if (skills.trees > 0.8 && skills.recursion > 0.8) unlocked.push("dynamic_programming", "graphs");
        return unlocked;
    }, [skills]);

    const overallProgress = useMemo(() => {
        const values = Object.values(skills);
        return values.reduce((sum, v) => sum + v, 0) / values.length;
    }, [skills]);

    const strongSkills = useMemo(() => {
        return (Object.entries(skills) as [SkillKey, number][])
            .filter(([, v]) => v > 0.75)
            .map(([k]) => k);
    }, [skills]);

    const weakSkills = useMemo(() => {
        return (Object.entries(skills) as [SkillKey, number][])
            .filter(([, v]) => v < 0.35)
            .map(([k]) => k);
    }, [skills]);

    return {
        recommendations,
        nextUnlockedSkills,
        overallProgress,
        strongSkills,
        weakSkills,
    };
}
