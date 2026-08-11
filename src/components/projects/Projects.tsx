import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <span className="font-display text-sm font-semibold tracking-[0.2em] text-teal">
        PROJECTS
      </span>
      <h2 id="projects-heading" className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        3개의 다리, 3개의 문제
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.index} project={project} />
        ))}
      </div>
    </section>
  );
}
