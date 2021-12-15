const responsive = require("./_data/responsive.json");
const typography = require("./_data/typography.js");
const responsiveJS = require("./responsive.js");
const pictureSvgPng = require("./picture.js");
const cardConfig = require("./_data/card.json");
const menu = require("./_data/menu.js");
const menuFunc = require("./menu.js");
const site = require("./_data/site.json");
const designSystem = require("./design-system.js");
const utils = require("./utils.js");
const containerData = require("./_data/container.js");
const customBufferData = require("./_data/custom_buffer.js");

function indicatorShortcode() {
  return '<p>indicatorShortcode from 11ty index.js. </p>'
}

module.exports = {
  indicatorShrt: indicatorShortcode,
  libData: responsive,
  typography: typography,
  container: responsiveJS.container,
  endContainer: responsiveJS.endContainer,
  column_100_50_33_33_33: responsiveJS.column_100_50_33_33_33,
  column_100_50_50_50_50: responsiveJS.column_100_50_50_50_50,
  column_100_100_50_50_50: responsiveJS.column_100_100_50_50_50,
  column_100_50_25_25_25: responsiveJS.column_100_50_25_25_25,
  column_100_25_25_25_25: responsiveJS.column_100_25_25_25_25,
  column_100_33_33_33_33: responsiveJS.column_100_33_33_33_33,
  column_100_66_66_66_66:  responsiveJS.column_100_66_66_66_66,
  column_100_75_75_75_75:  responsiveJS.column_100_75_75_75_75,
  column_50_50_50_50_50: responsiveJS.column_50_50_50_50_50,
  column_33_33_33_33_33: responsiveJS.column_33_33_33_33_33,
  column_25_25_25_25_25: responsiveJS.column_25_25_25_25_25,
  column_100_100_66_66_66: responsiveJS.column_100_100_66_66_66,
  column_100_100_33_33_33: responsiveJS.column_100_100_33_33_33,
  column_100_100_25_25_25: responsiveJS.column_100_100_25_25_25,
  column_100_100_75_75_75: responsiveJS.column_100_100_75_75_75,
  column_100_25_50_50_50: responsiveJS.column_100_25_50_50_50,
  column_100_75_50_50_50: responsiveJS.column_100_75_50_50_50,
  column_100_25_66_66_66: responsiveJS.column_100_25_66_66_66,
  column_100_25_100_100_100: responsiveJS.column_100_25_100_100_100,

  column_100_20_40_40_40:  responsiveJS.column_100_20_40_40_40,
  column_100_80_60_60_60:  responsiveJS.column_100_80_60_60_60,
  column_100_20_25_25_25:  responsiveJS.column_100_20_25_25_25,
  column_100_80_55_55_55:  responsiveJS.column_100_80_55_55_55,
  column_100_100_20_20_20:  responsiveJS.column_100_100_20_20_20,
  column_100_85_45_45_45:  responsiveJS.column_100_85_45_45_45,
  column_100_15_10_10_10:  responsiveJS.column_100_15_10_10_10,
  column_100_20_55_55_55:  responsiveJS.column_100_20_55_55_55,
  column_100_55_35_35_35:  responsiveJS.column_100_55_35_35_35,
  column_100_25_10_10_10:  responsiveJS.column_100_25_10_10_10,
  column_100_80_75_75_75:  responsiveJS.column_100_80_75_75_75,
  column_55_55_100_100_100:  responsiveJS.column_55_55_100_100_100,
  column_45_45_100_100_100:  responsiveJS.column_45_45_100_100_100,
  column_30_35_50_50_50 : responsiveJS.column_30_35_50_50_50,
  column_100_100_70_70_70:  responsiveJS.column_100_100_70_70_70,
  column_50_40_30_30_30 : responsiveJS.column_50_40_30_30_30,
  column_100_80_50_50_50 : responsiveJS.column_100_80_50_50_50,
  column_100_60_55_55_55 : responsiveJS.column_100_60_55_55_55,
  column_100_20_20_20_20 : responsiveJS.column_100_20_20_20_20,
  column_100_70_35_35_35 : responsiveJS.column_100_70_35_35_35,
  column_100_10_10_10_10 : responsiveJS.column_100_10_10_10_10,
  column_100_10_100_100_100 : responsiveJS.column_100_10_100_100_100,
  column_100_90_85_85_85 : responsiveJS.column_100_90_85_85_85,
  column_100_100_15_15_15 : responsiveJS.column_100_100_15_15_15,

  column_10_25_25_25_25 : responsiveJS.column_10_25_25_25_25,
  column_90_75_75_75_75 : responsiveJS.column_90_75_75_75_75,
  column_10_20_40_40_40 : responsiveJS.column_10_20_40_40_40,
  column_70_80_60_60_60 : responsiveJS.column_70_80_60_60_60,
  column_20_20_25_25_25 : responsiveJS.column_20_20_25_25_25,
  column_55_80_55_55_55 : responsiveJS.column_55_80_55_55_55,
  column_25_100_20_20_20 : responsiveJS.column_25_100_20_20_20,
  column_10_20_25_25_25 : responsiveJS.column_10_20_25_25_25,
  column_70_80_55_55_55 : responsiveJS.column_70_80_55_55_55,
  column_20_100_20_20_20 : responsiveJS.column_20_100_20_20_20,
  column_80_80_75_75_75 : responsiveJS.column_80_80_75_75_75,
  column_40_40_55_55_55 : responsiveJS.column_40_40_55_55_55,
  column_60_60_35_35_35 : responsiveJS.column_60_60_35_35_35,
  column_20_10_10_10_10 : responsiveJS.column_20_10_10_10_10,
  column_10_10_25_25_25 : responsiveJS.column_10_10_25_25_25,
  column_90_90_75_75_75 : responsiveJS.column_90_90_75_75_75,
  column_70_60_55_55_55 : responsiveJS.column_70_60_55_55_55,
  column_25_20_20_20_20 : responsiveJS.column_25_20_20_20_20,
  column_50_50_25_25_25 : responsiveJS.column_50_50_25_25_25,
  column_5_10_100_100_100 : responsiveJS.column_5_10_100_100_100,
  column_5_100_15_15_15 : responsiveJS.column_5_100_15_15_15,
  column_90_90_85_85_85 : responsiveJS.column_90_90_85_85_85,

  endColumn: responsiveJS.endColumn,
  buffer : responsiveJS.buffer,
  responsiveBuffer : responsiveJS.responsiveBuffer,
  endBuffer : responsiveJS.endBuffer,
  picture : responsiveJS.picture,
  pushGap: responsiveJS.pushGap,
  popFromStack: responsiveJS.popFromStack,
  card: responsiveJS.card,
  pictureSvgPng: pictureSvgPng.SvgPng,
  cardConfig: cardConfig,
  menu: menu,
  recursiveMenu: menuFunc.recursiveMenu,
  site: site,
  designSystem: designSystem,
  debug: utils.debug,
  containerData: containerData,
  customBufferData: customBufferData
}