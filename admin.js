const db = window.mielSupabase;
const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const logoutButton = document.querySelector('#logout');
const dialog = document.querySelector('#product-dialog');
const form = document.querySelector('#product-form');
let products = [];

const fields = id => document.querySelector(`#${id}`);
function message(id, text, ok = false) { const el = fields(id); el.textContent = text; el.style.color = ok ? '#26734d' : '#9b321e'; }

async function showSession(session) {
  const logged = Boolean(session);
  loginPanel.hidden = logged; dashboard.hidden = !logged; logoutButton.hidden = !logged;
  if (logged) await loadProducts();
}

fields('login-form').addEventListener('submit', async event => {
  event.preventDefault(); message('login-message', 'Connexion…', true);
  const { error } = await db.auth.signInWithPassword({ email: fields('login-email').value, password: fields('login-password').value });
  if (error) message('login-message', 'E-mail ou mot de passe incorrect.');
});
logoutButton.addEventListener('click', () => db.auth.signOut());
db.auth.onAuthStateChange((_event, session) => showSession(session));
db.auth.getSession().then(({ data }) => showSession(data.session));

async function loadProducts() {
  const { data, error } = await db.from('products').select('*').order('display_order');
  if (error) { fields('product-list').innerHTML = `<p>Base non initialisée : ${error.message}</p>`; return; }
  products = data || [];
  fields('product-list').innerHTML = products.map(p => `<article class="admin-product"><button class="visibility-toggle ${p.is_active ? '' : 'off'}" data-toggle="${p.id}">${p.is_active ? 'Visible' : 'Masqué'}</button><img src="${p.image_url}" alt=""><div><h3>${p.name}</h3><p>${p.format} · ${p.is_promo && p.promo_price ? `<s>${p.price} DT</s> ${p.promo_price} DT` : `${p.price} DT`}</p><div class="product-badges">${p.is_new ? '<i>Nouveau</i>' : ''}${p.is_promo ? '<i>Promo</i>' : ''}${p.is_featured ? '<i>En vedette</i>' : ''}</div></div><button data-edit="${p.id}">Modifier</button></article>`).join('') || '<p>Aucun produit.</p>';
  document.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => openProduct(products.find(p => p.id === button.dataset.edit))));
  document.querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', async () => { const product=products.find(p=>p.id===button.dataset.toggle); button.disabled=true; const {error}=await db.from('products').update({is_active:!product.is_active}).eq('id',product.id); if(error) alert(error.message); await loadProducts(); }));
}

function openProduct(product = null) {
  form.reset(); fields('product-id').value = product?.id || ''; fields('form-title').textContent = product ? 'Modifier le produit' : 'Nouveau produit';
  ['name','subtitle','price','format','description'].forEach(key => fields(key).value = product?.[key.replace('-', '_')] ?? '');
  fields('promo-price').value = product?.promo_price ?? '';
  fields('display-order').value = product?.display_order ?? products.length + 1; fields('is-active').checked = product?.is_active ?? true;
  fields('is-new').checked = product?.is_new ?? false; fields('is-promo').checked = product?.is_promo ?? false; fields('is-featured').checked = product?.is_featured ?? false;
  fields('delete-product').hidden = !product; fields('image-preview').hidden = !product?.image_url;
  if (product?.image_url) fields('image-preview').src = product.image_url; message('form-message', ''); dialog.showModal();
}
fields('new-product').addEventListener('click', () => openProduct()); fields('close-dialog').addEventListener('click', () => dialog.close());
fields('image').addEventListener('change', () => { const file = fields('image').files[0]; if(file){fields('image-preview').src=URL.createObjectURL(file);fields('image-preview').hidden=false;} });

async function uploadImage(file) {
  if (!file) return null; if (file.size > 5 * 1024 * 1024) throw new Error('Image trop lourde (maximum 5 Mo).');
  const ext = file.name.split('.').pop().toLowerCase(); const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error; return db.storage.from('product-images').getPublicUrl(path).data.publicUrl;
}

form.addEventListener('submit', async event => {
  event.preventDefault(); message('form-message', 'Enregistrement…', true);
  try {
    const id = fields('product-id').value; const old = products.find(p => p.id === id); const uploaded = await uploadImage(fields('image').files[0]);
    const payload = { name:fields('name').value.trim(), subtitle:fields('subtitle').value.trim(), price:Number(fields('price').value), promo_price:fields('promo-price').value ? Number(fields('promo-price').value) : null, format:fields('format').value.trim(), description:fields('description').value.trim(), display_order:Number(fields('display-order').value), is_active:fields('is-active').checked, is_new:fields('is-new').checked, is_promo:fields('is-promo').checked, is_featured:fields('is-featured').checked, image_url:uploaded || old?.image_url };
    if (!payload.image_url) throw new Error('Ajoutez une image au produit.');
    const query = id ? db.from('products').update(payload).eq('id', id) : db.from('products').insert(payload); const { error } = await query; if(error) throw error;
    dialog.close(); await loadProducts();
  } catch(error) { message('form-message', error.message); }
});

fields('delete-product').addEventListener('click', async () => {
  const id = fields('product-id').value; if (!id || !confirm('Supprimer définitivement ce produit ?')) return;
  const { error } = await db.from('products').delete().eq('id', id); if(error){message('form-message',error.message);return;} dialog.close(); await loadProducts();
});
