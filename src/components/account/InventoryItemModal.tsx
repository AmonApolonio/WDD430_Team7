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
  const [categories, setCategories] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isAdd = mode === 'add';

  // Load data on modal open
  React.useEffect(() => {
    if (open) {
      const loadData = async () => {
        setDataLoading(true);
        try {
          const [categoriesData, statusData] = await Promise.all([
            fetchCategoriesData(),
            fetchStatusOptions()
          ]);
          setCategories(categoriesData);
          setStatusOptions(statusData);

          if ((mode === 'view' || mode === 'edit') && itemId) {
            const fetchedItem = await fetchInventoryItemById(itemId);
            if (fetchedItem) {
              setItem(fetchedItem);
            }
          } else if (mode === 'add') {
            setItem({ ...emptyItem, id: Date.now().toString() });
          }
        } catch (error) {
          console.error('Error loading modal data:', error);
        } finally {
          setDataLoading(false);
        }
      };
      loadData();
    }
  }, [mode, itemId, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (["price", "stock", "views"].includes(name)) {
      setItem({ ...item, [name]: Number(value) });
    } else {
      setItem({ ...item, [name]: value });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let imagesArr: string[] = [];
      if (Array.isArray(item.images)) {
        imagesArr = item.images;
      } else {
        imagesArr = String(item.images).split(',').map((img) => img.trim()).filter(Boolean);
      }
      const newItem = { ...item, images: imagesArr };
      
      if (isEdit && itemId) {
        const result = await updateInventoryItemById(itemId, newItem);
        if (result) {
          onSuccess();
          onClose();
        } else {
          alert('Failed to update product. Please try again.');
        }
      } else if (isAdd) {
        await addInventoryItem(newItem);
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      if (error instanceof Error && error.message.includes('Authentication required')) {
        alert('Your session has expired. Please log out and log back in to continue.');
      } else {
        alert('Failed to save product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (itemId) {
      setLoading(true);
      try {
        const success = await deleteInventoryItem(itemId);
        if (success) {
          onSuccess();
          onClose();
        } else {
          alert('Failed to delete product. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (dataLoading) {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography>Loading...</Typography>
        </Box>
      </Modal>
    );
  }

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
