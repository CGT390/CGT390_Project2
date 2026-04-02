import prisma from '@/app/lib/prisma'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: any) {
  const searchParams = request.nextUrl.searchParams
  const title = searchParams.get('title') || ''
  const search = searchParams.get('search') || ''

  const profiles = await prisma.profile.findMany({
    ...(title
      ? { where: { title: { contains: title, mode: 'insensitive' } } }
      : {}),
    ...(search
      ? { where: { name: { contains: search, mode: 'insensitive' } } }
      : {}),
  })

  return Response.json({ data: profiles }, { status: 200 })
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    console.log('Form Data Received')

    const name = formData.get('name') as string | null
    const title = formData.get('title') as string | null
    const email = formData.get('email') as string | null
    const bio = formData.get('bio') as string | null
    const imgFile = formData.get('img') as File | null

    // ...other validations...

    console.log('Parsed Form Data:', { name, title, email, bio, imgFile })

    // Validate required fields
    if (!name || name.trim() === '') {
      return Response.json({ error: 'Name is required' }, { status: 400 })
    } else if (!title || title.trim() === '') {
      return Response.json({ error: 'Title is required' }, { status: 400 })
    } else if (!email || email.trim() === '') {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    } else if (!bio || bio.trim() === '') {
      return Response.json({ error: 'Bio is required' }, { status: 400 })
    } else if (!imgFile || !(imgFile instanceof File) || imgFile.size === 0) {
      return Response.json({ error: 'Image is required' }, { status: 400 })
    } else if (imgFile.size > 1024 * 1024) {
      return Response.json({ error: 'Image must be less than 1MB' }, { status: 400 })
    } else if (!imgFile || imgFile.size > 1024 * 1024) {
      return Response.json(
        { error: 'Image is required and must be less than 1MB' },
        { status: 400 }
      )
    }

    // Upload image
    const blob = await put(imgFile.name, imgFile, {
      access: 'public',
      allowOverwrite: true,
    })

    const created = await prisma.profile.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        email: email.trim(),
        bio: bio.trim(),
        image_url: blob.url,
      },
    })

    return Response.json({ data: created }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating profile:', error)

    if (error?.code === 'P2002') {
      return Response.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    return Response.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}