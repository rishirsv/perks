import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { getImageDimensions } from '../generator/helpers/media.js';
import { compareCandidateImages, normalizePng } from './onboarding/lib.mjs';

function writePng(filePath, width, height, rgba) {
  const result = spawnSync(
    'python3',
    [
      '-c',
      [
        'from pathlib import Path',
        'from PIL import Image',
        'import sys',
        'out = Path(sys.argv[1])',
        'width = int(sys.argv[2])',
        'height = int(sys.argv[3])',
        'rgba = tuple(int(part) for part in sys.argv[4].split(","))',
        'out.parent.mkdir(parents=True, exist_ok=True)',
        'Image.new("RGBA", (width, height), rgba).save(out)',
      ].join('\n'),
      filePath,
      String(width),
      String(height),
      rgba.join(','),
    ],
    {
      encoding: 'utf8',
    },
  );
  assert.equal(result.status, 0, `PNG fixture creation should succeed.\n${result.stderr || ''}`.trim());
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'kpmg-onboarding-compare-'));

try {
  const nativeReferencePath = path.join(tempRoot, 'reference-native.png');
  const nativeCandidatePath = path.join(tempRoot, 'candidate-native.png');
  const preservedReferencePath = path.join(tempRoot, 'reference-preserved.png');
  const preservedCandidatePath = path.join(tempRoot, 'candidate-preserved.png');
  const resizedCandidatePath = path.join(tempRoot, 'candidate-resized.png');
  const mismatchCandidatePath = path.join(tempRoot, 'candidate-mismatch.png');
  const diffPngPath = path.join(tempRoot, 'diff.png');
  const diffJsonPath = path.join(tempRoot, 'diff.json');
  const scorecardPath = path.join(tempRoot, 'scorecard.json');

  writePng(nativeReferencePath, 32, 18, [220, 30, 30, 255]);
  writePng(nativeCandidatePath, 32, 18, [220, 30, 30, 255]);
  writePng(mismatchCandidatePath, 40, 18, [220, 30, 30, 255]);

  normalizePng({
    inputPath: nativeReferencePath,
    outputPath: preservedReferencePath,
  });
  normalizePng({
    inputPath: nativeCandidatePath,
    outputPath: preservedCandidatePath,
  });

  const preservedReferenceDims = getImageDimensions(preservedReferencePath);
  const preservedCandidateDims = getImageDimensions(preservedCandidatePath);
  assert.deepEqual(
    preservedReferenceDims,
    {
      width: 32,
      height: 18,
      aspectRatio: 32 / 18,
      type: 'png',
    },
    'Default normalizePng behavior should preserve native reference PNG dimensions.',
  );
  assert.equal(preservedCandidateDims.width, 32);
  assert.equal(preservedCandidateDims.height, 18);

  const compared = compareCandidateImages({
    referencePngPath: preservedReferencePath,
    candidatePngPath: preservedCandidatePath,
    diffPngPath,
    diffJsonPath,
    scorecardPath,
  });
  assert.equal(compared.scorecard.pass, true, 'Native-dimension compare should succeed without resizing.');
  assert.equal(compared.scorecard.metrics.dimensions.width, 32);
  assert.equal(compared.scorecard.metrics.dimensions.height, 18);

  normalizePng({
    inputPath: nativeCandidatePath,
    outputPath: resizedCandidatePath,
    mode: 'resize',
    width: 1600,
    height: 900,
  });
  const resizedDims = getImageDimensions(resizedCandidatePath);
  assert.equal(resizedDims.width, 1600, 'Explicit resize compatibility mode should still work.');
  assert.equal(resizedDims.height, 900, 'Explicit resize compatibility mode should still work.');

  assert.throws(
    () =>
      compareCandidateImages({
        referencePngPath: preservedReferencePath,
        candidatePngPath: mismatchCandidatePath,
        diffPngPath,
        diffJsonPath,
        scorecardPath,
      }),
    /matching native image dimensions/,
    'Compare should fail immediately when native image dimensions differ.',
  );
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('Onboarding compare dimension tests passed.');
