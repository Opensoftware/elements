const path = require("path");
const Image = require("@11ty/eleventy-img");
const responsive = require("./_data/responsive.json");

/**
 * Support operations max
 **/

const SCREENS = responsive.SCREEN_WIDTHES;

// Utils function

function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}

// Function - for work with stack

function getWidthStack(page) {
  if (!page.screenWidthStack) {
    page.screenWidthStack = [];
  }
  return page.screenWidthStack;
}

function pushOnWidthStack(page, params) {
  let stack = getWidthStack(page);
  stack.push(params);
}

function pushMaxWidthOnWidthStack(page, maxWidth) {
  pushOnWidthStack(page, {maxWidth: maxWidth});
}

function pushGapOnWidthStack(page, unusedSpaceWidth) {
  if(typeof(unusedSpaceWidth) === 'object') {
    let obj = JSON.parse(JSON.stringify(unusedSpaceWidth)); 
    // console.log('obj', obj);
    for (let key in obj) {
      // console.log('key', key);
        for (let gap in obj[key]) {
          // console.log('gap', gap);
          // console.log('obj[key][gap]', obj[key][gap]);
          if (typeof obj[key][gap] == 'number') {
            obj[key][gap] *= 2;
          }
        }
    }
    pushOnWidthStack(page, {gap: obj});
  } else {
    pushOnWidthStack(page, {gap: unusedSpaceWidth*2});
  }
}

function pushAdaptiveOnWidthStack(page, coefficients) {
  pushOnWidthStack(page, { adaptive: coefficients });
}

function popFromWidthStack(page) {
  let stack = getWidthStack(page);
  if (stack.length) {
      stack.length--;
  }
}

// Calc widthes for picture.

function calcWidthes(media, operations) {
  // console.log('media', media);
  // console.log('operations', operations);


  let localWidthes = SCREENS.slice();
  let maxWidthArray = operations.filter(op => op.maxWidth);
  let maxWidth = null;

  if(maxWidthArray.length > 0 && maxWidthArray.length <= 1) {
    maxWidth = maxWidthArray[0].maxWidth;
  } else if ( maxWidthArray.length > 1){
    maxWidth = maxWidthArray.reduce(function(res, obj) {
      return (obj.maxWidth < res.maxWidth) ? obj.maxWidth : res.maxWidth;
    });
  }

  if(maxWidth) {
    for(let i = 0; i < localWidthes.length; i++) {
      if(localWidthes[i] >= maxWidth) {
        localWidthes[i] = maxWidth;
        localWidthes = localWidthes.slice(0, i+1);
      }
    }
  }

  let mediaRange = 0;

  for(width of localWidthes) {
    if(width < 768) {
      mediaRange++;
    }
  }

  let localWidthesProcessed = localWidthes.slice();

  for(let i = 0; i < localWidthesProcessed.length; i++) {
    for(let op of operations) {    
      if(op.gap) {
        if(i === localWidthesProcessed.length - 1) {
          // console.log('localWidthesProcessed[i] before: ', localWidthesProcessed[i]);
          // console.log('op.gap', op.gap);
        }

        let gap = 0;
        if(typeof(op.gap) === 'object') {
          if(localWidthes[i] < media.phone) {
            gap = op.gap.phone.x;
            // console.log('op.gap.phone.x: ', gap);
          } else if(localWidthes[i] < media.tablet) {
            gap = op.gap.tablet.x;
            // console.log('op.gap.tablet.x: ', gap);
          } else if(localWidthes[i] < media.laptop) {
            gap = op.gap.laptop.x;
            // console.log('op.gap.laptop.x: ', gap);
          } else if(localWidthes[i] < media.desktop) {
            gap = op.gap.desktop.x;
            // console.log('op.gap.desktop.x: ', gap);
          } else {
            gap = op.gap.default.x;
            // console.log('op.gap.default.x: ', gap);
          }
        } else {
          gap = op.gap;
        }
        localWidthesProcessed[i] -= gap;
        // console.log('localWidthesProcessed[i] after: ', localWidthesProcessed[i]);
      }
  
      if(op.adaptive) {
          // console.log('op.adaptive: ', op.adaptive);
          // console.log('localWidthesProcessed[i] before: ', localWidthesProcessed[i]);

        if(localWidthes[i] < media.phone) {
            // console.log('op.adaptive.phone: ', op.adaptive.phone);
          localWidthesProcessed[i] *= op.adaptive.phone;
        } else if(localWidthes[i] < media.tablet) {
          // console.log('op.adaptive.tablet: ', op.adaptive.tablet);
          localWidthesProcessed[i] *= op.adaptive.tablet;
        } else if(localWidthes[i] < media.laptop) {
          // console.log('op.adaptive.laptop: ', op.adaptive.laptop);
          localWidthesProcessed[i] *= op.adaptive.laptop;
        } else if(localWidthes[i] < media.desktop) {
          // console.log('op.adaptive.desktop: ', op.adaptive.desktop);
          localWidthesProcessed[i] *= op.adaptive.desktop;
        } else {
          // console.log('op.adaptive.default: ', op.adaptive.default);
          localWidthesProcessed[i] *= op.adaptive.default;
        }
        localWidthesProcessed[i] = Math.round(localWidthesProcessed[i]);
        if(i === localWidthesProcessed.length - 1) {
          // console.log('localWidthesProcessed[i] after: ', localWidthesProcessed[i]);
        }
      }
    }
  }

  maxWidth = localWidthesProcessed[localWidthesProcessed.length - 1];
  let count = localWidthesProcessed.length;

  for(let i = 0; i < count; i++) {
    let width = localWidthesProcessed[i];
    if(i < mediaRange) {
      localWidthesProcessed.push(width*2);
      localWidthesProcessed.push(width*3);
    } else {
      localWidthesProcessed.push(Math.round(width*1.5));
      localWidthesProcessed.push(width*2);
    }
  }

  localWidthesProcessed.sort(compareNumeric);
  localWidthesProcessed.splice(localWidthesProcessed.indexOf(maxWidth), 1);
  localWidthesProcessed.push(maxWidth);
  return localWidthesProcessed;
}

function calcSizes(media, operations) {
  // console.log('op', operations);
  let sizesDefault = '100vw';
  let maxWidth = '';
  let sizes = {
    phone: sizesDefault,
    tablet: sizesDefault,
    laptop: sizesDefault,
    desktop: sizesDefault,
    default: sizesDefault
  };

  for(let op of operations) {
    if(op.maxWidth) {
      maxWidth = op.maxWidth;
      sizes.maxWidth = op.maxWidth;
    }

    if(op.adaptive) {
      if(op.adaptive.phone < 1) {
        sizes.phone = `(${sizes.phone} * ${(op.adaptive.phone).toFixed(2)})`;
        if(maxWidth < media.phone) {
          sizes.maxWidth = Math.round(sizes.maxWidth * (op.adaptive.phone));
        }
      }

      if(op.adaptive.tablet < 1) {
        sizes.tablet = `(${sizes.tablet} * ${(op.adaptive.tablet).toFixed(2)})`;
        if (maxWidth >= media.phone && maxWidth < media.tablet) {
          sizes.maxWidth = Math.round(sizes.maxWidth * (op.adaptive.tablet));
        }
      }
      
      if(op.adaptive.laptop < 1) {
        sizes.laptop = `(${sizes.laptop} * ${(op.adaptive.laptop).toFixed(2)})`;
        if (maxWidth >= media.tablet && maxWidth < media.laptop) {
          sizes.maxWidth = Math.round(sizes.maxWidth * (op.adaptive.laptop));
        }
      }
 
      if(op.adaptive.desktop < 1) {
        sizes.desktop = `(${sizes.desktop} * ${(op.adaptive.desktop).toFixed(2)})`;
        if (maxWidth >= media.laptop && maxWidth < media.desktop) {
          sizes.maxWidth = Math.round(sizes.maxWidth * (op.adaptive.desktop));
        }
      }

      if(op.adaptive.default < 1) {
        sizes.default = `(${sizes.default} * ${(op.adaptive.default).toFixed(2)})`;
        if (maxWidth >= media.desktop) {
          sizes.maxWidth = Math.round(sizes.maxWidth * (op.adaptive.default));
        }
      }
    }

    if(op.gap) {
      if(typeof(op.gap) === 'object') {
        sizes.phone = `(${sizes.phone} - ${op.gap.phone.x}px)`;
        sizes.tablet = `(${sizes.tablet} - ${op.gap.tablet.x}px)`; 
        sizes.laptop = `(${sizes.laptop} - ${op.gap.laptop.x}px)`;
        sizes.desktop = `(${sizes.desktop} - ${op.gap.desktop.x}px)`;
        sizes.default = `(${sizes.default} - ${op.gap.default.x}px)`;
      } else {
        sizes.phone = `(${sizes.phone} - ${op.gap}px)`;
        sizes.tablet = `(${sizes.tablet} - ${op.gap}px)`; 
        sizes.laptop = `(${sizes.laptop} - ${op.gap}px)`;
        sizes.desktop = `(${sizes.desktop} - ${op.gap}px)`;
        sizes.default = `(${sizes.default} - ${op.gap}px)`;
      }

      if(sizes.maxWidth) {
        if(typeof(op.gap) === 'object') {
          if(maxWidth < media.phone) {
            sizes.maxWidth -= op.gap.phone.x;
          }
          if (maxWidth >= media.phone && maxWidth < media.tablet) {
            sizes.maxWidth -= op.gap.tablet.x;
          }
          if (maxWidth >= media.tablet && maxWidth < media.laptop) {
            sizes.maxWidth -= op.gap.laptop.x;
          }
          if (maxWidth >= media.laptop && maxWidth < media.desktop) {
            sizes.maxWidth -= op.gap.desktop.x;
          }
          if (maxWidth >= media.desktop) {
            sizes.maxWidth -= op.gap.default.x;
          }
        } else {
          sizes.maxWidth -= op.gap;
        }
      }
    }
  }

  let result = '';

  for(let size in sizes) {
    if(size === 'maxWidth') {
      result = `(min-width: ${maxWidth}px) ${Math.round(sizes[size])}px, ` + result;
    }

    if(size  === 'phone') {
      result = `calc(${sizes[size]})` + result;
    }
    
    if(size  === 'tablet') {
      result = `(min-width: ${media.phone}px) calc(${sizes[size]}), ` + result;
    }
    
    if(size  === 'laptop') {
      result = `(min-width: ${media.tablet}px) calc(${sizes[size]}), ` + result;
    }

    if(size  === 'desktop') {
      result = `(min-width: ${media.laptop}px) calc(${sizes[size]}), ` + result;
    }

    if(size  === 'default') {
      result = `(min-width: ${media.desktop}px) calc(${sizes[size]}), ` + result;
    }
  }
  return result;
}

async function picture(responsive, src, alt) {
  let media = responsive.MEDIA;
  const isTEST = false;
  const extension = path.extname(src);
  const name = path.basename(src, extension);
  let operationStack = getWidthStack(this.page);

  let result = '';
  let srcset = calcWidthes(media, operationStack);
  let sizes = calcSizes(media, operationStack);

  // console.log('operationStack', operationStack);
  // console.log('widthes', srcset);
  // console.log('sizes', sizes);

  if(extension == '.svg') {
    let metadata = await Image(src, {
      svgAllowUpscale: true,
      widths: [srcset[srcset.length - 1]],
      formats: ['png'],
      outputDir: './_site/img',
      filenameFormat: function (id, src, width, format, options) {
        return `${name}-${[srcset[srcset.length - 1]]}w.png`;
      }
    });

    if(isTEST) {
      result = `<picture>
                  <source type="image/svg+xml" srcset="https://picture.softevol.com/svg/image-${metadata.png[0].width}x${Math.round(metadata.png[0].width / 16 * 9)}.svg ${metadata.png[0].width}w">
                  <img src="https://picture.softevol.com/svg/image-${metadata.png[0].width}x${Math.round(metadata.png[0].width / 16 * 9)}.svg" alt="${alt}" width="${metadata.png[0].width}" height="${Math.round(metadata.png[0].width / 16 * 9)}">
                </picture>`
    
    } else {
      result = `<picture>
      <source type="image/svg+xml" srcset="/${src}">
      <img src="${metadata.png[0].url}" alt="${alt}" width="${metadata.png[0].width}" height="${metadata.png[0].height}">
    </picture>`;
    }
  } else if (extension == '.png') {
    let metadata = await Image(src, {
      widths: srcset,
      formats: ['webp'],
      outputDir: './_site/img/',
      filenameFormat: function (id, src, width, format, options) {
        return `${name}-${width}w.${format}`;
      }
    });

    // console.log('srcset[srcset.length - 1]', srcset[srcset.length - 1]);

    let fallbackMetadata = await Image(src, {
      widths: [srcset[srcset.length - 1]],
      formats: ['png'],
      outputDir: './_site/img/',
      filenameFormat: function (id, src, width, format, options) {
        return `${name}-${width}w.${format}`;
      }
    });

    // console.log('fallbackMetadata.png', fallbackMetadata.png);

    if(isTEST) {
      result  = 
      `<picture>
        <source sizes="${sizes}" type="image/svg+xml" srcset="\n`;
      result += metadata['webp'].map(webp => `      https://picture.softevol.com/svg/image-${webp.width}x${Math.round(webp.width / 16 * 9)}.svg ${webp.width}w`).join(",\n");
      result += `">\n`;
      result += `<!-- TODO add img -->\n`;
      result += `  <img src="https://picture.softevol.com/svg/image-${fallbackMetadata.png[0].width}x${Math.round(fallbackMetadata.png[0].width / 16 * 9)}.svg" alt="${alt}" width="${fallbackMetadata.png[0].width}" height="${Math.round(fallbackMetadata.png[0].width / 16 * 9)}">\n`;
      result += `</picture>`;    
    } else {
      let fallbackWidth;
      let fallbackHeight;

      if(srcset[srcset.length - 1] !== fallbackMetadata.png[0].width) {
        fallbackWidth = srcset[srcset.length - 1];
        fallbackHeight = Math.round((fallbackWidth/fallbackMetadata.png[0].width)*fallbackMetadata.png[0].height);
      } else {
        fallbackWidth = fallbackMetadata.png[0].width;
        fallbackHeight = fallbackMetadata.png[0].height;
      }

      result  = 
      `<picture>
        <source sizes="${sizes}" type="image/webp" srcset="\n`;
      result += metadata['webp'].map(webp => `      ${webp.srcset}`).join(",\n");
      result += `">\n`;
      result += `<!-- TODO add img -->\n`;
      result += `  <img src="${fallbackMetadata.png[0].url}" alt="${alt}" width="${fallbackWidth}" height="${fallbackHeight}">\n`;
      result += `</picture>`;
    }
  } else if (extension == '.jpg' || extension == '.jpeg') {
    let metadata = await Image(src, {
      widths: srcset,
      formats: ['webp'],
      outputDir: './_site/img/',
      filenameFormat: function (id, src, width, format, options) {
        return `${name}-${width}w.${format}`;
      }
    });

    
    let fallbackMetadata = await Image(src, {
      widths: [srcset[srcset.length - 1]],
      formats: ['jpeg'],
      outputDir: './_site/img/',
      filenameFormat: function (id, src, width, format, options) {
        return `${name}-${width}w.${format}`;
      }
    });

    if(isTEST) {
      let array = [];

      for(let i = 100; i <= 1500; i++) {
        array.push(i);
      }

      result  = 
      `<picture>
        <source sizes="${sizes}" type="image/svg+xml" srcset="\n`;
      // result += metadata['webp'].map(webp => `      https://picture.softevol.com/svg/image-${webp.width}x${Math.round(webp.width / 16 * 9)}.svg ${webp.width}w`).join(",\n");
      result += array.map(v => `      https://picture.softevol.com/svg/image-${v}x${Math.round(v / 16 * 9)}.svg ${v}w`).join(",\n");
      result += `">\n`;
      result += `<!-- TODO add img -->\n`;
      result += `  <img src="https://picture.softevol.com/svg/image-${fallbackMetadata.jpeg[0].width}x${Math.round(fallbackMetadata.jpeg[0].width / 16 * 9)}.svg" alt="${alt}" width="${fallbackMetadata.jpeg[0].width}" height="${Math.round(fallbackMetadata.jpeg[0].width / 16 * 9)}">\n`;
      result += `</picture>`;    
    } else {
      let fallbackWidth;
      let fallbackHeight;

      if(srcset[srcset.length - 1] !== fallbackMetadata.jpeg[0].width) {
        fallbackWidth = srcset[srcset.length - 1];
        fallbackHeight = Math.round((fallbackWidth/fallbackMetadata.jpeg[0].width)*fallbackMetadata.jpeg[0].height);
      } else {
        fallbackWidth = fallbackMetadata.jpeg[0].width;
        fallbackHeight = fallbackMetadata.jpeg[0].height;
      }

      result  = 
      `<picture>
        <source sizes="${sizes}" type="image/webp" srcset="\n`;
      result += metadata['webp'].map(webp => `      ${webp.srcset}`).join(",\n");
      result += `">\n`;
      result += `<!-- TODO add img -->\n`;
      result += `  <img src="${fallbackMetadata.jpeg[0].url}" alt="${alt}" width="${fallbackWidth}" height="${fallbackHeight}">\n`;
      result += `</picture>`;
    }
  } else {
    throw new Error('Unsupported file format');
  }
  return result;
}

function customBuffer(custom_buffer, classes) {
  if(typeof custom_buffer !== "undefined" && custom_buffer !== null && custom_buffer.GAP) {
    pushGapOnWidthStack(this.page, custom_buffer.GAP);
  }

  let output = '';
  if(classes) {
    output = `<div class="custom-buffer ${classes}">`
  } else {
    output = `<div class="custom-buffer">`
  }

  return output;
}

function buffer(responsive, classes) {
  pushGapOnWidthStack(this.page, responsive.GAP);
  let output = '';

  if(classes) {
    output = `<div class="buffer ${classes}">`
  } else {
    output = `<div class="buffer">`
  }

  return output;
}

function responsiveBuffer(bufferParams) {
  pushGapOnWidthStack(this.page, bufferParams);
  return `<div class="responsive-buffer">`;
}

function endBuffer() {
  popFromWidthStack(this.page);
  return `</div>`;
}

async function card1(responsive, cardConfig, src, alt, title, text) {
  pushGapOnWidthStack(this.page, cardConfig.GAP);
  let card = `<div class="card-simple">
  <div class="card-simple__buffer">
  ${(buffer.call(this, responsive))}
    ${(await picture.call(this, src, alt))}
  ${(endBuffer.call(this))}
  <h3>${title}</h3>
  <p>${text}</p>
  </div>
  </div>`;
  popFromWidthStack(this.page);
  return card;
}

function column_100_50_33_33_33(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_50_33_33_33);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_50_33_33_33 ${align}">`;
  }
  return `<div class="column_100_50_33_33_33">`;
}

function column_100_50_50_50_50(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_50_50_50_50);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_50_50_50_50 ${align}">`;
  }
  return `<div class="column_100_50_50_50_50">`;
}

function column_100_50_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_50_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_50_25_25_25 ${align}">`;
  }
  return `<div class="column_100_50_25_25_25">`;
}

function column_100_100_50_50_50(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_50_50_50);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_50_50_50 ${align}">`;
  }
  return `<div class="column_100_100_50_50_50">`;
}

function column_100_25_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_25_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_25_25_25_25 ${align}">`;
  }
  return `<div class="column_100_25_25_25_25">`;
}

function column_100_33_33_33_33(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_33_33_33_33);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_33_33_33_33 ${align}">`;
  }
  return `<div class="column_100_33_33_33_33">`;
}

function column_100_66_66_66_66(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_66_66_66_66);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_66_66_66_66 ${align}">`;
  }
  return `<div class="column_100_66_66_66_66">`;
}

function column_100_75_75_75_75(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_75_75_75_75);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_75_75_75_75 ${align}">`;
  }
  return `<div class="column_100_75_75_75_75">`;
}


function column_50_50_50_50_50(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_50_50_50_50_50);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_50_50_50_50_50 ${align}">`;
  }
  return `<div class="column_50_50_50_50_50">`;
}

function column_33_33_33_33_33(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_33_33_33_33_33);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_33_33_33_33_33 ${align}">`;
  }
  return `<div class="column_33_33_33_33_33">`;
}

function column_25_25_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_25_25_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_25_25_25_25_25 ${align}">`;
  }
  return `<div class="column_25_25_25_25_25">`;
}

function column_100_100_66_66_66(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_66_66_66);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_66_66_66 ${align}">`;
  }
  return `<div class="column_100_100_66_66_66">`;
}

function column_100_100_33_33_33(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_33_33_33);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_33_33_33 ${align}">`;
  }
  return `<div class="column_100_100_33_33_33">`;
}

function column_100_100_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_25_25_25 ${align}">`;
  }
  return `<div class="column_100_100_25_25_25">`;
}

function column_100_100_75_75_75(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_75_75_75);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_75_75_75 ${align}">`;
  }
  return `<div class="column_100_100_75_75_75">`;
}

function column_100_25_50_50_50(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_25_50_50_50);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_25_50_50_50 ${align}">`;
  }
  return `<div class="column_100_25_50_50_50">`;
}

function column_100_75_50_50_50(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_75_50_50_50);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_75_50_50_50 ${align}">`;
  }
  return `<div class="column_100_75_50_50_50">`;
}

function column_100_25_66_66_66(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_25_66_66_66);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_25_66_66_66 ${align}">`;
  }
  return `<div class="column_100_25_66_66_66">`;
}

function column_100_25_100_100_100(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_25_100_100_100);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_25_100_100_100 ${align}">`;
  }
  return `<div class="column_100_25_100_100_100">`;
}

// 

function column_100_20_40_40_40(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_20_40_40_40);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_20_40_40_40 ${align}">`;
  }
  return `<div class="column_100_20_40_40_40">`;
}

function column_100_80_60_60_60(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_80_60_60_60);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_80_60_60_60 ${align}">`;
  }
  return `<div class="column_100_80_60_60_60">`;
}

function column_100_20_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_20_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_20_25_25_25 ${align}">`;
  }
  return `<div class="column_100_20_25_25_25">`;
}

function column_100_80_55_55_55(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_80_55_55_55);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_80_55_55_55 ${align}">`;
  }
  return `<div class="column_100_80_55_55_55">`;
}

function column_100_100_20_20_20(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_20_20_20);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_20_20_20 ${align}">`;
  }
  return `<div class="column_100_100_20_20_20">`;
}

function column_100_85_45_45_45(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_85_45_45_45);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_85_45_45_45 ${align}">`;
  }
  return `<div class="column_100_85_45_45_45">`;
}

function column_100_15_10_10_10(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_15_10_10_10);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_15_10_10_10 ${align}">`;
  }
  return `<div class="column_100_15_10_10_10">`;
}

function column_100_20_55_55_55(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_20_55_55_55);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_20_55_55_55 ${align}">`;
  }
  return `<div class="column_100_20_55_55_55">`;
}

function column_100_55_35_35_35(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_55_35_35_35);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_55_35_35_35 ${align}">`;
  }
  return `<div class="column_100_55_35_35_35">`;
}

function column_100_25_10_10_10(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_25_10_10_10);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_25_10_10_10 ${align}">`;
  }
  return `<div class="column_100_25_10_10_10">`;
}

function column_100_80_75_75_75(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_80_75_75_75);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_80_75_75_75 ${align}">`;
  }
  return `<div class="column_100_80_75_75_75">`;
}

function column_45_45_100_100_100(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_45_45_100_100_100);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_45_45_100_100_100 ${align}">`;
  }
  return `<div class="column_45_45_100_100_100">`;
}

function column_55_55_100_100_100(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_55_55_100_100_100);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_55_55_100_100_100 ${align}">`;
  }
  return `<div class="column_55_55_100_100_100">`;
}

function column_30_35_50_50_50(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_30_35_50_50_50);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_30_35_50_50_50 ${align}">`;
  }
  return `<div class="column_30_35_50_50_50">`;
}

function column_100_100_70_70_70(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_70_70_70);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_70_70_70 ${align}">`;
  }
  return `<div class="column_100_100_70_70_70">`;
}

function column_50_40_30_30_30(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_50_40_30_30_30);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_50_40_30_30_30 ${align}">`;
  }
  return `<div class="column_50_40_30_30_30">`;
}

function column_100_80_50_50_50(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_80_50_50_50);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_80_50_50_50 ${align}">`;
  }
  return `<div class="column_100_80_50_50_50">`;
}

function column_100_60_55_55_55(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_60_55_55_55);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_60_55_55_55 ${align}">`;
  }
  return `<div class="column_100_60_55_55_55">`;
}

function column_100_20_20_20_20(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_20_20_20_20);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_20_20_20_20 ${align}">`;
  }
  return `<div class="column_100_20_20_20_20">`;
}

function column_100_70_35_35_35(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_70_35_35_35);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_70_35_35_35 ${align}">`;
  }
  return `<div class="column_100_70_35_35_35">`;
}

function column_100_10_10_10_10(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_10_10_10_10);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_10_10_10_10 ${align}">`;
  }
  return `<div class="column_100_10_10_10_10">`;
}

function column_100_10_100_100_100(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_10_100_100_100);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_10_100_100_100 ${align}">`;
  }
  return `<div class="column_100_10_100_100_100">`;
}

function column_100_90_85_85_85(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_90_85_85_85);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_90_85_85_85 ${align}">`;
  }
  return `<div class="column_100_90_85_85_85">`;
}

function column_100_100_15_15_15(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_100_100_15_15_15);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_100_100_15_15_15 ${align}">`;
  }
  return `<div class="column_100_100_15_15_15">`;
}

function column_10_25_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_10_25_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_10_25_25_25_25 ${align}">`;
  }
  return `<div class="column_10_25_25_25_25">`;
}

function column_90_75_75_75_75(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_90_75_75_75_75);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_90_75_75_75_75 ${align}">`;
  }
  return `<div class="column_90_75_75_75_75">`;
}

function column_10_20_40_40_40(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_10_20_40_40_40);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_10_20_40_40_40 ${align}">`;
  }
  return `<div class="column_10_20_40_40_40">`;
}

function column_70_80_60_60_60(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_70_80_60_60_60);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_70_80_60_60_60 ${align}">`;
  }
  return `<div class="column_70_80_60_60_60">`;
}

function column_20_20_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_20_20_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_20_20_25_25_25 ${align}">`;
  }
  return `<div class="column_20_20_25_25_25">`;
}

function column_55_80_55_55_55(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_55_80_55_55_55);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_55_80_55_55_55 ${align}">`;
  }
  return `<div class="column_55_80_55_55_55">`;
}

function column_25_100_20_20_20(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_25_100_20_20_20);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_25_100_20_20_20 ${align}">`;
  }
  return `<div class="column_25_100_20_20_20">`;
}

function column_10_20_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_10_20_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_10_20_25_25_25 ${align}">`;
  }
  return `<div class="column_10_20_25_25_25">`;
}

function column_70_80_55_55_55(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_70_80_55_55_55);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_70_80_55_55_55 ${align}">`;
  }
  return `<div class="column_70_80_55_55_55">`;
}

function column_20_100_20_20_20(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_20_100_20_20_20);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_20_100_20_20_20 ${align}">`;
  }
  return `<div class="column_20_100_20_20_20">`;
}

function column_80_80_75_75_75(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_80_80_75_75_75);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_80_80_75_75_75 ${align}">`;
  }
  return `<div class="column_80_80_75_75_75">`;
}

function column_40_40_55_55_55(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_40_40_55_55_55);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_40_40_55_55_55 ${align}">`;
  }
  return `<div class="column_40_40_55_55_55">`;
}

function column_60_60_35_35_35(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_60_60_35_35_35);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_60_60_35_35_35 ${align}">`;
  }
  return `<div class="column_60_60_35_35_35">`;
}

function column_20_10_10_10_10(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_20_10_10_10_10);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_20_10_10_10_10 ${align}">`;
  }
  return `<div class="column_20_10_10_10_10">`;
}

function column_10_10_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_10_10_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_10_10_25_25_25 ${align}">`;
  }
  return `<div class="column_10_10_25_25_25">`;
}

function column_90_90_75_75_75(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_90_90_75_75_75);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_90_90_75_75_75 ${align}">`;
  }
  return `<div class="column_90_90_75_75_75">`;
}

function column_70_60_55_55_55(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_70_60_55_55_55);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_70_60_55_55_55 ${align}">`;
  }
  return `<div class="column_70_60_55_55_55">`;
}

function column_25_20_20_20_20(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_25_20_20_20_20);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_25_20_20_20_20 ${align}">`;
  }
  return `<div class="column_25_20_20_20_20">`;
}

function column_50_50_25_25_25(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_50_50_25_25_25);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_50_50_25_25_25 ${align}">`;
  }
  return `<div class="column_50_50_25_25_25">`;
}

function column_5_10_100_100_100(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_5_10_100_100_100);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_5_10_100_100_100 ${align}">`;
  }
  return `<div class="column_5_10_100_100_100">`;
}

function column_5_100_15_15_15(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_5_100_15_15_15);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_5_100_15_15_15 ${align}">`;
  }
  return `<div class="column_5_100_15_15_15">`;
}

function column_90_90_85_85_85(align = null) {
  pushAdaptiveOnWidthStack(this.page, responsive.COLUMN_90_90_85_85_85);
  if(align && (typeof(align) != 'object') ) {
    return `<div class="column_90_90_85_85_85 ${align}">`;
  }
  return `<div class="column_90_90_85_85_85">`;
}

function endColumn() {
  popFromWidthStack(this.page);
  return `</div>`;
}

function container(responsive, container) {
  if(typeof container !== "undefined" && container !== null && container.MAX_WIDTH && container.GAP) {
    pushMaxWidthOnWidthStack(this.page, container.MAX_WIDTH);
    pushGapOnWidthStack(this.page, container.GAP);
  } else {
    pushMaxWidthOnWidthStack(this.page, responsive.MAX_WIDTH);
    pushGapOnWidthStack(this.page, responsive.GAP);
  }
  return `<div class="container">`;
}

function customContainer(container) {
  pushMaxWidthOnWidthStack(this.page, container.MAX_WIDTH);
  pushGapOnWidthStack(this.page, container.GAP);

  // console.log('this.page', this.page);

  return `<div class="custom-container">`;
}

function endContainer() {
  popFromWidthStack(this.page); // padding
  popFromWidthStack(this.page); // max-width
  return `</div>`;
}

module.exports = {
  getStack: getWidthStack,
  pushOnStack: pushOnWidthStack,
  pushAdaptive: pushAdaptiveOnWidthStack,
  pushMaxWidth: pushMaxWidthOnWidthStack,
  pushGap: pushGapOnWidthStack,
  popFromStack: popFromWidthStack,
  srcset: calcWidthes,
  sizes: calcSizes,
  picture: picture,
  buffer: buffer,
  customBuffer: customBuffer,
  responsiveBuffer: responsiveBuffer,
  endBuffer: endBuffer,
  column_100_50_33_33_33: column_100_50_33_33_33,
  column_100_50_50_50_50:  column_100_50_50_50_50,
  column_100_100_50_50_50:  column_100_100_50_50_50,
  column_100_50_25_25_25:  column_100_50_25_25_25,
  column_100_25_25_25_25:  column_100_25_25_25_25,
  column_100_33_33_33_33:  column_100_33_33_33_33,
  column_100_66_66_66_66:  column_100_66_66_66_66,
  column_100_75_75_75_75:  column_100_75_75_75_75,
  column_50_50_50_50_50:  column_50_50_50_50_50,
  column_33_33_33_33_33:  column_33_33_33_33_33,
  column_25_25_25_25_25:  column_25_25_25_25_25,
  column_100_100_66_66_66:  column_100_100_66_66_66,
  column_100_100_33_33_33:  column_100_100_33_33_33,
  column_100_100_25_25_25:  column_100_100_25_25_25,
  column_100_100_75_75_75:  column_100_100_75_75_75,
  column_100_25_50_50_50:  column_100_25_50_50_50,
  column_100_75_50_50_50:  column_100_75_50_50_50,
  column_100_25_66_66_66:  column_100_25_66_66_66,
  column_100_25_100_100_100:  column_100_25_100_100_100,

  column_100_20_40_40_40:  column_100_20_40_40_40,
  column_100_80_60_60_60:  column_100_80_60_60_60,
  column_100_20_25_25_25:  column_100_20_25_25_25,
  column_100_80_55_55_55:  column_100_80_55_55_55,
  column_100_100_20_20_20:  column_100_100_20_20_20,
  column_100_85_45_45_45:  column_100_85_45_45_45,
  column_100_15_10_10_10:  column_100_15_10_10_10,
  column_100_20_55_55_55:  column_100_20_55_55_55,
  column_100_55_35_35_35:  column_100_55_35_35_35,
  column_100_25_10_10_10:  column_100_25_10_10_10,
  column_100_80_75_75_75:  column_100_80_75_75_75,
  column_55_55_100_100_100:  column_55_55_100_100_100,
  column_45_45_100_100_100:  column_45_45_100_100_100,
  column_30_35_50_50_50 : column_30_35_50_50_50,
  column_100_100_70_70_70:  column_100_100_70_70_70,
  column_50_40_30_30_30 : column_50_40_30_30_30,
  column_100_80_50_50_50 : column_100_80_50_50_50,
  column_100_60_55_55_55 : column_100_60_55_55_55,
  column_100_20_20_20_20 : column_100_20_20_20_20,
  column_100_70_35_35_35 : column_100_70_35_35_35,
  column_100_10_10_10_10 : column_100_10_10_10_10,
  column_100_10_100_100_100 : column_100_10_100_100_100,
  column_100_90_85_85_85 : column_100_90_85_85_85,
  column_100_100_15_15_15 : column_100_100_15_15_15,

  column_10_25_25_25_25 : column_10_25_25_25_25,
  column_90_75_75_75_75 : column_90_75_75_75_75,
  column_10_20_40_40_40 : column_10_20_40_40_40,
  column_70_80_60_60_60 : column_70_80_60_60_60,
  column_20_20_25_25_25 : column_20_20_25_25_25,
  column_55_80_55_55_55 : column_55_80_55_55_55,
  column_25_100_20_20_20 : column_25_100_20_20_20,
  column_10_20_25_25_25 : column_10_20_25_25_25,
  column_70_80_55_55_55 : column_70_80_55_55_55,
  column_20_100_20_20_20 : column_20_100_20_20_20,
  column_80_80_75_75_75 : column_80_80_75_75_75,
  column_40_40_55_55_55 : column_40_40_55_55_55,
  column_60_60_35_35_35 : column_60_60_35_35_35,
  column_20_10_10_10_10 : column_20_10_10_10_10,
  column_10_10_25_25_25 : column_10_10_25_25_25,
  column_90_90_75_75_75 : column_90_90_75_75_75,
  column_70_60_55_55_55 : column_70_60_55_55_55,
  column_25_20_20_20_20 : column_25_20_20_20_20,
  column_50_50_25_25_25 : column_50_50_25_25_25,

  column_5_10_100_100_100 : column_5_10_100_100_100,
  column_5_100_15_15_15 : column_5_100_15_15_15,
  column_90_90_85_85_85 : column_90_90_85_85_85,
  endColumn: endColumn,
  container: container,
  customContainer: customContainer,
  endContainer: endContainer,
  card: card1
}