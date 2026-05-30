Now I have a complete picture of the file. Here's the translated and improved description in English:

---

## What is a `.menu` file?

### Overview

A `.menu` file is a plain-text format designed by Simon Ameye specifically for **Brume Coffee** (Nice, France). Its purpose is to store a restaurant menu in a way that is both **human-readable** and easy to render automatically into a formatted webpage.

---

### Core Concepts

The file is built around three nested levels of structure:

| Unit | Separated by | Purpose |
|------|-------------|---------|
| **Lines** | newline (`\n`) | Group items together |
| **Items** | underscore `_` | Individual pieces of content (name, price, description…) |
| **Details** | at-sign `@` | Variants of a single item (original text, translation, hyperlink) |

---

### Item Levels

The **indentation level** of an item is determined by the number of `_` characters that precede it at the start of its line. Each level has a specific role:

| Level | Prefix | Role |
|-------|--------|------|
| 0 | *(nothing)* | **Block** — a top-level section of the menu |
| 1 | `_` | **Category** — a group within a block |
| 2 | `__` | **Product** — an individual item for sale |
| 3 | `___` | **Price** |
| 4 | `____` | **Description** |
| 5 | `_____` | **Allergens** |
| 6 | `______` | **Comment / note** |

> Two items of different levels can appear on the same line. For example, `item1 _ item2` is equivalent to writing them on separate lines.

---

### Detail Levels

Within a single item, the `@` separator creates **details** at increasing levels:

| Level | Role | Required? |
|-------|------|-----------|
| 0 | **Text** (original, typically French) | ✅ Yes |
| 1 | **Translation** (typically English) | Optional |
| 2 | **Hyperlink** | Optional |

Example: `Jus d'orange @ Orange juice @ https://example.com`

---

### Formatting Rules

- **Whitespace** around delimiters (`_`, `@`) is automatically trimmed. `bonjour monde @ hello world` is equivalent to `bonjour monde@hello world`.
- **Empty lines** and lines starting with `#` are **ignored** (treated as comments).
- **Prices** must never have a translation or a hyperlink.

---

### Allergens

Allergens must be chosen from the following official list:
`céréales, crustacés, oeufs, poissons, arachides, soja, lait, fruits à coques, céleri, moutarde, sésame, sulfites, lupin, mollusques`

- Known allergens are **automatically translated** by the renderer.
- An unknown allergen will still be displayed, but will be **highlighted in red**.

---

### Special Blocks

Two special block prefixes modify how a block is displayed:

| Prefix | Behavior |
|--------|----------|
| `!` | The block name is **not displayed** in the menu |
| `>` | The block's content is injected into the **HTML element whose ID matches the name** (e.g. `>introBox` targets `<div id="introBox">`) |

---

### Recommended Line Pattern (4 types)

```
Block:      blockFr @ blockEn
Category:   _ categoryFr @ categoryEn
Product:    __ productFr @ productEn _ price _ descriptionFr @ descriptionEn _ allergens
Comment:    ______ commentFr @ commentEn
```

---

### Full Example

```
Boissons @ Drinks
_ Jus @ Juice
______ Rafraichissant ! @ Refreshing!
__ Jus d'orange @ Orange juice _ 3.5 _ With two oranges
__ Jus de tomate @ Tomato juice _ 2

Café @ Coffee
__ Espresso _ 1.5
__ Latte _ 4 _ _ lait
______ made with <3
```