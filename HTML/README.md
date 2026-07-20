# HTML — Complete Beginner Notes

HTML (**HyperText Markup Language**) is the language used to create the **structure/skeleton** of every webpage.

- HTML = structure (bones) 🦴
- CSS = styling (skin & clothes) 🎨
- JavaScript = behavior (muscles/brain) 🧠

HTML is **not a programming language** — it's a *markup* language. It uses **tags** to describe content.

---

## 1. Basic Structure of an HTML Page

Every HTML file follows this skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage.</p>
</body>
</html>
```

| Part | Meaning |
|------|---------|
| `<!DOCTYPE html>` | Tells the browser "this is HTML5" |
| `<html>` | Root element — everything lives inside it |
| `<head>` | Info ABOUT the page (title, links, meta) — not visible on page |
| `<title>` | Text shown on the browser tab |
| `<meta charset="UTF-8">` | Supports all characters/emojis |
| `<meta viewport>` | Makes the page work on mobile |
| `<body>` | Everything VISIBLE on the page |

**Try it:** save the code above as `index.html` and double-click it — it opens in your browser!

---

## 2. Anatomy of a Tag

```html
<p class="intro">Hello there</p>
│  │             │           │
│  └ attribute   └ content   └ closing tag
└ opening tag
```

- **Tag**: keyword in angle brackets → `<p>`
- **Element**: opening tag + content + closing tag
- **Attribute**: extra info inside the opening tag → `class="intro"`, `href="..."`, `src="..."`
- **Self-closing tags** don't need a closing tag: `<br>`, `<img>`, `<hr>`, `<input>`

---

## 3. Block-Level vs Inline Elements ⭐ (Very Important)

### Block-Level Elements
- Always start on a **new line**
- Take up the **full width** available
- Can contain other block and inline elements
- You can set width/height on them

```html
<div>I am a block</div>
<p>I am also a block — I start on a new line</p>
<h1>Me too!</h1>
```

**Common block-level tags:**

| Tag | Purpose |
|-----|---------|
| `<div>` | Generic container (a "box") |
| `<h1>`–`<h6>` | Headings (h1 = biggest, h6 = smallest) |
| `<p>` | Paragraph |
| `<ul>`, `<ol>`, `<li>` | Lists |
| `<table>` | Tables |
| `<form>` | Forms |
| `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<main>` | Semantic layout tags |
| `<hr>` | Horizontal line |
| `<blockquote>` | Quoted section |

### Inline Elements
- Stay on the **same line** (don't break the flow)
- Only take up as much width as their content
- Width/height settings are ignored

```html
<p>This is <b>bold</b>, this is <i>italic</i>, and this is a <a href="#">link</a> — all on one line.</p>
```

**Common inline tags:**

| Tag | Purpose |
|-----|---------|
| `<span>` | Generic inline container |
| `<a>` | Link |
| `<b>` / `<strong>` | Bold (strong = important meaning) |
| `<i>` / `<em>` | Italic (em = emphasis) |
| `<u>` | Underline |
| `<img>` | Image |
| `<br>` | Line break |
| `<code>` | Code snippet |
| `<small>`, `<sub>`, `<sup>` | Small text, subscript, superscript |
| `<input>`, `<label>`, `<button>` | Form controls (inline-block) |

**Memory trick:** `div` = block box 📦, `span` = inline highlighter 🖍️

---

## 4. Headings & Paragraphs

```html
<h1>Main Title (only ONE per page)</h1>
<h2>Section Title</h2>
<h3>Sub-section</h3>
<p>A paragraph of text. Browsers automatically add spacing between paragraphs.</p>
<hr>  <!-- horizontal line -->
<p>Text after a line break<br>continues here on a new line.</p>
```

---

## 5. Text Formatting

```html
<b>Bold</b>            <strong>Important (bold)</strong>
<i>Italic</i>          <em>Emphasized (italic)</em>
<u>Underlined</u>      <mark>Highlighted</mark>
<del>Deleted</del>     <ins>Inserted</ins>
H<sub>2</sub>O         x<sup>2</sup>
```

---

## 6. Links (`<a>`)

```html
<!-- Link to another website (opens in new tab) -->
<a href="https://www.google.com" target="_blank">Go to Google</a>

<!-- Link to another page of YOUR site -->
<a href="about.html">About Us</a>

<!-- Link to a section on the same page -->
<a href="#contact">Jump to Contact</a>
<h2 id="contact">Contact</h2>

<!-- Email link -->
<a href="mailto:hello@example.com">Email me</a>
```

---

## 7. Images (`<img>`)

```html
<img src="photo.jpg" alt="A cute cat" width="300">
```

- `src` = path to the image (file or URL)
- `alt` = text shown if image fails to load (also used by screen readers — always include it!)
- `width`/`height` = size in pixels

---

## 8. Lists

```html
<!-- Unordered list (bullets) -->
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>

<!-- Ordered list (numbers) -->
<ol>
    <li>Wake up</li>
    <li>Code</li>
    <li>Sleep</li>
</ol>

<!-- Nested list -->
<ul>
    <li>Frontend
        <ul>
            <li>HTML</li>
            <li>CSS</li>
        </ul>
    </li>
</ul>
```

---

## 9. Tables

```html
<table border="1">
    <thead>
        <tr>
            <th>Name</th>
            <th>Age</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Aman</td>
            <td>21</td>
        </tr>
        <tr>
            <td>Priya</td>
            <td>22</td>
        </tr>
    </tbody>
</table>
```

- `<tr>` = table row, `<th>` = header cell (bold), `<td>` = data cell
- `colspan="2"` / `rowspan="2"` = merge cells across columns/rows

---

## 10. Forms (collecting user input)

```html
<form action="/submit" method="post">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" placeholder="Enter your name" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email">

    <label for="pass">Password:</label>
    <input type="password" id="pass" name="password">

    <!-- Radio buttons (choose ONE) -->
    <input type="radio" name="gender" value="male"> Male
    <input type="radio" name="gender" value="female"> Female

    <!-- Checkboxes (choose MANY) -->
    <input type="checkbox" name="skills" value="html"> HTML
    <input type="checkbox" name="skills" value="css"> CSS

    <!-- Dropdown -->
    <select name="city">
        <option value="delhi">Delhi</option>
        <option value="mumbai">Mumbai</option>
    </select>

    <!-- Multi-line text -->
    <textarea name="message" rows="4" cols="30" placeholder="Your message"></textarea>

    <button type="submit">Submit</button>
</form>
```

**Common input types:** `text`, `email`, `password`, `number`, `date`, `file`, `color`, `range`, `radio`, `checkbox`, `submit`

---

## 11. Semantic HTML (meaningful layout tags)

Instead of `<div>` everywhere, use tags that describe their purpose:

```html
<body>
    <header>Logo + navigation goes here</header>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
    <main>
        <section>
            <article>A blog post</article>
        </section>
        <aside>Sidebar / ads</aside>
    </main>
    <footer>© 2026 My Website</footer>
</body>
```

**Why?** Better for SEO (Google), accessibility (screen readers), and readable code.

---

## 12. Other Useful Tags

```html
<!-- Comment (not shown on page) -->
<!-- This is a comment -->

<!-- Video -->
<video src="video.mp4" controls width="400"></video>

<!-- Audio -->
<audio src="song.mp3" controls></audio>

<!-- Embed another page (e.g., YouTube) -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID" width="560" height="315"></iframe>

<!-- Button -->
<button>Click Me</button>
```

---

## 13. Common Mistakes Beginners Make

1. Forgetting to close tags → `<p>text` ❌ → `<p>text</p>` ✅
2. Wrong nesting → `<b><i>text</b></i>` ❌ → `<b><i>text</i></b>` ✅
3. Skipping `alt` on images
4. Using multiple `<h1>` tags (use only one per page)
5. Using tables for layout (use CSS instead)
6. Spaces in file names → use `my-page.html`, not `my page.html`

---

## 14. Practice Task 🏋️

Build a simple **"About Me"** page containing:

1. Page title in the browser tab
2. One `<h1>` with your name
3. A paragraph about yourself
4. An image (use any URL)
5. A list of your 3 favorite hobbies
6. A link to your GitHub profile
7. A table with your weekly schedule
8. A contact form (name + email + submit button)

Save it as `about-me.html` and open it in the browser!

---

**Next step:** Learn CSS to make these pages beautiful → see the `CSS` folder.
