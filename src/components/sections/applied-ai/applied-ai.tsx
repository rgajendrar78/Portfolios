import { Icon } from "@/components/ui/icon";
import { portfolio } from "@/config/portfolio";
import { stagger } from "@/lib/motion";
import { AiPath } from "./ai-path";
import { AiReplay } from "./ai-replay";

export function AppliedAi() {
  return (
    <div className="space-y-14">
      <div>
        <h3 className="reveal label">The path an AI request takes</h3>
        <div className="mt-5">
          <AiPath />
        </div>
      </div>

      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <ul className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {portfolio.ai.capabilities.map((capability, index) => (
            <li
              key={capability.title}
              className="reveal group card card-hover flex gap-4 rounded-lg p-4"
              style={stagger(index, 2)}
            >
              <Icon
                name={capability.icon}
                className="size-11 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-[4deg]"
              />
              <div className="min-w-0">
                <h3 className="text-[0.9375rem] text-ink">{capability.title}</h3>
                <p className="mt-1 text-[0.84375rem] leading-relaxed text-muted">{capability.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-7">
          <AiReplay />
        </div>
      </div>
    </div>
  );
}
