const responsive = require('./responsive.json');
const colors = require('./colors.json');

const ON_BACKGROUND = colors['On Background'].color;
const BACKGROUND_COLOR = colors.Background.color;
const GAP = responsive.GAP;
const MAIN_FONT_FAMILY = 'Roboto';
const FMODS_FONT_FAMILY = 'Arial';
const FONT_FAMILY_STYLE = 'sans-serif';

module.exports = {
  body: {
    'default': {
      'margin' : '0',
      'padding' : '0',
      'color' : `${ON_BACKGROUND}`,
      'background-color': `${BACKGROUND_COLOR}`,
      'font-family': `${MAIN_FONT_FAMILY}, ${FMODS_FONT_FAMILY}, ${FONT_FAMILY_STYLE}`
    }
  },
  h1: {
    'default': {
      'margin' : '0',
      'padding' : `13.44px ${GAP}px 13.44px ${GAP}px`,
      'font-family': `${MAIN_FONT_FAMILY}`,
      'font-weight': '700',
      'font-size' : '32px',
      'line-height': '150%',
      'word-spacing': '0px',
      'letter-spacing': '0px',
      'text-transform': 'none'
    },
    'desktop': {
    },
    'laptop': {
    },
    'tablet': {
    },
    'phone': {
    }
  },
  h2: {
    'default': {
      'margin' : '0',
      'padding' : `13.44px ${GAP}px 13.44px ${GAP}px`,
      'font-family': `${MAIN_FONT_FAMILY}`,
      'font-weight': '700',
      'font-size' : '24px',
      'line-height': '148%',
      'word-spacing': '0px',
      'letter-spacing': '0px',
      'text-transform': 'none'
    },
    'desktop': {
    },
    'laptop': {
    },
    'tablet': {
    },
    'phone': {
    }
  },
  h3: {
    'default': {
      'margin' : '0',
      'padding' : `13.44px ${GAP}px 13.44px ${GAP}px`,
      'font-family': `${MAIN_FONT_FAMILY}`,
      'font-weight': '700',
      'font-size' : '18.72px',
      'line-height': '156%',
      'word-spacing': '0px',
      'letter-spacing': '0px',
      'text-transform': 'none'
    },
    'desktop': {
    },
    'laptop': {
    },
    'tablet': {
    },
    'phone': {
    }
  },
  p: {
    'default': {
      'margin' : '0',
      'padding' : `${GAP}px`,
      'font-family': `${MAIN_FONT_FAMILY}`,
      'font-weight': '400',
      'font-size' : '16px',
      'line-height': '24px',
      'word-spacing': '0px',
      'letter-spacing': '0px',
      'text-transform': 'none'
    },
    'desktop': {
    },
    'laptop': {
    },
    'tablet': {
    },
    'phone': {
    }
  },
}