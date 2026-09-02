# Kairo

A time tracking, client, task, and finance management app built with vanilla HTML, CSS, and JavaScript — created to unify the tools I used daily as a virtual assistant (Clockify, Notion, and a spreadsheet) into a single place.

This is a learning project focused on relational data modeling with `localStorage` (many-to-many relationships between entities), CRUD operations across multiple connected data types, mobile-first responsive design, and inline editing — all without frameworks or libraries beyond Font Awesome and Flatpickr.

<img width="1350" height="633" alt="image" src="https://github.com/user-attachments/assets/a6eedd47-1724-459c-9813-d10b802564e9" />
<img width="1365" height="633" alt="image" src="https://github.com/user-attachments/assets/9556907e-b117-4c0e-94ee-eb7c468f37ce" />
<img width="1350" height="630" alt="image" src="https://github.com/user-attachments/assets/12b9d55c-1bc0-4f43-8ae8-19281f151fa8" />


## Features

- **Timer** — track time live with a stopwatch, or log it manually after the fact (date, start/end time, with the total calculated automatically); every field of a saved entry (client, project, description, tag, start, end) can be edited inline, directly on the card
- **Clients** — full CRUD, linked to one or more Projects through a many-to-many relationship (managed via checkboxes in the client's own form), drag-and-drop file selection for attachments, soft delete with a dedicated "deleted" area to restore or permanently remove
- **Projects** — full CRUD with a custom color per project (used consistently across the whole app — client links, time entries, Kanban columns), soft delete/restore (restoring optionally re-links the project to its previous clients)
- **Tasks** — a Kanban board per client with 5 color-coded status columns (To do, Doing, Waiting, Done, Archived), filterable by priority and by title keywords, with drag-and-drop file selection for attachments
- **Reports** — filter time entries by client, project, and a date range (via a range calendar); view a detailed, paginated list or a summary grouped by client + project; inline editing of every entry, same as the Timer
- **Finance** — pick a month to see exactly how much you're owed, calculated per client (hourly clients are billed by tracked time × rate; fixed-rate clients are billed their flat amount once, regardless of how many entries fall in that month), sorted from highest to lowest
- **Dark mode** — full light/dark theme toggle, persisted and consistent across every page
- **Responsive, mobile-first** — a collapsible sidebar on desktop, a bottom navigation bar on mobile

## Built with

- HTML5 (semantic markup)
- CSS3 (custom properties, Flexbox, CSS Grid, mobile-first media queries, no frameworks)
- Vanilla JavaScript (no libraries beyond the two below — DOM API, `localStorage`, Drag and Drop API)
- [Font Awesome](https://fontawesome.com/) for icons
- [Flatpickr](https://flatpickr.js.org/) for the Reports date range picker
- [Google Fonts](https://fonts.google.com/) — Inter & Sora

## Running locally

This is a static site — no build step or dependencies required.

1. Clone the repository
2. Open `index.html` in your browser, or serve it with a tool like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Data & privacy

All data (clients, projects, tasks, time entries) is stored locally in the browser via `localStorage` — nothing is sent to any server. This also means data doesn't sync between different browsers or devices, and clearing browser data will erase it.

## Roadmap

This project is actively evolving. Some ideas planned for future updates:

- Persisting attached files (selection already works via drag-and-drop, but the file itself isn't saved yet)
- An hourly package per client, with automatic overage billing and warnings when a client is close to or past their limit
- Exporting reports (detailed and summary) as PDF and Excel
- A billable/non-billable checkbox on time entries (the calculations already account for it, the UI doesn't yet)
- Multi-currency support (currently Real only)
- Drag-and-drop reordering between Kanban columns (task editing currently handles status changes instead)
- Custom-styled confirmation dialogs, replacing the browser's native `confirm()`

---

Made with 💙 by Nathalia
