
# 🧠 How I Built My First MCP Server

Building your first MCP server isn’t exactly easy at first glance — mainly because it’s such a new tool, with very little documentation available yet.
However, I came across a Python library called **FastMCP**, a framework that combines **FastAPI** with the **MCP** library.

The goal for my first MCP server was simple: **to make information about classes and available rooms at the University of Caen easily accessible through a single API request** (that’s where I study).

---

## 🚀 Getting Started

As I mentioned earlier, the goal was to build a functional MCP server.
The first step was to study the documentation for [FastMCP](https://gofastmcp.com/getting-started/quickstart), which is actually quite detailed.

It explains a lot, but the most important concept is understanding the **three MCP transport formats**:

* **STDIO** — communication between local programs (not usable between different computers)
* **HTTP** — classic request-response protocol (*1 request = 1 response*)
* **SSE** — a unidirectional protocol that stays open, allowing multiple messages to be sent continuously (recommended for network-accessible MCP servers)

Since my goal was to build a **network-accessible server**, I naturally went with the **SSE protocol**.
Once that decision was made, it was time to start coding.

---

## 🧩 The API Behind the MCP Server

To build this server, I needed a **reliable data source**.
So I reused the API from a tool I had built the previous year — a **schedule management system** for [Unicaen](https://edt.infuseting.fr).

Thanks to this API, I already had access to several key features:

* Fetch a person’s schedule based on their name
* Check a room’s availability
* View group schedules

In short, I already had solid foundations ready to be leveraged by the MCP server.

---

## ⚙️ The Code

With the groundwork done, I could start building the project’s core.
I set up the **MCP server** and its **SSE transport**, which handles data transmission through the protocol.

Two main routes were defined:

* `/` — shows where the SSE server is located and lets an AI discover the available tools
* `/health` — handles server status (errors, permissions, etc.)

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

## 🧠 One of the Tools: Checking Room Availability

Now, let’s take a look at one of the tools integrated into the MCP server (others are available on the [project’s GitHub](https://github.com/Infuseting/MCPEdtUnicaen)).

This tool lets you **check a room’s availability** — either right now, or during a given time range.
The main advantage is that an AI can directly call this tool, read its description, and figure out how to use it.

It takes several parameters:

* `nom` — the room name
* `start` and `end` — time boundaries (ISO or “HH:MM” format)
* `ctx` — the SSE request context, used for managing keys or configuration


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

In short, this tool queries the schedule API, filters out the day’s events, and determines whether the room is free or occupied.
If no class is scheduled, it simply reports that the room is available for the rest of the day.

---

## 🧱 Hosting and Deployment

For deployment, I went with **Docker**, which I’m already very comfortable with.
I used **Traefik** as a reverse proxy to publicly expose the MCP server at:

👉 [https://unicaenedt.mcp.infuseting.fr/](https://unicaenedt.mcp.infuseting.fr/)

This setup gave me a clean, secure, and easily replicable deployment — perfect for future MCP servers.

---

## ✨ Conclusion

Building this first MCP server was a true technical adventure.
I had to learn how to juggle between API logic, the quirks of the SSE protocol, and the sometimes confusing structure of the MCP system.

But in the end, it helped me truly understand **how a protocol can become a bridge between tools, services, and even AIs**.
While a traditional API simply responds to requests, an MCP server becomes a **living ecosystem** — capable of listening, responding, and evolving.

Today, the *MCPEdtUnicaen* server proudly runs in production.
It’s not perfect — but it works, and most importantly, it helped me **dive deep into the logic behind the MCP protocol**: still an unexplored frontier, but one full of promise.

And maybe that’s the real joy of development —
building something new, fumbling a bit, learning along the way, and finally watching your idea come to life.
