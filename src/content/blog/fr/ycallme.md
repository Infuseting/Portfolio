---
title: "YCallMe : Dépasser les limites du filtrage d'appels sur Android"
description: "Comment j'ai conçu un bloqueur d'appels Open Source sur Android avec Kotlin, en utilisant l'API CallScreeningService et des expressions régulières pour plus de granularité."
publishDate: 2026-06-28
tags: ["kotlin"]
draft: false
featured: true
---

Identifier les limites d'un outil existant est souvent le meilleur point de départ pour un projet. Bien que l'application Sarracroche soit une excellente référence pour le filtrage d'appels, sa rigidité face à des règles de blocage très spécifiques m'a poussé à développer ma propre solution. 

C'est ainsi qu'est né **YCallMe**, une application Open Source Android développée en Kotlin. Mon objectif avec ce projet était double : concevoir un outil sur-mesure introduisant le blocage granulaire par Regex et des réponses SMS automatisées, tout en consolidant mon expertise dans l'écosystème de développement Android natif.

## Conception de YCallMe : Le "Pourquoi" et le "Comment"

Avant d'écrire la moindre ligne de code, il était crucial de définir précisément les cas d'usage que les solutions traditionnelles ne couvraient pas.

**Le besoin de flexibilité : L'approche par Regex**  
La plupart des bloqueurs d'appels se basent sur des "listes noires" (blocklists) statiques. Le problème de cette approche est qu'elle devient inefficace face à des numéros générés dynamiquement ou partageant un schéma commun (comme certains préfixes de démarchage). L'intégration des expressions régulières (Regex) s'est imposée comme une évidence technique : elle offre une flexibilité totale pour cibler et bloquer des plages entières de numéros avec une seule règle, offrant ainsi une granularité parfaite.

**De la passivité à la proactivité : L'auto-réponse SMS**  
Bloquer un appel est une chose, mais gérer la communication avec l'appelant en est une autre. Je voulais que l'application puisse agir de manière autonome. Si un numéro spécifique (ou correspondant à un Regex) est rejeté, le système doit pouvoir lui envoyer un message automatique personnalisé. 

## Sous le capot : Implémentation Technique

Pour concevoir YCallMe, il ne s'agissait pas seulement de bloquer un numéro, mais de le faire efficacement et de manière transparente pour l'utilisateur, tout en respectant les contraintes de sécurité d'Android.

### L'interception avec l'API `CallScreeningService`

Plutôt que d'utiliser les anciennes méthodes basées sur des *BroadcastReceivers* (qui peuvent laisser le téléphone sonner une fraction de seconde), YCallMe tire parti de l'API native `CallScreeningService`. Ce service s'intègre profondément dans le système, permettant d'intercepter et d'évaluer les appels entrants avant même que l'interface système ne s'affiche.

```kotlin
override fun onScreenCall(callDetails: Call.Details) {
    val incomingNumber = callDetails.handle.schemeSpecificPart
    
    // Évaluation dynamique du numéro avec nos règles Regex
    if (shouldBlock(incomingNumber)) {
        val response = CallResponse.Builder()
            .setDisallowCall(true)
            .setRejectCall(true)
            .build()
            
        respondToCall(callDetails, response)
        handleAutoReply(incomingNumber) // Déclenchement de l'auto-réponse
    }
}
```

### Le moteur de filtrage en Kotlin

L'intégration des expressions régulières en Kotlin permet de valider instantanément si le numéro entrant matche avec l'une des règles définies par l'utilisateur (par exemple : `^(\+33|0)[1-5]11.*`). L'utilisation des *Data Classes* et des fonctions d'extension de Kotlin rend le code de parsing à la fois expressif, propre et performant.

### L'automatisation asynchrone des SMS

Une fois l'appel rejeté de manière silencieuse, YCallMe vérifie si une règle de réponse automatique est associée à ce numéro. L'application utilise alors le `SmsManager` pour expédier le message. Ce processus est géré de manière asynchrone via les **Coroutines Kotlin** afin de ne jamais bloquer le thread principal du service d'appel. Cela impliquait également de gérer finement le système de permissions d'Android (`SEND_SMS`, `READ_PHONE_STATE`, `BIND_SCREENING_SERVICE`) pour garantir le bon fonctionnement sans compromettre la sécurité.

## Bilan et Perspectives

Le développement de YCallMe m'a permis de me confronter à des problématiques concrètes du développement Android : la manipulation d'APIs système bas niveau, la gestion stricte du cycle de vie des services en arrière-plan, et la création d'une architecture résiliente en Kotlin.

L'application est entièrement Open Source. Si vous souhaitez explorer le code, voir comment les Regex sont parsées ou comment le service d'interception est implémenté, n'hésitez pas à consulter le dépôt GitHub !

🔗 **[Découvrir YCallMe sur GitHub](https://github.com/Infuseting/YCallMe)**
