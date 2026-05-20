import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const preset    = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !preset) {
    return NextResponse.json(
      { error: 'Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.' },
      { status: 500 }
    )
  }

  try {
    const incoming = await request.formData()
    const file   = incoming.get('file') as File | null
    const folder = incoming.get('folder') as string | null
    const resourceType = (incoming.get('resourceType') as string | null) ?? 'auto'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const body = new FormData()
    body.append('file', file)
    body.append('upload_preset', preset)
    if (folder) body.append('folder', folder)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: 'POST', body }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? `Cloudinary error (${res.status})` },
        { status: res.status }
      )
    }

    return NextResponse.json({ url: data.secure_url })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message ?? 'Upload failed' },
      { status: 500 }
    )
  }
}
