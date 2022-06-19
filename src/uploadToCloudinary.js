/**
 * @param {string} url
 */
function removeTrailingSlash(url) {
  if (url.endsWith('/')) {
    return url.substring(0, url.length - 1);
  }
  return url;
}

const cloudName = 'lost-and-found-startup';
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const unsignedPreset = 'mobile-uploads';

/**
 * @returns {Promise<string?>} url of the hosted image, or null if error
 */
export default async function uploadToCloudinary(filedata) {
  const formData = new FormData();
  formData.append('file', filedata);
  formData.append('upload_preset', unsignedPreset);

  // return 'todo-delete-me-debug-url'

  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    const url = json.url;
    return removeTrailingSlash(url);
  } catch (err) {
    return (console.error(err), null);
  }
}
