const { Jimp } = require('jimp');
const path = require('path');

const dir = 'evenements-passes/epopee-quatre-clans';
const images = ['taniere-loup.jpg', 'piste-nature.jpg', 'empreintes-loup.jpg'];

async function fixAll() {
  for (const img of images) {
    const filePath = path.join(dir, img);
    console.log('Correction de', img, '...');
    try {
      const image = await Jimp.read(filePath);
      console.log('  Dimensions avant:', image.width, 'x', image.height);
      const rotated = image.rotate(90);
      await rotated.write(filePath);
      console.log('  ✓', img, 'pivoté de 180°');
    } catch (err) {
      console.error('  Erreur sur', img, ':', err.message);
    }
  }
  console.log('Terminé !');
}

fixAll();
