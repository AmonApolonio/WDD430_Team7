import React, { Suspense, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { InventoryData } from '@/types/seller';
import {
  fetchInventoryItemById,
  updateInventoryItemById,
  addInventoryItem,
  deleteInventoryItem,
  fetchCategoriesData,
  fetchStatusOptions
} from '@/lib/api';

function createResource<T>(promise: Promise<T>) {
  let status = 'pending';
  let result: T;
  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result!;
    },
  };
}

interface InventoryItemModalProps {
  open: boolean;
  mode: 'view' | 'edit' | 'add';
  itemId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyItem: InventoryData = {
  id: '',
  name: '',
  price: 0,
  description: '',
  material: '',
  capacity: '',
  dimensions: '',
  care: '',
  seller: {
    name: '',
    memberSince: '',
    rating: 0,
    reviews: 0,
    profileImageUrl: '',
  },
  images: [],
  rating: 0,
  reviews: 0,
  isAddedToCart: false,
  stock: 0,
  status: '',
  sku: '',
  category: '',
  views: 0,
};


const categoriesResource = createResource(fetchCategoriesData());
const statusOptionsResource = createResource(fetchStatusOptions());

const InventoryItemModal: React.FC<InventoryItemModalProps> = (props) => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading item...</div>}>
      <InventoryItemModalContent {...props} />
    </Suspense>
  );
};

function InventoryItemModalContent({ open, mode, itemId, onClose, onSuccess }: InventoryItemModalProps) {
  const [item, setItem] = useState<InventoryData>(emptyItem);
  const [loading, setLoading] = useState(false);
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isAdd = mode === 'add';

  // Suspense data fetching
  const categories = categoriesResource.read();
  const statusOptions = statusOptionsResource.read();
  let fetchedItem: InventoryData | undefined = undefined;
  if ((mode === 'view' || mode === 'edit') && itemId) {
    const itemResource = createResource(fetchInventoryItemById(itemId));
    fetchedItem = itemResource.read();
  }

  React.useEffect(() => {
    if ((mode === 'view' || mode === 'edit') && itemId && fetchedItem) {
      setItem(fetchedItem);
    } else if (mode === 'add') {
      setItem({ ...emptyItem, id: Date.now().toString() });
    }
  }, [mode, itemId, open, fetchedItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["price", "stock", "views"].includes(name)) {
      setItem({ ...item, [name]: Number(value) });
    } else {
      setItem({ ...item, [name]: value });
    }
  };

  const handleSave = () => {
    setLoading(true);
    let imagesArr: string[] = [];
    if (Array.isArray(item.images)) {
      imagesArr = item.images;
    } else {
      imagesArr = String(item.images).split(',').map((img) => img.trim()).filter(Boolean);
    }
    const newItem = { ...item, images: imagesArr };
    if (isEdit && itemId) {
      updateInventoryItemById(itemId, newItem);
      setLoading(false);
      onSuccess();
      onClose();
    } else if (isAdd) {
      addInventoryItem(newItem);
      setLoading(false);
      onSuccess();
      onClose();
    }
  };

  const handleDelete = () => {
    if (itemId) {
      setLoading(true);
      deleteInventoryItem(itemId);
      setLoading(false);
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <Typography variant="h6" mb={2}>
          {isView && 'View Product'}
          {isEdit && 'Edit Product'}
          {isAdd && 'Add New Product'}
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Images (comma separated URLs)"
            name="images"
            value={Array.isArray(item.images) ? item.images.join(', ') : item.images}
            onChange={handleChange}
            disabled={isView}
            multiline
            minRows={1}
            helperText="Enter one or more image URLs separated by commas."
          />
          <TextField
            label="Name"
            name="name"
            value={item.name}
            onChange={handleChange}
            disabled={isView}
            required
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={item.price}
            onChange={handleChange}
            disabled={isView}
            required
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
            helperText="Enter the price in USD."
          />
          <TextField
            label="Description"
            name="description"
            value={item.description}
            onChange={handleChange}
            disabled={isView}
            multiline
            minRows={2}
          />
          <TextField
            label="Material"
            name="material"
            value={item.material}
            onChange={handleChange}
            disabled={isView}
            multiline
            minRows={1}
          />
          <TextField
            label="Capacity"
            name="capacity"
            value={item.capacity}
            onChange={handleChange}
            disabled={isView}
            multiline
            minRows={1}
          />
          <TextField
            label="Dimensions"
            name="dimensions"
            value={item.dimensions}
            onChange={handleChange}
            disabled={isView}
            multiline
            minRows={1}
          />
          <TextField
            label="Care"
            name="care"
            value={item.care}
            onChange={handleChange}
            disabled={isView}
            multiline
            minRows={1}
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={item.stock}
            onChange={handleChange}
            disabled={isView}
            required
          />
          <TextField
            label="Status"
            name="status"
            value={item.status}
            onChange={handleChange}
            select
            disabled={isView}
            required
          >
            {statusOptions.map((status: string) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="SKU"
            name="sku"
            value={item.sku}
            onChange={handleChange}
            disabled={isView}
            required
          />
          <TextField
            label="Category"
            name="category"
            value={item.category}
            onChange={handleChange}
            select
            disabled={isView}
            required
          >
            {categories.map((cat: string) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={onClose} color="inherit" disabled={loading}>Cancel</Button>
            {isView && isEdit && (
              <Button onClick={handleDelete} color="error" disabled={loading}>Delete</Button>
            )}
            {isEdit || isAdd ? (
              <Button onClick={handleSave} variant="contained" disabled={loading}>
                {isEdit ? 'Save' : 'Add'}
              </Button>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default InventoryItemModal;
