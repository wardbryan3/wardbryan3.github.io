# Aptio BIOS Screen Design

## Overview

Replace the current simple BIOS window with an authentic Aptio (American Megatrends) UEFI BIOS layout. The existing color scheme is correct (`#0000aa` blue background, `#c0c0c0` grey windows, `#000080` navy titlebars). The change adds the characteristic Aptio layout structure — header, menu tab bar, help pane, and footer — around the existing boot confirmation dialog.

## Layout

The BIOS screen is divided into four vertical sections:

```
┌──────────────────────────────────────────────────────────────┐
│  Aptio Setup Utility - v1.0    Copyright (C) 2025 AMI      │  ← Header
├──────────────────────────────────────────────────────────────┤
│  Main | Advanced | Chipset | Boot | Security | Save & Exit  │  ← Menu tabs
├──────────────────────────────────────────────────────────────┤
│                         │  Item Specific Help               │
│    [Boot Confirmation]  │  Confirm whether to               │  ← Content area
│    dialog window        │  continue booting...              │     (left + right pane)
│                         │                                    │
├──────────────────────────────────────────────────────────────┤
│  F1 Help  ESC Exit  ← → Select  Enter Accept               │  ← Footer
└──────────────────────────────────────────────────────────────┘
```

### 1. Header Bar

- Full-width bar at the top of the screen
- **Background:** `#0000aa` (inherits from overlay)
- **Left text:** "Aptio Setup Utility - v1.0" — white, bold
- **Right text:** "Copyright (C) 2025 American Megatrends" — light grey (`#c0c0c0`), normal weight
- **Bottom border:** 2px solid `#c0c0c0` to visually separate from menu tabs
- **Padding:** 8px 12px

### 2. Menu Tab Bar

- A row of six tabs below the header
- **Background:** `#0000aa` (inherits)
- **Tabs (left to right):** Main, Advanced, Chipset, Boot, Security, Save & Exit
- **Selected tab ("Main"):** Background `#000080`, white text, bold
- **Unselected tabs:** Light grey text (`#c0c0c0`), no background
- **Padding:** 4px 8px for the bar, 2px 12px per tab

### 3. Content Area (Split Pane)

Divided into two panes separated by a 1px `#0000cc` border:

**Left Pane (main content):**
- Flex: 1 (fills remaining width)
- Contains the boot confirmation dialog, centered vertically and horizontally within the pane

**Right Pane (help):**
- Fixed width: 180px
- **Heading:** "Item Specific Help" — white, bold, small (11px)
- **Body text:** Light grey (`#c0c0c0`), 11px — explains what this screen does
- **Separator:** Top border 1px `#0000cc`
- **Key hints:** Darker grey (`#888888`), 10px — shows ← → and Enter hints

### 4. Footer

- Full-width bar at the bottom
- **Top border:** 2px solid `#c0c0c0`
- **Key labels:** White, bold (for F1, ESC, ← →, Enter)
- **Descriptions:** Light grey (`#c0c0c0`)
- **Content:** "F1 Help | ESC Exit | ← → Select | Enter Accept"

## Dialog Window (Boot Confirmation)

The same dialog as the current implementation, positioned in the content area's left pane:

- **Outer:** Background `#c0c0c0`, border 2px solid `#ffffff`
- **Titlebar:** Background `#000080`, white bold text "Boot Confirmation", no close button
- **Body:** Centered text layout
- **Message:** "My wife made me put this here, would you like to boot?" — black, 13px
- **Choices:**
  - [Y] Yes: Background `#000080`, white text, bold (selected state)
  - [N] No: Dark grey text, no background (inactive state)
- **Internal footer:** "← → Select   Enter Accept" — dark grey, 11px, separated by 1px `#888888` border

## Colors

| Element | Value | Usage |
|---------|-------|-------|
| Background | `#0000aa` | Main BIOS screen background |
| Window bg | `#c0c0c0` | Dialog window, header label |
| Titlebar | `#000080` | Dialog title bar, selected tab, selected choice |
| White | `#ffffff` | All header text, dialog title, key labels, selected choice text |
| Light grey | `#c0c0c0` | Copyright text, unselected tabs, help text, footer descriptions |
| Dark grey | `#444444` / `#888888` | Inactive choice, dialog footer, help key hints |
| Black | `#000000` | Dialog body text |
| Border | `#0000cc` | Pane separator |
| Dialog border | `#ffffff` | Dialog window border |
| Footer border | `#c0c0c0` | Header/footer separator lines |

## Interaction

Unchanged from current implementation:
- **ArrowLeft / ArrowRight:** Toggle selection between [Y] and [N]
- **Enter:** If [Y] is selected, dismisses BIOS and dispatches `boot:bios-yes` event; if [N], no action
- **All keyboard events** are captured via `keydown` listener on `document`

## Implementation

### Files to Modify

1. **`src/components/BiosWindow.jsx`** — Add Aptio layout structure (header, tabs, pane split, help pane, footer) while keeping the dialog and keyboard interaction

2. **`src/styles/global.css`** — Update BIOS CSS classes:
   - `.bios-overlay` — keep existing
   - `.bios-header` — update to match Aptio layout
   - `.bios-tabbar` (new) — menu tab row
   - `.bios-tab` (new) — individual tab
   - `.bios-tab-selected` (new) — selected tab state
   - `.bios-body` — update to flex row layout with left/right panes
   - `.bios-help-pane` (new) — right pane
   - `.bios-footer` — update to show key hints

### Keyboard Interaction

Reuse existing event handling in `BiosWindow.jsx` — no changes needed.

### Dependencies

None. This is a CSS and JSX change only.

## Future Considerations

- None — the BIOS screen is a single-purpose boot confirmation dialog. No additional menus or settings will be added.
