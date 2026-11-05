## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- Treat the graph as the first context clue for every repository-specific question or task that needs project knowledge, including architecture, behavior, debugging, code location, and implementation. When `graphify-out/graph.json` exists, run `graphify query "<question>"` before opening or searching source files or project docs. Use the graph to guide exploration, then verify relevant facts against current source and tests; the graph is a navigation aid, not a substitute for verification. If the query is noisy, refine it against graph vocabulary. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. Include this graph-first requirement and the query findings in any subagent prompt that explores code.
- If the graph is missing or graphify cannot run, continue with normal source-based discovery without blocking; do not build a graph unless requested or needed for the task. Skip graph queries for unrelated general questions and when the user explicitly asks not to use the graph.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
