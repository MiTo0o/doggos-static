const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');


// https://github.com/lovell/sharp/issues/28
sharp.cache(false);

const filePaths = {
  Brownie: '../Brownie/images',
  Leo : '../Leo/images',
  Lucky: '../Lucky/images',
  Elvis: '../Elvis/images',
  Rufus: '../Rufus/images',
  Sesame: '../Sesame/images',
  Assorted: '../Assorted/images',
}

// samsung messes up the images, need work around  
// https://github.com/lovell/sharp/issues/3488
async function resizeFile(imgPath, imageFolderPath) {
  try {
    let buffer = await sharp(imgPath, { failOn: 'error' })
      .rotate()
      .resize(1080, 720, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({quality: 100})
      .toBuffer();
    const imageName = path.parse(imgPath).name
    const outputPath = `${imageFolderPath}/${imageName}.webp`
    return sharp(buffer, { failOn: 'error' }).toFile(outputPath);
  } catch (e) {
    console.log('ERROR: ', e.message, imgPath)
  }
}

let resizePromises = []
for (const dog in filePaths) {
  const filePath = filePaths[dog]
  fs.readdirSync(filePath).forEach(file => {
    const imagePath = `${filePath}/${file}`;
    const imageFolderPath = filePath
    resizePromises.push(resizeFile(imagePath, imageFolderPath))
  })
}

// Run next part after resizing everything
Promise.all(resizePromises)
  .then(resizePromisesData => {

    // Delete all file types that arent '.webp'
    for (const dog in filePaths) {
      const filePath = filePaths[dog]
      fs.readdirSync(filePath).forEach(file => {
        let imagePath = `${filePath}/${file}`;
        let imageExt = path.parse(imagePath).ext;
        if (imageExt !== '.webp') {
          fs.unlinkSync(imagePath)
        }
      })
    }

    const phrase = 'dong-saya-dae';
    for (const dog in filePaths) {
      const filePath = filePaths[dog]
      fs.readdirSync(filePath).forEach((file, index) => {
        let imagePath = `${filePath}/${file}`;

        // This really doesn't have to be like this but I'm just making sure that file names are unique
        // Using Date.now().toString() isn't good enough since the process is sometimes 
        // faster than 1 millisecond and it will override files 
        let randomString1 = Math.random().toString(36).substring(2)
        let randomString2 = Math.random().toString(36).substring(2)
        let randomPhrase = `${phrase}${randomString1}${randomString2}${index}`
        let renamedPath = `${filePath}/${randomPhrase}.webp`;
        fs.renameSync(imagePath, renamedPath)
      })
    }

    for (const dog in filePaths) {
      const filePath = filePaths[dog]
      fs.readdirSync(filePath).forEach((file, index) => {
        let imagePath = `${filePath}/${file}`;
        let fileNumber = index + 1
        let renamedPath = `${filePath}/${fileNumber}.webp`;
        fs.renameSync(imagePath, renamedPath)
      })
    }

    // Compile img data (ratio and links) to be used for doggos website
    for (const dog in filePaths) {
      const filePath = filePaths[dog]
    
      const writeData = {
        title: dog,
        imgList: []
      }
      try {
        fs.readdirSync(filePath).forEach(file => {
          const hostedStaticPath = `https://raw.githubusercontent.com/MiTo0o/doggos-static/main/${dog}/images/${file}`
          let imageSize = sizeOf(`${filePath}/${file}`);
          // console.log(file)
          const imgInfo = {
            src: hostedStaticPath,
            width: imageSize.width,
            height: imageSize.height
          }

          writeData.imgList.push(imgInfo);
        })
      } catch (e) {
        console.log('ERROR', e.message)
      }
      const data = `export const ${dog} = ${JSON.stringify(writeData)};`;
      fs.writeFileSync(`./compiledData/${dog}.ts`, data)
    }
  })
