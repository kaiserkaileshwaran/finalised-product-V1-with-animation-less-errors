"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  ExternalLink,
  FileText,
  Lightbulb,
  Play,
  CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getPathBySlug } from "@/lib/learning-data"
import { cn } from "@/lib/utils"

// Find a lesson by ID in the path structure
function findLessonInPath(path: ReturnType<typeof getPathBySlug>, lessonId: string) {
  if (!path) return null

  for (const level of path.levels) {
    for (const topic of level.topics) {
      const lesson = topic.lessons.find((l) => l.id === lessonId)
      if (lesson) {
        return { lesson, topic, level }
      }
    }
  }
  return null
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const resolvedParams = use(params)
  const path = getPathBySlug(resolvedParams.slug)
  const [activeTab, setActiveTab] = useState("content")
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  if (!path) {
    notFound()
  }

  // Find the lesson
  const lessonData = findLessonInPath(path, resolvedParams.lessonId)

  // If lesson not found, use a mock lesson for demo
  const mockLesson = {
    id: resolvedParams.lessonId,
    title: "Introduction to HTML",
    description: "Understanding what HTML is and how it structures web content",
    type: "concept" as const,
    duration: 30,
    content: {
      explanation: `HTML (HyperText Markup Language) is the standard language for creating web pages. It describes the structure of a web page using a series of elements that tell the browser how to display content.

## What is HTML?

HTML stands for HyperText Markup Language. It's not a programming language - it's a markup language that defines the structure of your content. HTML consists of a series of elements which you use to enclose, or wrap, different parts of the content to make it appear a certain way.

## Basic Structure

Every HTML document has a basic structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>
\`\`\`

## Key Concepts

1. **Elements**: The building blocks of HTML pages
2. **Tags**: Used to create elements (opening and closing tags)
3. **Attributes**: Provide additional information about elements
4. **Nesting**: Elements can contain other elements

## Semantic HTML

Semantic HTML uses HTML markup to reinforce the meaning of the content. Examples include:

- \`<header>\` - Defines a header for a document or section
- \`<nav>\` - Defines navigation links
- \`<main>\` - Specifies the main content
- \`<article>\` - Defines independent content
- \`<section>\` - Defines a section in a document
- \`<footer>\` - Defines a footer for a document`,
      documentationRefs: [
        {
          title: "HTML Basics - MDN Web Docs",
          url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
          source: "MDN",
        },
        {
          title: "HTML Introduction",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
          source: "MDN",
        },
        {
          title: "HTML Tutorial - W3Schools",
          url: "https://www.w3schools.com/html/",
          source: "W3Schools",
        },
      ],
      codeExamples: [
        {
          language: "html",
          code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <main>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
  </main>
  <footer>
    <p>&copy; 2024</p>
  </footer>
</body>
</html>`,
          explanation:
            "A complete HTML page with semantic structure including header, nav, main, and footer elements.",
        },
      ],
      quiz: [
        {
          id: "html-q1",
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language",
          ],
          correctIndex: 0,
          explanation:
            "HTML stands for HyperText Markup Language, the standard language for creating web pages.",
        },
        {
          id: "html-q2",
          question: "Which tag is used for the largest heading?",
          options: ["<heading>", "<h6>", "<h1>", "<head>"],
          correctIndex: 2,
          explanation:
            "The <h1> tag defines the largest and most important heading. Headings range from <h1> (largest) to <h6> (smallest).",
        },
        {
          id: "html-q3",
          question: "What is the correct HTML element for inserting a line break?",
          options: ["<break>", "<lb>", "<br>", "<newline>"],
          correctIndex: 2,
          explanation: "The <br> tag is used to insert a single line break in HTML.",
        },
      ],
      exercises: [
        {
          id: "ex-1",
          title: "Create Your First HTML Page",
          description:
            "Create an HTML page with a heading, paragraph, and a list of your favorite things.",
          hints: [
            "Start with the basic HTML structure",
            "Use <h1> for the main heading",
            "Use <p> for paragraphs",
            "Use <ul> or <ol> for lists",
          ],
          solution: `<!DOCTYPE html>
<html>
<head>
  <title>My Favorite Things</title>
</head>
<body>
  <h1>My Favorite Things</h1>
  <p>Here are some things I love:</p>
  <ul>
    <li>Coding</li>
    <li>Music</li>
    <li>Coffee</li>
  </ul>
</body>
</html>`,
        },
      ],
    },
  }

  const lesson = lessonData?.lesson || mockLesson
  const topic = lessonData?.topic || { name: "HTML Fundamentals" }
  const level = lessonData?.level || { name: "Beginner" }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleCheckQuiz = () => {
    setShowQuizResults(true)
  }

  const getQuizScore = () => {
    if (!lesson.content.quiz) return 0
    const correct = lesson.content.quiz.filter(
      (q) => quizAnswers[q.id] === q.correctIndex
    ).length
    return Math.round((correct / lesson.content.quiz.length) * 100)
  }

  const handleMarkComplete = () => {
    setIsCompleted(true)
    // In production, this would update the backend
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/paths/${path.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to path
            </Link>
            <div className="hidden sm:block text-sm">
              <span className="text-muted-foreground">{path.name}</span>
              <span className="mx-2 text-muted-foreground">/</span>
              <span>{topic.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        <Progress value={35} className="h-1" />
      </header>

      <main className="pt-16 pb-24">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Lesson Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="rounded bg-muted px-2 py-0.5">{level.name}</span>
              <span>•</span>
              <span>{topic.name}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span className="capitalize">{lesson.type}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger value="examples" className="gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Examples</span>
              </TabsTrigger>
              <TabsTrigger value="exercise" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Exercise</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="gap-2">
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Quiz</span>
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="mt-6">
              <Card className="border">
                <CardContent className="p-6 lg:p-8">
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {lesson.content.explanation.split("\n\n").map((paragraph, index) => {
                      if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={index} className="text-xl font-bold mt-8 mb-4">
                            {paragraph.replace("## ", "")}
                          </h2>
                        )
                      }
                      if (paragraph.startsWith("```")) {
                        const code = paragraph.replace(/```\w*\n?/g, "")
                        return (
                          <pre
                            key={index}
                            className="bg-muted rounded-lg p-4 overflow-x-auto text-sm my-4"
                          >
                            <code>{code}</code>
                          </pre>
                        )
                      }
                      if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
                        const items = paragraph.split("\n")
                        return (
                          <ul key={index} className="list-disc pl-6 space-y-2 my-4">
                            {items.map((item, i) => (
                              <li key={i}>{item.replace(/^[\d\.\-\*]\s*/, "")}</li>
                            ))}
                          </ul>
                        )
                      }
                      return (
                        <p key={index} className="my-4 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    })}
                  </div>

                  {/* Documentation References */}
                  {lesson.content.documentationRefs && (
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="font-semibold mb-4">Documentation References</h3>
                      <div className="space-y-2">
                        {lesson.content.documentationRefs.map((ref, index) => (
                          <a
                            key={index}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {ref.title}
                            <span className="text-xs text-muted-foreground">({ref.source})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Examples Tab */}
            <TabsContent value="examples" className="mt-6">
              <div className="space-y-6">
                {lesson.content.codeExamples?.map((example, index) => (
                  <Card key={index} className="border overflow-hidden">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-base">Example {index + 1}</CardTitle>
                      <CardDescription>{example.explanation}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <pre className="bg-muted/50 p-4 overflow-x-auto text-sm">
                        <code>{example.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Exercise Tab */}
            <TabsContent value="exercise" className="mt-6">
              {lesson.content.exercises?.map((exercise, index) => (
                <Card key={index} className="border">
                  <CardHeader>
                    <CardTitle>{exercise.title}</CardTitle>
                    <CardDescription>{exercise.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Hints:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        {exercise.hints.map((hint, i) => (
                          <li key={i}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                    <details className="group">
                      <summary className="cursor-pointer font-medium text-primary">
                        Show Solution
                      </summary>
                      <pre className="mt-4 bg-muted rounded-lg p-4 overflow-x-auto text-sm">
                        <code>{exercise.solution}</code>
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="mt-6">
              <Card className="border">
                <CardHeader>
                  <CardTitle>Knowledge Check</CardTitle>
                  <CardDescription>
                    Test your understanding of the concepts covered in this lesson
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {lesson.content.quiz?.map((question, qIndex) => (
                    <div key={question.id} className="space-y-3">
                      <p className="font-medium">
                        {qIndex + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => {
                          const isSelected = quizAnswers[question.id] === oIndex
                          const isCorrect = oIndex === question.correctIndex
                          const showResult = showQuizResults

                          return (
                            <button
                              key={oIndex}
                              onClick={() => !showQuizResults && handleQuizAnswer(question.id, oIndex)}
                              disabled={showQuizResults}
                              className={cn(
                                "w-full text-left p-3 rounded-lg border transition-colors",
                                isSelected && !showResult && "border-primary bg-primary/5",
                                showResult && isCorrect && "border-success bg-success/10",
                                showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                                !showResult && !isSelected && "hover:border-primary/50"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {showResult && isCorrect && (
                                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                )}
                                {showResult && isSelected && !isCorrect && (
                                  <span className="h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center shrink-0">
                                    X
                                  </span>
                                )}
                                {option}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {showQuizResults && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t flex items-center justify-between">
                    {showQuizResults ? (
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">
                          Score: {getQuizScore()}%
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowQuizResults(false)
                            setQuizAnswers({})
                          }}
                        >
                          Retry Quiz
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleCheckQuiz}
                        disabled={
                          Object.keys(quizAnswers).length !== (lesson.content.quiz?.length || 0)
                        }
                      >
                        Check Answers
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Mark Complete Button */}
          <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur p-4">
            <div className="mx-auto max-w-4xl flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {isCompleted ? (
                  <span className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-4 w-4" />
                    Lesson completed!
                  </span>
                ) : (
                  "Complete this lesson to continue"
                )}
              </div>
              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <Button className="gap-2">
                    Continue to Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleMarkComplete} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
