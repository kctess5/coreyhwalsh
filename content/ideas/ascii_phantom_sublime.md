---
title: "Phantom.js snapshot ascii rendering + Sublime"
date: "2015-02-25"
description: "Sublime Text as a web browser"
---

<p>Basically, think sublime plugin that wraps a Phantom.js instance. When things change, a snapshot is taken of the rendered HTML, which is then rasterized into colored ascii. This ascii gets saved to a file, and that file gets opened/reloaded in a Sublime Text window.</p>
<p class='down-1'>pseudo-bash$ Phantom.shapshot() | ImgToAscii > temp.txt<br>pseudo-bash$ Sublime.reload(temp.txt)</p>
<p class='down-2'>While this alone would be cool to see, I bet this could be made into a sort of UI for other Sublime Plugins that need GUI interfaces. Would make for an interesting weekend project. Hmmmm....</p>