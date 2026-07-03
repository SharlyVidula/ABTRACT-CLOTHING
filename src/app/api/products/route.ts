import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Product } from '@/lib/models';
import { GARMENTS } from '@/lib/garments';

export async function GET() {
  try {
    await connectToDatabase();

    let products = await Product.find({}).sort({ _id: -1 });

    // Seed database if it is empty
    if (products.length === 0) {
      console.log('Product database is empty. Seeding defaults...');
      await Product.insertMany(GARMENTS);
      products = await Product.find({}).sort({ _id: -1 });
    }

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve products', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { action, product, id } = await req.json();

    if (!action) {
      return NextResponse.json({ success: false, error: 'Missing action parameter' }, { status: 400 });
    }

    await connectToDatabase();

    if (action === 'add') {
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product details required for addition' }, { status: 400 });
      }
      
      // Prevent duplicate IDs
      const existing = await Product.findOne({ id: product.id });
      if (existing) {
        return NextResponse.json({ success: false, error: 'Product with this ID already exists' }, { status: 409 });
      }

      const newProduct = new Product(product);
      await newProduct.save();
      return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
    }

    if (action === 'update') {
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product details required for update' }, { status: 400 });
      }

      const updated = await Product.findOneAndUpdate(
        { id: product.id },
        { $set: product },
        { new: true }
      );

      if (!updated) {
        return NextResponse.json({ success: false, error: 'Product to update not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, product: updated }, { status: 200 });
    }

    if (action === 'delete') {
      const targetId = id || (product && product.id);
      if (!targetId) {
        return NextResponse.json({ success: false, error: 'Product ID required for deletion' }, { status: 400 });
      }

      const deleted = await Product.findOneAndDelete({ id: targetId });
      if (!deleted) {
        return NextResponse.json({ success: false, error: 'Product to delete not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('Products write API error:', error);
    return NextResponse.json(
      { success: false, error: 'Write operation failed', details: error.message },
      { status: 500 }
    );
  }
}
