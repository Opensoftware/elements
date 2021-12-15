---
layout: layout.njk
title: Favicon
---

# Favicon

## Links

- [Microsoft favicon/pinned icon](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/hh772707(v=vs.85))
- [Safari Pinned Tab Icons](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/pinnedTabs/pinnedTabs.html)
- [rel="icon", instead of rel="shortcut icon"](https://mathiasbynens.be/notes/rel-shortcut-icon)
- [Google - favicon to show in search results](https://developers.google.com/search/docs/advanced/appearance/favicon-in-search?visit_id=637612551778130156-3112088115&rd=1)
- [Definitive edition of "How to Favicon in 2021"](https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7)
- [Simple favicon](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs);
- [All cases favicon](https://habr.com/ru/post/522844/);
- [Check favicon](https://realfavicongenerator.net/);

## Head

<pre>
<code>
&lt;link type="image/x-icon" rel="icon" href="/favicon.ico"&gt;

&lt;link type="image/svg+xml" rel="icon" href="img/favicons/favicon.svg"&gt;

&lt;link type="image/png" sizes="16x16" rel="icon" href="/img/favicon-16x16.png"&gt;
&lt;link type="image/png" sizes="32x32" rel="icon" href="/img/favicon-32x32.png"&gt;
&lt;link type="image/png" sizes="48x48" rel="icon" href="/img/favicon-48x48.png"&gt;
&lt;link type="image/png" sizes="96x96" rel="icon" href="/img/favicon-96x96.png"&gt;
&lt;link type="image/png" sizes="120x120" rel="icon" href="/img/favicon-120x120.png"&gt;

&lt;link type="image/png" sizes="192x192" rel="icon" href="/img/android-icon-192x192.png"&gt;
&lt;link type="image/png" sizes="512x512" rel="icon" href="/img/android-icon-512x512.png"&gt;

&lt;link sizes="57x57" rel="apple-touch-icon" href="/img/apple-touch-icon-57x57.png"&gt;
&lt;link sizes="60x60" rel="apple-touch-icon" href="/img/apple-touch-icon-60x60.png"&gt;
&lt;link sizes="72x72" rel="apple-touch-icon" href="/img/apple-touch-icon-72x72.png"&gt;
&lt;link sizes="76x76" rel="apple-touch-icon" href="/img/apple-touch-icon-76x76.png"&gt;
&lt;link sizes="114x114" rel="apple-touch-icon" href="/img/apple-touch-icon-114x114.png"&gt;
&lt;link sizes="120x120" rel="apple-touch-icon" href="/img/apple-touch-icon-120x120.png"&gt;
&lt;link sizes="144x144" rel="apple-touch-icon" href="/img/apple-touch-icon-144x144.png"&gt;
&lt;link sizes="152x152" rel="apple-touch-icon" href="/img/apple-touch-icon-152x152.png"&gt;
&lt;link sizes="180x180" rel="apple-touch-icon" href="/img/apple-touch-icon-180x180.png"&gt;

&lt;link color="#2962FF" rel="mask-icon" href="img/favicons/favicon-black.svg"&gt;

&lt;meta name="application-name" content="softevol"&gt;
&lt;meta name="msapplication-TileColor" content="#FFFFFF"&gt;
&lt;meta name="msapplication-square70x70logo" content="/img/mstile-70x70.png"&gt;
&lt;meta name="msapplication-square150x150logo" content="/img/mstile-150x150.png"&gt;
&lt;meta name="msapplication-square310x310logo" content="/img/mstile-310x310.png"&gt;
&lt;meta name="msapplication-square310x150logo" content="/img/mstile-310x150.png"&gt;

&lt;meta name="msapplication-config" content="/browserconfig.xml"&gt;

&lt;link rel="manifest" href="/manifest.json"&gt;
&lt;meta name="theme-color" content="#2962FF"&gt;
</code>
</pre>

## browserconfig

<pre>
<code>

&lt;browserconfig&gt;
    &lt;msapplication&gt;
        &lt;tile&gt;
            &lt;square70x70logo src="/img/mstile-70x70.png"/&gt;
            &lt;square150x150logo src="/img/mstile-150x150.png"/&gt;
            &lt;square310x310logo src="/img/mstile-310x310.png"/&gt;
            &lt;square310x150logo src="/img/mstile-310x150.png"/&gt;
            &lt;TileColor&gt;#FFFFFF&lt;/TileColor&gt;
        &lt;/tile&gt;
    &lt;/msapplication&gt;
&lt;/browserconfig&gt;

</code>
</pre>