---
layout: post
title:  "2D Tint Masking in Unity"
tags: unity programming C# graphics
---
## A mini guide to easy 2D tint masking in Unity!
First, make a single-channel texture to use as your mask:

![](https://64.media.tumblr.com/1426a7931d35547cb846362d008a1fc6/f166f6e0ead6c3be-70/s540x810/93adf90d47ffdb6d2c12968fe47d16a02fed126b.png)

Next, add it as a secondary texture in the sprite editor window:

![](https://64.media.tumblr.com/ea94252d96174a2e0412a1cc01cbf9eb/f166f6e0ead6c3be-4d/s540x810/275fd7366bf1c06f09dfe7338dd8bc64e6db858b.png)

Finally, create a variant of a sprite shader and simply reference and use the mask via the name you chose in the previous step! No need to expose the tint mask as a shader property, it will be automatically set by SpriteRenderer:

![](https://64.media.tumblr.com/443fe94a3ac0eea0412a1faa15c92af6/f166f6e0ead6c3be-6e/s540x810/d62617ceae16c8a1d0bbe2e88d7c257f89b3cab1.png)

## Assets
* [https://opengameart.org/content/slime-monster-24x24](https://opengameart.org/content/slime-monster-24x24)
* [https://opengameart.org/content/tiny-16-basic](https://opengameart.org/content/tiny-16-basic)