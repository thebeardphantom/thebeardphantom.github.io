---
layout: post
title:  "The Early Evolution of an Enemy"
tags: unity programming C# graphics
---
**Idea for an enemy: a physically simulated corpse that sprouts spider-like legs. Uses procedural animation to walk along terrain.**

I based my implementation off of [this wonderful post on Reddit](https://www.reddit.com/r/Unity3D/comments/fqabkx/i_tried_to_explain_procedural_animation_in_10/).

First prototype. Lots of issues here. Legs look bad, animation isn’t correct, ragdoll would look better upside down. Also lots of hidden bugs that won’t pop up until later.

![](/blog/assets/images/tumblr_3e48e0dca90ac463fb23d311cf917763_1420b096_540.gif)

Attempt at improving animation. Still syncs up weirdly:

![](/blog/assets/images/tumblr_48ccad1a3b60528ad2667accdf2c4423_faf951e6_540.gif)

At this point I try to see what happens if I let the enemy steer. This is the result, which in my head was it just dancing to [this classic tune from _Chicago_](https://youtu.be/C9dFKRZ8EbU?t=82):

![](/blog/assets/images/tumblr_cee6a2bc9fd96011b9a32a735069c926_b00b836d_540.gif)

I decided to not try and fix the bug, and instead focus on getting the leg animation correct. Doing so meant I had to implement step 8 in the guide, not moving a leg if its two neighbors are also moving. That lead to this:

![](/blog/assets/images/tumblr_dae3b85bbaa4302f40e818aa59bde481_6d578edc_540.gif)

My partner informed me that the legs look like garbage, and she helped me design some new ones based off of spiders like the Golden Orb Silk Weaver. I also tweaked the movement such that the front legs should move further than the back legs, and do so a bit slower. I also added some (exaggerated here) bobbing during movement:

![](/blog/assets/images/tumblr_e8e1bc812df7c79c339919f40a7793e7_7f57b667_540.gif)

You know what would make everything creepier? Random twitching. I relocated the legs to the limbs such that the IK would kick in and compensate for the twitching:

![](/blog/assets/images/tumblr_acb8b496bd1238bdcb5f7e7245a53c36_68ab62bc_540.gif)

The current version of this creepy boi. Now he stays 1.5m off of the surface below him, as well as locking the IK targets to that same surface.

![](/blog/assets/images/tumblr_ddd1033fab01635096104cc2c98967ae_40eb8e6d_540.gif)