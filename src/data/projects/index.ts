import { fintagDetail } from "./fintag"
import { cochatBusinessDetail } from "./cochat-business"
import { gopsslDetail } from "./gopssl"
import { cochatDetail } from "./cochat"
import type { ProjectDetail } from "./types"

export { PROJECT_ACCENT, PROJECT_PULL, DEFAULT_ACCENT } from "./accent"
export { PROJECTS } from "./list"
export type { Project } from "./list"
export type {
  DetailIconKey,
  ProjectDetailCardItem,
  ProjectDetail,
} from "./types"

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "01": fintagDetail,
  "02": cochatBusinessDetail,
  "03": gopsslDetail,
  "04": cochatDetail,
}
