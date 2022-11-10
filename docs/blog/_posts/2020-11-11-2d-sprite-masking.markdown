---
layout: post
title:  "2D Tint Masking in Unity"
tags: unity programming C# graphics
---
First, make a single-channel texture to use as your mask:

![](/blog/assets/images/tumblr_1426a7931d35547cb846362d008a1fc6_93adf90d_540.png)

Next, add it as a secondary texture in the sprite editor window:

![](/blog/assets/images/tumblr_ea94252d96174a2e0412a1cc01cbf9eb_27426728_1280.png)

Finally, create a variant of a sprite shader and simply reference and use the mask via the name you chose in the previous step! No need to expose the tint mask as a shader property, it will be automatically set by SpriteRenderer:

![](/blog/assets/images/tumblr_443fe94a3ac0eea0412a1faa15c92af6_49506762_640.png)

## Assets
* [https://opengameart.org/content/slime-monster-24x24](https://opengameart.org/content/slime-monster-24x24)
* [https://opengameart.org/content/tiny-16-basic](https://opengameart.org/content/tiny-16-basic)