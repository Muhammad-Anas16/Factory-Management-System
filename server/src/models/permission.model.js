import db from "../config/db.js";
import { PAGES, ACTIONS } from '../constants/pages.constants.js';

function rowsToMap(rows) {
    const map = {};
    for (const row of rows) {
        map[row.page] = {
            canView: !!row.can_view,
            canCreate: !!row.can_create,
            canEdit: !!row.can_edit,
            canDelete: !!row.can_delete,
        };
    }
    return map;
}

function mapToAllowedPages(map) {
    return PAGES.map((page) => ({
        page,
        canView: !!map[page]?.canView,
        canCreate: !!map[page]?.canCreate,
        canEdit: !!map[page]?.canEdit,
        canDelete: !!map[page]?.canDelete,
    }));
}

const permissionModel = {
    getByUserId(userId) {
        return db.prepare('SELECT * FROM permissions WHERE user_id = ?').all(userId);
    },

    getAllowedPages(userId) {
        return mapToAllowedPages(rowsToMap(permissionModel.getByUserId(userId)));
    },

    getPermissionMap(userId) {
        return rowsToMap(permissionModel.getByUserId(userId));
    },

    replaceForUser(userId, allowedPages) {
        const del = db.prepare('DELETE FROM permissions WHERE user_id = ?');
        const insert = db.prepare(`
      INSERT INTO permissions (user_id, page, can_view, can_create, can_edit, can_delete)
      VALUES (@userId, @page, @canView, @canCreate, @canEdit, @canDelete)
    `);

        const tx = db.transaction((items) => {
            del.run(userId);
            for (const item of items) {
                if (!PAGES.includes(item.page)) continue;
                insert.run({
                    userId,
                    page: item.page,
                    canView: item.canView ? 1 : 0,
                    canCreate: item.canCreate ? 1 : 0,
                    canEdit: item.canEdit ? 1 : 0,
                    canDelete: item.canDelete ? 1 : 0,
                });
            }
        });

        tx(allowedPages);
    },

    grantAll(userId) {
        const fullAccess = PAGES.map((page) => ({
            page,
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
        }));
        permissionModel.replaceForUser(userId, fullAccess);
    },
};

export default permissionModel;
export { PAGES, ACTIONS };