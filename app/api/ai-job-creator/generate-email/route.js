import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);    // Extract form data with correct field names from the email form
    const {
      recipient,
      recipientRole,
      subject,
      context,
      purpose,
      tone,
      urgency,
      includeAttachments,
      attachmentDescription,
      followUpRequired,
      followUpDate,
      additionalNotes
    } = body;

    // Validate required fields
    if (!recipient || !subject || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: recipient, subject, context' },
        { status: 400 }
      );
    }    // Build the prompt for OpenAI
    const prompt = `Generate a professional email based on the following details:

Recipient: ${recipient}
Recipient Role/Title: ${recipientRole || 'N/A'}
Email Subject: ${subject}
Email Context: ${context}
Email Purpose: ${purpose}
Tone: ${tone || 'Professional'}
Urgency Level: ${urgency || 'Normal'}
Additional Notes: ${additionalNotes || 'N/A'}
${includeAttachments ? `Attachments: ${attachmentDescription}` : ''}

Requirements:
- Write a professional ${purpose} email
- Use a ${tone || 'professional'} tone
- Address the email to ${recipient}${recipientRole ? ` (${recipientRole})` : ''}
- Make it appropriate for the specified urgency level: ${urgency || 'normal'}
- Incorporate the provided context: ${context}
${additionalNotes ? `- Include these additional notes: ${additionalNotes}` : ''}
${includeAttachments ? `- Reference the attachments: ${attachmentDescription}` : ''}

Generate:
1. A clear, descriptive subject line (you can refine the provided subject: "${subject}")
2. A well-structured email body
3. Appropriate opening and closing`;

    let generatedEmail = '';
    let generatedSubject = '';

    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional HR email assistant. Generate clear, professional emails for job-related communications. Always provide both a subject line and email body.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';      // Parse the response to extract subject and body
      const subjectMatch = content.match(/Subject.*?:(.*?)(?:\n|$)/i);
      const bodyMatch = content.match(/(?:Email Body:|Body:)([\s\S]*?)(?:\n\n|$)/i) || 
                       content.match(/(?:Subject.*?\n)([\s\S]*)/i);

      generatedSubject = subjectMatch ? subjectMatch[1].trim() : subject;
      generatedEmail = bodyMatch ? bodyMatch[1].trim() : content;

      // Clean up the email content
      generatedEmail = generatedEmail
        .replace(/^(Email Body:|Body:)/i, '')
        .replace(/Subject.*?:/i, '')
        .trim();    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback email generation
      generatedSubject = subject;
      generatedEmail = `Dear ${recipient},

I hope this email finds you well. 

${context}

${additionalNotes ? `Additional information:\n${additionalNotes}\n\n` : ''}

${includeAttachments ? `Please find the attached ${attachmentDescription}.\n\n` : ''}

Please let me know if you have any questions or need further information.

Best regards,
[Your Name]`;
    }    // Prepare metadata
    const metadata = {
      generatedAt: new Date().toISOString(),
      purpose,
      tone,
      urgency,
      includeAttachments: includeAttachments || false,
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
      recipientRole: recipientRole || null
    };

    // Return the response in the expected format
    return NextResponse.json({
      success: true,
      data: {
        email: generatedEmail,
        subject: generatedSubject,
        recipient: recipient,
        rawText: generatedEmail,
        metadata: metadata
      }
    });

  } catch (error) {
    console.error('Email generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}