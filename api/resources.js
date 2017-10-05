export const resources = {
  projects: {
    all: { path: 'repos/{repo}/projects' },
    get: { path: 'projects/{id}' },
  },
  columns: {
    all: { path: '/projects/{project_id}/columns' },
    get: { path: '/projects/columns/{id}' },
  },
  cards: {
    all: { path: '/projects/columns/{column_id}/cards?per_page={per_page}', params: { per_page: 200 } },
    get: { path: '/projects/columns/cards/{id}' },
  },
  issues: {
    all: { path: '/repos/{repo}/issues' },
    get: { path: '/repos/{repo}/issues/{id}' },
  },
}
