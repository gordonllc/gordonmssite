import { spawn } from 'node:child_process';

const mode = process.argv[2] === 'start' ? 'start' : 'dev';
const port = process.env.PORT || '3000';
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error('Invalid PORT.');
const child = spawn(process.execPath, [
  'node_modules/next/dist/bin/next', mode, '--hostname', '0.0.0.0', '--port', port,
  ...(mode === 'dev' ? ['--webpack'] : []),
], { stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 0));
