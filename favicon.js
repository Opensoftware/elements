const Image = require('@11ty/eleventy-img');
const fs = require('fs');

const faviconData = require('./_data/favicon.json');
const siteData = require('./_data/site.json');

const faviconSizesIco = [32];
const faviconSizesPng = [16, 32, 48, 96, 144];
const androidIconSizes = [192, 512];
const appleIconSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
const msIconSizes = [70, 150, 310];
const msRectangleIconSize = {w: 310, h: 150};

async function makeFavicons(faviconData, siteData) {
  const svgSrc = faviconData.svgSrc;
  const safariSvgSrc = faviconData.safariSvgSrc;
  const svgSrc310x150 = faviconData.svgSrc310x150;
  const themeColor = faviconData.themeColor;
  const backgroundColor = faviconData.backgroundColor;

  const siteName = siteData.name;
  const siteShortName = siteData.shortName;
  const siteDescription = siteData.description;
  const siteLanguage = siteData.language;

  let metadataFaviconsPng = await Image(svgSrc, {
    widths: faviconSizesPng,
    formats: ['png'],
    outputDir: './_site/img',
    filenameFormat: function (id, src, width, format, options) {
      return `favicon-${width}x${width}.${format}`;
    }
  });

  // console.log('metadataFaviconsPng', metadataFaviconsPng);

  let metadataAndroidPng = await Image(svgSrc, {
    widths: androidIconSizes,
    formats: ['png'],
    outputDir: './_site/img',
    filenameFormat: function (id, src, width, format, options) {
      return `android-icon-${width}x${width}.${format}`;
    }
  });

  // console.log('metadataAndroidPng', metadataAndroidPng);

  let metadataApplePng = await Image(svgSrc, {
    widths: appleIconSizes,
    formats: ['png'],
    outputDir: './_site/img',
    filenameFormat: function (id, src, width, format, options) {
      return `apple-touch-icon-${width}x${width}.${format}`;
    }
  });

  // console.log('metadataApplePng', metadataApplePng);

  let metadataMsPng = await Image(svgSrc, {
    widths: msIconSizes,
    formats: ['png'],
    outputDir: './_site/img',
    filenameFormat: function (id, src, width, format, options) {
      return `mstile-${width}x${width}.${format}`;
    }
  });

  let metadataMsRectanglePng = await Image(svgSrc310x150, {
    widths: [msRectangleIconSize.w],
    formats: ['png'],
    outputDir: './_site/img',
    filenameFormat: function (id, src, width, format, options) {
      return `mstile-${msRectangleIconSize.w}x${msRectangleIconSize.h}.${format}`;
    }
  });

let browserConfigInner = `<?xml version="1.0" encoding="utf-8"?>
  <browserconfig>
    <msapplication>
      <tile>\n`;

for(img of metadataMsPng['png']) {
  browserConfigInner += `        <square${img.width}x${img.width}logo src="${img.url}"/>\n`
}

for(img of metadataMsRectanglePng['png']) {
  browserConfigInner += `        <square${img.width}x${msRectangleIconSize.h}logo src="${img.url}"/>\n`
}

browserConfigInner += `        <TileColor>${backgroundColor}</TileColor>
      </tile>
    </msapplication>
  </browserconfig>`;

  fs.writeFile('./_site/browserconfig.xml', browserConfigInner, (err) => {
    if(err) throw err;
  });

  let manifestInnerImg = ``
  for(let i = 0; i < metadataAndroidPng['png'].length; i++) {
    manifestInnerImg += `                          {
                          "src": "${metadataAndroidPng['png'][i].url}",
                          "sizes": "${metadataAndroidPng['png'][i].width}x${metadataAndroidPng['png'][i].width}",
                          "type": "${metadataAndroidPng['png'][i].sourceType}",\n`

    if(metadataAndroidPng['png'][i].width != 512) {
      manifestInnerImg += `                          "density": "${metadataAndroidPng['png'][i].width/48}.0"\n`
    }
    if (i === metadataAndroidPng['png'].length -1) {
      manifestInnerImg += `                          }\n`
    } else {
      manifestInnerImg += `                          },\n`
    }
  }

  let manifestInner = `
  {
    "name": "${siteName}",
    "short_name": "${siteShortName}",
    "description": "${siteDescription}",
    "lang": "${siteLanguage}",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "theme_color": "${themeColor}",
    "background_color": "${backgroundColor}",
    "icons": [
      ${manifestInnerImg}
    ]
   }
  `;

  fs.writeFile('./_site/manifest.json', manifestInner, (err) => {
    if(err) throw err;
  });

  let faviconsHeadPart = `
    <link type="image/x-icon" rel="icon" href="/favicon.ico">\n
    <link type="image/svg+xml" rel="icon" href="/${svgSrc}">\n\n`;

  for(let img of metadataFaviconsPng['png']) {
    faviconsHeadPart += `    <link type="${img.sourceType}" sizes="${img.width}x${img.width}" rel="icon" href="${img.url}">\n`
  }

  faviconsHeadPart += '\n';

  for(let img of metadataAndroidPng['png']) {
    faviconsHeadPart += `    <link type="${img.sourceType}" sizes="${img.width}x${img.width}" rel="icon" href="${img.url}">\n`
  }

  faviconsHeadPart += '\n';

  for(let img of metadataApplePng['png']) {
    faviconsHeadPart += `    <link sizes="${img.width}x${img.width}" rel="apple-touch-icon" href="${img.url}">\n`
  }

  faviconsHeadPart += `
    <link color="${themeColor}" rel="mask-icon" href="${safariSvgSrc}">\n
    <meta name="application-name" content="${siteName}">
    <meta name="msapplication-TileColor" content="${backgroundColor}">\n`;

    for(let img of metadataMsPng['png']) {
      faviconsHeadPart += `    <meta name="msapplication-square${img.width}x${img.width}logo" content="${img.url}">\n`
    }

    for(let img of metadataMsRectanglePng['png']) {
      faviconsHeadPart += `    <meta name="msapplication-square${img.width}x${msRectangleIconSize.h}logo" content="${img.url}">\n`
    }

    faviconsHeadPart += `
    <meta name="msapplication-config" content="/browserconfig.xml">

    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="${themeColor}">`

  console.log('faviconsHeadPart', faviconsHeadPart);

  return faviconsHeadPart;
}

makeFavicons(faviconData, siteData);

module.exports = {
  makeFavicons
}
