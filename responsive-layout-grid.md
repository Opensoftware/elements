---
layout: layout.njk
title: Responsive layout grid
---

# Responsive layout grid

Responsive layout gives:

- responsive-container. If you want have a responsive grid on yor website, you need to use this container like parent for your columns;
- responsive-block-4-4-4-4 (or "responsive-block-100-50-33-33")

0 - 600
600 - 905
905 - 1240
1240 +

"RESPONSIVE_BLOCK" : [
  {"class": "block-4444",
    "phone": "100",
    "tablet": "50",
    "laptop": "33.33",
    "desktop": "33.33"
  },
  {"class": "block-4844",
    "phone": "100",
    "tablet": "100",
    "laptop": "33.33",
    "desktop": "33.33"
  }
]