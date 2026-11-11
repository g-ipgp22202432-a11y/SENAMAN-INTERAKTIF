import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WARMUP_PHASES,
  generateObstacleCourse,
  getCurrentPhaseIndex,
  estimatePhysicalMetrics,
  evaluateActionSuccess,
} from './warmupRules';

test('WARMUP_PHASES contains 4 progressive stages for Year 5 PE curriculum', () => {
  assert.equal(WARMUP_PHASES.length, 4);
  assert.equal(WARMUP_PHASES[0].name.includes('Fasa 1'), true);
  assert.equal(WARMUP_PHASES[1].name.includes('Fasa 2'), true);
  assert.equal(WARMUP_PHASES[2].name.includes('Fasa 3'), true);
  assert.equal(WARMUP_PHASES[3].name.includes('Fasa 4'), true);
});

test('generateObstacleCourse generates obstacles with comfortable spacing', () => {
  const course = generateObstacleCourse(1000);
  assert.ok(course.length > 5);
  // Verify first obstacle starts after opening jog
  assert.ok(course[0].zPos >= 60);

  // Verify sequential spacing between obstacles is >= 50 units for Year 5 reaction time
  for (let i = 1; i < course.length; i++) {
    const diff = course[i].zPos - course[i - 1].zPos;
    assert.ok(diff >= 50, `Spacing between obstacles ${i-1} and ${i} was too close: ${diff}`);
  }

  // Verify all 4 required actions are present
  const types = new Set(course.map(o => o.type));
  assert.equal(types.has('KIRI'), true);
  assert.equal(types.has('KANAN'), true);
  assert.equal(types.has('LOMPAT'), true);
  assert.equal(types.has('TUNDUK'), true);
});

test('getCurrentPhaseIndex maps elapsed time accurately across phases', () => {
  // Phase 1 is 45s
  assert.equal(getCurrentPhaseIndex(0), 0);
  assert.equal(getCurrentPhaseIndex(20), 0);
  assert.equal(getCurrentPhaseIndex(44), 0);

  // Phase 2 is 90s (ends at 45 + 90 = 135s)
  assert.equal(getCurrentPhaseIndex(45), 1);
  assert.equal(getCurrentPhaseIndex(100), 1);

  // Phase 3 is 60s (ends at 135 + 60 = 195s)
  assert.equal(getCurrentPhaseIndex(140), 2);

  // Phase 4 is cool-down
  assert.equal(getCurrentPhaseIndex(200), 3);
  assert.equal(getCurrentPhaseIndex(300), 3);
});

test('estimatePhysicalMetrics calculates non-negative steps and calories for Year 5', () => {
  const metrics0 = estimatePhysicalMetrics(0);
  assert.equal(metrics0.steps, 0);
  assert.equal(metrics0.calories, 0);

  const metrics60 = estimatePhysicalMetrics(60, 1.0);
  assert.ok(metrics60.steps >= 120 && metrics60.steps <= 160);
  assert.ok(metrics60.calories > 3.0 && metrics60.calories < 8.0);
});

test('evaluateActionSuccess awards points on correct dodge', () => {
  const jumpSuccess = evaluateActionSuccess('LOMPAT', 'LOMPAT', 0, 0);
  assert.equal(jumpSuccess.success, true);
  assert.ok(jumpSuccess.scoreDelta > 0);

  const jumpFail = evaluateActionSuccess('LOMPAT', null, 0, 0);
  assert.equal(jumpFail.success, false);

  const duckSuccess = evaluateActionSuccess('TUNDUK', 'TUNDUK', 0, 0);
  assert.equal(duckSuccess.success, true);

  const leftSuccess = evaluateActionSuccess('KIRI', 'KIRI', -1, 1);
  assert.equal(leftSuccess.success, true);
});
