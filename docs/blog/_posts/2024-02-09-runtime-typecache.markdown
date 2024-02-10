---
layout: post
title:  "Runtime TypeCache"
tags: unity programming C#
---
## Introduction
**Unity supplies the <a href="https://docs.unity3d.com/ScriptReference/TypeCache.html" target="_blank">`UnityEditor.TypeCache` API</a>, which is pretty cool, but doesn't exactly help in a built player.**

So how do *most* developers end up doing a "give me all methods decorated with XYZ attribute" queries outside of the editor? Well...

{% gist 10cc36929bb395ce407618a85947b282 Snippet1.cs %}

Unfortunately, <a href="https://docs.unity3d.com/2023.3/Documentation/Manual/dotnetReflectionOverhead.html" target="_blank">this is a really big issue</a>. 

> Mono and IL2CPP internally cache all C# reflection (System.Reflection) objects and by design, Unity doesn’t garbage collect them. The result of this behavior is that the garbage collector continuously scans the cached C# reflection objects during the lifetime of your application, which causes unnecessary and potentially significant garbage collector overhead.

This tells us that the best practice is for reflection to be used in the most minimal and specific ways possible. The ideal way to do so would be to use code generation to replace reflection, but this can really only be done on a project-by-project basis. The second best way is to have some code that scans your assemblies *at build time* and generates the most precise and specific pathways to the reflection targets as possible.

**So I made <a href="https://github.com/thebeardphantom/Runtime-TypeCache" target="_blank">Runtime TypeCache</a>.**

Here's a demo for how it works:

{% gist 10cc36929bb395ce407618a85947b282 Snippet2.cs %}

So here we have an attribute class (`SomeAttribute`) which is decorated on a class (`TestType`) and all of its properties, fields, and methods.

To indicate to the Runtime TypeCache system that we want to be able to efficiently query for the usual suspects at runtime, we can use the `TypeCacheTarget` attribute. By decorating the `SomeAttribute` class with `TypeCacheTarget`, the Runtime TypeCache system will bake the necessary data to query the following for `SomeAttribute`:
- `GetFieldsWithAttribute()`
- `GetMethodsWithAttribute()`
- `GetTypesWithAttribute()`
- `GetPropertiesWithAttribute()` (Yes, unlike `UnityEditor.TypeCache`, Runtime TypeCache supports properties)

By decorating the `TestType` class with `TypeCacheTarget` you can call `GetTypesDerivedFrom()` for `TestType`. You can access these query functions statically via the `GlobalTypeCache` class:

{% gist 10cc36929bb395ce407618a85947b282 Snippet3.cs %}

In the editor, `GlobalTypeCache` actually utilizes `UnityEditor.TypeCache` under the hood for everything except properties, which falls back to traditional reflection.

When <a href="https://docs.unity3d.com/2023.3/Documentation/ScriptReference/Build.IPostprocessBuildWithReport.html" target="_blank">making</a> a build, a `ScriptableObject`, called `SerializedTypeCache`, is quietly generated, included as a <a href="https://docs.unity3d.com/ScriptReference/PlayerSettings.GetPreloadedAssets.html" target="_blank">Preloaded Asset</a>, and then deleted <a href="https://docs.unity3d.com/2023.3/Documentation/ScriptReference/Build.IPostprocessBuildWithReport.html" target="_blank">post-build</a>. `GlobalTypeCache` then locates this preloaded object in memory at runtime, converts it into a deserialized form, and then forwards all queries to that new object.

A copy of the `SerializedTypeCache`, as well as a JSON version of that copy, are generated in your project's Temp folder so you can inspect them for debugging purposes. Here's the output of a build using the code example above:

{% gist 10cc36929bb395ce407618a85947b282 Snippet4.json %}

You might notice that type names only exist at the end of the file. To reduce memory footprint, as well as reduce the calls to `Type.GetType(string)`, an indirection layer is used to reference `System.Types` using an index into an array. Each `System.Type` in that array is resolved exactly once, and string operations are avoided entirely.