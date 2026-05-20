'use client'

export interface UploadOptions {
  folder?: string
  resourceType?: 'auto' | 'video' | 'raw'
  onProgress?: (pct: number) => void
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Works in the browser, shows real progress, no per-file size limit on free tier.
 *
 * Required env vars (add to .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 */
export function uploadFile(file: File, opts: UploadOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const preset    = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !preset) {
      reject(new Error('Cloudinary not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local'))
      return
    }

    const resourceType = opts.resourceType ?? 'auto'
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset)
    if (opts.folder) formData.append('folder', opts.folder)

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) {
        opts.onProgress?.(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText)
        resolve(res.secure_url as string)
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err?.error?.message ?? `Upload failed (${xhr.status})`))
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`))
        }
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

    xhr.open('POST', url)
    xhr.send(formData)
  })
}
