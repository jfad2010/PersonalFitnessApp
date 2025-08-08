'use client';
import React, { useState } from 'react';

type SetRow = { weight?: number; reps?: number; rpe?: number; isWarmup?: boolean };
type ExerciseRow = { name: string; muscleGroup?: string; sets: SetRow[]; restSec?: number; tempo?: string };

import { queueRequest } from '@/lib/offlineQueue';

export default function SessionForm() {
  const [name, setName] = useState('Push Day');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<ExerciseRow[]>([
    { name: 'Bench Press', muscleGroup: 'Chest', restSec: 120, sets: [{weight: 60, reps: 8},{weight: 60, reps: 8},{weight: 60, reps: 8}] },
  ]);

  const addExercise = () => setExercises([...exercises, { name: '', sets: [{}, {}] }]);

  const addSet = (idx: number) => {
    const clone = exercises.slice();
    clone[idx].sets.push({});
    setExercises(clone);
  };

  const submit = async () => {
    const payload = { name, notes, exercises };
    if (!navigator.onLine) {
      await queueRequest('/api/sessions', 'POST', payload);
      alert('Saved offline, will sync when online');
      return;
    }
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) alert('Failed to save');
    else alert('Saved');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Log Session</h2>
      <div className="grid gap-2">
        <label className="text-sm">Session Name</label>
        <input className="border p-2 rounded" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Notes</label>
        <textarea className="border p-2 rounded" value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>
      {exercises.map((ex, i) => (
        <div key={i} className="border rounded p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Exercise name" className="border p-2 rounded" value={ex.name} onChange={e=>{
              const clone = exercises.slice(); clone[i].name = e.target.value; setExercises(clone);
            }} />
            <input placeholder="Muscle group" className="border p-2 rounded" value={ex.muscleGroup || ''} onChange={e=>{
              const clone = exercises.slice(); clone[i].muscleGroup = e.target.value; setExercises(clone);
            }} />
          </div>
          <div className="grid grid-cols-4 gap-2 items-center">
            <input placeholder="Rest (sec)" className="border p-2 rounded" value={ex.restSec || ''} onChange={e=>{
              const clone = exercises.slice(); clone[i].restSec = Number(e.target.value||0); setExercises(clone);
            }} />
            <input placeholder="Tempo (e.g., 3-1-2)" className="border p-2 rounded" value={ex.tempo || ''} onChange={e=>{
              const clone = exercises.slice(); clone[i].tempo = e.target.value; setExercises(clone);
            }} />
            <div className="col-span-2">
              <button className="border px-3 py-2 rounded w-full" onClick={()=>addSet(i)}>+ Add set</button>
            </div>
          </div>
          <div className="space-y-2">
            {ex.sets.map((s, j) => (
              <div key={j} className="grid grid-cols-4 gap-2">
                <input placeholder="Weight" className="border p-2 rounded" value={s.weight ?? ''} onChange={e=>{
                  const clone = exercises.slice(); clone[i].sets[j].weight = Number(e.target.value||0); setExercises(clone);
                }} />
                <input placeholder="Reps" className="border p-2 rounded" value={s.reps ?? ''} onChange={e=>{
                  const clone = exercises.slice(); clone[i].sets[j].reps = Number(e.target.value||0); setExercises(clone);
                }} />
                <input placeholder="RPE" className="border p-2 rounded" value={s.rpe ?? ''} onChange={e=>{
                  const clone = exercises.slice(); clone[i].sets[j].rpe = Number(e.target.value||0); setExercises(clone);
                }} />
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={!!s.isWarmup} onChange={e=>{
                    const clone = exercises.slice(); clone[i].sets[j].isWarmup = e.target.checked; setExercises(clone);
                  }} />
                  <span>Warm-up</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button className="border px-3 py-2 rounded" onClick={addExercise}>+ Add exercise</button>
        <button className="border px-3 py-2 rounded" onClick={submit}>Save session</button>
      </div>
    </div>
  )
}
