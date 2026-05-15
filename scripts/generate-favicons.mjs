import { Jimp } from 'jimp';
import { writeFile } from 'node:fs/promises';

const src = 'images-creation-de-site/logo.png';
const img = await Jimp.read(src);

const outputs = [
  [16, 'favicon-16.png'],
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'favicon-192.png'],
  [512, 'favicon-512.png'],
];

for (const [size, name] of outputs) {
  const out = img.clone().cover({ w: size, h: size });
  await out.write(name);
}

console.log('Favicons generated.');
