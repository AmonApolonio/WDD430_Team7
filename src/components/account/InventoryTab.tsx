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
          Add New Product
        </Button>
      </div>

      {/* Inventory Filters */}
      <div className="border-2 border-orange-300 p-4">
        <div className="flex items-end gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Search</label>
            <Input
              placeholder="Search products..."
              className="max-w-xs border-2 border-orange-300 rounded px-3 py-2 hover:border-orange-400"
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
          <div className="flex flex-col">
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
          <div className="flex flex-col">
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
          <div className="flex flex-col">
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

      {/* Product List */}
      <div className="border-2 border-orange-300">
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
                    className={`bg-${item.status === 'Active' ? 'green' : item.status === 'Out of Stock' ? 'red' : 'yellow'}-100 text-${item.status === 'Active' ? 'green' : item.status === 'Out of Stock' ? 'red' : 'yellow'}-800`}
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
