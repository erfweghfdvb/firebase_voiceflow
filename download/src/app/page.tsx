'use client';

import React, {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {removeDuplicateSentences} from '@/ai/flows/remove-duplicate-sentences';
import {extractData} from '@/ai/flows/extract-data';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  gap: '20px',
};

const cardStyle = {
  width: '100%',
  maxWidth: '800px',
};

const buttonStyle = {
  backgroundColor: '#008080',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
};

const animationStyle = {
  animation: 'fadeIn 0.5s ease-in-out',
};

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [processedText, setProcessedText] = useState('');

  const handleProcessText = async () => {
    if (!inputText) {
      alert('Please enter text to process.');
      return;
    }

    try {
      // First, remove duplicate sentences
      const duplicateResult = await removeDuplicateSentences({text: inputText});
      const dedupedText = duplicateResult.processedText;

      // Then, extract data from the de-duped text
      const extractionResult = await extractData({text: dedupedText});
      setProcessedText(JSON.stringify(extractionResult, null, 2)); // Format the JSON for readability

    } catch (error) {
      console.error('Error processing text:', error);
      alert('Failed to process text. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle>DupliText Eraser &amp; Data Extractor</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste or type your text here..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={10}
          />
          <Button onClick={handleProcessText}>
            Process Text
          </Button>
        </CardContent>
      </Card>

      <Separator style={{width: '100%', maxWidth: '800px'}} />

      <Card style={cardStyle}>
        <CardHeader>
          <CardTitle>Processed Text</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Processed text will appear here..."
            value={processedText}
            readOnly
            rows={10}
            style={animationStyle}
          />
        </CardContent>
      </Card>
    </div>
  );
}
