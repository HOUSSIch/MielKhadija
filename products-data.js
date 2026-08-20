const WHATSAPP_NUMBER = '21694323527';

function productWhatsApp(product) {
  const price = product.is_promo && product.promo_price ? product.promo_price : product.price;
  const message = `Bonjour Miel Khadija, je souhaite commander ${product.name} (${product.format} - ${price} DT). Pouvez-vous confirmer sa disponibilité ?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function catalogueCard(product, index) {
  const salePrice = product.is_promo && product.promo_price ? product.promo_price : product.price;
  const cartProduct = {...product, price: salePrice};
  return `<article class="catalogue-card">
    <span>${String(index + 1).padStart(2, '0')}</span>
    <div class="product-labels">${product.is_new ? '<b>Nouveau</b>' : ''}${product.is_promo ? '<b>Promo</b>' : ''}${product.is_featured ? '<b>Vedette</b>' : ''}</div>
    <img src="${product.image_url}" alt="${product.name}" loading="lazy">
    <div><small>${product.subtitle || ''}</small><h2>${product.name}</h2>
    <p>${product.format}${product.description ? ` · ${product.description}` : ''}</p>
    <footer><strong>${product.is_promo && product.promo_price ? `<s>${product.price}</s> ${product.promo_price}` : product.price} DT</strong><button class="add-cart" data-cart-product='${JSON.stringify(cartProduct).replaceAll("'", "&#39;")}'>Ajouter <b>+</b></button></footer></div>
  </article>`;
}

function homeCard(product, index) {
  const salePrice = product.is_promo && product.promo_price ? product.promo_price : product.price;
  const cartProduct = {...product, price: salePrice};
  return `<article class="product-card"><span class="product-index">N° ${String(index + 1).padStart(2, '0')}</span><div class="product-labels">${product.is_new ? '<b>Nouveau</b>' : ''}${product.is_promo ? '<b>Promo</b>' : ''}${product.is_featured ? '<b>Vedette</b>' : ''}</div><figure class="product-photo"><img src="${product.image_url}" alt="${product.name}" loading="lazy"><figcaption>Récolte Miel Khadija</figcaption></figure><h3>${product.name}</h3><p>${product.subtitle || product.format}</p><div class="product-buy"><strong>${product.is_promo && product.promo_price ? `<s>${product.price}</s> ${product.promo_price}` : product.price} DT</strong><button class="add-cart" data-cart-product='${JSON.stringify(cartProduct).replaceAll("'", "&#39;")}'>Ajouter au panier <span>+</span></button></div><small class="draft">${product.format}</small></article>`;
}

async function loadSupabaseProducts() {
  const grid = document.querySelector('.catalogue-grid');
  const home = document.querySelector('.products');
  if ((!grid && !home) || !window.mielSupabase) return;
  const { data, error } = await window.mielSupabase.from('products').select('*').eq('is_active', true).order('display_order');
  if (error || !data?.length) {
    grid?.classList.remove('products-loading');
    home?.classList.remove('products-loading');
    return;
  }
  if (grid) { grid.innerHTML = data.map(catalogueCard).join(''); window.dispatchEvent(new CustomEvent('catalogue:rendered')); }
  if (home) { home.innerHTML = data.slice(0, 6).map(homeCard).join(''); window.dispatchEvent(new CustomEvent('home-products:rendered')); }
  requestAnimationFrame(() => {
    grid?.classList.remove('products-loading');
    home?.classList.remove('products-loading');
  });
  const count = document.querySelector('[data-product-count]');
  if (count) count.textContent = `${data.length} produit${data.length > 1 ? 's' : ''}`;
  document.querySelectorAll('.view-all-products b').forEach(el => el.textContent = `${data.length} produits`);
}

document.addEventListener('DOMContentLoaded', loadSupabaseProducts);
