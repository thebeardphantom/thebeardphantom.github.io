---
layout: post
title:  "Carving Terrain Holes at Runtime"
tags: unity programming C# graphics
---
**While working on a 3D Halloween themed game involving graverobbing, I wanted graves that the player could dig up and hop into.**

The player should be able to hop down into a grave that goes under the terrain's surface by several meters. These graves have already have a Box Collider that the player's interaction scripts detect to "dig" away the dirt. There's two ways I could think of doing this:

1. Utilize another Box Collider as a trigger in the grave such that it that disables all player/terrain collision while the player is inside of it.
2. Carve holes through the terrain surface where it intersects with the world-space bounds of a grave's Box Collider.

I decided that option 1 was a little hackier than I'd like, so I went with option 2. The tricky thing about this was that I am using Unity's terrain instead of generating my own terrain mesh, so I have to know how to do it The Unity Way™.

Fortunately Unity supports Terrain Holes since 2019.3. How does this work? Simply put, a texture is utilized where each pixel represents a filled or unfilled cell in the terrain's surface. The Terrain and Terrain Collider components then utilize that hole texture in a very similar way to the heightmap. I could get the `TerrainData` reference from a Terrain component instance and call the [`TerrainData.SetHoles`](https://docs.unity3d.com/ScriptReference/TerrainData.SetHoles.html) function. The documentation reads as such:

> Sets Terrain holes data using a two-dimensional array of Terrain holes samples. The samples are represented as bool values: true for surface and false for hole. The array dimensions define the area affected, which starts at xBase and yBase. The Terrain holes array is indexed as [y, x].

There's a ton of questions that pop up in this kind of situation.

- How do I know where to carve?
- What if I need some additional padding space to carve out?
- How do I handle rotated colliders?
- How do I make sure the holes actually look good?

Something that less experienced programmers tend to think is that experts just know how to do stuff like this as soon as they take on the task. As someone who has been a programmer and used Unity since 2012 (a decade at the time of writing this oh my god no please) and now *works for Unity*, I can confidently say I had no idea how to answer these questions when I first started working on this problem. What experts **do** know how to do is break problems down into the smallest and simplest possible questions, and then try to find answers to those questions. This is a skill that takes time to build up