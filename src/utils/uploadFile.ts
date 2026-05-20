'use client'

export interface UploadOptions {
  folder?: string
  resourceType?: 'auto' | 'video' | 'raw'
  onProgress?: (pct: number) => void
}

/**
 * Upload a file via the /api/upload proxy (server → Cloudinary).
 * Routing through our own API avoids all browser CORS/signed-preset issues.
 * Progress reflects the client→server leg, which is the slow part.
 */
export function uploadFile(file: File, opts: UploadOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    if (opts.folder)       formData.append('folder', opts.folder)
    if (opts.resourceType) formData.append('resourceType', opts.resourceType)

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) {
        opts.onProgress?.(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText)
          resolve(res.url as string)
        } catch {
          reject(new Error('Invalid response from upload server'))
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err?.error ?? `Upload failed (${xhr.status})`))
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`))
        }
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error — check your connection and try again')))
    xhr.addEventListener('abort',  () => reject(new Error('Upload cancelled')))

    xhr.open('POST', '/api/upload')
    xhr.send(formData)
  })
}
