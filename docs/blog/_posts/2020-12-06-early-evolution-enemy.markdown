---
layout: post
title:  "The Early Evolution of an Enemy"
tags: unity programming C# graphics
---
**Idea for an enemy: a physically simulated corpse that sprouts spider-like legs. Uses procedural animation to walk along terrain.**

I based my implementation off of [this wonderful post on Reddit](https://www.reddit.com/r/Unity3D/comments/fqabkx/i_tried_to_explain_procedural_animation_in_10/).

First prototype. Lots of issues here. Legs look bad, animation isn’t correct, ragdoll would look better upside down. Also lots of hidden bugs that won’t pop up until later.

![](https://64.media.tumblr.com/3e48e0dca90ac463fb23d311cf917763/67c4568d4ecdcf03-7b/s540x810/1420b096d85eddf831202517e0007d1e2a9715b4.gif)

Attempt at improving animation. Still syncs up weirdly:

![](https://64.media.tumblr.com/48ccad1a3b60528ad2667accdf2c4423/67c4568d4ecdcf03-f9/s540x810/faf951e674bceff496893acc9ad1920e85c6f2db.gif)

At this point I try to see what happens if I let the enemy steer. This is the result, which in my head was it just dancing to [this classic tune from _Chicago_](https://youtu.be/C9dFKRZ8EbU?t=82):

![](https://64.media.tumblr.com/cee6a2bc9fd96011b9a32a735069c926/67c4568d4ecdcf03-26/s540x810/b00b836dce2a9a46356cf217193bb94fd352a987.gif)

I decided to not try and fix the bug, and instead focus on getting the leg animation correct. Doing so meant I had to implement step 8 in the guide, not moving a leg if its two neighbors are also moving. That lead to this:

![](https://64.media.tumblr.com/dae3b85bbaa4302f40e818aa59bde481/67c4568d4ecdcf03-03/s540x810/6d578edc06dd2c93fa1aa6f1b19bd55b08362441.gif)

My partner informed me that the legs look like garbage, and she helped me design some new ones based off of spiders like the Golden Orb Silk Weaver. I also tweaked the movement such that the front legs should move further than the back legs, and do so a bit slower. I also added some (exaggerated here) bobbing during movement:

![](https://64.media.tumblr.com/e8e1bc812df7c79c339919f40a7793e7/67c4568d4ecdcf03-de/s540x810/7f57b6679e4060d367aea6cc6d17c0f57b149454.gif)

You know what would make everything creepier? Random twitching. I relocated the legs to the limbs such that the IK would kick in and compensate for the twitching:

![](https://64.media.tumblr.com/acb8b496bd1238bdcb5f7e7245a53c36/67c4568d4ecdcf03-a8/s540x810/68ab62bc6888fb6142917c3835ab797ea99da869.gif)

The current version of this creepy boi. Now he stays 1.5m off of the surface below him, as well as locking the IK targets to that same surface.

![](https://64.media.tumblr.com/ddd1033fab01635096104cc2c98967ae/67c4568d4ecdcf03-f8/s540x810/40eb8e6d078b5af88e3c88e975e98e18b251371f.gif)