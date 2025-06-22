import { useState, useRef, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { user } = useAuth();
  const { addAd, categories } = useData();
  const navigate = useNavigate();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
        window.innerWidth <= 768 ||
        'ontouchstart' in window;
      setIsMobile(isMobileDevice);
      console.log('Mobile detection:', {
        userAgent,
        isMobileDevice,
        screenWidth: window.innerWidth,
        hasTouch: 'ontouchstart' in window
      });
    };

    checkMobile();

    // Re-check on resize
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  // Test file input functionality on mobile
  const testFileInput = () => {
    console.log('Testing file input functionality...');
    const testInput = document.createElement('input');
    testInput.type = 'file';
    testInput.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
    testInput.style.display = 'none';

    testInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      console.log('Test file input result:', {
        files: target.files,
        fileCount: target.files?.length,
        firstFile: target.files?.[0],
        fileType: target.files?.[0]?.type,
        fileSize: target.files?.[0]?.size
      });
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const objectUrl = URL.createObjectURL(file);
        console.log('Test object URL created:', objectUrl);
        toast.success(`File input test successful! File: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

        // Clean up test object URL
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      } else {
        toast.error('File input test failed - no files selected');
      }
      document.body.removeChild(testInput);
    };

    document.body.appendChild(testInput);
    testInput.click();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    console.log('handleImageUpload triggered', {
      files: e.target.files,
      index,
      isMobile,
      userAgent: navigator.userAgent
    });

    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const maxFiles = 5;

      console.log('Files selected:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

      // Check file count
      if (formData.images.length + files.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed. You can upload ${maxFiles - formData.images.length} more.`);
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      const validPreviews: string[] = [];

      files.forEach((file, fileIndex) => {
        console.log(`Processing file ${fileIndex}:`, { name: file.name, size: file.size, type: file.type });

        // Check file size
        if (file.size > maxFileSize) {
          toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
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
          toast.error(`${file.name} (${fileSizeMB}MB) is too large. Maximum file size is 10MB.`);
          return;
        }

        validFiles.push(file);
        const objectUrl = URL.createObjectURL(file);
        validPreviews.push(objectUrl);
        console.log(`File ${file.name} validated successfully, created object URL:`, objectUrl);
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
      } else {
        console.log('No valid files found');
        toast.error('No valid images were selected. Please try again.');
      }
    } else {
      console.log('No files selected or files array is empty');
      if (isMobile) {
        toast.error('No image selected. Please try tapping the image area again.');
      }
    }

    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleImageClick = (index: number) => {
    console.log('Image click triggered for index:', index);
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  // Fallback for mobile devices that might have issues with file input
  const handleMobileImageUpload = (index: number) => {
    console.log('Mobile image upload triggered for index:', index);

    // Show user guidance first
    toast.info('Opening file manager... Please select an image from your gallery', {
      duration: 3000
    });

    // Remove any existing temporary inputs
    const existingInputs = document.querySelectorAll('input[data-mobile-upload]');
    existingInputs.forEach(input => document.body.removeChild(input));

    // Create a temporary file input for mobile
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
    tempInput.multiple = false;
    tempInput.style.display = 'none';
    tempInput.setAttribute('data-mobile-upload', 'true');
    tempInput.setAttribute('data-index', index.toString());

    // Add multiple event listeners to ensure we catch the change
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      console.log('Mobile file input change event triggered:', {
        files: target.files,
        fileCount: target.files?.length,
        index
      });

      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        console.log('File selected in mobile fallback:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        // Process the file directly here instead of calling handleImageUpload
        const maxFileSize = 10 * 1024 * 1024; // 10MB

        // Validate file
        if (file.size > maxFileSize) {
          toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
          return;
        }

        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file. Please upload JPG, PNG, GIF, or WebP files.`);
          return;
        }

        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file);
        console.log('Created object URL for mobile upload:', objectUrl);

        // Update state directly
        setFormData(prev => {
          const newImages = [...prev.images, file].slice(0, 5);
          console.log('Updated formData images:', newImages.length);
          return {
            ...prev,
            images: newImages
          };
        });

        setImagePreviews(prev => {
          const newPreviews = [...prev, objectUrl].slice(0, 5);
          console.log('Updated imagePreviews:', newPreviews.length);
          return newPreviews;
        });

        toast.success('Image uploaded successfully!');
        console.log('Mobile image upload completed successfully');
      } else {
        console.log('No files selected in mobile fallback');
        toast.error('No image selected. Please try again.');
      }

      // Clean up
      if (document.body.contains(tempInput)) {
        document.body.removeChild(tempInput);
      }
    };

    // Add multiple event listeners
    tempInput.addEventListener('change', handleFileChange);
    tempInput.onchange = handleFileChange;

    tempInput.oncancel = () => {
      console.log('File selection cancelled in mobile fallback');
      toast.info('File selection cancelled. You can try again.');
      if (document.body.contains(tempInput)) {
        document.body.removeChild(tempInput);
      }
    };

    // Add error handling
    tempInput.onerror = (e) => {
      console.error('Error in mobile file input:', e);
      toast.error('Error accessing file manager. Please try again.');
      if (document.body.contains(tempInput)) {
        document.body.removeChild(tempInput);
      }
    };

    document.body.appendChild(tempInput);

    // Trigger file selection immediately
    try {
      console.log('Attempting to click mobile file input...');
      tempInput.click();
      tempInput.focus();
      console.log('Mobile file input clicked successfully');
    } catch (error) {
      console.error('Error clicking mobile file input:', error);
      toast.error('Unable to open file manager. Please try again.');
      if (document.body.contains(tempInput)) {
        document.body.removeChild(tempInput);
      }
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
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
            toast.error('One or more images are too large. Maximum file size is 10MB per image.');
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Post a New Ad</h1>
        <p className="text-muted-foreground">Sell your items to your college community</p>
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

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                Location
              </h2>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground font-medium">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="On-Campus">On-Campus</SelectItem>
                    <SelectItem value="Off-Campus">Off-Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                Images
              </h2>
              <p className="text-sm text-muted-foreground">Upload clear photos of your item (max 5 images)</p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="aspect-square">
                    {imagePreviews[index] ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreviews[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
                          onError={(e) => {
                            console.error(`Error loading image ${index + 1}:`, e);
                            toast.error(`Failed to load image ${index + 1}. Please try again.`);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <label
                          className="w-full h-full border-2 border-dashed border-slate-500/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400/50 transition-colors bg-slate-700/30 active:bg-slate-600/50 touch-manipulation"
                          htmlFor={`image-upload-${index}`}
                          onClick={(e) => {
                            // For mobile devices, use the fallback mechanism
                            if (isMobile) {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Mobile click detected, calling handleMobileImageUpload');
                              handleMobileImageUpload(index);
                            }
                          }}
                        >
                          <Upload className="h-6 w-6 text-slate-400 mb-2" />
                          <span className="text-xs text-slate-400 text-center px-2">Add Image</span>
                        </label>
                        <input
                          id={`image-upload-${index}`}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          multiple={false}
                          onChange={(e) => {
                            console.log('Regular file input change event:', {
                              files: e.target.files,
                              isMobile
                            });
                            handleImageUpload(e, index);
                          }}
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          className="hidden"
                        />
                        {/* Direct button for mobile */}
                        {isMobile && (
                          <button
                            type="button"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Mobile button click detected');
                              // Try the regular file input first, then fallback to custom handler
                              if (fileInputRefs.current[index]) {
                                console.log('Using regular file input for mobile');
                                fileInputRefs.current[index]?.click();
                              } else {
                                console.log('Using custom mobile handler');
                                handleMobileImageUpload(index);
                              }
                            }}
                            aria-label="Upload image"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile-specific instructions */}
              <div className="text-xs text-muted-foreground bg-slate-700/30 p-3 rounded-lg">
                <p className="font-medium mb-1">📱 Mobile Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Make sure your images are under 10MB</li>
                  <li>• Tap the image area to open your phone's file manager</li>
                  <li>• Navigate to your photo gallery or downloads folder</li>
                  <li>• Select the image you want to upload</li>
                  <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                </ul>
              </div>

              {/* Debug panel for mobile troubleshooting */}


            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-600/50">
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="border-slate-600/50 hover:bg-slate-700/50">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? 'Posting...' : 'Post Ad'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
