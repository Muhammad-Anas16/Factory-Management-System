import db from '../config/database.js';
import { ApiError } from '../utils/error.js';
export function list(){return db.prepare(`SELECT pe.*,a.name article_name,a.style_code FROM production_entries pe JOIN articles a ON a.id=pe.article_id ORDER BY pe.production_date DESC,pe.id DESC`).all();}
export function create(input,userId){if(Number(input.quantity)<=0)throw new ApiError(400,'Quantity must be greater than zero');const info=db.prepare(`INSERT INTO production_entries(article_id,quantity,production_date,notes,created_by)VALUES(?,?,?,?,?)`).run(input.article_id,Number(input.quantity),input.production_date,input.notes||null,userId);return info.lastInsertRowid;}
export function update(id,input){db.prepare(`UPDATE production_entries SET article_id=?,quantity=?,production_date=?,notes=? WHERE id=?`).run(input.article_id,Number(input.quantity),input.production_date,input.notes||null,id);}
export function remove(id){db.prepare('DELETE FROM production_entries WHERE id=?').run(id);}
