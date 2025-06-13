import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const token = process.env.ADMIN_TOKEN || 'admin-token-placeholder';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${backendUrl}/api/invoices/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          message: 'Invoice not found'
        }, { status: 404 });
      }
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    // Get the PDF data
    const pdfBuffer = await response.arrayBuffer();
    
    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
      },
    });

  } catch (error) {
    console.error('Error downloading invoice:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to download invoice',
      error: error.message
    }, { status: 500 });
  }
}
