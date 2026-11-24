import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';
import {
  Package,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  AlertTriangle,
  History,
  Layers,
  Edit2,
  Trash2,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewTab, setViewTab] = useState<'products' | 'transactions'>('products');

  // Add / Edit Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'HAIRCARE',
    supplier: 'L’Oréal India Professional',
    purchasePrice: 800,
    sellingPrice: 1400,
    stockQuantity: 20,
    minStockLevel: 5,
  });

  // Stock In / Out Modal
  const [stockModalType, setStockModalType] = useState<'IN' | 'OUT' | null>(null);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [stockQuantity, setStockQuantity] = useState(5);
  const [stockReason, setStockReason] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      let query = `/products?`;
      if (categoryFilter !== 'ALL') query += `category=${categoryFilter}&`;
      if (search) query += `search=${encodeURIComponent(search)}&`;

      const [prodRes, txnRes] = await Promise.all([
        api.get<{ success: boolean; data: Product[] }>(query),
        api.get<{ success: boolean; data: any[] }>('/inventory/transactions'),
      ]);

      if (prodRes.success) setProducts(prodRes.data);
      if (txnRes.success) setTransactions(txnRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [categoryFilter]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productForm);
      } else {
        await api.post('/products', productForm);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleStockAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct) return;
    try {
      const endpoint = stockModalType === 'IN' ? '/inventory/stock-in' : '/inventory/stock-out';
      await api.post(endpoint, {
        productId: targetProduct._id,
        quantity: stockQuantity,
        reason: stockReason,
      });
      setStockModalType(null);
      setTargetProduct(null);
      fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Stock adjustment failed');
    }
  };

  const categories = ['ALL', 'HAIRCARE', 'SKINCARE', 'TREATMENT', 'NAILS', 'COLOR', 'STYLING'];

  const lowStockCount = products.filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-salon-border">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
            Inventory & Stock Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor salon products, suppliers, minimum stock thresholds, and warehouse restocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-salon-border rounded-full p-1 bg-white">
            <button
              onClick={() => setViewTab('products')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                viewTab === 'products' ? 'bg-brand text-text-primary' : 'text-text-muted'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setViewTab('transactions')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                viewTab === 'transactions' ? 'bg-brand text-text-primary' : 'text-text-muted'
              }`}
            >
              Stock Log
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingProduct(null);
              setProductForm({
                name: '',
                sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
                category: 'HAIRCARE',
                supplier: 'L’Oréal India Professional',
                purchasePrice: 800,
                sellingPrice: 1400,
                stockQuantity: 20,
                minStockLevel: 5,
              });
              setIsProductModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Low stock warning banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-card bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{lowStockCount} products</strong> have reached minimum threshold levels and require restocking.
            </span>
          </div>
          <span className="font-mono font-bold text-amber-800">Action Required</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card variant="white" className="p-4 border border-salon-border">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand text-text-primary shadow-subtle'
                    : 'bg-surface-bone text-text-secondary hover:bg-surface-bone/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              placeholder="Search product or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs rounded-full border border-salon-border bg-white px-4 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              onClick={fetchInventory}
              className="p-2 rounded-full bg-surface-dark text-white hover:bg-black"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      {viewTab === 'products' ? (
        <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Product Name & SKU</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Cost (Buy)</th>
                  <th>Price (Sell)</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                  <th className="text-right px-4">Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-salon-border">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-bone/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-text-primary">{p.name}</p>
                      <span className="font-mono text-[10px] text-text-muted">{p.sku}</span>
                    </td>
                    <td>
                      <Badge variant="muted" size="sm">{p.category}</Badge>
                    </td>
                    <td className="text-text-secondary">{p.supplier}</td>
                    <td className="font-mono">{formatCurrency(p.purchasePrice)}</td>
                    <td className="font-mono font-bold text-text-primary">{formatCurrency(p.sellingPrice)}</td>
                    <td>
                      <span className="font-mono font-bold text-text-primary">{p.stockQuantity}</span>
                      <span className="text-[10px] text-text-muted block">Min: {p.minStockLevel}</span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(p.status)}`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-right px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          title="Stock In"
                          onClick={() => {
                            setTargetProduct(p);
                            setStockModalType('IN');
                            setStockQuantity(5);
                            setStockReason('Supplier Restock');
                          }}
                          className="px-2 py-1 rounded bg-brand text-text-primary font-bold text-[10px] hover:bg-brand-hover flex items-center gap-1"
                        >
                          <ArrowDownRight className="w-3 h-3" />
                          <span>In</span>
                        </button>
                        <button
                          title="Stock Out"
                          onClick={() => {
                            setTargetProduct(p);
                            setStockModalType('OUT');
                            setStockQuantity(1);
                            setStockReason('Used in client service');
                          }}
                          className="px-2 py-1 rounded bg-surface-bone text-text-secondary font-bold text-[10px] hover:bg-zinc-200 flex items-center gap-1"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Out</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductForm({
                              name: p.name,
                              sku: p.sku,
                              category: p.category,
                              supplier: p.supplier,
                              purchasePrice: p.purchasePrice,
                              sellingPrice: p.sellingPrice,
                              stockQuantity: p.stockQuantity,
                              minStockLevel: p.minStockLevel,
                            });
                            setIsProductModalOpen(true);
                          }}
                          className="p-1 text-text-muted hover:text-text-primary"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Transactions Log View */
        <Card variant="white" className="p-0 overflow-hidden border border-salon-border shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-bone border-b border-salon-border text-text-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                  <th>Audited By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-salon-border">
                {transactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-surface-bone/40 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-text-muted">{formatDate(txn.date)}</td>
                    <td className="font-bold text-text-primary">{txn.productName}</td>
                    <td className="font-mono text-[11px]">{txn.sku}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        txn.type === 'STOCK_IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-text-primary">{txn.quantity} units</td>
                    <td className="text-text-secondary">{txn.reason}</td>
                    <td className="text-text-muted font-mono text-[10px]">{txn.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Stock In / Out Modal */}
      <Modal
        isOpen={!!stockModalType}
        onClose={() => setStockModalType(null)}
        title={stockModalType === 'IN' ? 'Stock In (Restock)' : 'Stock Out (Consumption)'}
        subtitle={`${targetProduct?.name} (${targetProduct?.sku}) • Current: ${targetProduct?.stockQuantity} units`}
      >
        <form onSubmit={handleStockAction} className="space-y-4">
          <Input
            label="Quantity Units *"
            type="number"
            min={1}
            max={stockModalType === 'OUT' ? targetProduct?.stockQuantity : 1000}
            required
            value={stockQuantity}
            onChange={(e) => setStockQuantity(Number(e.target.value))}
          />

          <Input
            label="Reason / Notes *"
            required
            placeholder={stockModalType === 'IN' ? 'Shipment received from supplier' : 'Used for bridal package hair wash'}
            value={stockReason}
            onChange={(e) => setStockReason(e.target.value)}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setStockModalType(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm Stock Update
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Edit Inventory Product' : 'Add New Salon Product'}
        subtitle="Catalog product metadata, supplier, and inventory alert levels"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Product Name *"
            required
            placeholder="e.g. Olaplex No. 3 Hair Perfector"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="SKU Identifier *"
              required
              placeholder="OLA-PRF-001"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Category
              </label>
              <select
                className="w-full rounded-full border border-salon-border px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand min-h-[44px]"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              >
                {categories.filter((c) => c !== 'ALL').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Supplier *"
            required
            placeholder="L’Oréal India Professional"
            value={productForm.supplier}
            onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Purchase Cost (₹)"
              type="number"
              value={productForm.purchasePrice}
              onChange={(e) => setProductForm({ ...productForm, purchasePrice: Number(e.target.value) })}
            />
            <Input
              label="Selling Price (₹)"
              type="number"
              value={productForm.sellingPrice}
              onChange={(e) => setProductForm({ ...productForm, sellingPrice: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Initial Stock Quantity"
              type="number"
              value={productForm.stockQuantity}
              onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
            />
            <Input
              label="Minimum Alert Threshold"
              type="number"
              value={productForm.minStockLevel}
              onChange={(e) => setProductForm({ ...productForm, minStockLevel: Number(e.target.value) })}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
            <Button variant="outline" type="button" onClick={() => setIsProductModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
