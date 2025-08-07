import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Pagination from '@mui/material/Pagination';
import { Badge } from '@mui/material';
import { InventoryData } from '@/types/seller';
import { fetchInventoryData, fetchCategoriesData, fetchStatusOptions, deleteInventoryItem } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import InventoryItemModal from './InventoryItemModal';

const InventoryTab: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryData[] | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categories, setCategories] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [modalItemId, setModalItemId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCategories(fetchCategoriesData());
    setStatusOptions(fetchStatusOptions());
  }, []);

  const refreshInventory = () => {
    const inventoryData = fetchInventoryData(
      search,
      pageIndex - 1,
      pageSize,
      categoryFilter === 'All Categories' ? undefined : categoryFilter,
      statusFilter === 'All Status' ? undefined : statusFilter
    );
    setInventory(inventoryData.items);
    setTotalCount(inventoryData.totalCount);
  };

  useEffect(() => {
    refreshInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, categoryFilter, statusFilter, search]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageIndex(value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageIndex(1);
    setPageSize(Number(event.target.value));
  };

  return (
    <div className="space-y-6">
      {/* Inventory Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Product Inventory</h2>
        <Button
          variant="filled"
          className="px-2 py-1 flex items-center gap-2"
          onClick={() => {
            setModalMode('add');
            setModalItemId(undefined);
            setModalOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span className="hidden sm:inline">Add New Product</span>
        </Button>
      </div>

      {/* Inventory Filters */}
      <div className="border-2 border-orange-300 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Search</label>
            <Input
              placeholder="Search products..."
              className="border-2 border-orange-300 rounded px-3 py-2 hover:border-orange-400"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setSearch(searchInput);
                  setPageIndex(1);
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Category</label>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="border-2 border-orange-300 rounded px-3 py-2 hover:border-orange-400 focus:outline-none focus:ring-1 focus:ring-[#ffad4f]"
              >
                <option>All Categories</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Status</label>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="border-2 border-orange-300 rounded px-3 py-2 hover:border-orange-400 focus:outline-none focus:ring-1 focus:ring-[#ffad4f]"
              >
                <option>All Status</option>
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Page Size</label>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border-2 border-orange-300 rounded px-3 py-2 hover:border-orange-400 focus:outline-none focus:ring-1 focus:ring-[#ffad4f]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product List - Desktop Table */}
      <div className="border-2 border-orange-300 hidden sm:block">
        <div className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b-2 border-orange-300 bg-orange-50 font-medium text-gray-700">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Views</div>
            <div className="col-span-2">Actions</div>
          </div>
          {/* Product Rows */}
          {inventory &&
            inventory.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-orange-300 items-center hover:bg-orange-100"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 border border-orange-300 rounded flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      style={{ width: '100%', height: '100%' }}
                      unoptimized={item.images[0].startsWith('data:')}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">Material: {item.material}</p>
                    <p className="text-sm text-gray-600">Dimensions: {item.dimensions}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge color="secondary">{item.category}</Badge>
                </div>
                <div className="col-span-1 font-medium">{formatCurrency(item.price)}</div>
                <div className="col-span-1">{item.stock}</div>
                <div className="col-span-1">
                  <Badge
                    color="secondary"
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="col-span-1">{item.views}</div>
                <div className="col-span-2 flex items-center gap-2">
                  <Button
                    className="flex items-center gap-1"
                    onClick={() => {
                      setModalMode('edit');
                      setModalItemId(item.id);
                      setModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} className="w-4 h-4 text-orange-400 hover:text-orange-500" />
                  </Button>
                  <Button
                    className="flex items-center gap-1 text-orange-400 hover:text-orange-500"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this item?')) {
                        deleteInventoryItem(item.id);
                        refreshInventory();
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Product List - Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-5">
        {inventory && inventory.length === 0 && (
          <div className="text-center text-gray-400 py-8">No products found.</div>
        )}
        {inventory &&
          inventory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-md border-2 border-orange-300"
            >
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    style={{ width: '100%', height: '100%' }}
                    unoptimized={item.images[0].startsWith('data:')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-base truncate">{item.name}</span>
                    <span className="text-xs font-medium text-gray-400 truncate">{item.category}</span>
                  </div>
                  <span className={`text-xs font-semibold ${item.status === 'Active' ? 'text-green-500' : item.status === 'Out of Stock' ? 'text-red-500' : 'text-yellow-500'}`}>{item.status}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                <span>SKU: {item.sku}</span>
                <span>Material: {item.material}</span>
                <span>Dim: {item.dimensions}</span>
              </div>
              <div className="flex justify-between items-center mt-1 px-1 text-sm">
                <span className="font-bold text-gray-900">{formatCurrency(item.price)}</span>
                <span className="text-gray-500">Stock: <span className="font-medium text-gray-700">{item.stock}</span></span>
                <span className="text-gray-500">Views: <span className="font-medium text-gray-700">{item.views}</span></span>
              </div>
              <div className="flex gap-2 mt-1 justify-end">
                <Button
                  className="w-9 h-9 flex items-center justify-center p-0 bg-gray-50 hover:bg-gray-100 text-gray-500 border-none shadow-none rounded-full"
                  onClick={() => {
                    setModalMode('edit');
                    setModalItemId(item.id);
                    setModalOpen(true);
                  }}
                  aria-label="Edit"
                >
                  <FontAwesomeIcon icon={faPen} className="w-5 h-5" />
                </Button>
                <Button
                  className="w-9 h-9 flex items-center justify-center p-0 bg-gray-50 hover:bg-red-50 text-red-500 border-none shadow-none rounded-full"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this item?')) {
                      deleteInventoryItem(item.id);
                      refreshInventory();
                    }
                  }}
                  aria-label="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          count={Math.ceil(totalCount / pageSize)}
          page={pageIndex}
          onChange={handlePageChange}
          color="primary"
          className="flex justify-center mt-4"
        />
      </div>
      {/* Inventory Item Modal */}
      <InventoryItemModal
        open={modalOpen}
        mode={modalMode}
        itemId={modalItemId}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          refreshInventory();
        }}
      />
    </div>
  );
};

export default InventoryTab;
