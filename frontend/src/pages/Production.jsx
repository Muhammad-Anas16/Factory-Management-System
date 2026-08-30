import ResourcePage from './ResourcePage';
import { productionApi } from '../api/resources';

export default function Production() {
  return <ResourcePage title="Production" subtitle="Record production by article/style, quantity and date." page="production" api={productionApi} fields={[{ name: 'article_id', label: 'Article ID', required: true }, { name: 'quantity', label: 'Quantity', type: 'number', required: true }, { name: 'production_date', label: 'Production date', type: 'date', required: true }, { name: 'notes', label: 'Notes', type: 'textarea', full: true }]} columns={[{ key: 'id', label: 'ID' }, { key: 'article_name', label: 'Article' }, { key: 'article_id', label: 'Article ID' }, { key: 'quantity', label: 'Quantity' }, { key: 'production_date', label: 'Date' }, { key: 'created_at', label: 'Created' }]} />;
}
