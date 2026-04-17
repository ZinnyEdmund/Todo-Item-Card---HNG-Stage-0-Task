# Todo Item Card - Stage 1a

## Changes from Stage 0

- **Interactive Edit Mode**: Full form w/ explicit Save/Cancel button control, focus trapping, state snapshots
- **Status System**: Dropdown ↔ checkbox ↔ UI sync ("Done" checks box automatically)
- **Priority Visuals**: Dynamic top accent bar (High=red, Medium=amber, Low=gray)
- **Smart Collapse**: Descriptions >120 chars auto-collapse w/ accessible toggle
- **Advanced Time**: Granular "3hr 45min", 30s live updates, stops at "Completed"
- **Overdue States**: Red badge + glow effects
- **Explicit Button Logic**: Save hidden until Edit clicked (user fix)

## Design Decisions

| Feature  | Choice                             | Why                         |
| -------- | ---------------------------------- | --------------------------- |
| Priority | Top accent bar                     | Instant visual hierarchy    |
| Collapse | 120 char threshold + fade mask     | Clean truncated view        |
| Time     | 30s polling                        | Balances perf + "live" feel |
| Edit UX  | Explicit btn show/hide + form trap | Precise control, a11y       |
| Status   | `<select>` over buttons            | Compact + accessible        |

## Known Limitations

- No localStorage (single session only)
- No multi-card list (single card spec)
- No form validation beyond empty title
- Favicon missing (404 in logs)


## Live Demo

- **Local**: http://localhost:3001
- **Test**: All interactions work, responsive 320px+


**Thank You** 

