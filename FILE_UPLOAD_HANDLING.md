# File Upload Handling - Large Image Management

This document explains how the application handles file uploads, particularly for large images (>5MB), and the comprehensive error handling implemented.

## File Upload Limits

### Size Limits
- **Maximum file size**: 5MB per image
- **Maximum files**: 5 images per ad
- **Supported formats**: JPG, PNG, GIF, WebP

### Compression & Optimization
- **Automatic resizing**: Images are resized to max 800x800 pixels
- **Quality optimization**: Auto-compression with "good" quality
- **Format optimization**: Automatic format conversion for better compression
- **Metadata stripping**: Removes EXIF data to reduce file size

## Frontend Validation

### Real-time File Validation
The frontend validates files before upload:

1. **File Size Check**: Validates each file is under 5MB
2. **File Type Check**: Ensures only image files are selected
3. **File Count Check**: Limits to maximum 5 images
4. **User Feedback**: Shows file size in MB and validation status

### Error Messages
- `"File too large. Maximum file size is 5MB."`
- `"File is not an image file. Please upload JPG, PNG, GIF, or WebP files."`
- `"Maximum 5 images allowed. You can upload X more."`

### User Experience Features
- **File size display**: Shows file size in MB for each image
- **Remove functionality**: Users can remove individual images
- **Progress feedback**: Success/warning messages for uploads
- **Visual indicators**: Hover effects and remove buttons

## Backend Validation

### Multer Configuration
```javascript
limits: {
  fileSize: 5 * 1024 * 1024, // 5MB limit
  files: 5 // Max 5 files
}
```

### File Filter
- Validates MIME type starts with 'image/'
- Additional size check before upload
- Rejects non-image files with clear error message

### Error Handling Middleware
Custom error handling for different upload scenarios:

1. **LIMIT_FILE_SIZE**: File exceeds 5MB
2. **LIMIT_FILE_COUNT**: Too many files (>5)
3. **INVALID_FILE_TYPE**: Non-image file
4. **UPLOAD_ERROR**: Generic upload failure

## Error Response Format

All upload errors return consistent JSON responses:

```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "ERROR_CODE"
}
```

### Error Codes
- `FILE_TOO_LARGE`: File size exceeds 5MB
- `TOO_MANY_FILES`: More than 5 files uploaded
- `INVALID_FILE_TYPE`: Non-image file detected
- `UPLOAD_ERROR`: Generic upload failure

## Cloudinary Integration

### Automatic Optimization
- **Resizing**: 800x800 max dimensions
- **Compression**: Auto quality optimization
- **Format conversion**: Automatic format selection
- **Metadata removal**: Strips EXIF data

### Benefits
- Reduced storage costs
- Faster loading times
- Consistent image quality
- Better user experience

## User Interface Features

### Upload Area
- Drag-and-drop style interface
- Clear file size and format requirements
- Visual feedback for hover states

### Image Previews
- Grid layout with 3-5 columns
- File size display on each image
- Remove button on hover
- Progress counter (X of 5 images)

### Error Handling
- Toast notifications for errors
- Specific error messages for different issues
- Graceful degradation for invalid files
- Success confirmations for valid uploads

## Testing Scenarios

### Valid Uploads
- ✅ Images under 5MB
- ✅ Supported formats (JPG, PNG, GIF, WebP)
- ✅ Up to 5 images
- ✅ Mixed file types

### Invalid Uploads
- ❌ Files over 5MB
- ❌ Non-image files (PDF, DOC, etc.)
- ❌ More than 5 files
- ❌ Corrupted image files

### Edge Cases
- ⚠️ Large files with valid format
- ⚠️ Multiple files with some invalid
- ⚠️ Network interruptions during upload
- ⚠️ Browser compatibility issues

## Performance Considerations

### Memory Management
- Object URL cleanup when removing images
- Efficient file validation
- Minimal DOM manipulation

### Network Optimization
- File size validation before upload
- Automatic image compression
- Efficient error handling

### User Experience
- Immediate feedback for file selection
- Clear error messages
- Non-blocking validation
- Graceful error recovery

## Security Features

### File Validation
- MIME type checking
- File size limits
- File count limits
- Server-side validation

### Error Handling
- No sensitive information in error messages
- Consistent error response format
- Proper HTTP status codes
- Input sanitization

## Troubleshooting

### Common Issues
1. **"File too large" error**: Compress image or use smaller file
2. **"Invalid file type" error**: Ensure file is an image format
3. **Upload fails**: Check network connection and try again
4. **Preview not showing**: Refresh page and try again

### Debug Information
- Check browser console for detailed errors
- Verify file size in file properties
- Ensure file format is supported
- Check network tab for upload requests

## Future Enhancements

### Potential Improvements
- Drag-and-drop file upload
- Image cropping before upload
- Bulk image compression
- Upload progress indicators
- Retry mechanism for failed uploads
- Image quality selection options 