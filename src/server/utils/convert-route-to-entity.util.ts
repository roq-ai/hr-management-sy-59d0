const mapping: Record<string, string> = {
  evaluations: 'evaluation',
  marks: 'marks',
  organizations: 'organization',
  students: 'student',
  users: 'user',
  vacations: 'vacation',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
