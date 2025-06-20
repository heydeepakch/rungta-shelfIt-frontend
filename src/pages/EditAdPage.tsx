import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Upload, IndianRupee, Tag, MapPin, Package, ArrowLeft, X } from 'lucide-react';
import { Ad } from '../contexts/DataContext';

export const EditAdPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { categories, fetchAdById, updateAd } = useData();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ad, setAd] = useState<Ad | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        location: '',
        status: 'active' as 'active' | 'sold' | 'pending'
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);

    useEffect(() => {
        const loadAd = async () => {
            if (id) {
                setLoading(true);
                const foundAd = await fetchAdById(id);
                if (foundAd) {
                    setAd(foundAd);
                    setFormData({
                        title: foundAd.title,
                        description: foundAd.description,
                        price: foundAd.price.toString(),
                        category: foundAd.category._id,
                        condition: foundAd.condition,
                        location: foundAd.location,
                        status: foundAd.status
                    });
                    setImagePreviews(foundAd.images);
                }
                setLoading(false);
            }
        };
        loadAd();
    }, [id, fetchAdById]);

    // Check if user is the owner of the ad
    useEffect(() => {
        if (ad && user && ad.seller._id !== user._id) {
            toast.error('You can only edit your own ads');
            navigate('/');
        }
    }, [ad, user, navigate]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxFileSize = 5 * 1024 * 1024; // 5MB
            const maxFiles = 5;

            // Check file count (existing + new)
            if (imagePreviews.length + newImages.length + files.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} images allowed. You can upload ${maxFiles - imagePreviews.length - newImages.length} more.`);
                return;
            }

            // Validate each file
            const validFiles: File[] = [];

            files.forEach((file) => {
                // Check file size
                if (file.size > maxFileSize) {
                    toast.error(`${file.name} is too large. Maximum file size is 5MB.`);
                    return;
                }

                // Check file type
                if (!file.type.startsWith('image/')) {
                    toast.error(`${file.name} is not an image file. Please upload JPG, PNG, GIF, or WebP files.`);
                    return;
                }

                validFiles.push(file);
            });

            // Update state with valid files only
            if (validFiles.length > 0) {
                setNewImages(prev => [...prev, ...validFiles]);
                toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added successfully!`);
            }
        }
    };

    const removeExistingImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        toast.success('Image removed');
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        toast.success('Image removed');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !ad) {
            toast.error('You must be logged in to edit an ad');
            return;
        }

        if (!formData.title || !formData.description || !formData.price || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            toast.error('Please enter a valid price');
            return;
        }

        setSaving(true);

        try {
            // Prepare update data
            const updateData: Partial<Ad> = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                condition: formData.condition,
                location: formData.location,
                status: formData.status
            };

            // If there are new images, we need to handle them differently
            // For now, we'll just update the text fields
            // TODO: Implement image upload/update functionality

            await updateAd(ad._id, updateData);

            toast.success('Ad updated successfully!');
            navigate(`/ad/${ad._id}`);
        } catch (error: any) {
            console.error('Error updating ad:', error);
            toast.error('Failed to update ad. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!ad) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad not found</h2>
                    <p className="text-gray-600 mb-4">The ad you're trying to edit doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/')} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/ad/${ad._id}`)}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Ad
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Ad</h1>
                <p className="text-sm sm:text-base text-gray-600">Update your listing information</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Item Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="e.g., Calculus Textbook - Stewart 8th Edition"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your item's condition, features, and why someone should buy it..."
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        {/* Price and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        className="pl-10"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.icon} {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Condition and Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="condition">Condition</Label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Select value={formData.condition} onValueChange={(value) => handleChange('condition', value)}>
                                        <SelectTrigger className="pl-10">
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Like New">Like New</SelectItem>
                                            <SelectItem value="Excellent">Excellent</SelectItem>
                                            <SelectItem value="Good">Good</SelectItem>
                                            <SelectItem value="Fair">Fair</SelectItem>
                                            <SelectItem value="Poor">Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Select value={formData.location} onValueChange={(value) => handleChange('location', value)}>
                                        <SelectTrigger className="pl-10">
                                            <SelectValue placeholder={user?.location || 'Select location'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Campus North">Campus North</SelectItem>
                                            <SelectItem value="Campus South">Campus South</SelectItem>
                                            <SelectItem value="Campus East">Campus East</SelectItem>
                                            <SelectItem value="Campus West">Campus West</SelectItem>
                                            <SelectItem value="Off-Campus">Off-Campus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value: 'active' | 'sold' | 'pending') => handleChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Current Images */}
                        {imagePreviews.length > 0 && (
                            <div className="space-y-2">
                                <Label>Current Images</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Current ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                title="Remove image"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {imagePreviews.length} current image{imagePreviews.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}

                        {/* Add New Images */}
                        <div className="space-y-2">
                            <Label htmlFor="images">Add New Images (Optional)</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <span className="text-blue-600 hover:text-blue-500 font-medium">
                                            Add more photos
                                        </span>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            multiple
                                        />
                                    </label>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Add up to 5 photos total (max 5MB each)
                                    </p>
                                </div>
                            </div>

                            {newImages.length > 0 && (
                                <div className="mt-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {newImages.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`New ${index + 1}`}
                                                    className="w-32 h-32 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    title="Remove image"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                                                    {((file.size) / (1024 * 1024)).toFixed(1)}MB
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {newImages.length} new image{newImages.length !== 1 ? 's' : ''} to add
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(`/ad/${ad._id}`)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}; 