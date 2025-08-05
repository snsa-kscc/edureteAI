import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'No code provided'
      }, { status: 400 });
    }

    // Determine the environment and target URL
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLocal = process.env.VERCEL_ENV === undefined;
    
    let targetUrl: string;
    
    if (isDevelopment && isLocal) {
      // Local development - try FastAPI server first, fallback to Vercel function
      targetUrl = 'http://localhost:8000/generate-graph';
      
      try {
        const fastApiResponse = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
          // Short timeout for FastAPI check
          signal: AbortSignal.timeout(5000)
        });
        
        if (fastApiResponse.ok) {
          const result = await fastApiResponse.json();
          return NextResponse.json(result);
        }
      } catch (fastApiError) {
        console.log('FastAPI server not available, falling back to Vercel function...');
      }
      
      // Fallback to local Vercel function
      targetUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/py/generate-graph`;
    } else {
      // Production or Vercel environment
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : request.url.split('/api/')[0];
      
      targetUrl = `${baseUrl}/api/py/generate-graph`;
    }

    // Call the Python function
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      // Longer timeout for actual processing
      signal: AbortSignal.timeout(30000)
    });

    const result = await response.json();
    
    // Return the result with appropriate status code
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }

  } catch (error) {
    console.error('Error in generate-graph API:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      traceback: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Graph generation API is running',
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL_ENV || 'local',
    endpoints: {
      development: 'http://localhost:8000/generate-graph (FastAPI) or /api/py/generate-graph (Vercel)',
      production: '/api/py/generate-graph (Vercel Python runtime)'
    }
  });
}
