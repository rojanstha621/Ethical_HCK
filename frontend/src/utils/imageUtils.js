/**
 * Converts Google Drive sharing links to direct image URLs
 * Supports various Google Drive URL formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view
 * 
 * IMPORTANT: For Google Drive images to display, the file must be:
 * 1. Shared publicly (Right-click → Get link → Set to "Anyone with the link can view")
 * 2. The direct URL format: https://drive.google.com/uc?export=view&id=FILE_ID
 */
export const convertDriveLinkToImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Trim whitespace
  url = url.trim();

  // Check if it's already a direct image URL (starts with http/https and doesn't need conversion)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Check if it's a Google Drive link
    if (url.includes('drive.google.com')) {
      let fileId = null;

      // Pattern 1: https://drive.google.com/file/d/FILE_ID/view or /edit
      const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match1) {
        fileId = match1[1];
      }

      // Pattern 2: https://drive.google.com/open?id=FILE_ID
      if (!fileId) {
        const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match2) {
          fileId = match2[1];
        }
      }

      // Pattern 3: https://drive.google.com/uc?id=FILE_ID (already in correct format, but extract ID)
      if (!fileId) {
        const match3 = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
        if (match3) {
          fileId = match3[1];
        }
      }

      // Pattern 4: https://drive.google.com/drive/folders/FOLDER_ID (folder link - not supported for images)
      // We'll skip this as it's a folder, not a file

      // If we found a file ID, convert to direct image URL
      if (fileId) {
        // Use thumbnail format first - it's more reliable than uc?export=view
        // The thumbnail API works better with shared files
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
      } else {
        console.warn('Could not extract file ID from Google Drive URL:', url);
      }
    }

    // If it's not a Google Drive link or we couldn't extract the ID, return as-is
    return url;
  }

  // If it's not a URL, return as-is
  return url;
};

/**
 * Converts an array of URLs (for galleries) to direct image URLs
 */
export const convertDriveLinksToImageUrls = (urls) => {
  if (!Array.isArray(urls)) {
    return urls;
  }
  return urls.map(url => convertDriveLinkToImageUrl(url));
};

