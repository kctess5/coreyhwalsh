---
title: "Sublime Text Plugin + Google MobWrite - <i>in progress</i>"
date: "2015-02-02"
description: "Like Google Docs, but with Sublime Text."
---

<p><a target='_blank' href='https://github.com/kctess5/SubSync'>github repo: https://github.com/kctess5/SubSync</a> (in progress)</p>
<p><a target='_blank' href='https://code.google.com/p/google-mobwrite/'>background: https://code.google.com/p/google-mobwrite</a></p>
<p class='down-1'>I've wanted to do something with some sort of collaborative edit algorithm for a while now, and I've finally gotten around to doing it. I settled on Google MobWrite because it looks like one of the most powerful options on the market. I originally thought Share.js, but the support for that project, frankly, sucks, so it's not too enticing from that aspect and the code itself doesn't seem quite as thought out as MobWrite.</p>
<p class='down-1'>Unfortunately, MobWrite doesn't have a Python client library, so I've had to start this whole processing by porting code from the Java and Javascript client stuff. Documentation is a bit lacking, so it's been slow going with lots of ? moments, but this process is almost done. Once I finish it, I will just have to write a bit of UI stuff to let users decide what parts of their code they want to share, and the code to make that acutally work.</p>