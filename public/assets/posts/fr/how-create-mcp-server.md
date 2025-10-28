# 🧠 Comment j’ai créé mon premier serveur MCP

Créer son premier serveur MCP n’est pas une tâche facile au premier abord, principalement parce qu’il s’agit d’un outil récent, encore très peu documenté.
Toutefois, je suis tombé sur une librairie Python nommée **FastMCP**, un outil utilisant **FastAPI** et la librairie **MCP**.

L’objectif de mon premier serveur MCP était simple : **rendre facilement accessibles, via une seule requête API, des informations sur les cours et les salles disponibles à l’Université de Caen** (là où j’étudie).

---

## 🚀 Le début du projet

Comme je l’ai expliqué auparavant, le but était de constituer un serveur MCP fonctionnel.
La première étape a été d’étudier la documentation de [FastMCP](https://gofastmcp.com/getting-started/quickstart), qui est plutôt bien fournie.
Elle explique pas mal de choses, mais le point essentiel à retenir concerne les **trois formats de transport MCP** :

* **STDIO** : communication entre programmes en local (inaccessible entre deux ordinateurs différents)
* **HTTP** : protocole classique où *1 requête = 1 réponse*
* **SSE** : protocole unidirectionnel qui ne se ferme jamais et permet d’envoyer plusieurs messages en continu (recommandé pour un serveur MCP ouvert sur le réseau)

Mon objectif étant de créer un serveur **ouvert sur le réseau**, je me suis naturellement tourné vers le **protocole SSE**.
Une fois cette décision prise, il ne restait plus qu’à se lancer dans le développement.

---

## 🧩 L’API utilisée pour le serveur MCP

Pour développer ce serveur, il me fallait une **source de données solide**.
J’ai donc réutilisé l’API d’un outil que j’avais développé l’année précédente : un **système d’emploi du temps** pour [Unicaen](https://edt.infuseting.fr).

Grâce à cette API, je disposais déjà de plusieurs fonctionnalités clés :

* Récupérer l’emploi du temps d’un individu à partir de son nom et prénom
* Obtenir la disponibilité d’une salle
* Consulter les emplois du temps d’un groupe

Autant dire que les fondations étaient déjà prêtes pour être exploitées par le serveur MCP.

---

## ⚙️ Le code

Une fois les bases posées, j’ai pu construire le cœur du projet.
J’ai mis en place le **serveur MCP** et son **transport SSE**, chargé d’assurer le passage des données à travers le protocole.

Deux routes principales sont définies :

* `/` : indique l’emplacement du serveur SSE et permet à une IA de connaître les outils disponibles
* `/health` : gère l’état du serveur (erreurs, permissions, etc.)

```python
mcp = FastMCP("EDT Unicaen MCP Server")
sse_transport = SseServerTransport("/messages/")

@mcp.custom_route(path="/health", methods=["GET"])
async def _health(request):
    return JSONResponse({"ok": True, "server": mcp.name, "mount": _MCP_MOUNT, "sse_path": _MCP_SSE_PATH})

@mcp.custom_route(path="/", methods=["GET"])
async def _root(request):
    txt = f"{mcp.name} — SSE endpoint available at {_MCP_SSE_PATH} (MCP mount: {_MCP_MOUNT})"
    return PlainTextResponse(txt)

if __name__ == "__main__":
    mcp.run(transport="sse", host="127.0.0.1", port="80")
```

---

## 🧠 L’un des outils : la disponibilité d’une salle

Passons maintenant à l’un des outils que j’ai intégrés dans le serveur MCP (il y en a d’autres, disponibles sur le [GitHub du projet](https://github.com/Infuseting/MCPEdtUnicaen)).

Cet outil permet de **connaître la disponibilité d’une salle** — maintenant, ou sur une plage horaire donnée.
L’intérêt est que l’IA peut directement appeler cet outil, comprendre sa description, et en déduire comment l’utiliser.

On retrouve plusieurs paramètres :

* `nom` : le nom de la salle
* `start` et `end` : les bornes horaires (au format ISO ou “HH:MM”)
* `ctx` : le contexte de la requête SSE, pour la gestion des clés ou configurations


```python

@mcp.tool(name="disponibilite_salle", title="Disponibilité salle", description="Indique si une salle est disponible maintenant et jusqu\u2019\u00e0 quelle heure. Si une heure de debut et/ou de fin est fournie (ex: '08:00' ou ISO), limite la recherche à cette plage horaire. Les réponses incluent les dates/horaires au format ISO complet (ex: 2025-10-25T08:00:00).")
def disponibilite_salle(nom: Optional[str] = None, start: Optional[str] = None, end: Optional[str] = None, ctx: Optional[Context] = None) -> dict:
    """Retourne la disponibilité d'une salle (free/busy) et l'heure de fin si occupée.

    Logic:
    - cherche la salle dans `salle` (ou timetable/univ)
    - appelle l'endpoint de mise à jour pour la date d'aujourd'hui
    - récupère la liste d'events pour aujourd'hui
    - si un event englobe maintenant -> occupied until its DTEND (ou DTSTART if no DTEND)
    - else -> free until next event start (or None pour la fin de journée)

    Paramètres supplémentaires:
    - start: chaîne 'HH:MM' ou ISO datetime pour limiter la recherche
    - end: chaîne 'HH:MM' ou ISO datetime pour limiter la recherche
    """


    matches = find_entries_by_name(nom)
    if not matches:
        return {"ok": False, "error": "Aucune salle trouvée pour ce nom"}
    entry = None
    for m in matches:
        if m.get("type") in ("salle", "univ-timetable"):
            entry = m
            break
    if not entry:
        entry = matches[0]

    url = build_ade_url(entry, date=datetime.date.today())
    if not url:
        return {"ok": False, "error": "Impossible de construire l'URL de mise à jour pour cette salle", "matches": matches}
    try:
        content = fetch_url(url)
    except Exception as e:
        return {"ok": False, "error": f"Erreur lors de la récupération de l'URL: {e}", "url": url}
    today = datetime.date.today().strftime("%Y-%m-%d")
    events = parse_update_json_events(content, only_date=today)
    # fallback to ICS parsing if nothing
    if not events:
        events = parse_ics_events(content)
    now = datetime.datetime.now()
    # parse optional limits
    start_dt = parse_limit_to_datetime(start)
    end_dt = parse_limit_to_datetime(end)
    # If both provided but invalid range
    if start_dt and end_dt and end_dt < start_dt:
        return {"ok": False, "error": "La limite de fin est antérieure à la limite de début"}
    # If a range was provided, filter events to those that intersect the window
    if start_dt or end_dt:
        filtered = []
        for ev in events:
            ev_start = ev.get("start")
            ev_end = ev.get("end") or ev_start
            if not ev_start or not ev_end:
                continue
            win_start = start_dt or datetime.datetime.min
            win_end = end_dt or datetime.datetime.max
            # intersect if event starts before window end and ends after window start
            if ev_start < win_end and ev_end > win_start:
                filtered.append(ev)
        events = filtered

    # Normalize: ensure end times exist; if missing, set end = start
    for ev in events:
        if not ev.get("end"):
            ev["end"] = ev.get("start")

    # events that are currently happening
    ongoing = [e for e in events if e["start"] and e["end"] and e["start"] <= now < e["end"]]
    if ongoing:
        ongoing.sort(key=lambda e: e["end"])
        e = ongoing[0]
        resp = {"ok": True, "available": False, "until": e["end"].isoformat(), "summary": e.get("summary"), "source": url}
        if start_dt:
            resp["range_start"] = start_dt.isoformat()
        if end_dt:
            resp["range_end"] = end_dt.isoformat()
        return resp

    # next upcoming
    future = [e for e in events if e["start"] and e["start"] > now]
    if future:
        future.sort(key=lambda e: e["start"])
        nxt = future[0]
        resp = {"ok": True, "available": True, "free_until": nxt["start"].isoformat(), "next_summary": nxt.get("summary"), "source": url}
        if start_dt:
            resp["range_start"] = start_dt.isoformat()
        if end_dt:
            resp["range_end"] = end_dt.isoformat()
        return resp

    # no more events today -> free all day
    resp = {"ok": True, "available": True, "free_until": None, "note": "Aucun cours r\u00e9pertori\u00e9 pour aujourd\u2019hui", "source": url}
    if start_dt:
        resp["range_start"] = start_dt.isoformat()
    if end_dt:
        resp["range_end"] = end_dt.isoformat()
    return resp


```

En résumé, cet outil interroge l’API d’emploi du temps, filtre les événements du jour, et détermine si la salle est libre ou occupée.
S’il n’y a aucun cours prévu, il indique que la salle est disponible pour la journée.

---

## 🧱 Hébergement et mise en ligne

Pour la mise en ligne, j’ai opté pour **Docker**, que je maîtrise déjà bien.
J’ai utilisé **Traefik** comme reverse proxy afin d’exposer le serveur MCP publiquement sur :

👉 [https://unicaenedt.mcp.infuseting.fr/](https://unicaenedt.mcp.infuseting.fr/)

Ce setup m’a permis d’avoir un déploiement propre, sécurisé, et facilement réplicable pour d’autres MCP à l’avenir.

---

## ✨ Conclusion

Créer ce premier serveur MCP a été une vraie aventure technique.
J’ai dû apprendre à jongler entre la logique des API, les spécificités du protocole SSE, et la structure parfois déroutante du système MCP.

Mais au final, tout cela m’a permis de mieux comprendre **comment un protocole peut devenir un pont entre des outils, des services, et même des IA**.
Là où une API classique se limite à répondre à des requêtes, un serveur MCP devient un **écosystème vivant**, capable de dialoguer, d’écouter et d’évoluer.

Aujourd’hui, le serveur *MCPEdtUnicaen* tourne fièrement en production.
Il n’est pas parfait — mais il fonctionne, et surtout, il m’a permis de **plonger dans la logique du protocole MCP** : un terrain encore peu exploré, mais extrêmement prometteur.

Et si c’était ça, le vrai plaisir du développement ?
Construire quelque chose de nouveau, tâtonner, apprendre, et finalement voir son idée prendre vie.

