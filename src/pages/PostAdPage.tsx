import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Upload, IndianRupee, Tag, MapPin, Package, ArrowLeft } from 'lucide-react';

export const PostAdPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    images: [] as File[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { user } = useAuth();
  const { addAd, categories } = useData();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const maxFiles = 5;

      // Check file count
      if (formData.images.length + files.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed. You can upload ${maxFiles - formData.images.length} more.`);
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      const validPreviews: string[] = [];

      files.forEach((file, index) => {
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

        // Check file size in MB for user-friendly message
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        if (file.size > maxFileSize) {
          toast.error(`${file.name} (${fileSizeMB}MB) is too large. Maximum file size is 5MB.`);
          return;
        }

        validFiles.push(file);
        validPreviews.push(URL.createObjectURL(file));
      });

      // Update state with valid files only
      if (validFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...validFiles].slice(0, maxFiles)
        }));

        setImagePreviews(prev => [...prev, ...validPreviews].slice(0, maxFiles));

        if (validFiles.length < files.length) {
          toast.warning(`${validFiles.length} of ${files.length} files were uploaded. Some files were skipped due to size or type restrictions.`);
        } else {
          toast.success(`${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploaded successfully!`);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });

    toast.success('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to post an ad');
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

    setIsLoading(true);

    try {
      const adFormData = new FormData();
      adFormData.append('title', formData.title);
      adFormData.append('description', formData.description);
      adFormData.append('price', formData.price);
      adFormData.append('category', formData.category);
      adFormData.append('condition', formData.condition || 'Good');
      adFormData.append('location', formData.location || user.location);
      adFormData.append('college', user.college);

      formData.images.forEach(image => {
        adFormData.append('images', image);
      });

      await addAd(adFormData);

      toast.success('Your ad has been posted successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error posting ad:', error);

      // Handle specific upload errors
      if (error.response?.data?.error) {
        const errorData = error.response.data;
        switch (errorData.error) {
          case 'FILE_TOO_LARGE':
            toast.error('One or more images are too large. Maximum file size is 5MB per image.');
            break;
          case 'TOO_MANY_FILES':
            toast.error('Too many images. Maximum 5 images allowed.');
            break;
          case 'INVALID_FILE_TYPE':
            toast.error('One or more files are not valid images. Please upload JPG, PNG, GIF, or WebP files.');
            break;
          case 'UPLOAD_ERROR':
            toast.error('Image upload failed. Please try again with smaller files.');
            break;
          default:
            toast.error(errorData.message || 'Failed to post ad. Please try again.');
        }
      } else {
        toast.error('Failed to post ad. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Post New Ad</h1>
        <p className="text-sm sm:text-base text-gray-600">Create a new listing for your college community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
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

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500 font-medium">
                      Upload photos
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
                    Add up to 5 photos (max 5MB each) to help your item sell faster
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                          {((formData.images[index]?.size || 0) / (1024 * 1024)).toFixed(1)}MB
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {imagePreviews.length} of 5 images uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Posting...' : 'Post Ad'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
