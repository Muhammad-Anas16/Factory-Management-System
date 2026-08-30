import db from '../config/database.js';
import { ApiError } from '../utils/error.js';

function earnedForUser(userId, start, end) {
  return db.prepare(`SELECT COALESCE(SUM(completed_quantity * rate),0) total FROM work_allocations WHERE user_id=? AND status='completed' AND completion_date BETWEEN ? AND ?`).get(userId,start,end).total;
}
function previousBalance(userId, start) {
  const row=db.prepare(`SELECT balance_carried_forward FROM payroll_records WHERE user_id=? AND week_end < ? ORDER BY week_end DESC, id DESC LIMIT 1`).get(userId,start);
  return Number(row?.balance_carried_forward || 0);
}
export function list(){return db.prepare(`SELECT p.*,u.username FROM payroll_records p JOIN users u ON u.id=p.user_id ORDER BY p.week_end DESC,p.id DESC`).all();}
export function create(input,createdBy){
  if(!input.user_id||!input.week_start||!input.week_end)throw new ApiError(400,'Worker, week start and week end are required');
  const earned=input.earned_amount!==undefined?Number(input.earned_amount):earnedForUser(input.user_id,input.week_start,input.week_end);
  const prev=input.previous_balance!==undefined?Number(input.previous_balance):previousBalance(input.user_id,input.week_start);
  const adjustments=Number(input.adjustments||0); const total=prev+earned+adjustments; const paid=Number(input.paid_amount||0); const balance=total-paid; const status=paid<=0?'pending':paid<total?'partial':'paid';
  const info=db.prepare(`INSERT INTO payroll_records(user_id,week_start,week_end,earned_amount,previous_balance,adjustments,total_payable,paid_amount,balance_carried_forward,status,payment_date,notes,created_by)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(input.user_id,input.week_start,input.week_end,earned,prev,adjustments,total,paid,balance,status,input.payment_date||null,input.notes||null,createdBy);return info.lastInsertRowid;
}
export function update(id,input){const p=db.prepare('SELECT * FROM payroll_records WHERE id=?').get(id);if(!p)throw new ApiError(404,'Payroll not found');const earned=Number(input.earned_amount??p.earned_amount),prev=Number(input.previous_balance??p.previous_balance),adj=Number(input.adjustments??p.adjustments),total=prev+earned+adj,paid=Number(input.paid_amount??p.paid_amount),balance=total-paid,status=paid<=0?'pending':paid<total?'partial':'paid';db.prepare(`UPDATE payroll_records SET user_id=?,week_start=?,week_end=?,earned_amount=?,previous_balance=?,adjustments=?,total_payable=?,paid_amount=?,balance_carried_forward=?,status=?,payment_date=?,notes=?,updated_at=datetime('now') WHERE id=?`).run(input.user_id??p.user_id,input.week_start??p.week_start,input.week_end??p.week_end,earned,prev,adj,total,paid,balance,status,input.payment_date??p.payment_date,input.notes??p.notes,id);}
export const remove=(id)=>db.prepare('DELETE FROM payroll_records WHERE id=?').run(id);
