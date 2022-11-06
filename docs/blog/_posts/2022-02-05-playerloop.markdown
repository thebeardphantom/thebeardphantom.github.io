---
layout: post
title:  "PlayerLoop!"
date:   2020-02-05 12:00:00 -0700
categories: unity
---
## **Introduction**

**This [is a repost of a blog post I made on my old website](https://web.archive.org/web/20181023203049/http://beardphantom.com/ghost-stories/unity-2018-and-playerloop/), pretty much all of this information still applies in 2020!**

Before Unity 5.X (specifically 5.0), control over the application lifecycle was basically nonexistent. For application startup/initialization code you could’ve created a script that was sorted earliest in the Script Execution Order window and used `Awake`, but you would’ve ran into issues. An object with that script would need to exist in any scene that required that initialization code to run, a state that is really difficult to maintain while in the editor. It’s too easy to forget that object needs to be around, and that functionality needs to be explained to other developers working on the project.

With Unity 5.0 we were provided `RuntimeInitializeOnLoad`, an attribute placed on a static function which is then executed automatically at runtime consistently. Its a foolproof way of ensuring that some code **always** executes, regardless of scene setup. In 5.2 an optional argument in form of the `RuntimeInitializeLoadType` enum was added, allowing developers to decide if the marked function should execute before or after the initial scene is loaded (before the `Awake` message is sent). With this single feature it suddenly became viable to use Unity without scenes, slightly closer to using a game framework, such as MonoGame.

However, the systems that are updated each frame (some more often) were still out of reach. These systems are otherwise known as the main/game update loop. Systems could not be disabled for performance, reordered for preference, and, most importantly, new arbitrary systems could not be added into the update loop. Of course you could always use functions like `Update`, `FixedUpdate` and `LateUpdate` to hook into the built in update systems, but these always occurred inbetween Unity’s internal systems, beyond user control.

With Unity 2018.1, the `PlayerLoop` and `PlayerLoopSystem` classes and the `UnityEngine.Experimental.PlayerLoop` namespace have been introduced, allowing users to remove and reorder engine update systems, as well as implement custom systems.

[[MORE]]

## **The Default PlayerLoop**
The first step to understanding the PlayerLoop is to find a way of viewing what the out-of-the-box loop is actually made of. You can get the default loop thusly:

```csharp
PlayerLoopSystem loop = PlayerLoop.GetDefaultPlayerLoop()
```

[PlayerLoopSystem](https://web.archive.org/web/20190127004746/https://docs.unity3d.com/2018.1/Documentation/ScriptReference/Experimental.LowLevel.PlayerLoopSystem.html) is a struct that is organized in a recursive, tree-like structure. From this object you can get some information about the system:

* **`type`**: For default systems this is a `System.Type` object that acts as a representation of what update system this is. These types are only used as identifiers, and don’t actually contain anything. For example, the type of the `PlayerLoopSystem` responsible for updating AI is `UnityEngine.Experimental.PlayerLoop.AIUpdate`. We’ll use this field later to search for built-in types from the default player loop. This field is mostly useless for custom systems, except for its use as a label for the system in the Profiler.
* **`subSystemList`**: As previously stated, `PlayerLoopSystem` is a recursive structure, so this is an array of all of the `PlayerLoopSystems` underneath this system. Traversing this array recursively will let us inspect the default loop.
* **`updateFunction`**: For default systems this is a pointer to the native-side function that is executed for this update system. This field is unused for custom systems.
* **`updateDelegate`**: This is a C# delegate that is primarily used for custom systems. However, it seems that it is possible to use this to add a callback to default systems as well. When we implement a custom system this is where all the work will happen.
* **`loopConditionFunction`**: For default systems this is a pointer to a native-side function that is executed to check if this system and all of the systems below it should be executed. This field is unused for custom systems.

The system returned by `GetDefaultPlayerLoop()` is somewhat bogus. The only field that has a value is `subSystemList`. This is because this system is used as a “root node”, which every recursive structure requires. It’s fairly trivial to write a quick recursive function to pretty-print the contents of the default loop:

```csharp
[RuntimeInitializeOnLoadMethod]
private static void AppStart()
{
    var def = PlayerLoop.GetDefaultPlayerLoop();
    var sb = new StringBuilder();
    RecursivePlayerLoopPrint(def, sb, 0);
    Debug.Log(sb.ToString());
}

private static void RecursivePlayerLoopPrint(PlayerLoopSystem def, StringBuilder sb, int depth)
{
    if (depth == 0)
    {
        sb.AppendLine("ROOT NODE");
    }
    else if (def.type != null)
    {
        for (int i = 0; i < depth; i++)
        {
            sb.Append("\t");
        }
        sb.AppendLine(def.type.Name);
    }
    if (def.subSystemList != null)
    {
        depth++;
        foreach (var s in def.subSystemList)
        {
            RecursivePlayerLoopPrint(s, sb, depth);
        }
        depth--;
    }
}
```

Running this gives us a pretty large tree of systems:

```
ROOT NODE
	Initialization
		PlayerUpdateTime
		AsyncUploadTimeSlicedUpdate
		SynchronizeInputs
		SynchronizeState
		XREarlyUpdate
	EarlyUpdate
		PollPlayerConnection
		ProfilerStartFrame
		GpuTimestamp
		UnityConnectClientUpdate
		CloudWebServicesUpdate
		UnityWebRequestUpdate
		ExecuteMainThreadJobs
		ProcessMouseInWindow
		ClearIntermediateRenderers
		ClearLines
		PresentBeforeUpdate
		ResetFrameStatsAfterPresent
		UpdateAllUnityWebStreams
		UpdateAsyncReadbackManager
		UpdateTextureStreamingManager
		UpdatePreloading
		RendererNotifyInvisible
		PlayerCleanupCachedData
		UpdateMainGameViewRect
		UpdateCanvasRectTransform
		UpdateInputManager
		ProcessRemoteInput
		XRUpdate
		TangoUpdate
		ScriptRunDelayedStartupFrame
		UpdateKinect
		DeliverIosPlatformEvents
		DispatchEventQueueEvents
		DirectorSampleTime
		PhysicsResetInterpolatedTransformPosition
		NewInputBeginFrame
		SpriteAtlasManagerUpdate
		PerformanceAnalyticsUpdate
	FixedUpdate
		ClearLines
		NewInputEndFixedUpdate
		DirectorFixedSampleTime
		AudioFixedUpdate
		ScriptRunBehaviourFixedUpdate
		DirectorFixedUpdate
		LegacyFixedAnimationUpdate
		XRFixedUpdate
		PhysicsFixedUpdate
		Physics2DFixedUpdate
		DirectorFixedUpdatePostPhysics
		ScriptRunDelayedFixedFrameRate
		ScriptRunDelayedTasks
		NewInputBeginFixedUpdate
	PreUpdate
		PhysicsUpdate
		Physics2DUpdate
		CheckTexFieldInput
		IMGUISendQueuedEvents
		NewInputUpdate
		SendMouseEvents
		AIUpdate
		WindUpdate
		UpdateVideo
	Update
		ScriptRunBehaviourUpdate
		ScriptRunDelayedDynamicFrameRate
		DirectorUpdate
	PreLateUpdate
		AIUpdatePostScript
		DirectorUpdateAnimationBegin
		LegacyAnimationUpdate
		DirectorUpdateAnimationEnd
		DirectorDeferredEvaluate
		UpdateNetworkManager
		UpdateMasterServerInterface
		UNetUpdate
		EndGraphicsJobsLate
		ParticleSystemBeginUpdateAll
		ScriptRunBehaviourLateUpdate
		ConstraintManagerUpdate
	PostLateUpdate
		PlayerSendFrameStarted
		DirectorLateUpdate
		ScriptRunDelayedDynamicFrameRate
		PhysicsSkinnedClothBeginUpdate
		UpdateCanvasRectTransform
		PlayerUpdateCanvases
		UpdateAudio
		ParticlesLegacyUpdateAllParticleSystems
		ParticleSystemEndUpdateAll
		UpdateCustomRenderTextures
		UpdateAllRenderers
		EnlightenRuntimeUpdate
		UpdateAllSkinnedMeshes
		ProcessWebSendMessages
		SortingGroupsUpdate
		UpdateVideoTextures
		UpdateVideo
		DirectorRenderImage
		PlayerEmitCanvasGeometry
		PhysicsSkinnedClothFinishUpdate
		FinishFrameRendering
		BatchModeUpdate
		PlayerSendFrameComplete
		UpdateCaptureScreenshot
		PresentAfterDraw
		ClearImmediateRenderers
		PlayerSendFramePostPresent
		UpdateResolution
		InputEndFrame
		TriggerEndOfFrameCallbacks
		GUIClearEvents
		ShaderHandleErrors
		ResetInputAxis
		ThreadedLoadingDebug
		ProfilerSynchronizeStats
		MemoryFrameMaintenance
		ExecuteGameCenterCallbacks
		ProfilerEndFrame
```

## **A Simple Custom PlayerLoopSystem**

Creating a complete replacement system is quite easy:

```csharp
[RuntimeInitializeOnLoadMethod]
private static void AppStart()
{
    var systemRoot = new PlayerLoopSystem();
    systemRoot.subSystemList = new PlayerLoopSystem[]
    {
        new PlayerLoopSystem()
        {
            updateDelegate = CustomUpdate,
            type = typeof(PlayerLoopTest)
        }
    };
    PlayerLoop.SetPlayerLoop(systemRoot);
}

private static void CustomUpdate()
{
    Debug.Log("Custom update running!");
}
```

A few things to take notice of: It seems that root system execution is completely ignored. If you specify a value for updateDelegate on the root system it will not be executed. This is why we need to define a root node and place our system underneath. Also note that this is a complete replacement. None of the default systems are running here. If you place a dynamic physics object in the scene it won’t move. The values in the Time class won’t be updated, and neither will input. Clearly, the default player loop is extremely sensitive to changes.

## **Borrowing Default Systems**

Just for fun, why don’t we add one default system back into the mix? We can once again use recursion to find a default system by type and include it in our subsystem list:

```csharp
[RuntimeInitializeOnLoadMethod]
private static void AppStart()
{
    var defaultSystems = PlayerLoop.GetDefaultPlayerLoop();
    var physicsFixedUpdateSystem = FindSubSystem<FixedUpdate.PhysicsFixedUpdate>(defaultSystems);
    var systemRoot = new PlayerLoopSystem();
    systemRoot.subSystemList = new PlayerLoopSystem[]
    {
        physicsFixedUpdateSystem,
        new PlayerLoopSystem()
        {
            updateDelegate = CustomUpdate,
            type = typeof(PlayerLoopTest)
        },
    };
    PlayerLoop.SetPlayerLoop(systemRoot);
}

private static void CustomUpdate()
{
    Debug.Log("Custom update running!");
}

private static PlayerLoopSystem FindSubSystem<T>(PlayerLoopSystem def)
{
    if (def.type == typeof(T))
    {
        return def;
    }
    if (def.subSystemList != null)
    {
        foreach (var s in def.subSystemList)
        {
            var system = FindSubSystem(s, type);
            if (system.type == typeof(T))
            {
                return system;
            }
        }
    }
    return default(PlayerLoopSystem);
}
```

There’s more efficiency to be gained here if we’re looking for multiple systems by type, but this works for now. You’ll notice that this creates incorrect behavior; physics forces are way too powerful! That’s because we’re updating physics on a framerate dependent update loop instead of on a fixed time update loop. The `FixedUpdate PlayerLoopSystem` handles timing and using correct delta times for all of the subsystems beneath it, which we aren’t doing here. Fixing this would be both daunting and freeing; you could implement your own timestep! We won’t be covering that here, though.

## **Replacing a Default System**

You may have read the [10000 Update() calls](https://blogs.unity3d.com/2015/12/23/1k-update-calls/) article on the official Unity blog. In this article the author discusses implementing a managed-side custom update loop as a replacement for the `Update` call. We can do this better by actually replacing the default `Update` call, which was printed in our list as `Update.ScriptRunBehaviourUpdate`. We can modify our previous function to replace the system we found by type with our own system, maintaining the execution order. However, `PlayerLoopSystem` is a struct, and will be passed by value into our function. In order to modify what we pass in, we’ll use the `ref` keyword:

```csharp
[RuntimeInitializeOnLoadMethod]
private static void AppStart()
{
    var defaultSystems = PlayerLoop.GetDefaultPlayerLoop();
    var customUpdate = new PlayerLoopSystem()
    {
        updateDelegate = CustomUpdate,
        type = typeof(PlayerLoopTest)
    };
    ReplaceSystem<Update.ScriptRunBehaviourUpdate>(ref defaultSystems, customUpdate);
    PlayerLoop.SetPlayerLoop(defaultSystems);
}

private static void CustomUpdate()
{
    Debug.Log("Custom update running!");
}

private static bool ReplaceSystem<T>(ref PlayerLoopSystem system, PlayerLoopSystem replacement)
{
    if (system.type == typeof(T))
    {
        system = replacement;
        return true;
    }
    if (system.subSystemList != null)
    {
        for (var i = 0; i < system.subSystemList.Length; i++)
        {
            if (ReplaceSystem(system.subSystemList[i], replacement, toReplace))
            {
                return true;
            }
        }
    }
    return false;
}
```

If you create a new script with an `Update()` call and add it to an object in your scene, you’ll notice it won’t be called anymore. Note that this example doesn’t cover the other required steps to actually replace all of the functionality of `Update()`, such as creating an object management system to add and remove updatable objects from a global collection and calling update functions on them. The ideal implementation would probably use an `IUpdatable` interface to allow nearly any object to be included in the custom update loop (and eliminate the need for “magic methods”).

## **…And More**
There’s certainly more to be experimented with this wonderful new access to the low level systems that literally makes Unity tick. Hopefully this post gives you a good head start to shaping Unity to fit your needs. A few quick ideas as to interesting additions that you can try to add as utility API:

* Inserting systems. Some modifications to the replacement example could allow you to insert a system into a subsystem array instead of replacing it.
* Explore different ways of disabling systems temporarily. If your game is in a pause menu you don’t need AI updates running!
* Create a visualizer. This could be in-game or in-editor. The Profiler does list every system using the `PlayerLoopSystem` type field as a label, but knowing in a debug build what systems are currently enabled could be very beneficial when doing heavy customization to the default PlayerLoop.
* High performance update loops. This could be used for mobile games that don’t need systems like physics, AI or XR.

Let me know what you think on [Twitter or Reddit](https://beardphantom.com/#contact) about this new API, how you might use it for your games, and what else you’re looking for in the Unity application lifecycle.