import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { measurements, garment, size } = await req.json();

    if (!measurements || !garment || !size) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
    }

    const prompt = `
      You are an expert AI fashion advisor and sizing specialist for a premium couture brand.
      Analyze the customer's body measurements alongside the catalog garment specifications to determine the best size recommendation and provide a detailed fit and feel analysis.

      Customer Body Measurements:
      - Height: ${measurements.height} cm
      - Chest: ${measurements.chest} cm
      - Waist: ${measurements.waist} cm
      - Hips: ${measurements.hips} cm
      - Inseam: ${measurements.inseam} cm

      Garment Details:
      - Name: ${garment.name}
      - Category: ${garment.category}
      - Description: ${garment.description}
      - Fabric & Material Technical Details: ${garment.technicalDetails.join(', ')}
      - Size Guide Dimensions: ${JSON.stringify(garment.sizes)}
      - Selected Size: ${size}

      1. Identify which catalog size (S, M, L, XL) is the optimal recommendation for the customer's chest, waist, and hips.
      2. Generate a detailed "Fit & Feel" review. Describe how the garment's specific fabrics (e.g. heavy cotton, silk, knit mesh) will drape, feel, and fit on their physical proportions. Keep this review luxurious, styling-focused, and 3-4 sentences long.
      3. Provide a comparison of how the fit and feel will change if they:
         - Size Down: what happens if they wear one size smaller than the selected size.
         - Selected Size: detail the fit and feel of the currently selected size.
         - Size Up: what happens if they wear one size larger than the selected size.

      Respond ONLY with a valid JSON object matching this schema:
      {
        "recommendedSize": "S" | "M" | "L" | "XL",
        "fitAndFeel": "Detailed paragraph explaining the fit and fabric feel on their body proportions.",
        "sizeComparisons": {
          "sizeDown": "Short, clear description of the fit/drape if they size down.",
          "selected": "Short, clear description of the fit/drape of the selected size.",
          "sizeUp": "Short, clear description of the fit/drape if they size up."
        }
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' }
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(responseText.trim());

    return NextResponse.json({
      success: true,
      recommendedSize: parsed.recommendedSize,
      fitAndFeel: parsed.fitAndFeel,
      sizeComparisons: parsed.sizeComparisons,
      externalApiTriggered: true,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Fit simulation error:', error);
    return NextResponse.json(
      { error: 'Failed to simulate fit' },
      { status: 500 }
    );
  }
}
