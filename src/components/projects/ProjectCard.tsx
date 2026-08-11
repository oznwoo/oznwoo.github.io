import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col rounded-3xl border border-ink/10 bg-paper2 p-8 transition-[transform,box-shadow] duration-normal ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
      <span
        aria-hidden="true"
        className="font-display text-6xl font-bold text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)] opacity-20"
      >
        {project.index}
      </span>

      <span className="mt-4 text-sm font-semibold tracking-[0.15em] text-teal">
        {project.role}
      </span>

      <h3 className="mt-2 font-display text-2xl font-semibold">{project.title}</h3>

      <p className="mt-4 flex-1 leading-relaxed text-ink/70">{project.description}</p>

      {project.metric && (
        <p className="mt-4 inline-flex w-fit items-center rounded-full bg-coral/15 px-4 py-1.5 text-sm font-semibold text-coral">
          {project.metric}
        </p>
      )}

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-medium text-ink/70"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
