import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createProduct, deleteProduct, getCategories, getMyProducts, updateProduct } from "../services/productService";

const blank = { name: "", description: "", category_id: "", subcategory_id: "", price: "", brand: "", color: "", size: "", image: "", stock: "0" };

function SellerProducts() {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setProducts(await getMyProducts(token)); setCategories(await getCategories()); }
    catch (error) { showToast(error.response?.data?.message || "Could not load product management data.", "danger"); }
  };
  useEffect(() => { load(); }, [token]);

  const selectedCategory = categories.find((category) => String(category.id) === String(form.category_id));
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value, ...(event.target.name === "category_id" ? { subcategory_id: "" } : {}) });
  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    const payload = { ...form, subcategory_id: form.subcategory_id || null };
    try {
      editingId ? await updateProduct(token, editingId, payload) : await createProduct(token, payload);
      showToast(editingId ? "Product updated." : "Product created.", "success"); setForm(blank); setEditingId(null); await load();
    } catch (error) { showToast(error.response?.data?.message || "Please check the product details.", "danger"); }
    finally { setSaving(false); }
  };
  const edit = (product) => { setEditingId(product.id); setForm({ ...blank, ...product, category_id: String(product.category_id), subcategory_id: product.subcategory_id ? String(product.subcategory_id) : "" }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id) => { if (!window.confirm("Delete this product permanently?")) return; try { await deleteProduct(token, id); setProducts(products.filter((product) => product.id !== id)); showToast("Product deleted.", "success"); } catch (error) { showToast(error.response?.data?.message || "Could not delete product.", "danger"); } };

  if (!['SELLER', 'ADMIN'].includes(user?.role)) return <><Navbar /><main className="container py-5"><div className="alert alert-warning">A seller account is required to manage products.</div></main><Footer /></>;
  return <div className="app-page"><Navbar /><main className="container py-5">
    <div className="d-flex justify-content-between align-items-center mb-4"><div><span className="section-kicker">Seller workspace</span><h1 className="mt-2">Product Management</h1></div><Link className="btn btn-outline-primary" to="/seller/dashboard">Dashboard</Link></div>
    {!categories.length && <div className="alert alert-info d-flex justify-content-between align-items-center"><span>Create a category before adding your first product.</span><Link className="btn btn-sm btn-primary" to="/seller/categories">Manage Categories</Link></div>}
    <div className="card glass-card mb-4"><div className="card-body p-4"><h4>{editingId ? "Edit product" : "Add a product"}</h4><form onSubmit={submit} className="row g-3 mt-1">
      <div className="col-md-6"><input required name="name" className="form-control" placeholder="Product name" value={form.name} onChange={change} /></div><div className="col-md-3"><input required min="0" step="0.01" name="price" type="number" className="form-control" placeholder="Price (LKR)" value={form.price} onChange={change} /></div><div className="col-md-3"><input required min="0" name="stock" type="number" className="form-control" placeholder="Stock" value={form.stock} onChange={change} /></div>
      <div className="col-md-4"><select required name="category_id" className="form-select" value={form.category_id} onChange={change}><option value="">Select category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="col-md-4"><select name="subcategory_id" className="form-select" value={form.subcategory_id} onChange={change}><option value="">No subcategory</option>{selectedCategory?.subcategories?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div className="col-md-4"><input name="brand" className="form-control" placeholder="Brand (optional)" value={form.brand || ""} onChange={change} /></div>
      <div className="col-md-6"><input name="image" type="url" className="form-control" placeholder="Image URL (optional)" value={form.image || ""} onChange={change} /></div><div className="col-md-3"><input name="color" className="form-control" placeholder="Color" value={form.color || ""} onChange={change} /></div><div className="col-md-3"><input name="size" className="form-control" placeholder="Size" value={form.size || ""} onChange={change} /></div>
      <div className="col-12"><textarea name="description" className="form-control" placeholder="Description" rows="3" value={form.description || ""} onChange={change} /></div><div className="col-12"><button disabled={saving} className="btn btn-primary me-2">{saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}</button>{editingId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</button>}</div>
    </form></div></div>
    <div className="card glass-card"><div className="card-body p-4"><h4 className="mb-3">My products ({products.length})</h4><div className="table-responsive"><table className="table align-middle"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody>{products.map((p) => <tr key={p.id}><td><strong>{p.name}</strong><small className="d-block text-muted">{p.brand || "No brand"}</small></td><td>{p.category?.name}</td><td>Rs. {Number(p.price).toLocaleString("en-LK")}</td><td>{p.stock}</td><td className="text-end"><button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(p)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.id)}>Delete</button></td></tr>)}{!products.length && <tr><td colSpan="5" className="text-center text-muted py-4">No products yet. Create your first listing above.</td></tr>}</tbody></table></div></div></div>
  </main><Footer /></div>;
}

export default SellerProducts;
