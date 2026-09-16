export const PRODUCT_PLACEHOLDER = `${import.meta.env.BASE_URL}images/products/placeholder.svg`;

export function productImageSource(image) {
  if (!image) return PRODUCT_PLACEHOLDER;
  if (/^https?:\/\//i.test(image)) return image;
  return `${import.meta.env.BASE_URL}${String(image).replace(/^\/+/, "")}`;
}

export function useProductImageFallback(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = PRODUCT_PLACEHOLDER;
}
