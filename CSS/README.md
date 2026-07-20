# CSS — Complete Beginner Notes

CSS (**Cascading Style Sheets**) is the language that **styles** HTML — colors, sizes, spacing, layout, animations.

HTML = skeleton 🦴 → CSS = skin, clothes & makeup 🎨

---

## 1. CSS Syntax

```css
selector {
    property: value;
    property: value;
}
```

Example:
```css
h1 {
    color: red;
    font-size: 40px;
}
```
Read as: *"Select all `<h1>` tags → make their text red and 40px big."*

- **Selector** → WHAT to style
- **Property** → WHICH aspect (color, size...)
- **Value** → HOW (red, 40px...)
- Every line ends with a **semicolon `;`**

---

## 2. Three Ways to Add CSS

### 1. Inline CSS (inside the tag) — avoid for real projects
```html
<p style="color: blue; font-size: 20px;">Hello</p>
```

### 2. Internal CSS (inside `<style>` in the `<head>`)
```html
<head>
    <style>
        p { color: blue; }
    </style>
</head>
```

### 3. External CSS (separate file) ✅ BEST practice
Create `style.css`:
```css
p { color: blue; }
```
Link it in your HTML `<head>`:
```html
<link rel="stylesheet" href="style.css">
```

**Priority:** Inline > Internal/External (whichever comes last wins).

---

## 3. Selectors (how to target elements)

```css
/* 1. Element selector — all <p> tags */
p { color: green; }

/* 2. Class selector (.) — reusable, most used */
.highlight { background: yellow; }

/* 3. ID selector (#) — unique, one per page */
#header { background: black; }

/* 4. Universal selector — everything */
* { margin: 0; padding: 0; }

/* 5. Group selector — multiple at once */
h1, h2, p { font-family: Arial; }

/* 6. Descendant — <p> INSIDE .card */
.card p { color: gray; }

/* 7. Direct child — <li> directly inside <ul> */
ul > li { list-style: none; }

/* 8. Pseudo-classes — element states */
a:hover { color: red; }        /* mouse over */
input:focus { border-color: blue; }  /* clicked/typing */
li:first-child { font-weight: bold; }
li:nth-child(2) { color: purple; }

/* 9. Pseudo-elements */
p::first-letter { font-size: 2em; }
.note::before { content: "📌 "; }
```

HTML usage of class & id:
```html
<p class="highlight">I have a class</p>
<div id="header">I have an id</div>
```

**Rule of thumb:** use **classes** for styling, **ids** for unique elements/JavaScript.

---

## 4. Specificity (which rule wins?)

When rules conflict, the more "specific" one wins:

```
Inline style  >  #id  >  .class  >  element
   1000          100       10         1
```

```css
p { color: blue; }       /* loses */
.text { color: green; }  /* wins over p */
#msg { color: red; }     /* wins over .text */
```

If specificity is equal → the **last rule written wins** (that's the "Cascading" in CSS).

---

## 5. Colors

```css
h1 {
    color: red;                    /* name */
    color: #ff0000;                /* hex */
    color: rgb(255, 0, 0);         /* rgb */
    color: rgba(255, 0, 0, 0.5);   /* rgb + opacity (0–1) */
    color: hsl(0, 100%, 50%);      /* hue, saturation, lightness */
}
```

- `color` → text color
- `background-color` → background

---

## 6. Text & Font Properties

```css
p {
    font-size: 18px;
    font-family: Arial, sans-serif;   /* fallback fonts */
    font-weight: bold;                /* normal | bold | 100–900 */
    font-style: italic;
    text-align: center;               /* left | center | right | justify */
    text-decoration: underline;       /* none (removes link underline) */
    text-transform: uppercase;        /* lowercase | capitalize */
    line-height: 1.6;                 /* spacing between lines */
    letter-spacing: 2px;
}
```

**Google Fonts (free custom fonts):**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
```
```css
body { font-family: 'Poppins', sans-serif; }
```

---

## 7. The Box Model ⭐ (MOST important concept)

Every HTML element is a rectangular **box** made of 4 layers:

```
┌─────────────── margin (outside space) ───────────────┐
│  ┌───────────── border ─────────────┐                │
│  │  ┌───────── padding ─────────┐   │                │
│  │  │                           │   │                │
│  │  │        CONTENT            │   │                │
│  │  │                           │   │                │
│  │  └───────────────────────────┘   │                │
│  └───────────────────────────────────┘               │
└───────────────────────────────────────────────────────┘
```

```css
.box {
    width: 300px;
    height: 150px;
    padding: 20px;              /* space INSIDE, between content & border */
    border: 2px solid black;    /* the edge */
    margin: 30px;               /* space OUTSIDE, pushes other elements away */
}
```

### Shorthand (clockwise: top, right, bottom, left)
```css
padding: 10px;                  /* all 4 sides */
padding: 10px 20px;             /* top-bottom | left-right */
padding: 10px 20px 30px 40px;   /* top | right | bottom | left */
margin: 0 auto;                 /* center a block horizontally! */
```

### box-sizing (always use this!)
```css
* {
    box-sizing: border-box;   /* width includes padding + border = predictable sizes */
    margin: 0;
    padding: 0;
}
```

### Border & corners
```css
border: 2px dashed red;      /* solid | dashed | dotted */
border-radius: 10px;         /* rounded corners */
border-radius: 50%;          /* perfect circle (on a square) */
```

---

## 8. Display Property

```css
display: block;         /* new line, full width (div, p, h1) */
display: inline;        /* same line, no width/height (span, a) */
display: inline-block;  /* same line BUT accepts width/height */
display: none;          /* completely removes element */
```

Related: `visibility: hidden;` hides the element but **keeps its space**.

---

## 9. Flexbox ⭐ (modern layout — learn this well!)

Put `display: flex` on a **parent** and its children line up automatically:

```css
.container {
    display: flex;
    flex-direction: row;        /* row (default) | column */
    justify-content: center;    /* main axis: flex-start | center | flex-end |
                                   space-between | space-around | space-evenly */
    align-items: center;        /* cross axis: flex-start | center | flex-end */
    gap: 20px;                  /* space between children */
    flex-wrap: wrap;            /* wrap to next line if no space */
}
```

**Perfectly center anything (memorize this!):**
```css
.parent {
    display: flex;
    justify-content: center;  /* horizontal */
    align-items: center;      /* vertical */
    height: 100vh;
}
```

Child properties:
```css
.child {
    flex: 1;          /* grow to share space equally */
    align-self: end;  /* override alignment for one child */
}
```

---

## 10. CSS Grid (2D layouts)

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;   /* 3 equal columns */
    grid-template-columns: repeat(3, 1fr); /* same thing, shorter */
    grid-template-columns: 200px 1fr;      /* fixed sidebar + flexible main */
    gap: 20px;
}
```

**Flexbox** = 1 direction (row OR column). **Grid** = 2 directions (rows AND columns).

---

## 11. Position

```css
position: static;    /* default, normal flow */
position: relative;  /* move relative to its normal spot; also anchors children */
position: absolute;  /* positioned relative to nearest 'relative' parent */
position: fixed;     /* stuck to the screen (navbars!) even when scrolling */
position: sticky;    /* scrolls normally, then sticks */
```

Used with offsets + layering:
```css
.badge {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 5;      /* higher number = on top */
}
```

---

## 12. Units

| Unit | Meaning |
|------|---------|
| `px` | Fixed pixels |
| `%` | Percent of parent |
| `vw` / `vh` | 1% of screen width / height (`100vh` = full screen height) |
| `em` | Relative to parent font-size |
| `rem` | Relative to root font-size (16px default) — best for font sizes |
| `fr` | Fraction of free space (Grid only) |

---

## 13. Backgrounds & Shadows

```css
.hero {
    background-color: #222;
    background-image: url('bg.jpg');
    background-size: cover;        /* fill the whole area */
    background-position: center;
    background-repeat: no-repeat;

    /* Gradient */
    background: linear-gradient(to right, #ff6b6b, #556270);

    /* Shadows: x y blur color */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    text-shadow: 2px 2px 4px gray;
}
```

---

## 14. Transitions & Hover Effects

```css
.btn {
    background: royalblue;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;   /* smooth change */
}

.btn:hover {
    background: navy;
    transform: scale(1.1);       /* grow 10% */
    cursor: pointer;
}
```

Other transforms: `rotate(45deg)`, `translateX(20px)`, `scale(1.5)`.

---

## 15. Simple Animation

```css
@keyframes bounce {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(-20px); }
    100% { transform: translateY(0); }
}

.ball {
    animation: bounce 1s infinite;
}
```

---

## 16. Responsive Design (Media Queries)

Make your site work on mobile:

```css
/* Styles for screens 768px wide or SMALLER (tablets/phones) */
@media (max-width: 768px) {
    .container { flex-direction: column; }
    h1 { font-size: 24px; }
    .sidebar { display: none; }
}
```

Don't forget this in your HTML `<head>` (required for mobile):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 17. A Complete Mini Example

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Card</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="card">
        <img src="https://picsum.photos/300/150" alt="Random photo">
        <h2>Hello, I'm a Card</h2>
        <p>Built with HTML + CSS.</p>
        <button class="btn">Click Me</button>
    </div>
</body>
</html>
```

**style.css**
```css
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: Arial, sans-serif;
    background: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.card {
    background: white;
    width: 300px;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    text-align: center;
}

.card img { width: 100%; border-radius: 8px; }
.card h2 { margin: 12px 0 6px; }
.card p  { color: #666; margin-bottom: 16px; }

.btn {
    background: royalblue;
    color: white;
    border: none;
    padding: 10px 22px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
}
.btn:hover { background: navy; }
```

---

## 18. Common Beginner Mistakes

1. Forgetting `;` at the end of a line
2. Forgetting to link the CSS file (`<link rel="stylesheet" href="style.css">`)
3. Using `id` for everything → use `class`
4. Fighting specificity with `!important` → fix the selector instead
5. Fixed `px` widths everywhere → use `%`, `rem`, `flex` for responsiveness
6. Not using `box-sizing: border-box`

---

## 19. Practice Task 🏋️

1. Take your `about-me.html` from the HTML notes
2. Create `style.css` and link it
3. Give the page a background color and a custom Google Font
4. Center your content with Flexbox
5. Style your image with `border-radius: 50%` (circle photo!)
6. Add a hover effect to your links
7. Add a media query so it looks good on mobile

---

**Learning order:** Selectors → Box Model → Flexbox → Positioning → Responsive. Master these 5 and you can build almost anything.
