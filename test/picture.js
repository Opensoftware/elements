const {srcset, sizes} = require('../responsive.js');
const responsive = require('../_data/responsive.json');

function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}

const RESPONSIVE_PADDING = {
  "phone": 4,
  "tablet": 8,
  "laptop": 12,
  "desktop": 16,
  "default": 20
};

let localWidthesProcessed = responsive.SCREEN_WIDTHES.slice();
let maxWidth = localWidthesProcessed[localWidthesProcessed.length - 1];
let count = localWidthesProcessed.length;
let mediaRange = 6;
for(let i = 0; i < count; i++) {
  let width = localWidthesProcessed[i];

  if(localWidthesProcessed[i] < responsive.MEDIA.phone) {
    localWidthesProcessed[i] -= RESPONSIVE_PADDING.phone*2;
  }

  if(localWidthesProcessed[i] >= responsive.MEDIA.phone && localWidthesProcessed[i] < responsive.MEDIA.tablet) {
    localWidthesProcessed[i] -= RESPONSIVE_PADDING.tablet*2;
  }
  
  if(localWidthesProcessed[i] >= responsive.MEDIA.tablet && localWidthesProcessed[i] < responsive.MEDIA.laptop) {
    localWidthesProcessed[i] -= RESPONSIVE_PADDING.laptop*2;
  }
  
  if(localWidthesProcessed[i] >= responsive.MEDIA.laptop && localWidthesProcessed[i] < responsive.MEDIA.desktop) {
    localWidthesProcessed[i] -= RESPONSIVE_PADDING.desktop*2;
  }

  if(localWidthesProcessed[i] >= responsive.MEDIA.desktop) {
    localWidthesProcessed[i] -= RESPONSIVE_PADDING.default*2;
  }

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

console.log('localWidthesProcessed', localWidthesProcessed);


/**
 *  empty operations
 **/
 let operations1 = [];
 let srcset1 = [320, 360, 375, 414, 428, 640, 720, 750, 768, 828, 856, 960, 1024, 1080, 1125, 1152, 1240, 1242, 1284, 1536, 1536, 1860, 2048, 2160, 2480, 2880, 1440];
 let sizes1 = '(min-width: 1440px) calc(100vw), (min-width: 1240px) calc(100vw), (min-width: 905px) calc(100vw), (min-width: 600px) calc(100vw), calc(100vw)';
 
 /**
  *  max width
  *  max-width should be larger than any media and first in the list.
  **/
 let operations2 = [{ maxWidth: 800 }];
 let srcset2 = [320, 360, 375, 414, 428, 640, 720, 750, 768, 828, 856, 960, 1080, 1125, 1152, 1200, 1242, 1284, 1536, 1600, 800];
 let sizes2 = '(min-width: 800px) 800px, (min-width: 1440px) calc(100vw), (min-width: 1240px) calc(100vw), (min-width: 905px) calc(100vw), (min-width: 600px) calc(100vw), calc(100vw)';
 
 /**
  *  padding
  **/
 let operations3 = [{ gap: 8*2 }];
 let srcset3 = [304, 344, 359, 398, 412, 608, 688, 718, 752, 796, 824, 912, 1008, 1032, 1077, 1128, 1194, 1224, 1236, 1504, 1512, 1836, 2016, 2136, 2448, 2848, 1424];
 let sizes3 = '(min-width: 1440px) calc((100vw - 16px)), (min-width: 1240px) calc((100vw - 16px)), (min-width: 905px) calc((100vw - 16px)), (min-width: 600px) calc((100vw - 16px)), calc((100vw - 16px))';
 
  /**
  *  maxWidth + padding
  **/
 let operations4 = [{ maxWidth: 800 }, { gap: 8*2 }];
 let srcset4 = [304, 344, 359, 398, 412, 608, 688, 718, 752, 796, 824, 912, 1032, 1077, 1128, 1176, 1194, 1236, 1504, 1568, 784];
 let sizes4 = '(min-width: 800px) 784px, (min-width: 1440px) calc((100vw - 16px)), (min-width: 1240px) calc((100vw - 16px)), (min-width: 905px) calc((100vw - 16px)), (min-width: 600px) calc((100vw - 16px)), calc((100vw - 16px))';
 
 /**
  *  responsive
  **/
 let operations5 = [{adaptive: {"phone":  responsive.COLUMN_100_50_33_33_33.phone, "tablet":  responsive.COLUMN_100_50_33_33_33.tablet, "laptop":  responsive.COLUMN_100_50_33_33_33.laptop, "desktop":  responsive.COLUMN_100_50_33_33_33.desktop, "default":  responsive.COLUMN_100_50_33_33_33.default}}];
 let srcset5 = [320, 341, 360, 375, 384, 413, 414, 428, 512, 576, 620, 640, 682, 720, 720, 750, 768, 826, 828, 856, 960, 960, 1080, 1125, 1242, 1284, 480];
 let sizes5 = `(min-width: 1440px) calc((100vw / 3)), (min-width: 1240px) calc((100vw / 3)), (min-width: 905px) calc((100vw / 3)), (min-width: 600px) calc((100vw / 2)), calc(100vw)`;
 
 /**
  *  padding outer + responsive
  **/
 let operations6 = [{ gap: 8*2 }, {adaptive: {"phone":  responsive.COLUMN_100_50_33_33_33.phone, "tablet":  responsive.COLUMN_100_50_33_33_33.tablet, "laptop":  responsive.COLUMN_100_50_33_33_33.laptop, "desktop":  responsive.COLUMN_100_50_33_33_33.desktop,  "default":  responsive.COLUMN_100_50_33_33_33.default}}];
 let srcset6 = [304, 336, 344, 359, 376, 398, 408, 412, 504, 564, 608, 612, 672, 688, 713, 718, 752, 796, 816, 824, 912, 950, 1032, 1077, 1194, 1236, 475];
 let sizes6 = '(min-width: 1440px) calc(((100vw - 16px) / 3)), (min-width: 1240px) calc(((100vw - 16px) / 3)), (min-width: 905px) calc(((100vw - 16px) / 3)), (min-width: 600px) calc(((100vw - 16px) / 2)), calc((100vw - 16px))';
 
 /**
  *  responsive + padding inner
  **/
 let operations7 = [{adaptive: {"phone":  responsive.COLUMN_100_50_33_33_33.phone, "tablet":  responsive.COLUMN_100_50_33_33_33.tablet, "laptop":  responsive.COLUMN_100_50_33_33_33.laptop, "desktop":  responsive.COLUMN_100_50_33_33_33.desktop,  "default":  responsive.COLUMN_100_50_33_33_33.default}}, { gap: 8*2 }];
 let srcset7 = [304, 344, 359, 398, 412, 368, 496, 604, 704];
 let sizes7 = '(min-width: 1440px) calc(((100vw / 2) - 16px)), (min-width: 1240px) calc(((100vw / 2) - 16px)), (min-width: 905px) calc(((100vw / 2) - 16px)), (min-width: 600px) calc(((100vw / 2) - 16px)), calc((100vw - 16px))';
 
 /**
  *  padding outer + responsive + padding inner
  **/
let operations8 = [{ gap: 8*2 }, {adaptive: {"phone":  responsive.COLUMN_100_50_33_33_33.phone, "tablet":  responsive.COLUMN_100_50_33_33_33.tablet, "laptop":  responsive.COLUMN_100_50_33_33_33.laptop, "desktop":  responsive.COLUMN_100_50_33_33_33.desktop,  "default":  responsive.COLUMN_100_50_33_33_33.default}}, { gap: 8*2 }];
let srcset8 = [288, 328, 343, 382, 396, 360, 488, 596, 696];
let sizes8 = '(min-width: 1440px) calc((((100vw - 16px) / 2) - 16px)), (min-width: 1240px) calc((((100vw - 16px) / 2) - 16px)), (min-width: 905px) calc((((100vw - 16px) / 2) - 16px)), (min-width: 600px) calc((((100vw - 16px) / 2) - 16px)), calc(((100vw - 16px) - 16px))';

 /**
  *  max-width + padding outer + responsive + padding inner
  **/
let operations9 = [{ maxWidth: 800 }, { gap: 8*2 }, {adaptive: {"phone":  responsive.COLUMN_100_50_33_33_33.phone, "tablet":  responsive.COLUMN_100_50_33_33_33.tablet, "laptop":  responsive.COLUMN_100_50_33_33_33.laptop, "desktop":  responsive.COLUMN_100_50_33_33_33.desktop,  "default":  responsive.COLUMN_100_50_33_33_33.default}}, { gap: 8*2 }];
let srcset9 = [288, 328, 343, 382, 396, 360, 376];
let sizes9 = '(min-width: 800px) 376px, (min-width: 1440px) calc((((100vw - 16px) / 2) - 16px)), (min-width: 1240px) calc((((100vw - 16px) / 2) - 16px)), (min-width: 905px) calc((((100vw - 16px) / 2) - 16px)), (min-width: 600px) calc((((100vw - 16px) / 2) - 16px)), calc(((100vw - 16px) - 16px))';


let operations10 = [{ gap: RESPONSIVE_PADDING }];
let srcset10 = [312,  352,  367,  406,  420,  640, 720,  750,  752,  828,  856,  960, 1000, 1080, 1125, 1242, 1248, 1284, 1334, 1440, 1496, 1536, 1536, 1880, 2048, 2049, 2160, 2304, 2304, 2560, 2732, 2880, 2880, 3072, 3840, 1920];
let sizes10 = '(min-width: 1440px) calc((100vw - 40px)), (min-width: 1240px) calc((100vw - 32px)), (min-width: 905px) calc((100vw - 24px)), (min-width: 600px) calc((100vw - 16px)), calc((100vw - 8px))';

  
  
// test 1
// console.log('test 1');
// let srcsetTest = srcset(operations1);
// let sizesTest = sizes(operations1);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset1)? "pass" : "fail");
// console.log(sizesTest === sizes1? "pass" : "fail");
// console.log('---');

// // test 2
// console.log('test 2');
// srcsetTest = srcset(operations2);
// sizesTest = sizes(operations2);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset2)? "pass" : "fail");
// console.log( sizesTest === sizes2? "pass" : "fail");
// console.log('---');

// // test 3
// console.log('test 3');
// srcsetTest = srcset(operations3);
// sizesTest = sizes(operations3);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset3)? "pass" : "fail");
// console.log( sizesTest === sizes3? "pass" : "fail");
// console.log('---');

// // test 4
// console.log('test 4');
// srcsetTest = srcset(operations4);
// sizesTest = sizes(operations4);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset4)? "pass" : "fail");
// console.log( sizesTest === sizes4? "pass" : "fail");
// console.log('---');

// // test 5
// console.log('test 5');
// srcsetTest = srcset(operations5);
// sizesTest = sizes(operations5);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset5)? "pass" : "fail");
// console.log( sizesTest === sizes5? "pass" : "fail");
// console.log('---');

// // test 6
// console.log('test 6');
// srcsetTest = srcset(operations6);
// sizesTest = sizes(operations6);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset6)? "pass" : "fail");
// console.log( sizesTest === sizes6? "pass" : "fail");
// console.log('---');

// // test 7
// console.log('test 7');
// srcsetTest = srcset(operations7);
// sizes = sizes(operations7);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset7)? "pass" : "fail");
// console.log( sizesTest === sizes7? "pass" : "fail");
// console.log('srcsetTest', srcsetTest);
// console.log('srcset7', srcset7);
// console.log('sizesTest', sizesTest);
// console.log('sizes7', sizes7);
// console.log('---');


// // test 8
// console.log('test 8');
// srcsetTest = srcset(operations8);
// sizes = sizes(operations8);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset8)? "pass" : "fail");
// console.log( sizesTest === sizes8? "pass" : "fail");
// console.log('---');


// // test 9
// console.log('test 9');
// srcsetTest = srcset(operations9);
// sizes = sizes(operations9);
// console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset9)? "pass" : "fail");
// console.log( sizesTest === sizes9? "pass" : "fail");
// console.log('---');

// test 10
console.log('test 10');
srcsetTest = srcset(operations10);
sizes = sizes(operations10);
console.log(JSON.stringify(srcsetTest) === JSON.stringify(srcset10)? "pass" : "fail");
console.log( sizesTest === sizes10? "pass" : "fail");
console.log('---');