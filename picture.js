const Image = require("@11ty/eleventy-img");

async function pictureSvgPng(src, alt, width, height) {
  if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }
  
  let metadata = await Image(src, {
      formats: ['png', 'svg'],
      outputDir: './_site/img'
  });

  // TODO: figure out that loading="lazy" decoding="async"
  // TODO: set image name like param
  
  return `<picture>
              <source type="image/svg+xml" srcset="${metadata.svg[0].url}">
              <img src="${metadata.png[0].url}" width="${width}" height="${height}" alt="${alt}">
          </picture>`;
}

module.exports = {
  SvgPng: pictureSvgPng
}