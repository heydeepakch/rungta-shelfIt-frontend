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
            // Find the category object by ID
            const categoryObj = categories.find(cat => cat._id === formData.category);

            // Prepare update data
            const updateData: Partial<Ad> = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                category: categoryObj!,
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
                    <h2 className="text-2xl font-bold text-foreground mb-2">Ad not found</h2>
                    <p className="text-muted-foreground mb-4">The ad you're trying to edit doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/')} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Edit Ad</h1>
                <p className="text-muted-foreground">Update your listing information</p>
            </div>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-foreground font-medium">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., MacBook Pro 2021, Chemistry Textbook"
                                        className="bg-slate-700/50 border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-foreground font-medium">Price (₹) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="500"
                                        min="0"
                                        className="bg-slate-700/50 border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-foreground font-medium">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your item in detail..."
                                    rows={4}
                                    className="bg-slate-700/50 border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-foreground font-medium">Category *</Label>
                                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20">
                                            <SelectValue placeholder="Select a category" />
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

                                <div className="space-y-2">
                                    <Label htmlFor="condition" className="text-foreground font-medium">Condition *</Label>
                                    <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                                        <SelectTrigger className="bg-slate-700/50 border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20">
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="Like New">Like New</SelectItem>
                                            <SelectItem value="Excellent">Excellent</SelectItem>
                                            <SelectItem value="Good">Good</SelectItem>
                                            <SelectItem value="Fair">Fair</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Current Images */}
                        {imagePreviews.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                                    <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                                    Current Images
                                </h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Current ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded-lg border border-slate-600/50"
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
                                <p className="text-sm text-muted-foreground">
                                    {imagePreviews.length} current image{imagePreviews.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}

                        {/* Add New Images */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                                Add New Images (Optional)
                            </h2>
                            <div className="border-2 border-dashed border-slate-500/50 rounded-lg p-6 text-center hover:border-blue-400/50 transition-colors bg-slate-700/30">
                                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                <div className="mt-4">
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <span className="text-blue-400 hover:text-blue-300 font-medium">
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
                                    <p className="text-sm text-slate-400">
                                        Add up to 5 photos (max 5MB each) to help your item sell faster
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Supported formats: JPG, PNG, GIF, WebP
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2">
                                        {imagePreviews.length} of 5 images uploaded
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
                                                    className="w-32 h-32 object-cover rounded-lg border border-slate-600/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    title="Remove image"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-400 mt-2">
                                        {newImages.length} new image{newImages.length !== 1 ? 's' : ''} to add
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-600/50">
                            <Button type="button" variant="outline" onClick={() => navigate(`/ad/${ad._id}`)} className="border-slate-600/50 hover:bg-slate-700/50">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}; 