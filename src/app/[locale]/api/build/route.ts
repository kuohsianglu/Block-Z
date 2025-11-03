import type { NextRequest } from 'next/server';
import type { HardwareConfiguration } from '@/types/wisblock';
import { spawn } from 'node:child_process';
import { chmodSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

function createBuildCommand(config: HardwareConfiguration): { board: string; args: string[] } {
  const board = config.core?.id.replace('core-', '') || 'rak4631';
  const args = ['-DCONFIG_WISBLOCK=y'];

  if (config.slots.A) {
    const sensorId = config.slots.A.id.replace('sensor-', '').toUpperCase();
    args.push(`-DCONFIG_WISBLOCK_SENSOR_${sensorId}=y`);
  }

  if (config.slots.B) {
    const sensorId = config.slots.B.id.replace('sensor-', '').toUpperCase();
    args.push(`-DCONFIG_WISBLOCK_SENSOR_${sensorId}=y`);
  }

  if (config.slots.IO) {
    const ioId = config.slots.IO.id.replace('io-', '').toUpperCase();
    args.push(`-DCONFIG_WISBLOCK_IO_${ioId}=y`);
  }
  // ... add more logic for other slots ...

  args.unshift('-DOVERLAY_CONFIG=\'overlay-bt_mcumgr.conf overlay-lorawan.conf\'');

  return { board, args };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Get hardware configuration from frontend
    const config = (await req.json()) as HardwareConfiguration;

    // 2. Create local build directory on the server
    const buildDir = 'build_wisblock_zephyr';
    const absoluteBuildDir = path.resolve(process.cwd(), buildDir);
    mkdirSync(absoluteBuildDir, { recursive: true });
    chmodSync(absoluteBuildDir, 0o777);

    const hostBuildPath = process.env.DOCKER_BUILD_HOST_PATH || absoluteBuildDir;

    // 3. Dynamically generate build command based on config
    const { board, args } = createBuildCommand(config);
    const buildArgsString = args.join(' ');

    const dockerCommand = 'docker';
    const dockerArgs = [
      'run',
      '--rm',
      '-v',
      // `${absoluteBuildDir}:/workdir`, // Mount absolute path
      `${hostBuildPath}:/workdir`,
      'ghcr.io/zephyrproject-rtos/zephyr-build:main',
      '/bin/bash',
      '-c',
      `
        set -e

        echo "--- [1/4] Check working folder ---"
        ls -la /workdir

        echo "--- [2/4] west init ---"
        # If wisblock-zephyrproject already exists, skip init
        if [ ! -d "wisblock-zephyrproject" ]; then
          west init -m https://github.com/kuohsianglu/wisblock-zephyr-sdk.git wisblock-zephyrproject
        else
          echo "WisBlock Zephyr project exist，ignore west init."
        fi

        cd wisblock-zephyrproject

        echo "--- [3/4] west update ---"
        west update

        echo "--- [4/4] Start build FW (Board: ${board}) ---"
        echo "Build args: ${buildArgsString}"

        cd wisblock-zephyr-sdk

        west build -p -b ${board} rakwireless/thingset_lorawan/ -- ${buildArgsString}

      `,
    ];

    // 4. Create a Stream to send logs back to frontend in real-time
    const stream = new ReadableStream({
      start(controller) {
        const send = (data: string) => {
          controller.enqueue(new TextEncoder().encode(data));
        };

        // Execute Docker command
        const process = spawn(dockerCommand, dockerArgs);

        // Stream stdout
        process.stdout.on('data', (data) => {
          send(data.toString());
        });

        // Stream stderr
        process.stderr.on('data', (data) => {
          send(data.toString());
        });

        // Handle process close
        process.on('close', (code) => {
          if (code === 0) {
            send('\n--- BUILD SUCCESSFUL ---');
            controller.close();
          } else {
            send(`\n--- BUILD FAILED (Exit Code: ${code}) ---`);
            controller.close();
          }
        });

        // Handle execution errors (e.g., 'docker' command not found)
        process.on('error', (err) => {
          send(`\n--- SPAWN ERROR: ${err.message} ---`);
          controller.error(err);
        });
      },
    });

    // 5. Return the stream as response
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    const errorMessage
      = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
