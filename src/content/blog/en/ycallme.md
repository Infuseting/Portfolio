---
title: "YCallMe: Pushing the Limits of Call Filtering on Android"
description: "How I built an Open Source call blocker on Android with Kotlin, using the CallScreeningService API and regular expressions for fine-grained control."
publishDate: 2026-06-28
tags: ["kotlin"]
draft: false
featured: true
---

Identifying the limitations of an existing tool is often the best starting point for a project. While the "Sarracroche" app is an excellent reference for call filtering, its rigidity when dealing with highly specific blocking rules pushed me to develop my own solution.

That's how **YCallMe** was born, an Open Source Android application developed in Kotlin. My goal with this project was twofold: to design a custom tool introducing granular blocking via Regex and automated SMS replies, while consolidating my expertise in the native Android development ecosystem.

## Designing YCallMe: The "Why" and "How"

Before writing a single line of code, it was crucial to clearly define the use cases that traditional solutions couldn't cover.

**The Need for Flexibility: The Regex Approach**  
Most call blockers rely on static blocklists. The issue with this approach is that it becomes ineffective against dynamically generated numbers or numbers sharing a common pattern (like certain telemarketing prefixes). Integrating Regular Expressions (Regex) was the obvious technical choice: it offers total flexibility to target and block entire ranges of numbers with a single rule, providing perfect granularity.

**From Passive to Proactive: Automated SMS Replies**  
Blocking a call is one thing, but managing communication with the caller is another. I wanted the application to act autonomously. If a specific number (or one matching a Regex) is rejected, the system should be able to send them a customized automated message. 

## Under the Hood: Technical Implementation

To build YCallMe, the challenge wasn't just about blocking a number, but doing it efficiently and seamlessly for the user, all while respecting Android's security constraints.

### Interception with the `CallScreeningService` API

Rather than using older methods based on *BroadcastReceivers* (which can let the phone ring for a fraction of a second), YCallMe leverages the native `CallScreeningService` API. This service integrates deeply into the system, allowing incoming calls to be intercepted and evaluated before the system UI is even displayed.

```kotlin
override fun onScreenCall(callDetails: Call.Details) {
    val incomingNumber = callDetails.handle.schemeSpecificPart
    
    // Dynamic evaluation of the number against our Regex rules
    if (shouldBlock(incomingNumber)) {
        val response = CallResponse.Builder()
            .setDisallowCall(true)
            .setRejectCall(true)
            .build()
            
        respondToCall(callDetails, response)
        handleAutoReply(incomingNumber) // Trigger auto-reply
    }
}
```

### The Filtering Engine in Kotlin

Integrating regular expressions in Kotlin makes it possible to instantly validate whether an incoming number matches any of the user-defined rules (e.g., `^(\+33|0)[1-5]11.*`). Using Kotlin's *Data Classes* and extension functions keeps the parsing code expressive, clean, and highly performant.

### Asynchronous SMS Automation

Once the call is silently rejected, YCallMe checks if an automatic reply rule is associated with that number. The application then uses the `SmsManager` to dispatch the message. This process is handled asynchronously via **Kotlin Coroutines** to ensure the main thread of the call service is never blocked. This also involved carefully managing Android's strict permission system (`SEND_SMS`, `READ_PHONE_STATE`, `BIND_SCREENING_SERVICE`) to guarantee proper functionality without compromising security.

## Conclusion and Takeaways

Developing YCallMe allowed me to tackle concrete Android development challenges: manipulating low-level system APIs, strictly managing the lifecycle of background services, and creating a resilient architecture in Kotlin.

The application is fully Open Source. If you'd like to explore the code, see how the Regex parsing is handled, or how the interception service is implemented, feel free to check out the GitHub repository!

🔗 **[Discover YCallMe on GitHub](https://github.com/Infuseting/YCallMe)**
