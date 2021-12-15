---
layout: layout.njk
title: Picture
---

{% container responsive, container %}

# Picture

A component for responsive image.

<pre>
<code>
&#123;% picture responsive, "image_src", "image_alt" %&#125;
</code>
</pre>

There is 3 params:

**responsive**: current obj with main params for gaps, responsive layout grid, site max-width, main users device screens. Usually, it is file "responsive.json" with path: "./data/responsive.json". If this file is not defined in project, obj data with default params will be taken from responsive.json with path: "./node_modules/lib/data/responsive.json". 

In file ".eleventy.js" at the root of the site you need to define data from the lib package:
{% buffer responsive, custom_buffer %}
<pre>
<code>
const lib = require("lib");
</code>
</pre>
{% endBuffer %}

And add global data to this project.

{% buffer responsive, custom_buffer %}
<pre>
<code>
eleventyConfig.addGlobalData("responsive", lib.libData);
</code>
</pre>
{% endBuffer %}

**image_src**: path to your source image. You can use svg, png or jpg/jpeg formats. Source image have be in high resolution - img plugin cannot upscale your image for output images with a size above.

**image_alt**: alt text for img.


Depending on the format of the source, you will get results like this:

**svg**

{% buffer responsive, custom_buffer %}
{% picture responsive, "img/picture/image-3.svg", "Svg example" %}
{% endBuffer %}

**png**

{% buffer responsive, custom_buffer %}
{% picture responsive, "img/picture/image-2.png", "Png example" %}
{% endBuffer %}

**jpg**

{% buffer responsive, custom_buffer %}
{% picture responsive, "img/picture/image-1.jpg", "Jpg example" %}
{% endBuffer %}

{% endContainer %}

---

{% container responsive, container %}

## CUSTOM WIDTH PICTURE

{% customContainer custom_container %}
{% picture responsive, "img/picture/image-1.jpg", "Jpg example" %}
{% endContainer %}

{% endContainer %}