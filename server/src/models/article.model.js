import db from '../config/database.js';
import { parseJson, toJson } from '../utils/json.js';
export function list(){
  return db.prepare(`SELECT a.*, c.name category_name, p.name party_name FROM articles a LEFT JOIN categories c ON c.id=a.category_id LEFT JOIN parties p ON p.id=a.party_id ORDER BY a.id DESC`).all().map(a=>({...a,image_paths:parseJson(a.image_paths,[])}));
}
export function find(id){const a=db.prepare(`SELECT a.*, c.name category_name, p.name party_name FROM articles a LEFT JOIN categories c ON c.id=a.category_id LEFT JOIN parties p ON p.id=a.party_id WHERE a.id=?`).get(id); return a?{...a,image_paths:parseJson(a.image_paths,[])}:null;}
export function create(input, images=[]){
 const info=db.prepare(`INSERT INTO articles (name,style_code,category_id,party_id,size,color,batch,description,total_pieces,piece_rate,customer_rate,image_paths) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).run(input.name,input.style_code||null,input.category_id||null,input.party_id||null,input.size||null,input.color||null,input.batch||null,input.description||null,Number(input.total_pieces||0),Number(input.piece_rate||0),Number(input.customer_rate||0),toJson(images));
 return find(info.lastInsertRowid);
}
export function update(id,input,newImages){
 const old=find(id); if(!old) return null;
 const images=newImages===undefined?old.image_paths:newImages;
 db.prepare(`UPDATE articles SET name=?,style_code=?,category_id=?,party_id=?,size=?,color=?,batch=?,description=?,total_pieces=?,piece_rate=?,customer_rate=?,image_paths=?,updated_at=datetime('now') WHERE id=?`).run(input.name??old.name,input.style_code??old.style_code,input.category_id??old.category_id,input.party_id??old.party_id,input.size??old.size,input.color??old.color,input.batch??old.batch,input.description??old.description,Number(input.total_pieces??old.total_pieces),Number(input.piece_rate??old.piece_rate),Number(input.customer_rate??old.customer_rate),toJson(images),id);
 return find(id);
}
export const remove=(id)=>db.prepare('DELETE FROM articles WHERE id=?').run(id);
