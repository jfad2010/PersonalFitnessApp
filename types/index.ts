export type Goal = {
  focus: 'hypertrophy' | 'strength' | 'fat_loss' | 'endurance' | 'recomp';
  priorityLifts?: string[];
  weeklyDaysTarget?: number;
  notes?: string;
};
