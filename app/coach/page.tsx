'use client';
import React, { useState } from 'react';

export default function CoachPage() {
  const [prompt, setPrompt] = useState('Give me feedback on my last push day and plan my next week.');
  const [result, setResult] = useState<string>('');

  const runCoach = async () => {
    setResult('Thinking...');
    const res = await fetch('/api/ai/coach', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResult(data.output || 'No response');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">AI Coach</h2>
      <textarea className="border rounded p-2 w-full" rows={5} value={prompt} onChange={e=>setPrompt(e.target.value)} />
      <button className="border px-3 py-2 rounded" onClick={runCoach}>Run</button>
      <pre className="border rounded p-3 whitespace-pre-wrap">{result}</pre>
    </div>
  );
}
