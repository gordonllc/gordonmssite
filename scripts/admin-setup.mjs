import { randomBytes, scryptSync } from 'node:crypto';
import { emitKeypressEvents } from 'node:readline';

if (!process.stdin.isTTY) throw new Error('Run npm run admin:setup in the Replit Shell to enter a password privately.');
emitKeypressEvents(process.stdin);
async function hiddenPrompt(prompt) {
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve) => {
    let value = '';
    const handler = (text, key) => {
      if (key?.ctrl && key.name === 'c') { process.stdin.setRawMode(false); process.exit(1); }
      if (key?.name === 'return') {
        process.stdin.off('keypress', handler); process.stdin.setRawMode(false);
        process.stdin.pause(); process.stdout.write('\n'); resolve(value);
      } else if (key?.name === 'backspace') value = value.slice(0, -1);
      else if (text && !key?.ctrl && !key?.meta) value += text;
    };
    process.stdin.on('keypress', handler);
  });
}
const password = await hiddenPrompt('Choose an admin password (at least 14 characters; input is hidden): ');
if (password.length < 14 || password.length > 256) throw new Error('Use a password between 14 and 256 characters.');
if (password !== await hiddenPrompt('Confirm password: ')) throw new Error('Passwords did not match.');
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString('hex');
console.log('\nAdd these values to Replit Secrets. Do not commit or share them.');
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString('hex')}`);
console.log('Set ADMIN_EMAIL to the email you will use to sign in.');
