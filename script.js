// -----------------
// DATA
// -----------------

const cures = [
  {
    name: "OPF-310 – Otsuka / University of Illinois Hospital",
    shortName: "OPF-310",
    yearsAway: "~8–12+ years",
    completionYear: 2027,
    stage: "Phase I/II – estimated completion June 2027 (NCT06575426)",
    notes: "Uses encapsulated insulin-producing pig islets intended to protect insulin-making cells from the immune system.",
    primaryPathway: "Cell Replacement"
  },
  {
    name: "UP421 – Sana Biotechnology / Uppsala University Hospital",
    shortName: "UP421",
    yearsAway: "~10–15+ years",
    completionYear: 2025,
    stage: "Phase I – estimated completion June 2025 (NCT06239636)",
    notes: "Genetically modified donor cells transplanted into the forearm muscle to replace lost insulin-making cells.",
    primaryPathway: "Cell Replacement"
  },
  {
    name: "VCTX-211 / CTX-211 – CRISPR Therapeutics",
    shortName: "VCTX-211",
    yearsAway: "~8–12+ years",
    completionYear: 2025,
    stage: "Phase I/II – estimated completion August 2025 (NCT05565248)",
    notes: "Gene-edited pancreatic precursor cells placed in an encapsulation device to safely restore insulin production.",
    primaryPathway: "Cell Replacement"
  },
  {
    name: "OPT101 – Op-T Balanced Immunity",
    shortName: "OPT101",
    yearsAway: "~6–10+ years",
    completionYear: 2028,
    stage: "Phase II – estimated completion August 2028 (NCT06964087)",
    notes: "Immune-calming injections hoped to reduce chronic inflammation and slow the immune attack on insulin-making cells.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "Denosumab – City of Hope",
    shortName: "Denosumab",
    yearsAway: "~6–10+ years",
    completionYear: 2026,
    stage: "Phase II – estimated completion April 2026 (NCT06524960)",
    notes: "An existing osteoporosis drug being tested to see if it can protect and improve insulin-making cell function.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "Autologous MSCs – Children Hospital El-Demerdash (Egypt)",
    shortName: "Auto MSCs",
    yearsAway: "~4–8+ years",
    completionYear: 2026,
    stage: "Phase II/III – estimated completion September 2026 (NCT06951074)",
    notes: "Uses the patient’s own stem cells, prepared in the lab and then reinfused to help support insulin-making cells.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "The OPERA Study – Abu Dhabi Stem Cells Center (ADSCC)",
    shortName: "OPERA",
    yearsAway: "~8–12+ years",
    completionYear: 2026,
    stage: "Phase I/II – estimated completion December 2026 (NCT05413005)",
    notes: "White blood cells are treated with light and medication outside the body, then returned to gently retrain the immune system.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "PlpepTolDC – City of Hope",
    shortName: "PlpepTolDC",
    yearsAway: "~10–15+ years",
    completionYear: 2026,
    stage: "Phase I – estimated completion January 2026 (NCT04590872)",
    notes: "Uses a patient’s immune cells mixed with beta-cell proteins to teach the immune system to stop attacking insulin-making cells.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "COVALENT-112 – Biomea Fusion",
    shortName: "COVALENT-112",
    yearsAway: "~6–10+ years",
    completionYear: 2025,
    stage: "Phase II – estimated completion August 2025 (NCT06152042)",
    notes: "An oral medicine (menin inhibitor BMF-219) designed to calm the immune attack and let insulin-making cells recover.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "Umbilical T Cells + Liraglutide – Central South University (China)",
    shortName: "Umb T + Lira",
    yearsAway: "~8–12+ years",
    completionYear: 2026,
    stage: "Phase I/II – estimated completion July 2026 (NCT03011021)",
    notes: "T cells from umbilical cord blood and a diabetes medicine (liraglutide) are combined to both adjust the immune response and support insulin release.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "Repeat BCG Vaccinations – Faustman Lab (MGH)",
    shortName: "BCG",
    yearsAway: "~10–15+ years",
    completionYear: 2031,
    stage: "Phase II – estimated completions March 2027 & July 2031 (NCT05180591, NCT02081326)",
    notes: "An older TB vaccine (BCG) given repeatedly to see if it can ‘reset’ the immune system in people with long-term Type 1 diabetes.",
    primaryPathway: "Immune System Modification"
  },
  {
    name: "Stem Cell Educator – Tarone Biotechnologies / Hackensack UMC",
    shortName: "Stem Educator",
    yearsAway: "~4–8+ years",
    completionYear: 2025,
    stage: "Phase II/III – estimated completion June 2025 (NCT04011020)",
    notes: "A person’s blood is circulated through a device with stem cells that ‘educate’ immune cells before they return to the body, with the goal of easing the immune attack.",
    primaryPathway: "Immune System Modification"
  }
];

// Convert "~4–8+ years" into a midpoint number (e.g., 6)
function extractYearsFromText(yearsAwayText) {
  if (!yearsAwayText) return 0;
  const matches = yearsAwayText.match(/\d+/g);
  if (!matches) return 0;

  const numbers = matches
    .map(n => parseInt(n, 10))
    .filter(n => !Number.isNaN(n));

  if (!numbers.length) return 0;
  if (numbers.length === 1) return numbers[0];

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return (min + max) / 2;
}




// -----------------
// HELPERS
// -----------------

// Flip "Project – Company / University" -> "Company / University – Project"
function getDisplayName(rawName) {
  if (!rawName || !rawName.includes("–")) return rawName;
  const parts = rawName.split("–");
  if (parts.length < 2) return rawName;

  const project = parts[0].trim();
  const sponsor = parts.slice(1).join("–").trim();
  return `${sponsor} – ${project}`;
}

// Pull first NCT ID out of the stage string, if present
function getNctId(stageText) {
  if (!stageText) return null;
  const match = stageText.match(/\b(NCT[0-9A-Z]+)\b/);
  return match ? match[1] : null;
}


// -----------------
// RENDER CARDS
// -----------------

function renderCureCards() {
  const cureList = document.getElementById("cure-list");
  if (!cureList) return;

  const groups = {};
  cures.forEach(cure => {
    const key = cure.primaryPathway || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(cure);
  });

  Object.keys(groups).forEach(pathway => {
    const section = document.createElement("section");
    section.className = "pathway-section";

    const heading = document.createElement("h3");
    heading.className = "pathway-heading";
    heading.textContent = pathway;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "pathway-grid";

    groups[pathway].forEach(cure => {
      const card = document.createElement("div");
      card.className = "cure-card";

      const displayName = getDisplayName(cure.name);
      const nctId = getNctId(cure.stage);
      const trialLinkHtml = nctId
        ? `<a class="cure-link" href="https://clinicaltrials.gov/study/${nctId}" target="_blank" rel="noopener noreferrer">View on ClinicalTrials.gov</a>`
        : "";

      card.innerHTML = `
        <div class="cure-name">${displayName}</div>
        <div class="cure-years">${cure.yearsAway}</div>
        <div class="cure-stage">${cure.stage}</div>
        <div class="cure-notes">${cure.notes}</div>
        ${trialLinkHtml}
      `;

      grid.appendChild(card);
    });

    section.appendChild(grid);
    cureList.appendChild(section);
  });
}


// -----------------
// RENDER CHEVRON TIMELINE (2025–2036)
// -----------------

function getShortSponsor(rawName) {
  if (!rawName || !rawName.includes("–")) return rawName;

  // Extract sponsor portion only
  const fullSponsor = rawName.split("–").slice(1).join("–").trim();

  // If it's already short enough, return it
  if (fullSponsor.length < 18) return fullSponsor;

  // Custom replacements for common long names
  const replacements = [
    { match: "University of Illinois Hospital", short: "Illinois Hospital" },
    { match: "Uppsala University Hospital", short: "Uppsala Hospital" },
    { match: "Children Hospital El-Demerdash (Egypt)", short: "El-Demerdash" },
    { match: "Tarone Biotechnologies / Hackensack UMC", short: "Tarone / Hackensack" },
    { match: "Central South University (China)", short: "Central South Univ" },
    { match: "City of Hope", short: "City of Hope" },
    { match: "CRISPR Therapeutics", short: "CRISPR" },
    { match: "Abu Dhabi Stem Cells Center (ADSCC)", short: "ADSCC" },
    { match: "Faustman Lab (MGH)", short: "MGH" }
  ];

  for (let r of replacements) {
    if (fullSponsor.includes(r.match)) return r.short;
  }

  // If no match → fallback: take first chunk before “/”
  return fullSponsor.split("/")[0].trim();
}


function renderChevronTimeline() {
  const chevronRow = document.getElementById("chevron-row");
  const dotsContainer = document.getElementById("chevron-dots");
  if (!chevronRow || !dotsContainer) return;

  // Segments along a 0–15 year line from "today"
  const segments = [
    { label: "0–5 years",   min: 0,  max: 5 },
    { label: "5–10 years",  min: 5,  max: 10 },
    { label: "10–15+ years", min: 10, max: 15 }
  ];
  const segmentCount = segments.length;

  // Build 3 chevrons with a left→right blue fade
  segments.forEach((seg, index) => {
    const t = segmentCount <= 1 ? 0 : index / (segmentCount - 1); // 0 → 1
    const lightness = 40 + t * 20; // 40% → 60%

    const chev = document.createElement("div");
    chev.className = "chevron";
    chev.textContent = seg.label;
    chev.style.background = `hsl(220, 85%, ${lightness}%)`;

    chevronRow.appendChild(chev);
  });

  // Track stacking of dots per "rough year bucket"
  const bucketSlotCounts = {};

  cures.forEach(cure => {
    const midYears = extractYearsFromText(cure.yearsAway); // 0–15ish
    if (!midYears) return;

    const clampedYears = Math.max(0, Math.min(midYears, 15));

    // Find which 5-year segment this lands in
    let segIndex = segments.length - 1;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const isLast = i === segments.length - 1;
      if (
        clampedYears >= seg.min &&
        (clampedYears < seg.max || (isLast && clampedYears <= seg.max))
      ) {
        segIndex = i;
        break;
      }
    }

    const seg = segments[segIndex];
    const span = seg.max - seg.min || 1;
    const withinSeg = (clampedYears - seg.min) / span; // 0–1 inside that block

    // Convert segment + within-segment position into a 0–100% left offset
    const leftPercent =
      ((segIndex + withinSeg) / segmentCount) * 100;

    // Use rounded midpoint as a simple bucket key for stacking
    const bucketKey = Math.round(clampedYears);
    const currentSlot = bucketSlotCounts[bucketKey] || 0;
    bucketSlotCounts[bucketKey] = currentSlot + 1;

    const baseTop = 2;         // closer to the chevrons
    const slotSpacing = 44;    // more space between stacked dots
    const topPx = baseTop + currentSlot * slotSpacing;



    const wrapper = document.createElement("div");
    wrapper.className = "chevron-dot-wrapper";
    wrapper.style.left = `${leftPercent}%`;
    wrapper.style.top = `${topPx}px`;

    const dot = document.createElement("div");
    dot.className = "chevron-dot";
    const approxYears = Math.round(midYears);
    dot.title = `${cure.name} – ~${approxYears} years out`;

    const label = document.createElement("div");
    label.className = "chevron-label";
    label.textContent = getShortSponsor(cure.name) || "";



    wrapper.appendChild(dot);
    wrapper.appendChild(label);
    dotsContainer.appendChild(wrapper);
  });
}




// -----------------
// INIT
// -----------------

document.addEventListener("DOMContentLoaded", () => {
  renderCureCards();
  renderChevronTimeline();
});
