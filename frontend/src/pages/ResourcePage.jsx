import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { usePermission } from '../context/PermissionContext';

function fieldConfigToInitial(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, field.type === 'checkbox' ? true : '']));
}

export default function ResourcePage({ title, subtitle, page, api, fields, columns = fields.map((field) => ({ key: field.name, label: field.label })), transformList, customForm, renderCell }) {
  const { canCreate, canEdit, canDelete } = usePermission();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(fieldConfigToInitial(fields));
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = async () => {
    try {
      const response = await api.list();
      const data = response.data?.data;
      const list = data?.items ?? data ?? response.data?.items ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Unable to load records.' });
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => Object.values(item).some((value) => String(value ?? '').toLowerCase().includes(needle)));
  }, [items, search]);

  const openCreate = () => {
    setForm(fieldConfigToInitial(fields));
    setModal({ mode: 'create' });
  };

  const openEdit = (item) => {
    const next = fieldConfigToInitial(fields);
    fields.forEach((field) => { next[field.name] = item[field.name] ?? (field.type === 'checkbox' ? false : ''); });
    setForm(next);
    setModal({ mode: 'edit', item });
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      let payload = { ...form };
      if (customForm?.preparePayload) payload = customForm.preparePayload(payload);
      if (modal.mode === 'create') await api.create(payload);
      else await api.update(modal.item.id, payload);
      setModal(null);
      setToast({ type: 'success', message: modal.mode === 'create' ? 'Record created.' : 'Record updated.' });
      await load();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || err.message || 'Save failed.' });
    } finally { setBusy(false); }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name || item.username || `record #${item.id}`}?`)) return;
    try {
      await api.remove(item.id);
      setToast({ type: 'success', message: 'Record deleted.' });
      await load();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Delete failed.' });
    }
  };

  return (
    <div className="page">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <PageHeader title={title} subtitle={subtitle} actions={canCreate(page) ? <button className="primary-button" onClick={openCreate}>+ Add {title.replace(/s$/, '')}</button> : null} />
      <div className="toolbar"><input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} /><span className="result-count">{filtered.length} records</span></div>
      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}{(canEdit(page) || canDelete(page)) && <th>Actions</th>}</tr></thead>
            <tbody>
              {!filtered.length && <tr><td colSpan={columns.length + 1}><div className="table-empty">No records found.</div></td></tr>}
              {filtered.map((item) => <tr key={item.id}>{columns.map((column) => <td key={column.key}>{renderCell ? renderCell(item, column.key) : String(item[column.key] ?? '—')}</td>)}{(canEdit(page) || canDelete(page)) && <td><div className="row-actions">{canEdit(page) && <button className="text-button" onClick={() => openEdit(item)}>Edit</button>}{canDelete(page) && <button className="danger-link" onClick={() => remove(item)}>Delete</button>}</div></td>}</tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {modal && <Modal title={`${modal.mode === 'create' ? 'Add' : 'Edit'} ${title.replace(/s$/, '')}`} onClose={() => setModal(null)} footer={<><button className="secondary-button" onClick={() => setModal(null)}>Cancel</button><button className="primary-button" form="resource-form" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></>}><form id="resource-form" className="form-grid" onSubmit={submit}>{customForm?.renderExtra?.({ form, setForm })}{fields.map((field) => <label key={field.name} className={field.full ? 'full' : ''}>{field.label}{field.type === 'select' ? <select value={form[field.name]} onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))} required={field.required}>{(field.options || []).map((option) => <option value={option.value ?? option} key={option.value ?? option}>{option.label ?? option}</option>)}</select> : field.type === 'textarea' ? <textarea value={form[field.name]} onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))} rows="4" required={field.required} /> : field.type === 'checkbox' ? <span className="check-wrap"><input type="checkbox" checked={Boolean(form[field.name])} onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.checked }))} /> Enabled</span> : <input type={field.type || 'text'} value={form[field.name]} onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))} required={field.required} />}</label>)}</form></Modal>}
    </div>
  );
}
