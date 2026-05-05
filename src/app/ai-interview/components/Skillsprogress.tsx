"use client";
import { cn } from "../lib/Utils";
import { Skill } from "../types/interview";



interface SkillsProgressProps {
  skills: Skill[];
  currentSkillId: string;
  completedSkillIds: Set<string>;
}

export function SkillsProgress({
  skills,
  currentSkillId,
  completedSkillIds,
}: SkillsProgressProps) {
  return (
    <div className="w-full max-w-[280px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">
        Skills Progress
      </h3>
      <div className="flex flex-col gap-0.5">
        {skills.map((skill) => {
          const isDone = completedSkillIds.has(skill.id);
          const isActive = skill.id === currentSkillId && !isDone;

          return (
            <div key={skill.id} className="flex items-center gap-3 py-2">
              {/* Icon */}
              {isDone ? (
                <div className="w-[22px] h-[22px] rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : isActive ? (
                <div className="w-[22px] h-[22px] rounded-full bg-purple-400 animate-pulse flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
              ) : (
                <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}

              {/* Name */}
              <span
                className={cn(
                  "text-sm font-medium",
                  isDone && "text-green-600",
                  isActive && "text-purple-600",
                  !isDone && !isActive && "text-gray-400"
                )}
              >
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}