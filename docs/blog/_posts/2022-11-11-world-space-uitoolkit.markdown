---
layout: post
title:  "UI Toolkit in World Space (kind of)"
tags: unity programming C# graphics
---
## Introduction
**UI Toolkit actually lets developers modify the screen-space position, rotation, and scale of any VisualElement.**

Using this, we can fake billboarded, 3D positioned UI.

![](/blog/assets/images/UI.gif)

## Cool, how do I do it?

Start by adding a `UIDocument` component to your scene, and a new script to manipulate the elements. I called mine *WorldSpaceUI*.

The easiest way to manipulate the positions of `VisualElements` in a consistent way is to ensure that they are absolutely positioned and completely centered in the middle of the root element. So in my `Awake` method I create my elements using the following style:

{% gist 42a409e7179b9b087f0a5e0e848dc824 Label.cs %}

This would result in a label that is set up like so:

![](/blog/assets/images/Unity_uIPsS71chg.png)

After I create my elements I associate them with specific transforms in my scene. Now every frame we need to transform the world space position of those associated `Transforms` into screen-space and use scaling to fake perspective. The code for this is remarkably simple. First you'll want to get the center of the screen in screen-space:

{% gist 42a409e7179b9b087f0a5e0e848dc824 CenterScreen.cs %}

Then use this to calculate a delta away from the center of the screen to the associated `Transform's` world position transformed into screen-space. The scale is `one / z distance`, with some protection against a divide-by-zero. Make sure to keep the Z value of the `ITranform's` position at 0 to avoid weirdness:

{% gist 42a409e7179b9b087f0a5e0e848dc824 MoveToPosition.cs %}

And that's it! I believe UI Toolkit clips any pixels that aren't on the X/Y plane, so for now rotations on anything except the Z axis won't render correctly. If I find a way around this I'll write a follow-up.