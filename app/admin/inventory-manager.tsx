'use client';

import { useState, type FormEvent } from 'react';
import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  LogOut,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import type { EquipmentItem } from '../data/equipment';

const blankItem: EquipmentItem = {
  slug: '',
  year: new Date().getFullYear(),
  make: '',
  model: '',
  title: '',
  category: 'Excavators',
  price: 0,
  priceLabel: '$0',
  hours: null,
  availability: 'For Sale',
  status: 'Available',
  image: '',
  alt: '',
  description: '',
  featured: false,
  published: true,
  sortOrder: 0,
};

export default function InventoryManager({
  initialItems,
  userName,
  signOutHref,
}: {
  initialItems: EquipmentItem[];
  userName: string;
  signOutHref: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<{ item: EquipmentItem; isNew: boolean } | null>(null);
  const [notice, setNotice] = useState('');
  const [busySlug, setBusySlug] = useState('');

  const visibleItems = items.filter((item) => {
    const search = query.trim().toLowerCase();
    return !search || [item.title, item.make, item.model, item.category, item.status]
      .join(' ')
      .toLowerCase()
      .includes(search);
  });
  const publishedCount = items.filter((item) => item.published !== false).length;
  const availableCount = items.filter((item) => item.status === 'Available').length;
  const featuredCount = items.filter((item) => item.featured).length;

  function upsertItem(item: EquipmentItem, previousSlug?: string) {
    setItems((current) => {
      const match = previousSlug || item.slug;
      const exists = current.some((candidate) => candidate.slug === match);
      return exists
        ? current.map((candidate) => candidate.slug === match ? item : candidate)
        : [item, ...current];
    });
  }

  async function toggleVisibility(item: EquipmentItem) {
    setBusySlug(item.slug);
    setNotice('');
    try {
      const response = await fetch(`/api/admin/equipment/${encodeURIComponent(item.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, published: item.published === false }),
      });
      const data = await response.json() as { item: EquipmentItem; error?: string };
      if (!response.ok) throw new Error(data.error || 'Unable to update visibility.');
      upsertItem(data.item, item.slug);
      setNotice(data.item.published ? 'Listing published.' : 'Listing hidden from the public site.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to update visibility.');
    } finally {
      setBusySlug('');
    }
  }

  async function removeItem(item: EquipmentItem) {
    if (!window.confirm(`Permanently remove “${item.title}”? This cannot be undone.`)) return;
    setBusySlug(item.slug);
    setNotice('');
    try {
      const response = await fetch(`/api/admin/equipment/${encodeURIComponent(item.slug)}`, { method: 'DELETE' });
      const data = await response.json() as { deleted?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error || 'Unable to remove the listing.');
      setItems((current) => current.filter((candidate) => candidate.slug !== item.slug));
      setNotice('Listing removed.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to remove the listing.');
    } finally {
      setBusySlug('');
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="admin-brand" href="/"><span>G</span><div><strong>Gordon Machinery</strong><small>Inventory Manager</small></div></a>
        <div className="admin-account"><span>{userName}</span><a href={signOutHref}><LogOut size={16} /> Sign out</a></div>
      </header>

      <div className="admin-main">
        <section className="admin-title-row">
          <div><p className="eyebrow">Inventory Manager</p><h1>Equipment</h1><p>Add machines, update availability and control what appears on the public site.</p></div>
          <div className="admin-title-actions">
            <a className="admin-secondary-button" href="/equipment" target="_blank" rel="noreferrer">View public inventory <ArrowUpRight size={16} /></a>
            <button className="button" type="button" onClick={() => setEditor({ item: blankItem, isNew: true })}><Plus size={18} /> Add Machine</button>
          </div>
        </section>

        <section className="admin-stats" aria-label="Inventory summary">
          <div><PackageCheck size={20} /><span><strong>{items.length}</strong>Total machines</span></div>
          <div><Eye size={20} /><span><strong>{publishedCount}</strong>Published</span></div>
          <div><Check size={20} /><span><strong>{availableCount}</strong>Available</span></div>
          <div><Star size={20} /><span><strong>{featuredCount}</strong>Featured</span></div>
        </section>

        <section className="admin-list-panel">
          <div className="admin-list-toolbar">
            <div><h2>All Equipment</h2><p>{items.length} {items.length === 1 ? 'listing' : 'listings'}</p></div>
            <label className="admin-search"><Search size={17} /><span className="sr-only">Search inventory</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search equipment" /></label>
          </div>

          {notice && <p className="admin-notice" role="status">{notice}</p>}

          <div className="admin-equipment-list">
            {visibleItems.map((item) => (
              <article className="admin-equipment-row" key={item.slug}>
                <img src={item.image} alt="" />
                <div className="admin-equipment-name"><span>{item.category}</span><strong>{item.title}</strong><small>{item.year} · {item.hours ? `${item.hours.toLocaleString()} hours` : 'Hours not listed'}</small></div>
                <strong className="admin-row-price">{item.priceLabel}</strong>
                <span className={`admin-status admin-status-${item.status.toLowerCase()}`}>{item.status}</span>
                <span className={`admin-visibility ${item.published === false ? 'is-hidden' : ''}`}>{item.published === false ? <EyeOff size={14} /> : <Eye size={14} />}{item.published === false ? 'Hidden' : 'Published'}</span>
                <div className="admin-row-actions">
                  <button type="button" disabled={busySlug === item.slug} onClick={() => setEditor({ item, isNew: false })} aria-label={`Edit ${item.title}`}><Pencil size={16} /></button>
                  <button type="button" disabled={busySlug === item.slug} onClick={() => toggleVisibility(item)} aria-label={item.published === false ? `Publish ${item.title}` : `Hide ${item.title}`}>{item.published === false ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button className="danger" type="button" disabled={busySlug === item.slug} onClick={() => removeItem(item)} aria-label={`Remove ${item.title}`}><Trash2 size={16} /></button>
                </div>
              </article>
            ))}
            {!visibleItems.length && <div className="admin-empty"><Search size={26} /><strong>No matching equipment</strong><span>Try another search.</span></div>}
          </div>
        </section>
      </div>

      {editor && (
        <EquipmentEditor
          key={`${editor.isNew ? 'new' : 'edit'}-${editor.item.slug}`}
          item={editor.item}
          isNew={editor.isNew}
          onClose={() => setEditor(null)}
          onSaved={(item) => {
            upsertItem(item, editor.isNew ? undefined : editor.item.slug);
            setEditor(null);
            setNotice(editor.isNew ? 'Machine added to inventory.' : 'Listing updated.');
          }}
        />
      )}
    </main>
  );
}

function EquipmentEditor({ item, isNew, onClose, onSaved }: {
  item: EquipmentItem;
  isNew: boolean;
  onClose: () => void;
  onSaved: (item: EquipmentItem) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [primaryPreview, setPrimaryPreview] = useState(item.image);
  const [alternatePreview, setAlternatePreview] = useState(item.alternateImage || '');

  async function upload(file: File) {
    const body = new FormData();
    body.set('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body });
    const data = await response.json() as { url?: string; error?: string };
    if (!response.ok) throw new Error(data.error || 'Image upload failed.');
    if (!data.url) throw new Error('Image upload failed.');
    return data.url;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const primaryFile = form.get('primaryFile');
      const alternateFile = form.get('alternateFile');
      const image = primaryFile instanceof File && primaryFile.size ? await upload(primaryFile) : String(form.get('image') || '');
      const alternateImage = alternateFile instanceof File && alternateFile.size ? await upload(alternateFile) : String(form.get('alternateImage') || '');
      const payload = {
        slug: form.get('slug'),
        title: form.get('title'),
        year: Number(form.get('year')),
        make: form.get('make'),
        model: form.get('model'),
        category: form.get('category'),
        price: Number(form.get('price')),
        hours: form.get('hours') ? Number(form.get('hours')) : null,
        availability: form.get('availability'),
        status: form.get('status'),
        description: form.get('description'),
        image,
        alternateImage,
        alt: form.get('alt'),
        featured: form.get('featured') === 'on',
        published: form.get('published') === 'on',
        sortOrder: Number(form.get('sortOrder') || 0),
      };
      const endpoint = isNew ? '/api/admin/equipment' : `/api/admin/equipment/${encodeURIComponent(item.slug)}`;
      const response = await fetch(endpoint, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json() as { item: EquipmentItem; error?: string };
      if (!response.ok) throw new Error(data.error || 'Unable to save the listing.');
      onSaved(data.item);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save the listing.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-editor-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <aside className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <div className="admin-editor-header"><div><span>{isNew ? 'New Listing' : 'Edit Listing'}</span><h2 id="editor-title">{isNew ? 'Add a Machine' : item.title}</h2></div><button type="button" onClick={onClose} aria-label="Close editor"><X size={21} /></button></div>
        <form onSubmit={submit}>
          <div className="admin-form-section">
            <h3>Machine information</h3>
            <div className="admin-field-grid">
              <label className="wide">Listing title<input name="title" defaultValue={item.title} placeholder="2022 Vermeer SC70TX" required /></label>
              <label>Year<input name="year" type="number" min="1900" max="2100" defaultValue={item.year} required /></label>
              <label>Make<input name="make" defaultValue={item.make} placeholder="Vermeer" required /></label>
              <label>Model<input name="model" defaultValue={item.model} placeholder="SC70TX" required /></label>
              <label>Category<input name="category" list="equipment-categories" defaultValue={item.category} required /><datalist id="equipment-categories"><option>Excavators</option><option>Backhoe Loaders</option><option>Stump Grinders</option><option>Loaders</option><option>Forestry Equipment</option><option>Other Equipment</option></datalist></label>
              <label>Price ($)<input name="price" type="number" min="0" step="1" defaultValue={item.price} required /></label>
              <label>Hours<input name="hours" type="number" min="0" step="1" defaultValue={item.hours ?? ''} placeholder="Optional" /></label>
              <label>Sale or rental<select name="availability" defaultValue={item.availability}><option>For Sale</option><option>Rental Available</option></select></label>
              <label>Status<select name="status" defaultValue={item.status}><option>Available</option><option>Pending</option><option>Sold</option><option>Rented</option></select></label>
              <label>Display order<input name="sortOrder" type="number" step="1" defaultValue={item.sortOrder || 0} /></label>
              <label className="wide">Listing URL<input name="slug" defaultValue={item.slug} placeholder="Created automatically from the title" /></label>
              <label className="wide">Description<textarea name="description" rows={4} defaultValue={item.description} required /></label>
            </div>
          </div>

          <div className="admin-form-section">
            <h3>Photos</h3>
            <div className="admin-photo-grid">
              <PhotoField label="Primary photo" name="primaryFile" urlName="image" preview={primaryPreview} currentUrl={item.image} onPreview={setPrimaryPreview} required />
              <PhotoField label="Alternate photo" name="alternateFile" urlName="alternateImage" preview={alternatePreview} currentUrl={item.alternateImage || ''} onPreview={setAlternatePreview} />
            </div>
            <label className="admin-alt-field">Photo description<input name="alt" defaultValue={item.alt} placeholder="Describe the machine shown" /></label>
          </div>

          <div className="admin-form-section admin-publish-options">
            <label><input name="published" type="checkbox" defaultChecked={item.published !== false} /><span><strong>Publish on website</strong><small>Turn this off to save a private draft.</small></span></label>
            <label><input name="featured" type="checkbox" defaultChecked={Boolean(item.featured)} /><span><strong>Feature on homepage</strong><small>Featured machines appear in the homepage equipment section.</small></span></label>
          </div>

          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <div className="admin-editor-footer"><button className="admin-secondary-button" type="button" onClick={onClose}>Cancel</button><button className="button" type="submit" disabled={saving}>{saving ? 'Saving…' : isNew ? 'Add Machine' : 'Save Changes'}</button></div>
        </form>
      </aside>
    </div>
  );
}

function PhotoField({ label, name, urlName, preview, currentUrl, onPreview, required = false }: {
  label: string;
  name: string;
  urlName: string;
  preview: string;
  currentUrl: string;
  onPreview: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="admin-photo-field">
      <span>{label}</span>
      <label className="admin-photo-drop">
        {preview ? <img src={preview} alt="" /> : <ImagePlus size={25} />}
        <strong>{preview ? 'Choose a different photo' : 'Upload a photo'}</strong>
        <small>JPG, PNG, WebP or AVIF · up to 8 MB</small>
        <input name={name} type="file" accept="image/jpeg,image/png,image/webp,image/avif" required={required && !currentUrl} onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onPreview(URL.createObjectURL(file));
        }} />
      </label>
      <label className="admin-url-field">Or paste an image URL<input name={urlName} defaultValue={currentUrl} onChange={(event) => { if (event.target.value) onPreview(event.target.value); }} /></label>
    </div>
  );
}
