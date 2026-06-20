import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SUGGESTIONS_FILE = path.join(process.cwd(), 'suggestions.json');

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.text || typeof data.text !== 'string' || data.text.trim() === '') {
      return NextResponse.json(
        { error: 'Suggestion text is required' },
        { status: 400 }
      );
    }

    // Read existing suggestions
    let suggestions = [];
    try {
      const fileData = await fs.readFile(SUGGESTIONS_FILE, 'utf-8');
      if (fileData.trim()) {
        suggestions = JSON.parse(fileData);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
      // If file doesn't exist, it's fine, we start with empty array
    }

    // Add new suggestion
    const newSuggestion = {
      id: Date.now().toString(),
      text: data.text.trim(),
      timestamp: new Date().toISOString()
    };

    suggestions.push(newSuggestion);

    // Save back to file
    await fs.writeFile(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2), 'utf-8');

    return NextResponse.json({ success: true, suggestion: newSuggestion }, { status: 201 });
  } catch (error) {
    console.error('Failed to process suggestion:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
