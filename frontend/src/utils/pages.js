export const PAGE_DEFINITIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'users', label: 'Users' },
  { key: 'roles', label: 'Roles' },
  { key: 'karigars', label: 'Karigars' },
  { key: 'helpers', label: 'Helpers' },
  { key: 'supervisors', label: 'Supervisors' },
  { key: 'categories', label: 'Categories' },
  { key: 'articles', label: 'Articles / Styles' },
  { key: 'production', label: 'Production' },
  { key: 'work-allocation', label: 'Work Allocation' },
  { key: 'work-completion', label: 'Work Completion' },
  { key: 'payroll', label: 'Payroll' },
  { key: 'payments', label: 'Payments' },
  { key: 'reports', label: 'Reports' },
  { key: 'parties', label: 'Parties' },
  { key: 'challans', label: 'Challans' },
  { key: 'billing', label: 'Billing' },
  { key: 'audit-logs', label: 'Audit Logs' },
  { key: 'backup', label: 'Backup' },
  { key: 'settings', label: 'Settings' },
];

export const ACTIONS = ['view', 'create', 'edit', 'delete'];

export const DEFAULT_PERMISSIONS = Object.fromEntries(
  PAGE_DEFINITIONS.map(({ key }) => [key, { can_view: false, can_create: false, can_edit: false, can_delete: false }]),
);

export function normalizePermissions(permissions = {}) {
  const normalized = structuredClone(DEFAULT_PERMISSIONS);
  Object.entries(permissions || {}).forEach(([page, values]) => {
    normalized[page] = {
      can_view: Boolean(values?.can_view),
      can_create: Boolean(values?.can_create),
      can_edit: Boolean(values?.can_edit),
      can_delete: Boolean(values?.can_delete),
    };
  });
  return normalized;
}

export function permissionsFromAllowedPages(allowedPages = []) {
  const next = structuredClone(DEFAULT_PERMISSIONS);
  allowedPages.forEach((page) => {
    if (next[page]) next[page].can_view = true;
  });
  return next;
}
