import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const versionPath = path.join(
      process.cwd(),
      'build_wisblock_zephyr/wisblock-zephyrproject/zephyr/VERSION',
    );

    if (!fs.existsSync(versionPath)) {
      return NextResponse.json({ version: null });
    }

    const content = fs.readFileSync(versionPath, 'utf-8');
    const major = content.match(/VERSION_MAJOR\s*=\s*(\d+)/)?.[1];
    const minor = content.match(/VERSION_MINOR\s*=\s*(\d+)/)?.[1];
    const patch = content.match(/PATCHLEVEL\s*=\s*(\d+)/)?.[1];

    if (major && minor) {
      const version = `${major}.${minor}.${patch || '0'}`;
      return NextResponse.json({ version });
    }

    return NextResponse.json({ version: null });
  } catch (error) {
    console.error('Error reading Zephyr version:', error);
    return NextResponse.json({ version: null }, { status: 500 });
  }
}
