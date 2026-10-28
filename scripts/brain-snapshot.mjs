#!/usr/bin/env node
// ============================================================================
// WIRED DIGITAL — 1-CLICK SNAPSHOT & ROLLBACK ENGINE (scripts/brain-snapshot.mjs)
// ----------------------------------------------------------------------------
// Usage:
//   npm run snapshot -- "Before editing pricing"
//   npm run rollback                (restores most recent snapshot)
//   npm run rollback -- list        (lists all saved snapshots)
//   npm run rollback -- <id>        (restores a specific snapshot by ID)
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAP_DIR = path.join(ROOT, '.brain', 'snapshots');

function collectFilesInDir(relDir, extRe = /\.(jsx?|mjs|css|json|md)$/) {
  const absDir = path.join(ROOT, relDir);
  if (!fs.existsSync(absDir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const childRel = path.join(relDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesInDir(childRel, extRe));
    } else if (extRe.test(entry.name)) {
      results.push(childRel);
    }
  }
  return results.sort();
}

// Complete source, style, script & brain config inventory backed up in every snapshot
export function getTrackedBrainFiles() {
  const rootFiles = [
    'BRAIN.md',
    'AGENTS.md',
    '.cursorrules',
    'index.html',
    'package.json',
    'vite.config.js',
    'vercel.json'
  ].filter((f) => fs.existsSync(path.join(ROOT, f)));

  return [
    ...rootFiles,
    ...collectFilesInDir('src'),
    ...collectFilesInDir('scripts')
  ];
}

export const TRACKED_BRAIN_FILES = getTrackedBrainFiles();

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

export function listSnapshots() {
  if (!fs.existsSync(SNAP_DIR)) return [];
  const entries = fs
    .readdirSync(SNAP_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const metaPath = path.join(SNAP_DIR, d.name, 'meta.json');
      if (!fs.existsSync(metaPath)) return null;
      try {
        return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createSnapshot(label = 'Manual studio snapshot') {
  ensureDir(SNAP_DIR);
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+$/, '')
    .replace('T', '-');
  const id = `snap-${stamp}`;
  const destRoot = path.join(SNAP_DIR, id);
  ensureDir(destRoot);

  const savedFiles = [];
  for (const rel of getTrackedBrainFiles()) {
    const srcPath = path.join(ROOT, rel);
    if (!fs.existsSync(srcPath)) continue;
    const dstPath = path.join(destRoot, rel);
    ensureDir(path.dirname(dstPath));
    fs.copyFileSync(srcPath, dstPath);
    savedFiles.push(rel);
  }

  const meta = {
    id,
    label: label || 'Studio snapshot',
    createdAt: now.toISOString(),
    filesCount: savedFiles.length,
    files: savedFiles
  };
  fs.writeFileSync(path.join(destRoot, 'meta.json'), JSON.stringify(meta, null, 2));
  return meta;
}

export function restoreSnapshot(targetId = null) {
  const all = listSnapshots();
  if (all.length === 0) {
    throw new Error('No snapshots found in .brain/snapshots/. Run `npm run snapshot` first.');
  }
  const chosen = targetId ? all.find((s) => s.id === targetId) : all[0];
  if (!chosen) {
    throw new Error(`Snapshot "${targetId}" not found. Available: ${all.map((s) => s.id).join(', ')}`);
  }

  const snapFolder = path.join(SNAP_DIR, chosen.id);
  const restored = [];
  for (const rel of chosen.files || TRACKED_BRAIN_FILES) {
    const srcPath = path.join(snapFolder, rel);
    const dstPath = path.join(ROOT, rel);
    if (fs.existsSync(srcPath)) {
      ensureDir(path.dirname(dstPath));
      fs.copyFileSync(srcPath, dstPath);
      restored.push(rel);
    }
  }
  return { ...chosen, restored };
}

// CLI entrypoint
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2] || 'snapshot';
  const arg = process.argv.slice(3).join(' ').trim();

  if (mode === 'snapshot' || mode === 'save') {
    const meta = createSnapshot(arg || 'Studio checkpoint');
    console.log(`\n✓ Saved Site Brain snapshot: ${meta.id}`);
    console.log(`  Label: ${meta.label}`);
    console.log(`  Files backed up (${meta.filesCount}): ${meta.files.join(', ')}\n`);
  } else if (mode === 'list') {
    const snaps = listSnapshots();
    if (!snaps.length) {
      console.log('\nNo snapshots saved yet. Run `npm run snapshot` to create one.\n');
    } else {
      console.log(`\nSaved Site Brain Snapshots (${snaps.length}):`);
      for (const s of snaps) {
        console.log(`  • ${s.id}  [${s.createdAt}]  —  "${s.label}" (${s.filesCount} files)`);
      }
      console.log('');
    }
  } else if (mode === 'rollback' || mode === 'restore') {
    if (arg === 'list') {
      const snaps = listSnapshots();
      for (const s of snaps) {
        console.log(`  • ${s.id}  [${s.createdAt}]  —  "${s.label}"`);
      }
      process.exit(0);
    }
    const res = restoreSnapshot(arg || null);
    console.log(`\n↺ Rolled back to snapshot: ${res.id} ("${res.label}")`);
    console.log(`  Restored ${res.restored.length} files: ${res.restored.join(', ')}\n`);
  }
}
