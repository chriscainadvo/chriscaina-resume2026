/* Scene ranges (fraction of stage scroll), overlay copy, and bloom targets. */
export const SCENES = [
  {
    index: 1,
    start: 0.0,
    end: 0.15,
    label: '// 01 — THE TOOLS',
    title: 'Every tool. Every day.',
    body:
      "I work with the world's most powerful AI tools — not occasionally, but as the foundation of every system I build.",
    caption: 'Everyone works with the same AI tools.',
    bloom: { strength: 0.35, radius: 0.4, threshold: 0.9 },
  },
  {
    index: 2,
    start: 0.15,
    end: 0.28,
    label: '// 02 — THE INTELLIGENCE',
    title: "AI isn't a feature I use.",
    body:
      'It’s the foundation of how I operate. Every workflow, every system — augmented by artificial intelligence.',
    caption: 'But tools don’t think. They don’t feel the weight of a decision.',
    bloom: { strength: 0.8, radius: 0.4, threshold: 0.8 },
  },
  {
    index: 3,
    start: 0.28,
    end: 0.42,
    label: '// 03 — THE SCALE',
    title: 'Every node. A workflow.',
    body:
      '200+ companies researched. 10+ hours saved every week. 6 AI systems deployed live.',
    caption: '200+ companies. 10+ hours saved a week. 6 systems live.',
    bloom: { strength: 1.2, radius: 0.8, threshold: 0.75 },
  },
  {
    index: 4,
    start: 0.42,
    end: 0.56,
    label: '// 04 — THE STRUCTURE',
    title: 'Structure from intelligence.',
    body:
      'When 10+ years of executive operations meets hands-on AI — you get leverage that compounds.',
    caption: 'Real leverage is structure — intelligence with a backbone.',
    bloom: { strength: 0.6, radius: 0.4, threshold: 0.82 },
  },
  {
    index: 5,
    start: 0.56,
    end: 0.7,
    label: '// 05 — THE BUILDS',
    title: '6 AI systems. Built from scratch.',
    body:
      'Not templates. Not prompts. Real infrastructure — deployed, running, delivering results.',
    caption: 'Six systems. Built from scratch. Running right now.',
    bloom: { strength: 0.5, radius: 0.4, threshold: 0.85 },
  },
  {
    index: 6,
    start: 0.7,
    end: 0.84,
    label: '// 06 — JARVIS',
    title: 'My AI Chief of Staff.',
    body:
      'Claude Code + n8n + Notion. Per-client agents. iMessage sync. Live dashboard. Running 24/7 on a Mac Mini.',
    caption: 'Jarvis — my AI Chief of Staff. Running 24/7.',
    bloom: { strength: 0.9, radius: 0.5, threshold: 0.78 },
  },
  {
    index: 7,
    start: 0.84,
    end: 1.0001,
    label: '// 07 — THE OPERATOR',
    title: 'Meet the person behind it all.',
    body:
      '10+ years. 6 AI systems. Zero developers. One EA who builds what others only talk about.',
    caption: 'The future of AI isn’t synthetic. It’s human.',
    bloom: { strength: 0.3, radius: 0.3, threshold: 0.9 },
  },
]
