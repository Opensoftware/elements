// const path = require("path");
const Image = require("@11ty/eleventy-img");

const responsive = require("./responsive.js");
const cardData = require("./_data/card.json");
const utils = require("./utils.js");
const menu = require("./menu.js");
const favicon = require("./favicon.js");

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



module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("js/**/*.js");
  eleventyConfig.addPassthroughCopy("css/**/*.css");
  eleventyConfig.addPassthroughCopy("img");

  eleventyConfig.addShortcode("buffer", responsive.buffer);
  eleventyConfig.addShortcode("endBuffer", responsive.endBuffer);

  eleventyConfig.addShortcode("column_100_50_33_33_33", responsive.column_100_50_33_33_33);
  eleventyConfig.addShortcode("endColumn", responsive.endColumn);

  eleventyConfig.addShortcode("container", responsive.container);
  eleventyConfig.addShortcode("customContainer", responsive.customContainer);
  eleventyConfig.addShortcode("endContainer", responsive.endContainer);
  
  eleventyConfig.addAsyncShortcode("picture", responsive.picture);
  eleventyConfig.addAsyncShortcode("pictureSvgPng", pictureSvgPng);
  eleventyConfig.addAsyncShortcode("card", card);
  eleventyConfig.addShortcode("colorBlock", colorBlock);
  eleventyConfig.addShortcode("debug", utils.debug);
  eleventyConfig.addShortcode("recursiveMenu", menu.recursiveMenu);
  eleventyConfig.addAsyncShortcode("favicons", favicon.makeFavicons);

  async function card(responsiveJSON, src, alt, title, url) {
    responsive.pushGap(this.page, cardData.PADDING*2 + cardData.BORDER*2);
    let card = `<div class="card">
                <div class="card__inner">
                  <a href="${url}">
                    ${(await responsive.picture.call(this, responsiveJSON, src, alt))}
                    <h3 class="card__title">${title}</h3>
                  </a>
                </div>
              </div>`;
    responsive.popFromStack(this.page);
    return card;
  }

  function colorBlock(theme, color, label) {
    let colorBlock = `<div class="color-block">
                  <div style="background-color: ${ color }; color: ${ label };">
                    <div class="color-block__buffer">
                      <p class="color-block__label">
                        ${ theme }
                      </p>
                      <div class="spacer-40"></div>
                      <p class="color-block__hex">
                        ${ color }
                      </p>
                    </div>
                  </div>
                </div>
    `;
    return colorBlock;
  }

  return {
    markdownTemplateEngine: 'njk'
  };
}

