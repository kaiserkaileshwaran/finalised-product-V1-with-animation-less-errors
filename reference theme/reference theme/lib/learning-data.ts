// Learning path data structure with comprehensive content

export interface LearningPath {
  id: string
  slug: string
  name: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Elite"
  estimatedHours: number
  skills: string[]
  icon: string
  color: string
  levels: PathLevel[]
  totalLessons: number
}

export interface PathLevel {
  id: string
  name: string
  description: string
  difficulty: string
  topics: Topic[]
}

export interface Topic {
  id: string
  name: string
  description: string
  lessons: Lesson[]
  isCompleted?: boolean
  isCurrent?: boolean
}

export interface Lesson {
  id: string
  title: string
  description: string
  type: "concept" | "exercise" | "project" | "quiz" | "challenge"
  duration: number
  xpReward: number
  content: LessonContent
  isCompleted?: boolean
}

export interface LessonContent {
  explanation: string
  keyTakeaways: string[]
  documentationRefs: DocumentationRef[]
  codeExamples: CodeExample[]
  exercises: Exercise[]
  quiz: QuizQuestion[]
  project?: ProjectTask
  challenge?: ChallengeTask
}

export interface DocumentationRef {
  title: string
  url: string
  source: string
}

export interface CodeExample {
  title: string
  language: string
  code: string
  explanation: string
  output?: string
}

export interface Exercise {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard"
  description: string
  starterCode: string
  hints: string[]
  solution: string
  testCases: TestCase[]
}

export interface TestCase {
  input: string
  expectedOutput: string
  description: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

export interface ProjectTask {
  title: string
  difficulty: "beginner" | "intermediate" | "advanced"
  description: string
  objectives: string[]
  requirements: string[]
  milestones: ProjectMilestone[]
  resources: string[]
  estimatedTime: number
  xpReward: number
}

export interface ProjectMilestone {
  id: string
  title: string
  description: string
  checklist: string[]
}

export interface ChallengeTask {
  title: string
  description: string
  timeLimit: number
  requirements: string[]
  bonusObjectives: string[]
}

// Comprehensive learning paths
export const learningPaths: LearningPath[] = [
  {
    id: "path-web-developer",
    slug: "web-developer",
    name: "Web Developer",
    description: "Master full-stack web development from HTML basics to building production SaaS applications",
    difficulty: "Beginner",
    estimatedHours: 200,
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Databases", "APIs"],
    icon: "globe",
    color: "blue",
    totalLessons: 85,
    levels: [
      {
        id: "web-beginner",
        name: "Beginner",
        description: "Foundation of web development",
        difficulty: "Beginner",
        topics: [
          {
            id: "html-fundamentals",
            name: "HTML Fundamentals",
            description: "Learn the building blocks of the web",
            lessons: [
              {
                id: "html-intro",
                title: "Introduction to HTML",
                description: "Understanding what HTML is and how it structures web content",
                type: "concept",
                duration: 30,
                xpReward: 100,
                content: {
                  explanation: `# Introduction to HTML

HTML (HyperText Markup Language) is the foundation of every website you visit. It's the skeleton that gives structure to web content, telling browsers how to display text, images, videos, and other elements.

## What is HTML?

HTML is a **markup language**, not a programming language. This means it doesn't have logic like if statements or loops - instead, it uses **tags** to "mark up" content and define its purpose and structure.

Think of HTML like the blueprint of a house. It defines where the rooms are, where the doors go, and how everything connects - but it doesn't determine the paint color (that's CSS) or how the lights turn on (that's JavaScript).

## The History of HTML

- **1991**: Tim Berners-Lee created HTML at CERN
- **1995**: HTML 2.0 became the first standard
- **1999**: HTML 4.01 was released
- **2014**: HTML5 became the modern standard we use today

## Basic Document Structure

Every HTML document follows a specific structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Your content goes here -->
    <h1>Hello, World!</h1>
    <p>This is my first webpage.</p>
</body>
</html>
\`\`\`

Let's break down each part:

### \`<!DOCTYPE html>\`
This declaration tells the browser this is an HTML5 document. Always include this at the very top.

### \`<html lang="en">\`
The root element that wraps all content. The \`lang\` attribute specifies the language for accessibility.

### \`<head>\`
Contains metadata about the document - information that isn't displayed on the page but is important for:
- Browser behavior (\`meta\` tags)
- Page title (shown in browser tabs)
- Links to stylesheets and scripts
- SEO information

### \`<body>\`
Contains all the visible content - everything users see and interact with.

## Understanding Tags and Elements

HTML uses **tags** to create **elements**. Most elements have:

1. **Opening tag**: \`<tagname>\`
2. **Content**: Text or other elements
3. **Closing tag**: \`</tagname>\`

\`\`\`html
<p>This is a paragraph element.</p>
\`\`\`

Some elements are **self-closing** (also called void elements):

\`\`\`html
<img src="photo.jpg" alt="A photo">
<br>
<hr>
<input type="text">
\`\`\`

## Attributes

Attributes provide additional information about elements:

\`\`\`html
<a href="https://example.com" target="_blank" rel="noopener">
    Click me
</a>
\`\`\`

Common attributes include:
- \`id\`: Unique identifier
- \`class\`: CSS class names
- \`style\`: Inline CSS
- \`title\`: Tooltip text
- \`data-*\`: Custom data attributes

## Nesting Elements

Elements can contain other elements, creating a parent-child relationship:

\`\`\`html
<article>
    <header>
        <h1>Article Title</h1>
        <p>Published on <time datetime="2024-01-15">January 15, 2024</time></p>
    </header>
    <section>
        <p>Article content goes here...</p>
    </section>
</article>
\`\`\`

**Important**: Always close tags in the correct order (LIFO - Last In, First Out).

## Comments

Comments help document your code and are invisible to users:

\`\`\`html
<!-- This is a single-line comment -->

<!--
    This is a
    multi-line comment
-->
\`\`\`

## Why HTML Matters

1. **Accessibility**: Screen readers use HTML structure to navigate
2. **SEO**: Search engines read HTML to understand content
3. **Maintainability**: Well-structured HTML is easier to style and script
4. **Performance**: Proper HTML loads faster and works everywhere`,
                  keyTakeaways: [
                    "HTML is a markup language that structures web content",
                    "Every HTML document needs DOCTYPE, html, head, and body elements",
                    "Elements are created using opening and closing tags",
                    "Attributes provide additional information about elements",
                    "Proper nesting is essential for valid HTML",
                    "Semantic HTML improves accessibility and SEO",
                  ],
                  documentationRefs: [
                    { title: "HTML Basics - MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics", source: "MDN" },
                    { title: "HTML Introduction", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", source: "MDN" },
                    { title: "HTML Living Standard", url: "https://html.spec.whatwg.org/", source: "WHATWG" },
                  ],
                  codeExamples: [
                    {
                      title: "Complete HTML Page Structure",
                      language: "html",
                      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My awesome website">
    <title>My Website</title>
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>
    
    <main>
        <h1>Welcome to My Website</h1>
        <p>This is the main content area.</p>
        
        <article>
            <h2>Featured Article</h2>
            <p>Lorem ipsum dolor sit amet...</p>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`,
                      explanation: "A complete, semantic HTML5 page with proper structure including header with navigation, main content area with an article, and a footer.",
                    },
                    {
                      title: "Common Text Elements",
                      language: "html",
                      code: `<!-- Headings (h1-h6) -->
<h1>Main Title (only one per page)</h1>
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>

<!-- Paragraphs -->
<p>This is a paragraph of text. It can contain 
   <strong>bold text</strong>, <em>italic text</em>, 
   and <a href="/link">links</a>.</p>

<!-- Lists -->
<ul>
    <li>Unordered list item</li>
    <li>Another item</li>
</ul>

<ol>
    <li>First ordered item</li>
    <li>Second ordered item</li>
</ol>

<!-- Quotes -->
<blockquote cite="https://example.com">
    <p>This is a blockquote from another source.</p>
</blockquote>

<!-- Code -->
<code>inline code</code>

<pre><code>
function hello() {
    console.log('Hello!');
}
</code></pre>`,
                      explanation: "Common HTML text elements you'll use frequently, including headings, paragraphs, lists, quotes, and code blocks.",
                    },
                    {
                      title: "Forms and Input Elements",
                      language: "html",
                      code: `<form action="/submit" method="POST">
    <fieldset>
        <legend>Personal Information</legend>
        
        <label for="name">Full Name:</label>
        <input type="text" id="name" name="name" required 
               placeholder="John Doe">
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" 
               minlength="8" required>
    </fieldset>
    
    <fieldset>
        <legend>Preferences</legend>
        
        <label>
            <input type="checkbox" name="newsletter" checked>
            Subscribe to newsletter
        </label>
        
        <label>
            <input type="radio" name="plan" value="free">
            Free Plan
        </label>
        <label>
            <input type="radio" name="plan" value="pro">
            Pro Plan
        </label>
    </fieldset>
    
    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4"></textarea>
    
    <button type="submit">Submit Form</button>
</form>`,
                      explanation: "A comprehensive form demonstrating various input types, proper labeling for accessibility, and form organization with fieldsets.",
                    },
                  ],
                  exercises: [
                    {
                      id: "ex-html-1",
                      title: "Create Your First HTML Page",
                      difficulty: "easy",
                      description: "Create a basic HTML page with a heading, paragraph, and a link to your favorite website.",
                      starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <!-- Add your content here -->
    
</body>
</html>`,
                      hints: [
                        "Use <h1> for the main heading",
                        "Use <p> for the paragraph",
                        "Use <a href='URL'>Link Text</a> for the link",
                        "Don't forget to add meaningful text content!",
                      ],
                      solution: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <h1>Welcome to My First Webpage!</h1>
    <p>This is my first HTML page. I'm learning web development 
       and it's exciting!</p>
    <p>Check out my favorite website: 
       <a href="https://developer.mozilla.org">MDN Web Docs</a>
    </p>
</body>
</html>`,
                      testCases: [
                        { input: "document.querySelector('h1')", expectedOutput: "HTMLHeadingElement", description: "Page should have an h1 element" },
                        { input: "document.querySelector('p')", expectedOutput: "HTMLParagraphElement", description: "Page should have a paragraph" },
                        { input: "document.querySelector('a')", expectedOutput: "HTMLAnchorElement", description: "Page should have a link" },
                      ],
                    },
                    {
                      id: "ex-html-2",
                      title: "Build a Navigation Menu",
                      difficulty: "easy",
                      description: "Create a semantic navigation menu with links to Home, About, Services, and Contact pages.",
                      starterCode: `<header>
    <!-- Create a nav element with links -->
    
</header>`,
                      hints: [
                        "Use the <nav> element to wrap navigation links",
                        "Use an unordered list <ul> for the menu items",
                        "Each menu item should be a <li> containing an <a>",
                        "Use href='#' for placeholder links",
                      ],
                      solution: `<header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
</header>`,
                      testCases: [
                        { input: "document.querySelector('nav')", expectedOutput: "HTMLElement", description: "Should have a nav element" },
                        { input: "document.querySelectorAll('nav a').length", expectedOutput: "4", description: "Should have 4 navigation links" },
                      ],
                    },
                    {
                      id: "ex-html-3",
                      title: "Create an Article with Semantic HTML",
                      difficulty: "medium",
                      description: "Build a blog article using semantic HTML5 elements including header, article, sections, and footer.",
                      starterCode: `<!-- Create a semantic blog article structure -->
`,
                      hints: [
                        "Use <article> as the main container",
                        "Include <header> with title and metadata",
                        "Use <section> for content blocks",
                        "Add a <footer> with author info",
                        "Use <time> element for dates",
                      ],
                      solution: `<article>
    <header>
        <h1>Understanding Semantic HTML</h1>
        <p>Published on <time datetime="2024-01-15">January 15, 2024</time></p>
        <p>By <strong>Jane Developer</strong></p>
    </header>
    
    <section>
        <h2>What is Semantic HTML?</h2>
        <p>Semantic HTML uses elements that convey meaning about the content 
           they contain, not just how they look.</p>
    </section>
    
    <section>
        <h2>Why Does It Matter?</h2>
        <p>Using semantic elements improves accessibility, SEO, 
           and code maintainability.</p>
    </section>
    
    <footer>
        <p>Written by Jane Developer | 
           <a href="mailto:jane@example.com">Contact</a></p>
    </footer>
</article>`,
                      testCases: [
                        { input: "document.querySelector('article')", expectedOutput: "HTMLElement", description: "Should have an article element" },
                        { input: "document.querySelector('article header')", expectedOutput: "HTMLElement", description: "Article should have a header" },
                        { input: "document.querySelectorAll('section').length", expectedOutput: "2", description: "Should have 2 sections" },
                      ],
                    },
                  ],
                  quiz: [
                    {
                      id: "html-q1",
                      question: "What does HTML stand for?",
                      options: [
                        "HyperText Markup Language",
                        "High Tech Modern Language",
                        "HyperText Machine Language",
                        "Home Tool Markup Language",
                      ],
                      correctIndex: 0,
                      explanation: "HTML stands for HyperText Markup Language. It's the standard markup language for creating web pages and web applications.",
                      difficulty: "easy",
                    },
                    {
                      id: "html-q2",
                      question: "Which element should contain the main content of an HTML document?",
                      options: ["<div>", "<main>", "<content>", "<section>"],
                      correctIndex: 1,
                      explanation: "The <main> element represents the main content of the document. There should only be one <main> element per page, and it shouldn't be nested inside <article>, <aside>, <footer>, <header>, or <nav> elements.",
                      difficulty: "easy",
                    },
                    {
                      id: "html-q3",
                      question: "What is the purpose of the <head> element?",
                      options: [
                        "To display the page header",
                        "To contain metadata and links to resources",
                        "To create a heading",
                        "To define the main navigation",
                      ],
                      correctIndex: 1,
                      explanation: "The <head> element contains metadata about the document, such as the title, character encoding, viewport settings, and links to stylesheets and scripts. It doesn't display visible content.",
                      difficulty: "easy",
                    },
                    {
                      id: "html-q4",
                      question: "Which is the correct way to add a comment in HTML?",
                      options: [
                        "// This is a comment",
                        "/* This is a comment */",
                        "<!-- This is a comment -->",
                        "# This is a comment",
                      ],
                      correctIndex: 2,
                      explanation: "HTML comments use the syntax <!-- comment -->. Unlike JavaScript (//) or CSS (/* */), HTML has its own unique comment syntax.",
                      difficulty: "easy",
                    },
                    {
                      id: "html-q5",
                      question: "What is the difference between <strong> and <b> elements?",
                      options: [
                        "There is no difference",
                        "<strong> is semantic (important text), <b> is purely visual",
                        "<b> is newer than <strong>",
                        "<strong> creates italic text",
                      ],
                      correctIndex: 1,
                      explanation: "<strong> indicates that text is of strong importance, and browsers typically render it as bold. <b> is used to draw attention to text without conveying extra importance. Screen readers may emphasize <strong> text differently.",
                      difficulty: "medium",
                    },
                    {
                      id: "html-q6",
                      question: "Which attribute is required on an <img> element for accessibility?",
                      options: ["title", "src", "alt", "id"],
                      correctIndex: 2,
                      explanation: "The 'alt' attribute provides alternative text for an image. It's crucial for accessibility (screen readers) and also displays when images fail to load. While 'src' is required for the image to work, 'alt' is required for accessibility.",
                      difficulty: "medium",
                    },
                    {
                      id: "html-q7",
                      question: "What does the 'lang' attribute on the <html> element specify?",
                      options: [
                        "The programming language used",
                        "The natural language of the document content",
                        "The language of comments in the code",
                        "The language server to use",
                      ],
                      correctIndex: 1,
                      explanation: "The 'lang' attribute specifies the natural language of the document's content (e.g., 'en' for English, 'es' for Spanish). This helps screen readers pronounce content correctly and assists search engines.",
                      difficulty: "medium",
                    },
                    {
                      id: "html-q8",
                      question: "Which element should you use for the most important heading on a page?",
                      options: ["<heading>", "<h6>", "<h1>", "<title>"],
                      correctIndex: 2,
                      explanation: "<h1> is the most important heading element and should typically be used once per page for the main title. Headings range from <h1> (most important) to <h6> (least important).",
                      difficulty: "easy",
                    },
                  ],
                  project: {
                    title: "Personal Portfolio Page",
                    difficulty: "beginner",
                    description: "Create a personal portfolio webpage that showcases who you are, your skills, and your projects. This project will help you practice semantic HTML structure and various HTML elements.",
                    objectives: [
                      "Apply semantic HTML5 elements correctly",
                      "Create a well-structured document outline",
                      "Use various HTML elements (lists, links, images, forms)",
                      "Implement accessibility best practices",
                    ],
                    requirements: [
                      "Use semantic HTML elements (header, nav, main, section, article, footer)",
                      "Include a navigation menu with at least 4 links",
                      "Add a hero section with your name and a tagline",
                      "Create an 'About Me' section with a brief bio",
                      "Build a skills section using an unordered list",
                      "Add a projects section with at least 2 project cards",
                      "Include a contact form with name, email, and message fields",
                      "Add a footer with copyright and social media links",
                      "Use proper heading hierarchy (h1-h6)",
                      "Include alt text for all images",
                    ],
                    milestones: [
                      {
                        id: "m1",
                        title: "Document Structure",
                        description: "Set up the basic HTML structure",
                        checklist: [
                          "Create HTML file with proper doctype",
                          "Add head with meta tags and title",
                          "Set up body with header, main, and footer",
                        ],
                      },
                      {
                        id: "m2",
                        title: "Navigation & Hero",
                        description: "Build the header area",
                        checklist: [
                          "Create navigation with logo and menu links",
                          "Add hero section with h1 and tagline",
                          "Include a call-to-action button",
                        ],
                      },
                      {
                        id: "m3",
                        title: "Content Sections",
                        description: "Add the main content",
                        checklist: [
                          "Create About section with paragraph and image",
                          "Build Skills section with list",
                          "Add Projects section with article elements",
                        ],
                      },
                      {
                        id: "m4",
                        title: "Contact & Footer",
                        description: "Complete the page",
                        checklist: [
                          "Create contact form with proper labels",
                          "Add footer with copyright",
                          "Include social media links",
                        ],
                      },
                    ],
                    resources: [
                      "MDN HTML Elements Reference",
                      "W3C HTML Validation Service",
                      "WebAIM Accessibility Checklist",
                    ],
                    estimatedTime: 120,
                    xpReward: 500,
                  },
                },
              },
              {
                id: "html-elements",
                title: "HTML Elements & Tags Deep Dive",
                description: "Master all essential HTML elements and when to use them",
                type: "concept",
                duration: 45,
                xpReward: 120,
                content: {
                  explanation: `# HTML Elements & Tags Deep Dive

Now that you understand the basics, let's explore the full range of HTML elements you'll use as a web developer.

## Text Content Elements

### Headings
HTML provides six levels of headings, from \`<h1>\` (most important) to \`<h6>\` (least important):

\`\`\`html
<h1>Main Page Title</h1>
<h2>Major Section</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
<h5>Minor heading</h5>
<h6>Smallest heading</h6>
\`\`\`

**Best Practices:**
- Use only one \`<h1>\` per page
- Don't skip heading levels (h1 → h3)
- Use headings for structure, not for styling

### Paragraphs and Text Formatting

\`\`\`html
<p>Regular paragraph text.</p>

<p>
    Text can be <strong>strongly emphasized</strong> or 
    <em>italicized for emphasis</em>. You can also mark 
    <mark>highlighted text</mark> or show 
    <del>deleted</del> and <ins>inserted</ins> content.
</p>

<p>
    Use <code>inline code</code> for code snippets,
    <kbd>Ctrl+C</kbd> for keyboard shortcuts, and
    <var>x</var> for variables in math.
</p>
\`\`\`

## Structural (Semantic) Elements

HTML5 introduced semantic elements that describe their content:

\`\`\`html
<header>  <!-- Page or section header -->
<nav>     <!-- Navigation links -->
<main>    <!-- Main content (one per page) -->
<article> <!-- Self-contained content -->
<section> <!-- Thematic grouping -->
<aside>   <!-- Sidebar/tangential content -->
<footer>  <!-- Page or section footer -->
\`\`\`

### When to Use Each

| Element | Use For |
|---------|---------|
| \`<header>\` | Logo, nav, page title |
| \`<nav>\` | Primary navigation, menus |
| \`<main>\` | Main content unique to page |
| \`<article>\` | Blog posts, news articles, comments |
| \`<section>\` | Chapters, tab panels, themed areas |
| \`<aside>\` | Sidebars, pull quotes, ads |
| \`<footer>\` | Copyright, links, contact info |

## Lists

### Unordered Lists
For items where order doesn't matter:

\`\`\`html
<ul>
    <li>First item</li>
    <li>Second item
        <ul>
            <li>Nested item</li>
        </ul>
    </li>
</ul>
\`\`\`

### Ordered Lists
For sequential items:

\`\`\`html
<ol>
    <li>Step one</li>
    <li>Step two</li>
    <li>Step three</li>
</ol>

<!-- With start attribute -->
<ol start="5">
    <li>This is item 5</li>
</ol>

<!-- Reversed -->
<ol reversed>
    <li>Third place</li>
    <li>Second place</li>
    <li>First place</li>
</ol>
\`\`\`

### Description Lists
For term-definition pairs:

\`\`\`html
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
    
    <dt>JavaScript</dt>
    <dd>Programming language for the web</dd>
</dl>
\`\`\`

## Links and Navigation

### Basic Links

\`\`\`html
<!-- External link -->
<a href="https://example.com">Visit Example</a>

<!-- Internal link -->
<a href="/about">About Us</a>

<!-- Email link -->
<a href="mailto:contact@example.com">Email Us</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us</a>

<!-- Download link -->
<a href="/files/report.pdf" download>Download Report</a>
\`\`\`

### Link Attributes

\`\`\`html
<!-- Open in new tab (securely) -->
<a href="https://example.com" 
   target="_blank" 
   rel="noopener noreferrer">
    External Site
</a>

<!-- Anchor link (jump to section) -->
<a href="#contact">Jump to Contact</a>

<!-- ... later in the page ... -->
<section id="contact">
    <h2>Contact Us</h2>
</section>
\`\`\`

## Images and Media

### Images

\`\`\`html
<!-- Basic image -->
<img src="photo.jpg" alt="Description of the photo">

<!-- With dimensions -->
<img src="photo.jpg" alt="Photo" width="800" height="600">

<!-- Responsive image -->
<img src="small.jpg"
     srcset="small.jpg 480w,
             medium.jpg 800w,
             large.jpg 1200w"
     sizes="(max-width: 600px) 480px,
            (max-width: 1000px) 800px,
            1200px"
     alt="Responsive photo">

<!-- With figure caption -->
<figure>
    <img src="chart.png" alt="Sales chart showing growth">
    <figcaption>Q4 2024 Sales Performance</figcaption>
</figure>
\`\`\`

### Video and Audio

\`\`\`html
<!-- Video -->
<video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Your browser doesn't support video.
</video>

<!-- Audio -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    Your browser doesn't support audio.
</audio>
\`\`\`

## Tables

Tables are for **tabular data only**, not for layout:

\`\`\`html
<table>
    <caption>Monthly Sales Report</caption>
    <thead>
        <tr>
            <th scope="col">Product</th>
            <th scope="col">Q1</th>
            <th scope="col">Q2</th>
            <th scope="col">Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Widget A</th>
            <td>$1,000</td>
            <td>$1,500</td>
            <td>$2,500</td>
        </tr>
        <tr>
            <th scope="row">Widget B</th>
            <td>$2,000</td>
            <td>$2,200</td>
            <td>$4,200</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Total</th>
            <td>$3,000</td>
            <td>$3,700</td>
            <td>$6,700</td>
        </tr>
    </tfoot>
</table>
\`\`\`

## Interactive Elements

### Details/Summary (Accordion)

\`\`\`html
<details>
    <summary>Click to expand</summary>
    <p>Hidden content revealed when clicked.</p>
</details>

<details open>
    <summary>Already expanded</summary>
    <p>This content is visible by default.</p>
</details>
\`\`\`

### Dialog (Modal)

\`\`\`html
<dialog id="myDialog">
    <h2>Dialog Title</h2>
    <p>Dialog content here.</p>
    <button onclick="this.closest('dialog').close()">Close</button>
</dialog>

<button onclick="document.getElementById('myDialog').showModal()">
    Open Dialog
</button>
\`\`\``,
                  keyTakeaways: [
                    "Use semantic elements to describe content purpose",
                    "Choose the right element for the job (lists, tables, etc.)",
                    "Always include alt text for images",
                    "Use proper heading hierarchy for document outline",
                    "Links should have descriptive text, not 'click here'",
                    "Tables are for data, not layout",
                  ],
                  documentationRefs: [
                    { title: "HTML Element Reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element", source: "MDN" },
                    { title: "Semantic HTML", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html", source: "MDN" },
                  ],
                  codeExamples: [
                    {
                      title: "Complete Semantic Page Structure",
                      language: "html",
                      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Post - Understanding Semantic HTML</title>
</head>
<body>
    <header>
        <nav aria-label="Main navigation">
            <ul>
                <li><a href="/" aria-current="page">Home</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h1>Understanding Semantic HTML</h1>
                <p>
                    <time datetime="2024-01-15">January 15, 2024</time>
                    by <a href="/author/jane" rel="author">Jane Doe</a>
                </p>
            </header>

            <section>
                <h2>Introduction</h2>
                <p>Semantic HTML is the foundation of accessible web development...</p>
            </section>

            <section>
                <h2>Key Benefits</h2>
                <ul>
                    <li>Improved accessibility</li>
                    <li>Better SEO</li>
                    <li>Easier maintenance</li>
                </ul>
            </section>

            <footer>
                <p>Tags: 
                    <a href="/tag/html" rel="tag">HTML</a>,
                    <a href="/tag/accessibility" rel="tag">Accessibility</a>
                </p>
            </footer>
        </article>

        <aside aria-label="Related articles">
            <h2>Related Posts</h2>
            <ul>
                <li><a href="/post/css-basics">CSS Basics</a></li>
                <li><a href="/post/aria-intro">Introduction to ARIA</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 My Blog. All rights reserved.</p>
    </footer>
</body>
</html>`,
                      explanation: "A complete blog post page demonstrating proper semantic HTML structure with appropriate ARIA labels for accessibility.",
                    },
                  ],
                  exercises: [
                    {
                      id: "ex-elements-1",
                      title: "Build a Product Card",
                      difficulty: "easy",
                      description: "Create a product card with image, title, description, price, and buy button using semantic HTML.",
                      starterCode: `<!-- Create a product card for an online store -->
<article class="product-card">
    <!-- Add product content here -->
</article>`,
                      hints: [
                        "Use <figure> and <figcaption> for the product image",
                        "Use heading elements for product name",
                        "Include a <p> for description",
                        "Use <data> element for the price",
                        "Add a <button> for the action",
                      ],
                      solution: `<article class="product-card">
    <figure>
        <img src="product.jpg" alt="Wireless Headphones">
    </figure>
    
    <header>
        <h3>Wireless Headphones</h3>
        <p>Premium noise-canceling headphones with 30-hour battery life.</p>
    </header>
    
    <footer>
        <p>
            <data value="99.99">$99.99</data>
        </p>
        <button type="button">Add to Cart</button>
    </footer>
</article>`,
                      testCases: [
                        { input: "document.querySelector('article')", expectedOutput: "HTMLElement", description: "Should use article element" },
                        { input: "document.querySelector('img')", expectedOutput: "HTMLImageElement", description: "Should have an image" },
                        { input: "document.querySelector('button')", expectedOutput: "HTMLButtonElement", description: "Should have a button" },
                      ],
                    },
                  ],
                  quiz: [
                    {
                      id: "elements-q1",
                      question: "Which element should you use for a site's main navigation?",
                      options: ["<div class='nav'>", "<navigation>", "<nav>", "<menu>"],
                      correctIndex: 2,
                      explanation: "The <nav> element represents a section of navigation links. It's the semantic choice for main site navigation, helping screen readers identify navigation areas.",
                      difficulty: "easy",
                    },
                    {
                      id: "elements-q2",
                      question: "What is the difference between <article> and <section>?",
                      options: [
                        "<article> is for news, <section> is for everything else",
                        "<article> is self-contained and could stand alone, <section> is a thematic grouping",
                        "There is no difference, they're interchangeable",
                        "<section> is deprecated in HTML5",
                      ],
                      correctIndex: 1,
                      explanation: "An <article> represents a self-contained piece of content that could be distributed independently (like a blog post). A <section> is a thematic grouping of content, typically with a heading.",
                      difficulty: "medium",
                    },
                    {
                      id: "elements-q3",
                      question: "Which list type should you use for step-by-step instructions?",
                      options: ["<ul>", "<ol>", "<dl>", "<menu>"],
                      correctIndex: 1,
                      explanation: "Use <ol> (ordered list) when the sequence matters, such as steps in a recipe or tutorial. Use <ul> when order doesn't matter, and <dl> for term-definition pairs.",
                      difficulty: "easy",
                    },
                  ],
                },
              },
              {
                id: "html-forms",
                title: "HTML Forms Mastery",
                description: "Build accessible, user-friendly forms with validation",
                type: "concept",
                duration: 50,
                xpReward: 150,
                content: {
                  explanation: `# HTML Forms Mastery

Forms are how users interact with your website - from logging in to making purchases. Building good forms is essential for user experience and data collection.

## Form Basics

Every form starts with the \`<form>\` element:

\`\`\`html
<form action="/submit" method="POST">
    <!-- Form controls go here -->
</form>
\`\`\`

### Form Attributes

- **action**: Where to send form data
- **method**: HTTP method (GET or POST)
- **enctype**: How data is encoded (important for file uploads)
- **novalidate**: Disables browser validation (for custom validation)

\`\`\`html
<!-- Standard form -->
<form action="/api/contact" method="POST">

<!-- File upload form -->
<form action="/api/upload" method="POST" enctype="multipart/form-data">

<!-- Search form (GET) -->
<form action="/search" method="GET">
\`\`\`

## Input Types

HTML5 provides many specialized input types:

### Text Inputs
\`\`\`html
<input type="text" placeholder="Regular text">
<input type="email" placeholder="email@example.com">
<input type="password" placeholder="Enter password">
<input type="tel" placeholder="(123) 456-7890">
<input type="url" placeholder="https://example.com">
<input type="search" placeholder="Search...">
\`\`\`

### Number Inputs
\`\`\`html
<input type="number" min="0" max="100" step="1">
<input type="range" min="0" max="100" value="50">
\`\`\`

### Date/Time Inputs
\`\`\`html
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="month">
<input type="week">
\`\`\`

### Selection Inputs
\`\`\`html
<input type="checkbox">
<input type="radio">
<input type="color">
<input type="file">
\`\`\`

### Buttons
\`\`\`html
<input type="submit" value="Submit">
<input type="reset" value="Reset">
<input type="button" value="Click Me">

<!-- Better: Use button element -->
<button type="submit">Submit</button>
<button type="button">Click Me</button>
\`\`\`

## Labels - Critical for Accessibility

**Always** associate labels with inputs:

\`\`\`html
<!-- Method 1: Using 'for' attribute (recommended) -->
<label for="email">Email Address:</label>
<input type="email" id="email" name="email">

<!-- Method 2: Wrapping (also valid) -->
<label>
    Email Address:
    <input type="email" name="email">
</label>
\`\`\`

## Form Validation

HTML5 provides built-in validation:

\`\`\`html
<!-- Required field -->
<input type="text" required>

<!-- Minimum/Maximum length -->
<input type="text" minlength="3" maxlength="50">

<!-- Pattern matching (regex) -->
<input type="text" pattern="[A-Za-z]{3,}" 
       title="Three or more letters">

<!-- Number constraints -->
<input type="number" min="1" max="100" step="5">

<!-- Email validation (automatic) -->
<input type="email">
\`\`\`

### Custom Validation Messages

\`\`\`html
<input type="email" 
       required
       oninvalid="this.setCustomValidity('Please enter a valid email')"
       oninput="this.setCustomValidity('')">
\`\`\`

## Organizing Forms

### Fieldsets and Legends

Group related inputs together:

\`\`\`html
<form>
    <fieldset>
        <legend>Personal Information</legend>
        <label for="fname">First Name:</label>
        <input type="text" id="fname" name="fname">
        
        <label for="lname">Last Name:</label>
        <input type="text" id="lname" name="lname">
    </fieldset>
    
    <fieldset>
        <legend>Contact Details</legend>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
        
        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone">
    </fieldset>
</form>
\`\`\`

## Select, Textarea, and Datalist

### Select (Dropdown)
\`\`\`html
<label for="country">Country:</label>
<select id="country" name="country">
    <option value="">Select a country</option>
    <optgroup label="North America">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
    </optgroup>
    <optgroup label="Europe">
        <option value="uk">United Kingdom</option>
        <option value="de">Germany</option>
    </optgroup>
</select>

<!-- Multiple selection -->
<select multiple size="5">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
</select>
\`\`\`

### Textarea
\`\`\`html
<label for="message">Message:</label>
<textarea id="message" name="message" 
          rows="5" cols="50"
          placeholder="Enter your message..."
          maxlength="500"></textarea>
\`\`\`

### Datalist (Autocomplete)
\`\`\`html
<label for="browser">Favorite Browser:</label>
<input list="browsers" id="browser" name="browser">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
</datalist>
\`\`\`

## Accessibility Best Practices

1. **Always use labels** - Every input needs a label
2. **Use fieldsets** - Group related inputs logically
3. **Provide clear instructions** - Help text before inputs
4. **Error messages** - Associate errors with inputs using aria-describedby
5. **Focus management** - Ensure keyboard navigation works

\`\`\`html
<div class="form-group">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username"
           aria-describedby="username-help username-error"
           aria-invalid="false">
    <p id="username-help" class="help-text">
        3-20 characters, letters and numbers only
    </p>
    <p id="username-error" class="error" hidden>
        Username is required
    </p>
</div>
\`\`\``,
                  keyTakeaways: [
                    "Always use labels for form inputs",
                    "Choose the right input type for better UX",
                    "Use HTML5 validation attributes",
                    "Group related fields with fieldsets",
                    "Make forms keyboard accessible",
                    "Provide clear error messages",
                  ],
                  documentationRefs: [
                    { title: "HTML Forms Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms", source: "MDN" },
                    { title: "Form Validation", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation", source: "MDN" },
                  ],
                  codeExamples: [
                    {
                      title: "Complete Registration Form",
                      language: "html",
                      code: `<form action="/api/register" method="POST" novalidate>
    <h2>Create Account</h2>
    
    <fieldset>
        <legend>Account Information</legend>
        
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" 
                   required autocomplete="email"
                   placeholder="you@example.com">
        </div>
        
        <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" id="password" name="password"
                   required minlength="8"
                   autocomplete="new-password"
                   aria-describedby="password-requirements">
            <p id="password-requirements" class="help-text">
                Minimum 8 characters
            </p>
        </div>
        
        <div class="form-group">
            <label for="confirm-password">Confirm Password *</label>
            <input type="password" id="confirm-password" 
                   name="confirmPassword" required>
        </div>
    </fieldset>
    
    <fieldset>
        <legend>Profile Details</legend>
        
        <div class="form-group">
            <label for="display-name">Display Name</label>
            <input type="text" id="display-name" name="displayName"
                   maxlength="50" autocomplete="name">
        </div>
        
        <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows="3" 
                      maxlength="200"
                      placeholder="Tell us about yourself..."></textarea>
        </div>
    </fieldset>
    
    <fieldset>
        <legend>Preferences</legend>
        
        <label class="checkbox">
            <input type="checkbox" name="newsletter" checked>
            Subscribe to newsletter
        </label>
        
        <label class="checkbox">
            <input type="checkbox" name="terms" required>
            I agree to the <a href="/terms">Terms of Service</a> *
        </label>
    </fieldset>
    
    <button type="submit">Create Account</button>
</form>`,
                      explanation: "A complete, accessible registration form with proper validation, grouping, and accessibility attributes.",
                    },
                  ],
                  exercises: [
                    {
                      id: "ex-forms-1",
                      title: "Build a Contact Form",
                      difficulty: "medium",
                      description: "Create a contact form with name, email, subject, and message fields with proper validation.",
                      starterCode: `<form>
    <!-- Build your contact form here -->
</form>`,
                      hints: [
                        "Use proper input types (text, email, etc.)",
                        "Add labels for each input",
                        "Make required fields actually required",
                        "Use a textarea for the message",
                        "Add a submit button",
                      ],
                      solution: `<form action="/api/contact" method="POST">
    <h2>Contact Us</h2>
    
    <div class="form-group">
        <label for="name">Your Name *</label>
        <input type="text" id="name" name="name" required>
    </div>
    
    <div class="form-group">
        <label for="email">Email Address *</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
        <label for="subject">Subject *</label>
        <select id="subject" name="subject" required>
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="feedback">Feedback</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="message">Message *</label>
        <textarea id="message" name="message" rows="5" 
                  required minlength="20" maxlength="1000"
                  placeholder="How can we help you?"></textarea>
    </div>
    
    <button type="submit">Send Message</button>
</form>`,
                      testCases: [
                        { input: "document.querySelector('form').querySelectorAll('label').length", expectedOutput: "4", description: "Should have 4 labels" },
                        { input: "document.querySelector('textarea')", expectedOutput: "HTMLTextAreaElement", description: "Should have a textarea" },
                        { input: "document.querySelector('button[type=\"submit\"]')", expectedOutput: "HTMLButtonElement", description: "Should have submit button" },
                      ],
                    },
                  ],
                  quiz: [
                    {
                      id: "forms-q1",
                      question: "Why is the 'for' attribute on labels important?",
                      options: [
                        "It makes the label look better",
                        "It associates the label with an input for accessibility",
                        "It's required for form submission",
                        "It prevents form validation",
                      ],
                      correctIndex: 1,
                      explanation: "The 'for' attribute creates an association between a label and its input. This helps screen readers announce labels correctly and allows users to click the label to focus the input.",
                      difficulty: "easy",
                    },
                    {
                      id: "forms-q2",
                      question: "Which enctype should you use when uploading files?",
                      options: [
                        "application/x-www-form-urlencoded",
                        "text/plain",
                        "multipart/form-data",
                        "application/json",
                      ],
                      correctIndex: 2,
                      explanation: "multipart/form-data is required for file uploads. It allows the form to send binary file data along with text fields. The default (application/x-www-form-urlencoded) only handles text.",
                      difficulty: "medium",
                    },
                  ],
                  project: {
                    title: "Multi-Step Registration Form",
                    difficulty: "intermediate",
                    description: "Create a multi-step registration form with personal info, preferences, and confirmation steps.",
                    objectives: [
                      "Build complex form structures",
                      "Implement comprehensive validation",
                      "Create accessible form patterns",
                    ],
                    requirements: [
                      "Three steps: Personal Info, Preferences, Review",
                      "Navigation between steps",
                      "Validation on each step",
                      "Review page showing all entered data",
                    ],
                    milestones: [],
                    resources: [],
                    estimatedTime: 90,
                    xpReward: 400,
                  },
                },
              },
              {
                id: "html-project-1",
                title: "Project: Build a Recipe Blog",
                description: "Apply all HTML concepts to build a complete recipe blog website",
                type: "project",
                duration: 90,
                xpReward: 600,
                content: {
                  explanation: "Apply everything you've learned to build a fully semantic recipe blog.",
                  keyTakeaways: [],
                  documentationRefs: [],
                  codeExamples: [],
                  exercises: [],
                  quiz: [],
                  project: {
                    title: "Recipe Blog Website",
                    difficulty: "beginner",
                    description: "Build a complete recipe blog with multiple pages showcasing proper HTML structure, forms, and semantic elements. This project will test all the HTML skills you've learned.",
                    objectives: [
                      "Create a multi-page website structure",
                      "Use all semantic HTML5 elements correctly",
                      "Build accessible navigation and forms",
                      "Structure complex content (recipes)",
                    ],
                    requirements: [
                      "Home page with featured recipes and navigation",
                      "Recipe page template with ingredients, instructions, nutrition info",
                      "About page with team bios",
                      "Contact page with subscription form",
                      "Category pages for different recipe types",
                      "Use proper heading hierarchy throughout",
                      "Include schema.org structured data for recipes",
                      "All images must have appropriate alt text",
                    ],
                    milestones: [
                      {
                        id: "m1",
                        title: "Site Structure",
                        description: "Set up the overall site structure",
                        checklist: [
                          "Create HTML files for all pages",
                          "Build consistent header/footer",
                          "Set up navigation linking all pages",
                        ],
                      },
                      {
                        id: "m2",
                        title: "Home Page",
                        description: "Build the home page",
                        checklist: [
                          "Hero section with call-to-action",
                          "Featured recipes grid",
                          "Category quick links",
                          "Newsletter signup form",
                        ],
                      },
                      {
                        id: "m3",
                        title: "Recipe Template",
                        description: "Create the recipe page structure",
                        checklist: [
                          "Recipe header with image and metadata",
                          "Ingredients list",
                          "Step-by-step instructions",
                          "Nutrition information table",
                          "Related recipes section",
                        ],
                      },
                      {
                        id: "m4",
                        title: "Additional Pages",
                        description: "Complete remaining pages",
                        checklist: [
                          "About page with team info",
                          "Contact form with validation",
                          "Category listing pages",
                        ],
                      },
                    ],
                    resources: [
                      "Schema.org Recipe markup documentation",
                      "WCAG Accessibility Guidelines",
                    ],
                    estimatedTime: 180,
                    xpReward: 800,
                  },
                },
              },
            ],
          },
          {
            id: "css-fundamentals",
            name: "CSS Fundamentals",
            description: "Style your web pages beautifully",
            lessons: [
              {
                id: "css-intro",
                title: "Introduction to CSS",
                description: "Learn how CSS controls the visual presentation of web pages",
                type: "concept",
                duration: 40,
                xpReward: 100,
                content: {
                  explanation: `# Introduction to CSS

CSS (Cascading Style Sheets) controls how HTML elements look on screen. If HTML is the skeleton, CSS is the skin, clothes, and makeup.

## What is CSS?

CSS is a stylesheet language that describes the presentation of HTML documents. It controls:
- Colors and backgrounds
- Fonts and typography
- Layout and spacing
- Animations and transitions
- Responsive design

## CSS Syntax

CSS uses a simple syntax of selectors and declarations:

\`\`\`css
selector {
    property: value;
    property: value;
}
\`\`\`

For example:

\`\`\`css
h1 {
    color: navy;
    font-size: 2rem;
    font-weight: bold;
}
\`\`\`

## Three Ways to Add CSS

### 1. External Stylesheet (Recommended)
\`\`\`html
<link rel="stylesheet" href="styles.css">
\`\`\`

### 2. Internal Styles
\`\`\`html
<style>
    body { font-family: sans-serif; }
</style>
\`\`\`

### 3. Inline Styles (Avoid)
\`\`\`html
<p style="color: red;">Red text</p>
\`\`\`

## CSS Selectors

### Basic Selectors

\`\`\`css
/* Element selector */
p { color: gray; }

/* Class selector */
.highlight { background: yellow; }

/* ID selector */
#header { position: fixed; }

/* Universal selector */
* { margin: 0; padding: 0; }
\`\`\`

### Combinators

\`\`\`css
/* Descendant (any level) */
article p { line-height: 1.6; }

/* Child (direct) */
nav > ul { display: flex; }

/* Adjacent sibling */
h2 + p { font-size: 1.2rem; }

/* General sibling */
h2 ~ p { color: gray; }
\`\`\`

### Attribute Selectors

\`\`\`css
/* Has attribute */
[disabled] { opacity: 0.5; }

/* Exact match */
[type="email"] { border-color: blue; }

/* Contains */
[class*="btn"] { cursor: pointer; }

/* Starts with */
[href^="https"] { color: green; }

/* Ends with */
[href$=".pdf"] { color: red; }
\`\`\`

### Pseudo-classes

\`\`\`css
/* User interaction */
a:hover { text-decoration: underline; }
button:focus { outline: 2px solid blue; }
input:disabled { background: #eee; }

/* Structural */
li:first-child { font-weight: bold; }
tr:nth-child(even) { background: #f5f5f5; }
p:last-of-type { margin-bottom: 0; }
\`\`\`

### Pseudo-elements

\`\`\`css
/* Before/After */
.quote::before { content: '"'; }
.quote::after { content: '"'; }

/* First letter/line */
p::first-letter { font-size: 2em; }
p::first-line { font-weight: bold; }

/* Selection */
::selection { background: yellow; }
\`\`\`

## The Cascade

CSS means "Cascading" Style Sheets. When multiple rules apply, the cascade determines which wins:

1. **Importance**: \`!important\` declarations
2. **Specificity**: More specific selectors win
3. **Source Order**: Later rules override earlier ones

### Specificity Calculation

\`\`\`
Inline styles:  1000
IDs:             100
Classes:          10
Elements:          1
\`\`\`

Example:
\`\`\`css
#nav .link       /* 110 */
nav a.active     /* 12 */
a                /* 1 */
\`\`\`

## Colors in CSS

\`\`\`css
/* Keywords */
color: red;
color: transparent;

/* Hexadecimal */
color: #ff0000;
color: #f00;        /* Shorthand */
color: #ff000080;   /* With alpha */

/* RGB/RGBA */
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);

/* HSL/HSLA */
color: hsl(0, 100%, 50%);
color: hsla(0, 100%, 50%, 0.5);

/* Modern syntax */
color: rgb(255 0 0 / 50%);
color: hsl(0 100% 50% / 50%);
\`\`\`

## Units in CSS

### Absolute Units
\`\`\`css
width: 200px;   /* Pixels */
font-size: 12pt; /* Points (print) */
\`\`\`

### Relative Units
\`\`\`css
font-size: 1.5em;   /* Relative to parent */
font-size: 1.5rem;  /* Relative to root */
width: 50%;         /* Percentage of parent */
width: 50vw;        /* Viewport width */
height: 100vh;      /* Viewport height */
\`\`\`

## Comments

\`\`\`css
/* This is a CSS comment */

/*
   Multi-line
   comment
*/
\`\`\``,
                  keyTakeaways: [
                    "CSS controls the visual presentation of HTML",
                    "Use external stylesheets for maintainability",
                    "Selectors target HTML elements to style",
                    "Specificity determines which rules apply",
                    "Use relative units for responsive design",
                    "The cascade flows from less to more specific",
                  ],
                  documentationRefs: [
                    { title: "CSS Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps", source: "MDN" },
                    { title: "CSS Reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference", source: "MDN" },
                  ],
                  codeExamples: [
                    {
                      title: "Basic Page Styling",
                      language: "css",
                      code: `/* Reset defaults */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Base styles */
body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
}

/* Typography */
h1, h2, h3 {
    line-height: 1.2;
    margin-bottom: 1rem;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

p {
    margin-bottom: 1rem;
}

/* Links */
a {
    color: #0066cc;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}`,
                      explanation: "A clean foundation for any website with reset, typography, and basic layout styles.",
                    },
                  ],
                  exercises: [
                    {
                      id: "ex-css-1",
                      title: "Style a Button",
                      difficulty: "easy",
                      description: "Create a styled button with hover and focus states.",
                      starterCode: `.btn {
    /* Add your styles */
}`,
                      hints: [
                        "Set padding for size",
                        "Add background-color and color",
                        "Round corners with border-radius",
                        "Add hover state for interactivity",
                        "Include focus state for accessibility",
                      ],
                      solution: `.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
}

.btn:hover {
    background: #0052a3;
}

.btn:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}`,
                      testCases: [],
                    },
                  ],
                  quiz: [
                    {
                      id: "css-q1",
                      question: "What does CSS stand for?",
                      options: [
                        "Computer Style Sheets",
                        "Creative Style Sheets",
                        "Cascading Style Sheets",
                        "Colorful Style Sheets",
                      ],
                      correctIndex: 2,
                      explanation: "CSS stands for Cascading Style Sheets. The 'cascading' refers to how styles are applied based on specificity and source order.",
                      difficulty: "easy",
                    },
                    {
                      id: "css-q2",
                      question: "Which selector has the highest specificity?",
                      options: [
                        "#header .nav a",
                        ".nav a.active",
                        "header nav a",
                        "a",
                      ],
                      correctIndex: 0,
                      explanation: "#header .nav a has specificity of 111 (1 ID + 1 class + 1 element). IDs add 100, classes add 10, and elements add 1 to specificity.",
                      difficulty: "medium",
                    },
                  ],
                },
              },
            ],
          },
          {
            id: "js-basics",
            name: "JavaScript Basics",
            description: "Add interactivity to your websites",
            lessons: [],
          },
        ],
      },
      {
        id: "web-intermediate",
        name: "Intermediate",
        description: "Level up with modern frameworks",
        difficulty: "Intermediate",
        topics: [
          { id: "responsive", name: "Responsive Design", description: "Build for all devices", lessons: [] },
          { id: "flexbox-grid", name: "Flexbox & Grid", description: "Modern CSS layouts", lessons: [] },
          { id: "react-basics", name: "React Fundamentals", description: "Component-based UI", lessons: [] },
        ],
      },
      {
        id: "web-advanced",
        name: "Advanced",
        description: "Full-stack development",
        difficulty: "Advanced",
        topics: [
          { id: "nextjs", name: "Next.js", description: "React framework", lessons: [] },
          { id: "databases", name: "Databases", description: "SQL and NoSQL", lessons: [] },
          { id: "auth", name: "Authentication", description: "Secure user auth", lessons: [] },
        ],
      },
      {
        id: "web-expert",
        name: "Expert",
        description: "Production-ready skills",
        difficulty: "Expert",
        topics: [
          { id: "testing", name: "Testing", description: "Comprehensive testing", lessons: [] },
          { id: "performance", name: "Performance", description: "Optimization", lessons: [] },
          { id: "deployment", name: "Deployment", description: "CI/CD pipelines", lessons: [] },
        ],
      },
      {
        id: "web-elite",
        name: "Elite",
        description: "Master-level challenges",
        difficulty: "Elite",
        topics: [
          { id: "saas-project", name: "Build a SaaS", description: "Complete application", lessons: [] },
          { id: "scaling", name: "Scaling Systems", description: "High availability", lessons: [] },
        ],
      },
    ],
  },
  {
    id: "path-app-developer",
    slug: "app-developer",
    name: "App Developer",
    description: "Build native mobile apps for iOS and Android",
    difficulty: "Beginner",
    estimatedHours: 180,
    skills: ["React Native", "Flutter", "Mobile UI", "State Management"],
    icon: "smartphone",
    color: "green",
    totalLessons: 72,
    levels: [],
  },
  {
    id: "path-python-developer",
    slug: "python-developer",
    name: "Python Developer",
    description: "Master Python for automation, data science, and backend development",
    difficulty: "Beginner",
    estimatedHours: 160,
    skills: ["Python", "Django", "Data Analysis", "Automation"],
    icon: "code",
    color: "yellow",
    totalLessons: 65,
    levels: [],
  },
  {
    id: "path-cloud-engineer",
    slug: "cloud-engineer",
    name: "Cloud Engineer",
    description: "Design and manage cloud infrastructure on AWS, GCP, and Azure",
    difficulty: "Intermediate",
    estimatedHours: 200,
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    icon: "cloud",
    color: "orange",
    totalLessons: 78,
    levels: [],
  },
  {
    id: "path-ml-engineer",
    slug: "ml-engineer",
    name: "ML Engineer",
    description: "Build intelligent systems with machine learning and AI",
    difficulty: "Advanced",
    estimatedHours: 250,
    skills: ["Python", "TensorFlow", "PyTorch", "ML Ops", "Statistics"],
    icon: "brain",
    color: "purple",
    totalLessons: 95,
    levels: [],
  },
  {
    id: "path-cybersecurity",
    slug: "cybersecurity",
    name: "Cybersecurity",
    description: "Protect systems and networks from security threats",
    difficulty: "Intermediate",
    estimatedHours: 180,
    skills: ["Network Security", "Ethical Hacking", "Cryptography", "Security Auditing"],
    icon: "shield",
    color: "red",
    totalLessons: 70,
    levels: [],
  },
  {
    id: "path-blockchain",
    slug: "blockchain",
    name: "Blockchain Developer",
    description: "Build decentralized applications and smart contracts",
    difficulty: "Advanced",
    estimatedHours: 170,
    skills: ["Solidity", "Web3.js", "Smart Contracts", "DeFi"],
    icon: "link",
    color: "cyan",
    totalLessons: 60,
    levels: [],
  },
  {
    id: "path-game-dev",
    slug: "game-developer",
    name: "Game Developer",
    description: "Create games for mobile, PC, and console platforms",
    difficulty: "Intermediate",
    estimatedHours: 220,
    skills: ["Unity", "C#", "Game Design", "3D Graphics"],
    icon: "gamepad",
    color: "pink",
    totalLessons: 85,
    levels: [],
  },
  {
    id: "path-devops",
    slug: "devops-engineer",
    name: "DevOps Engineer",
    description: "Automate and streamline software delivery pipelines",
    difficulty: "Intermediate",
    estimatedHours: 190,
    skills: ["Docker", "Kubernetes", "Jenkins", "Monitoring", "Linux"],
    icon: "settings",
    color: "slate",
    totalLessons: 75,
    levels: [],
  },
]

export const getPathBySlug = (slug: string): LearningPath | undefined => {
  return learningPaths.find((path) => path.slug === slug)
}

export const getPathById = (id: string): LearningPath | undefined => {
  return learningPaths.find((path) => path.id === id)
}

export const getLessonById = (pathSlug: string, lessonId: string) => {
  const path = getPathBySlug(pathSlug)
  if (!path) return null

  for (const level of path.levels) {
    for (const topic of level.topics) {
      const lesson = topic.lessons.find((l) => l.id === lessonId)
      if (lesson) {
        return { lesson, topic, level, path }
      }
    }
  }
  return null
}

// XP and level calculations
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 500) + 1
}

export const xpForNextLevel = (currentLevel: number): number => {
  return currentLevel * 500
}

export const xpProgress = (xp: number): number => {
  const level = calculateLevel(xp)
  const currentLevelXp = (level - 1) * 500
  const nextLevelXp = level * 500
  return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
}

// Path color mapping for gradient backgrounds (Apple Liquid Glass style)
export const pathColors: Record<string, string> = {
  blue: "bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30",
  green: "bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30",
  purple: "bg-gradient-to-br from-violet-500/20 via-violet-600/10 to-transparent border-violet-500/30",
  orange: "bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30",
  cyan: "bg-gradient-to-br from-cyan-500/20 via-cyan-600/10 to-transparent border-cyan-500/30",
  red: "bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent border-red-500/30",
  pink: "bg-gradient-to-br from-pink-500/20 via-pink-600/10 to-transparent border-pink-500/30",
  slate: "bg-gradient-to-br from-slate-500/20 via-slate-600/10 to-transparent border-slate-500/30",
  amber: "bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30",
}

// Difficulty color mapping
export const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  Intermediate: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Advanced: "bg-violet-500/10 text-violet-500 border-violet-500/30",
  Expert: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  Elite: "bg-red-500/10 text-red-500 border-red-500/30",
}
