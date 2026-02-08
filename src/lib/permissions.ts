// ===== Permissions & Role Logic =====
// おにく = leader (admin), all others = member

export type Role = "leader" | "member";

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
}

export const TEAM_ROSTER: TeamMember[] = [
  { id: "p1", name: "おにく", role: "leader" },
  { id: "p2", name: "タカ", role: "member" },
  { id: "p3", name: "バスロもっちバイヤグラ", role: "member" },
  { id: "p4", name: "ノセ", role: "member" },
  { id: "p5", name: "便座", role: "member" },
  { id: "p6", name: "ロキソニン陸斗", role: "member" },
  { id: "p7", name: "だーふく", role: "member" },
  { id: "p8", name: "コロッケ", role: "member" },
  { id: "p9", name: "ぱいぱんコニー", role: "member" },
];

/**
 * Permission check: what each role can do.
 *
 * - All members: create sessions, hand reviews, opponent notes, check-in, comments
 * - Leader only: delete other members' data, manage team settings, view all members' stats
 */
export function can(
  action:
    | "create_session"
    | "create_hand"
    | "create_opponent"
    | "check_in"
    | "comment"
    | "delete_own"
    | "delete_any"
    | "manage_team"
    | "view_all_stats",
  role: Role,
): boolean {
  switch (action) {
    case "create_session":
    case "create_hand":
    case "create_opponent":
    case "check_in":
    case "comment":
    case "delete_own":
      return true; // All members can do this
    case "delete_any":
    case "manage_team":
    case "view_all_stats":
      return role === "leader";
    default:
      return false;
  }
}

/** Get current user (mock — defaults to おにく leader for demo) */
export function getCurrentUser(): TeamMember {
  return TEAM_ROSTER[0]; // おにく
}

export function getMemberById(id: string): TeamMember | undefined {
  return TEAM_ROSTER.find((m) => m.id === id);
}

export function getMemberByName(name: string): TeamMember | undefined {
  return TEAM_ROSTER.find((m) => m.name === name);
}
