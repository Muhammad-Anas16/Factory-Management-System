export const PAGES = [
  'dashboard','users','roles','karigars','helpers','supervisors','categories','articles',
  'production','work-allocation','work-completion','payroll','payments','reports','parties',
  'challans','billing','audit-logs','backup','settings'
];

export const ACTIONS = ['view','create','edit','delete'];

export function fullPermissions() {
  return Object.fromEntries(PAGES.map((page) => [page, {
    can_view: true, can_create: true, can_edit: true, can_delete: true,
  }]));
}

export function normalisePermissions(input = {}) {
  const output = {};
  for (const page of PAGES) {
    const p = input?.[page] || {};
    output[page] = {
      can_view: Boolean(p.can_view),
      can_create: Boolean(p.can_create),
      can_edit: Boolean(p.can_edit),
      can_delete: Boolean(p.can_delete),
    };
  }
  return output;
}

export function allowedPagesFromPermissions(permissions) {
  return PAGES.filter((page) => permissions?.[page]?.can_view);
}
