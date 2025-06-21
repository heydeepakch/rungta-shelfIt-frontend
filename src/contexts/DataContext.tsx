import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Ad {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: string;
  images: string[];
  seller: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  location: string;
  datePosted: string;
  status: 'active' | 'sold' | 'pending';
  views: number;
  college: string;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface DataContextType {
  ads: Ad[];
  categories: Category[];
  loading: boolean;
  addAd: (ad: FormData) => Promise<void>;
  updateAd: (id: string, updates: Partial<Ad>) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  getAdsByUser: (userId: string) => Promise<Ad[]>;
  searchAds: (query: string, categoryFilter?: string) => Promise<Ad[]>;
  incrementViews: (adId: string) => Promise<void>;
  fetchAds: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAdById: (adId: string) => Promise<Ad | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api';

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/ads`);
      setAds(data);
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdById = useCallback(async (adId: string): Promise<Ad | null> => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/ads/${adId}`);
      return data;
    } catch (error) {
      console.error('Error fetching ad:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
    fetchCategories();
  }, [fetchAds, fetchCategories]);

  const addAd = useCallback(async (adData: FormData) => {
    try {
      const { data } = await axios.post(`${API_URL}/ads`, adData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAds(prevAds => [...prevAds, data]);
    } catch (error) {
      console.error('Error adding ad:', error);
      throw error;
    }
  }, []);

  const updateAd = useCallback(async (id: string, updates: Partial<Ad>) => {
    try {
      const { data } = await axios.put(`${API_URL}/ads/${id}`, updates);
      setAds(prevAds => prevAds.map(ad => (ad._id === id ? data : ad)));
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  }, []);

  const deleteAd = useCallback(async (id: string) => {
    try {
      await axios.delete(`${API_URL}/ads/${id}`);
      setAds(prevAds => prevAds.filter(ad => ad._id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  }, []);

  const getAdsByUser = useCallback(async (userId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/ads/user/${userId}`);
      return data;
    } catch (error) {
      console.error('Error getting ads by user:', error);
      return [];
    }
  }, []);

  const searchAds = useCallback(async (query: string, categoryFilter?: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/ads`, {
        params: { keyword: query, category: categoryFilter },
      });
      return data;
    } catch (error) {
      console.error('Error searching ads:', error);
      return [];
    }
  }, []);

  const incrementViews = useCallback(async (adId: string) => {
    try {
      await axios.put(`${API_URL}/ads/${adId}`, { $inc: { views: 1 } });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }, []);

  const value = React.useMemo(() => ({
    ads,
    categories,
    loading,
    addAd,
    updateAd,
    deleteAd,
    getAdsByUser,
    searchAds,
    incrementViews,
    fetchAds,
    fetchCategories,
    fetchAdById,
  }), [ads, categories, loading, addAd, updateAd, deleteAd, getAdsByUser, searchAds, incrementViews, fetchAds, fetchCategories, fetchAdById]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
