'use client'

import * as tus from 'tus-js-client'
import { createClient } from '@/utils/supabase/client'

export interface UploadOptions {
  bucket: string
  folder?: string
  onProgress?: (pct: number) => void
}

export function uploadFile(file: File, opts: UploadOptions): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { reject(new Error('Not authenticated')); return }

    const ext = file.name.split('.').pop()
    const name = `${opts.folder ? opts.folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

    const upload = new tus.Upload(file, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        'x-upsert': 'false',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: opts.bucket,
        objectName: name,
        contentType: file.type || 'application/octet-stream',
        cacheControl: '31536000',
      },
      chunkSize: 6 * 1024 * 1024, // 6 MB chunks — works for any total size
      onError(err) { reject(err) },
      onProgress(bytesUploaded, bytesTotal) {
        opts.onProgress?.(Math.round((bytesUploaded / bytesTotal) * 100))
      },
      onSuccess() {
        resolve(`${supabaseUrl}/storage/v1/object/public/${opts.bucket}/${name}`)
      },
    })

    upload.findPreviousUploads().then(prev => {
      if (prev.length) upload.resumeFromPreviousUpload(prev[0])
      upload.start()
    })
  })
}
