'use client'

import { useState, useEffect } from 'react'
import { RegisterScreen } from './auth/register-screen'
import { LoginScreen } from './auth/login-screen'
import { CategoryButton } from './daily-quest/category-button'
import { TasksView } from './daily-quest/tasks-view'
import { SmallModal } from './daily-quest/modal'
import { ProgressView } from './daily-quest/progress-view'
import { getToday } from '@/lib/store'
import type { Category, Task } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

export function ProductTutorial({ onGoToLogin, onGoToRegister }: { onGoToLogin: () => void, onGoToRegister: () => void }) {
  const [step, setStep] = useState(0)
  const [isSkipped, setIsSkipped] = useState(false)

  // Dragging simulation flag
  const [isDraggingCategory, setIsDraggingCategory] = useState(false)

  // Simulation State
  const today = getToday()
  const [typedCategory, setTypedCategory] = useState('')
  const [typedTask, setTypedTask] = useState('')
  const [categories, setCategories] = useState<Record<string, Category>>({})
  const [categoryId] = useState('demo-cat-1')
  const [categoryId2] = useState('demo-cat-2')
  const [tasks, setTasks] = useState<Task[]>([])
  const [streakDays, setStreakDays] = useState(0)

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isTasksOpen, setIsTasksOpen] = useState(false)
  const [isProgressOpen, setIsProgressOpen] = useState(false)

  // Tutorial Orchestration
  useEffect(() => {
    // 0: Register -> 1: Login
    const t0 = setTimeout(() => setStep(1), 2500)

    // 1: Login -> 2: Empty Dashboard
    const t1 = setTimeout(() => { setStep(2) }, 5000)

    // 2: Dashboard -> 3: Open Category Modal
    const t2 = setTimeout(() => {
      setStep(3);
      setIsCategoryModalOpen(true);
    }, 7000)

    // 3: Typing Category
    const t3 = setTimeout(() => { setTypedCategory('F') }, 7500)
    const t3a = setTimeout(() => { setTypedCategory('Fit') }, 7800)
    const t3b = setTimeout(() => { setTypedCategory('Fitness') }, 8100)

    // 4: Dashboard with Category created
    const t4 = setTimeout(() => {
      setIsCategoryModalOpen(false)
      setCategories({
        [categoryId]: { name: 'Fitness', completed: false, days: { [today]: [] } },
        [categoryId2]: { name: 'Reading', completed: false, days: { [today]: [] } } // Add second category for dragging
      })
      setStep(4)
    }, 9000)

    // 4.5: Simulate Category Drag
    const tDrag1 = setTimeout(() => {
      setIsDraggingCategory(true)
    }, 10500)

    const tDrag2 = setTimeout(() => {
      // Framer Motion physically swaps them smoothly
      setStep(4.5)
    }, 11500)

    const tDrag3 = setTimeout(() => {
      // Drop it smoothly
      setIsDraggingCategory(false)
    }, 12000)

    // 5: Open Tasks
    const t5 = setTimeout(() => {
      setIsTasksOpen(true)
      setStep(5)
    }, 13500)

    // 6: Type Task 1
    const t6 = setTimeout(() => setTypedTask('Run 5km'), 14500)

    // 7: Add Task 1
    const t7 = setTimeout(() => {
      setTypedTask('')
      setTasks([{ text: 'Run 5km', done: false }])
      setStep(6)
    }, 15500)

    // 8: Type Task 2
    const t8 = setTimeout(() => setTypedTask('Drink Water'), 16500)

    // 9: Add Task 2
    const t9 = setTimeout(() => {
      setTypedTask('')
      setTasks([{ text: 'Run 5km', done: false }, { text: 'Drink Water', done: false }])
      setStep(7)
    }, 17500)

    // 10: Reorder Tasks
    const t10 = setTimeout(() => {
      setTasks([{ text: 'Drink Water', done: false }, { text: 'Run 5km', done: false }])
      setStep(8)
    }, 19000)

    // 11: Complete First Task
    const t11 = setTimeout(() => {
      setTasks([{ text: 'Drink Water', done: true }, { text: 'Run 5km', done: false }])
      setStep(9)
    }, 20500)

    // 11.5: Complete Second Task (Sequence checkmarks)
    const t11a = setTimeout(() => {
      setTasks([{ text: 'Drink Water', done: true }, { text: 'Run 5km', done: true }])
      setStep(9.5)
    }, 21500)

    // 12: Complete Category (Both tasks done & Window Closes)
    const t12 = setTimeout(() => {
      setIsTasksOpen(false)
      setCategories({
        [categoryId]: {
          name: 'Fitness',
          completed: true,
          days: { [today]: [{ text: 'Drink Water', done: true }, { text: 'Run 5km', done: true }] }
        },
        [categoryId2]: { name: 'Reading', completed: false, days: { [today]: [] } }
      })
      setStep(10)
    }, 22500)

    // 13: View Progress View (with mocked historical data)
    const t13 = setTimeout(() => {
      // Mock exactly 365 days of data
      const longHistory: Record<string, Task[]> = {}
      for (let i = 0; i < 365; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        // 80% completion rate randomly
        longHistory[d.toISOString().split('T')[0]] = [
          { text: 'Mock 1', done: true },
          { text: 'Mock 2', done: Math.random() > 0.2 }
        ]
      }
      setCategories({
        [categoryId]: {
          name: 'Fitness',
          completed: true,
          days: longHistory
        },
        [categoryId2]: { name: 'Reading', completed: false, days: { [today]: [] } }
      })
      setStreakDays(365)
      setIsProgressOpen(true)
      setStep(11)
    }, 24500)

    // 14: Close Progress, Open Profile Simulation
    const t14 = setTimeout(() => {
      setIsProgressOpen(false)
      setStep(12)
    }, 28500)

    // 15: Select Sunset Theme
    const t15 = setTimeout(() => {
      setStep(13)
    }, 30500)

    // 16: Select Custom Theme
    const t16 = setTimeout(() => {
      setStep(14)
    }, 32500)

    // 17: Share Profile
    const t17 = setTimeout(() => {
      setStep(15)
    }, 34500)

    // 18: End Screen
    const t18 = setTimeout(() => {
      setStep(16)
    }, 37500)

    return () => {
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t3a); clearTimeout(t3b);
      clearTimeout(t4); clearTimeout(tDrag1); clearTimeout(tDrag2); clearTimeout(tDrag3); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); clearTimeout(t8); clearTimeout(t9);
      clearTimeout(t10); clearTimeout(t11); clearTimeout(t11a); clearTimeout(t12); clearTimeout(t13); 
      clearTimeout(t14); clearTimeout(t15); clearTimeout(t16); clearTimeout(t17); clearTimeout(t18);
    }
  }, [categoryId, categoryId2, today])

  const handleSkip = () => {
    setIsSkipped(true)
    onGoToLogin()
  }

  // Prevent any rendering if skipped to ensure no leaked animations
  if (isSkipped) return null

  // Map state to actual components to mimic the real UI exactly

  // Step 0: Register
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center relative">
        <TutorialHeader onSkip={onGoToRegister} />
        <div className="w-full pointer-events-none opacity-90 scale-95 transition-all">
          <RegisterScreen onSwitchToLogin={() => { }} onRegisterSuccess={() => { }} />
        </div>
        <p className="fixed bottom-10 text-muted-foreground italic font-medium tracking-widest uppercase animate-pulse">Tutorial: Create an Account</p>
      </div>
    )
  }

  // Step 1: Login
  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center animate-fade-in relative">
        <TutorialHeader onSkip={onGoToRegister} />
        <div className="w-full pointer-events-none opacity-90 scale-95 transition-all">
          <LoginScreen onSwitchToRegister={() => { }} onLoginSuccess={() => { }} />
        </div>
        <p className="fixed bottom-10 text-muted-foreground italic font-medium tracking-widest uppercase animate-pulse">Tutorial: Login to Procrastiview</p>
      </div>
    )
  }

  // Final End Screen (Step 16)
  if (step === 16) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="border-2 border-border rounded-2xl animate-glow p-8 bg-background/50 backdrop-blur-sm text-center max-w-md w-full animate-fade-in">
          <h2 className="text-3xl font-bold text-primary italic mb-6">Your Progress Awaits</h2>
          <p className="text-muted-foreground text-sm italic mb-6">
            Track streaks, personalize themes, lock your profile with a passcode, and share your public link!
          </p>
          <div className="flex flex-col gap-4">
            <button onClick={onGoToRegister} className="w-full py-3 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm italic uppercase transition-all hover:bg-primary/30 animate-glow">
              Register Now
            </button>
            <button onClick={onGoToLogin} className="w-full py-3 border-[1.5px] border-secondary flex-1 rounded-lg bg-secondary/10 text-secondary font-bold text-sm italic uppercase transition-all hover:bg-secondary/20">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard / App Layout
  return (
    <div className="min-h-screen overflow-hidden pointer-events-none transition-all duration-500">
      <div className="w-[95vw] h-[95vh] mx-auto mt-[2.5vh] border-2 border-border rounded-2xl animate-glow p-5 flex flex-col gap-4 overflow-hidden">
        <h1 className="text-center text-primary text-3xl font-bold animate-fade-in-down italic">
          Procrastiview
        </h1>

        <div className="flex gap-3 flex-wrap justify-center">
          <button className={`px-5 py-2.5 rounded-lg border-[1.5px] border-primary bg-primary/10 text-primary transition-all duration-300 italic ${step === 2 ? 'animate-glow-subtle scale-105' : ''}`}>
            + New Category
          </button>
          <button className={`px-5 py-2.5 rounded-lg border-[1.5px] border-primary bg-primary/10 text-primary transition-all duration-300 italic ${step >= 12 && step <= 15 ? 'opacity-50' : ''}`}>
            Progress
          </button>
          <button className={`px-5 py-2.5 rounded-lg border-[1.5px] border-primary bg-primary/10 text-primary transition-all duration-300 italic ${step >= 12 && step <= 15 ? 'opacity-50' : ''}`}>
            Streak
          </button>
          <button className={`px-5 py-2.5 rounded-lg border-[1.5px] border-secondary bg-secondary/10 text-secondary transition-all duration-300 italic ${step >= 12 && step <= 15 ? 'animate-glow-subtle scale-105' : ''}`}>
            Profile
          </button>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto overflow-y-auto pr-2 pb-4 pt-2">
          {step >= 12 && step <= 15 ? (
            <div className="w-full h-full bg-card/80 border-[1.5px] border-border rounded-xl p-6 flex flex-col gap-6 animate-fade-in">
              <div className="text-center pb-4 border-b border-border/50">
                <h3 className="text-2xl font-bold text-primary italic">My Profile</h3>
                <p className="text-muted-foreground text-sm italic">procastiview.com/demo-user</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-primary italic">App Theme</span>
                  <div className="flex flex-wrap gap-2">
                    {['Sunrise', 'Day', 'Sunset', 'Night', 'Custom'].map((t) => (
                      <button key={t} className={`px-3 py-1.5 rounded-lg border-[1.5px] text-xs font-bold italic transition-all ${
                        (step === 13 && t === 'Sunset') || (step >= 14 && t === 'Custom') || (step === 12 && t === 'Night')
                          ? 'border-primary bg-primary/20 text-primary scale-105 shadow-[0_0_10px_rgba(79,195,255,0.3)]'
                          : 'border-border/50 text-muted-foreground'
                      }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                  {step >= 14 && (
                    <div className="mt-2 p-3 bg-background/50 rounded-lg border border-primary/20 animate-fade-in flex items-center justify-between">
                      <span className="text-xs font-bold italic text-primary">Personalize Color</span>
                      <div className="w-6 h-6 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 shadow-md"></div>
                    </div>
                  )}
                </div>

                <div className={`mt-6 pt-4 border-t border-border/50 flex flex-col gap-3 ${step === 15 ? 'animate-glow scale-[1.02]' : ''}`}>
                  <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border-[1.5px] font-bold italic transition-all ${
                    step === 15 ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_15px_rgba(124,255,154,0.4)]' : 'bg-primary/10 border-primary text-primary'
                  }`}>
                    Share Public Profile Link
                  </button>
                  {step === 15 && <span className="text-center text-xs text-secondary animate-fade-in">Link Copied!</span>}
                </div>
              </div>
            </div>
          ) : Object.keys(categories).length === 0 ? (
            <p className="text-center text-muted-foreground italic mt-4 py-8 bg-card/50 rounded-xl border border-dashed border-border/60">
              No categories yet. Create one to get started!
            </p>
          ) : (
            <AnimatePresence>
              {[
                step >= 4.5 ? categoryId2 : categoryId,
                step >= 4.5 ? categoryId : categoryId2
              ].map((id) => {
                const cat = categories[id];
                if (!cat) return null;
                
                const isFloating = isDraggingCategory && id === categoryId;
                
                return (
                  <motion.div
                    layout
                    key={id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isFloating ? 0.7 : 1, 
                      scale: isFloating ? 1.05 : 1,
                      y: isFloating ? -15 : 0,
                      zIndex: isFloating ? 10 : 1
                    }}
                    transition={{ layout: { type: "spring", stiffness: 300, damping: 25 }, duration: 0.3 }}
                    className={`${step >= 10 && id === categoryId ? 'animate-glow-intense shadow-[0_0_20px_rgba(124,255,154,0.6)] scale-105' : ''} w-full`}
                  >
                    <CategoryButton category={cat} onClick={() => { }} />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Category Modal Simulated */}
      <SmallModal isOpen={isCategoryModalOpen} onClose={() => { }} title="Create New Category">
        <input
          type="text"
          value={typedCategory}
          readOnly
          placeholder="Enter category name..."
          className="w-full px-4 py-3.5 border-[1.5px] border-primary rounded-lg bg-primary/10 text-foreground italic text-base transition-all focus:outline-none placeholder:text-foreground/50"
        />
        <div className="flex gap-3">
          <button className="flex-1 px-5 py-3 border-[1.5px] border-primary rounded-lg bg-gradient-to-br from-primary/15 to-primary/10 text-primary font-bold text-sm italic uppercase">
            Create
          </button>
        </div>
      </SmallModal>

      {/* Tasks View Simulated */}
      {isTasksOpen && (
        <TasksView
          isOpen={isTasksOpen}
          onClose={() => { }}
          category={{ ...categories[categoryId], days: { [today]: tasks } }}
          categoryId={categoryId}
          onUpdateTasks={() => { }}
          onMarkDone={() => { }}
          simulatedNewTaskText={typedTask}
        />
      )}

      {/* Progress View Simulated */}
      {isProgressOpen && (
        <ProgressView
          isOpen={isProgressOpen}
          onClose={() => { }}
          categories={categories}
          initialCategoryId={categoryId}
        />
      )}

      {/* Tutorial Label Overlay Bottom Text */}
      <div className="fixed bottom-10 left-0 w-full flex justify-center z-[100] drop-shadow-lg">
        <span className="bg-background/80 backdrop-blur border border-primary text-primary px-6 py-2 rounded-full font-bold tracking-widest uppercase italic shadow-lg text-sm transition-all text-center">
          {step === 2 && 'Step 3: Empty Dashboard'}
          {step === 3 && 'Step 4: Add a Category'}
          {step >= 4 && step <= 4.5 && 'Step 5: Add/Reorder Category'}
          {step >= 5 && step <= 7 && 'Step 6: Add Tasks'}
          {step === 8 && 'Step 7: Reorder Tasks'}
          {step >= 9 && step <= 9.5 && 'Step 8: Complete Tasks'}
          {step === 10 && 'Step 9: Category Celebrates!'}
          {step === 11 && `Step 10: View Progress Calendar!`}
          {step === 12 && `Step 11: Set up Passcode & Themes`}
          {step === 13 && `Step 12: Select Built-in Themes`}
          {step === 14 && `Step 13: Personalize Custom Theme Color`}
          {step === 15 && `Step 14: Share your Public Profile`}
        </span>
      </div>

      <TutorialHeader onSkip={handleSkip} />
    </div>
  )
}

function TutorialHeader({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-[150] flex items-center gap-3">
      <span className="bg-primary/20 backdrop-blur-md border border-primary/50 text-primary px-4 py-1.5 rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_0_15px_rgba(79,195,255,0.3)] animate-glow">
        TUTORIAL MODE
      </span>
      <button
        onClick={onSkip}
        className="bg-background/80 backdrop-blur-md border border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors px-4 py-1.5 rounded-full font-medium tracking-wide text-xs uppercase shadow-sm"
      >
        Skip
      </button>
    </div>
  )
}
