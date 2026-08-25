import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createCategory, createSubcategory, deleteCategory, deleteSubcategory, getCategories, updateCategory } from "../services/productService";

function AdminCategories() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [subcategoryNames, setSubcategoryNames] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const loadCategories = async () => {
    try { setCategories(await getCategories()); }
    catch (error) { showToast(error.response?.data?.message || "Could not load categories.", "danger"); }
  };
  useEffect(() => { loadCategories(); }, [token]);

  const addCategory = async (event) => {
    event.preventDefault(); setIsSaving(true);
    try { await createCategory(token, { name, icon: icon || null }); setName(""); setIcon(""); await loadCategories(); showToast("Category created.", "success"); }
    catch (error) { showToast(error.response?.data?.message || "Could not create category.", "danger"); }
    finally { setIsSaving(false); }
  };
  const renameCategory = async (category) => {
    const nextName = window.prompt("Category name", category.name);
    if (!nextName?.trim() || nextName.trim() === category.name) return;
    try { await updateCategory(token, category.id, { name: nextName.trim(), icon: category.icon || null }); await loadCategories(); showToast("Category updated.", "success"); }
    catch (error) { showToast(error.response?.data?.message || "Could not update category.", "danger"); }
  };
  const removeCategory = async (category) => {
    if (!window.confirm(`Delete ${category.name}? Its subcategories and products will also be deleted.`)) return;
    try { await deleteCategory(token, category.id); await loadCategories(); showToast("Category deleted.", "success"); }
    catch (error) { showToast(error.response?.data?.message || "Could not delete category.", "danger"); }
  };
  const addSubcategory = async (event, categoryId) => {
    event.preventDefault(); const subcategoryName = subcategoryNames[categoryId]?.trim(); if (!subcategoryName) return;
    try { await createSubcategory(token, categoryId, subcategoryName); setSubcategoryNames({ ...subcategoryNames, [categoryId]: "" }); await loadCategories(); showToast("Subcategory created.", "success"); }
    catch (error) { showToast(error.response?.data?.message || "Could not create subcategory.", "danger"); }
  };
  const removeSubcategory = async (subcategory) => {
    if (!window.confirm(`Delete ${subcategory.name}?`)) return;
    try { await deleteSubcategory(token, subcategory.id); await loadCategories(); showToast("Subcategory deleted.", "success"); }
    catch (error) { showToast(error.response?.data?.message || "Could not delete subcategory.", "danger"); }
  };

  return <div className="app-page"><Navbar /><main className="container py-5"><div className="d-flex justify-content-between align-items-center mb-4"><div><span className="section-kicker">Catalog setup</span><h1 className="mt-2">Category Management</h1></div><Link className="btn btn-outline-primary" to="/seller/products">Product Management</Link></div>
    <div className="card shadow-sm border-0 mb-4"><div className="card-body p-4"><h5>Add Category</h5><form className="row g-3 mt-1" onSubmit={addCategory}><div className="col-md-7"><input required className="form-control" placeholder="Category name" value={name} onChange={(event) => setName(event.target.value)} /></div><div className="col-md-3"><input className="form-control" placeholder="Icon (optional)" value={icon} onChange={(event) => setIcon(event.target.value)} /></div><div className="col-md-2"><button disabled={isSaving} className="btn btn-primary w-100">Add Category</button></div></form></div></div>
    <div className="row g-4">{categories.map((category) => <div className="col-md-6" key={category.id}><div className="card shadow-sm border-0 h-100"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-start"><h5>{category.icon} {category.name}</h5><div><button className="btn btn-sm btn-outline-primary me-2" onClick={() => renameCategory(category)}>Rename</button><button className="btn btn-sm btn-outline-danger" onClick={() => removeCategory(category)}>Delete</button></div></div><hr /><p className="text-muted small mb-2">Subcategories</p>{category.subcategories?.length ? <div className="d-flex flex-wrap gap-2 mb-3">{category.subcategories.map((subcategory) => <span className="badge bg-light text-dark border" key={subcategory.id}>{subcategory.name} <button className="btn-close ms-1" style={{ fontSize: "0.55rem" }} onClick={() => removeSubcategory(subcategory)} aria-label={`Delete ${subcategory.name}`} /></span>)}</div> : <p className="text-muted small">No subcategories yet.</p>}<form className="input-group input-group-sm" onSubmit={(event) => addSubcategory(event, category.id)}><input className="form-control" placeholder="New subcategory" value={subcategoryNames[category.id] || ""} onChange={(event) => setSubcategoryNames({ ...subcategoryNames, [category.id]: event.target.value })} /><button className="btn btn-outline-primary">Add</button></form></div></div></div>)}</div>
    {!categories.length && <div className="card shadow-sm border-0 text-center p-5"><h5>No categories available</h5><p className="text-muted mb-0">Create a category above before sellers add products.</p></div>}
  </main><Footer /></div>;
}

export default AdminCategories;
