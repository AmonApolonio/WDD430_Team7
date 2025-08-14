import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const authorId = searchParams.get('authorId');
    const targetId = searchParams.get('targetId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: {
      productId?: string;
      authorId?: string;
      targetId?: string;
    } = {};

    if (productId) where.productId = productId;
    if (authorId) where.authorId = authorId;
    if (targetId) where.targetId = targetId;

    const [reviews, total, averageRating] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: {
          rating: true,
        },
      }),
    ]);

    // Get rating breakdown if productId is specified
    let ratingBreakdown = null;
    if (productId) {
      const ratings = await prisma.review.groupBy({
        by: ['rating'],
        where: { productId },
        _count: {
          rating: true,
        },
      });

      ratingBreakdown = {
        1: ratings.find(r => r.rating === 1)?._count.rating || 0,
        2: ratings.find(r => r.rating === 2)?._count.rating || 0,
        3: ratings.find(r => r.rating === 3)?._count.rating || 0,
        4: ratings.find(r => r.rating === 4)?._count.rating || 0,
        5: ratings.find(r => r.rating === 5)?._count.rating || 0,
      };
    }

    return NextResponse.json({
      reviews: reviews.map(review => ({
        id: review.id,
        reviewerName: `${review.author.firstName} ${review.author.lastName}`,
        reviewerProfileImageUrl: review.author.profilePictureUrl,
        rating: review.rating,
        reviewDate: review.createdAt.toISOString(),
        reviewText: review.comment || '',
        title: review.title,
        isVerified: review.isVerified,
        isHelpful: review.isHelpful,
        product: review.product,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        averageRating: averageRating._avg.rating || 0,
        totalReviews: total,
        ratingBreakdown,
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { productId, rating, title, comment } = await request.json();

    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, sellerId: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Prevent users from reviewing their own products
    if (product.sellerId === currentUser.userId) {
      return NextResponse.json(
        { error: 'You cannot review your own product' },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_authorId: {
          productId,
          authorId: currentUser.userId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product (optional verification)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: currentUser.userId,
          status: {
            in: ['DELIVERED', 'CONFIRMED'], // Only allow reviews for delivered orders
          },
        },
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        authorId: currentUser.userId,
        targetId: product.sellerId,
        rating,
        title,
        comment,
        isVerified: !!hasPurchased,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Review created successfully',
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerified: review.isVerified,
        createdAt: review.createdAt,
        author: {
          id: review.author.id,
          name: `${review.author.firstName} ${review.author.lastName}`,
          profilePictureUrl: review.author.profilePictureUrl,
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}