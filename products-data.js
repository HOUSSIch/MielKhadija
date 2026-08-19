const WHATSAPP_NUMBER = '21694323527';

function productWhatsApp(product) {
  const message = `Bonjour Miel Khadija, je souhaite commander ${product.name} (${product.format} - ${product.price} DT). Pouvez-vous confirmer sa disponibilité ?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function catalogueCard(product, index) {
  return `<article class="catalogue-card">
    <span>${String(index + 1).padStart(2, '0')}</span>
    <img src="${product.image_url}" alt="${product.name}" loading="lazy">
    <div><small>${product.subtitle || ''}</small><h2>${product.name}</h2>
    <p>${product.format}${product.description ? ` · ${product.description}` : ''}</p>
    <footer><strong>${product.price} DT</strong><a href="${productWhatsApp(product)}" target="_blank" rel="noopener">Commander <b>↗</b></a></footer></div>
  </article>`;
}

async function loadCatalogueProducts() {
  const grid = document.querySelector('.catalogue-grid');
  if (!grid || !window.mielSupabase) return;
  const { data, error } = await window.mielSupabase.from('products').select('*').eq('is_active', true).order('display_order');
  if (error || !data?.length) return;
  grid.innerHTML = data.map(catalogueCard).join('');
  const count = document.querySelector('[data-product-count]');
  if (count) count.textContent = `${data.length} produit${data.length > 1 ? 's' : ''}`;
  window.dispatchEvent(new CustomEvent('catalogue:rendered'));
}

document.addEventListener('DOMContentLoaded', loadCatalogueProducts);
