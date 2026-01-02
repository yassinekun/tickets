# macantik Design System & UI Documentation

This document serves as the official design guide for the **macantik AFCON 2025 Ticket Platform**. It outlines the core aesthetics, layout principles, and theme instructions used across the project.

---

## 🎨 1. Core Visual Identity

### Aesthetic Philosophy
**"Action-Oriented Premium"**: The design combines the energy of football with the reliability of a high-end fintech app. It uses deep slates, vibrant primary colors, and a heavy emphasis on typography and "glassmorphism."

### Color Palette
- **Primary (Lion Red/Blue)**: Vibrant high-contrast colors used for critical actions and brand identity.
- **Secondary (Turquoise/Success)**: Used for verified badges, successful actions, and positive financial indicators.
- **Status (Danger/Warning)**: Used for expired matches (`gray-400`), pending activations (`orange-500`), and logout/delete actions (`red-500`).
- **Backgrounds**:
    - **Public/Fan Portal**: Light `gray-50` with white surfaces for a clean, accessible feel.
    - **Admin Portal**: Deep `slate-900` with `slate-800` cards for an "Internal/Secured" identity.

---

## 🖌️ 2. Typography & Texture

### Typography Hierarchy (Inter / System Sans)
- **Primary Headings**: Black/Extrabold weight, tight tracking (`tracking-tight`), often italicized in dashboard headers for "Sport Broadcast" energy.
- **Labels**: Small caps (`uppercase`), extrabold (`font-black`), wide tracking (`tracking-widest`) at `text-[10px]`.
- **Match Items**: Use thick uppercase font for team names to mimic stadium scoreboards.

### Glassmorphism & Depth
- **Navbar**: `backdrop-blur-md` with `bg-white/5` or `bg-slate-900/80`.
- **Floating Background**: A repeating diagonal pattern (`pattern-01.png`) is fixed globally at `opacity-5` to create subtle depth.
- **Elevation**: Rounding is always `rounded-3xl` or `rounded-[2rem]` for a modern, mobile-first organic feel.

---

## 📐 3. Page-Specific Design Systems

### A. Fan Dashboard (The Management Hub)
- **Layout**: Sidebar-centric (`lg:flex-row`).
- **Metric Cards**: Focus on "Recent Activity" and "Match Countdown." Use small `primary/10` background icons.
- **Action Buttons**: Floating "+" icons for "List Ticket" or "Set Alert." 
- **Modals**: High-relief white cards with centered icon branding (e.g., Verification fee modal uses a central `Check` or `Dollar` icon).

### B. Admin Dashboard (The Control Room)
- **Isolation**: Strictly uses the dark mode (`bg-slate-900`).
- **Stats Row**: Large metrics with progress bars (`h-1`) at the bottom of each stat card to show relative volume.
- **Verification List**: Multi-column tables with "Quick Toggle" switches. Pending items must be highlighted with `bg-orange-500/10` backgrounds.
- **Visual Feedback**: Real-time status updates (Verified vs. Not Verified) use high-contrast text (`text-white` vs `text-gray-400`).

### C. Ticket Details & Marketplace
- **Two-Column Split**: 
    - **Left (Context)**: Large-scale interactive SVG SeatMap. Focus on visual selection.
    - **Right (Action)**: Scrollable `TicketList` with "Buy Now" as the primary CTA.
- **Category Indicators**: Use distinct border colors for CAT 1, CAT 2, and CAT 3 corresponding to map highlights.
- **Trust Elements**: Verified Seller badges must be immediately visible next to seller names.

---

## 🏟️ 4. Layout Rules & Components

1.  **Global Background Layer**: Applied in `App.jsx`, ensuring every page has a premium textured feel.
2.  **Match Cards**: 
    - **Upcoming**: Full color, hover scale, "Find Ticket" primary button.
    - **Past**: `opacity-60`, disabled links, "Not Available" grayed-out button.
3.  **Sticky Elements**: Headers (`Navbar`) and Action Bars (`Ticket List` container) must remain sticky to key viewports for high conversion.
4.  **Empty States**: Use `lucide` icons at hero sizes (`size-64`) with muted tones (`text-gray-200`) to guide users when no data exists.

---

## 🛠️ 5. Implementation Instructions

- **Strict Identity**: Never mix the Fan light theme into the Admin dark mode.
- **Accessibility**: All buttons must have `active:scale-95` and `hover:scale-[1.02]` for tactile feedback.
- **Brand Consistency**: The `macantik` logo (Lion symbol) is the anchor. It must be consistent in size (`h-12`) across all headers.
