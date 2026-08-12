"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Flame,
  BookOpen,
  Target,
  Edit3,
  Camera,
  Shield,
  Bell,
  Globe,
  Save,
  X,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { learningPaths } from "@/lib/learning-data"

const tabs = [
  { id: "overview", name: "Overview", icon: User },
  { id: "achievements", name: "Achievements", icon: Trophy },
  { id: "settings", name: "Settings", icon: Shield },
]

const userAchievements = [
  {
    id: "first-lesson",
    name: "First Steps",
    description: "Complete your first lesson",
    earned: true,
    earnedAt: "2024-01-15",
    icon: BookOpen,
    rarity: "common",
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    earned: true,
    earnedAt: "2024-01-22",
    icon: Flame,
    rarity: "uncommon",
  },
  {
    id: "path-complete",
    name: "Path Pioneer",
    description: "Complete your first learning path",
    earned: true,
    earnedAt: "2024-02-10",
    icon: Target,
    rarity: "rare",
  },
  {
    id: "streak-30",
    name: "Month Master",
    description: "Maintain a 30-day streak",
    earned: false,
    earnedAt: null,
    icon: Flame,
    rarity: "epic",
  },
  {
    id: "all-paths",
    name: "Universal Scholar",
    description: "Complete all learning paths",
    earned: false,
    earnedAt: null,
    icon: Globe,
    rarity: "legendary",
  },
]

const rarityColors = {
  common: "border-zinc-400 bg-zinc-400/10",
  uncommon: "border-green-500 bg-green-500/10",
  rare: "border-blue-500 bg-blue-500/10",
  epic: "border-purple-500 bg-purple-500/10",
  legendary: "border-amber-500 bg-amber-500/10",
}

const rarityTextColors = {
  common: "text-zinc-400",
  uncommon: "text-green-500",
  rare: "text-blue-500",
  epic: "text-purple-500",
  legendary: "text-amber-500",
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedEmail, setEditedEmail] = useState(user?.email || "")

  const enrolledPaths = learningPaths.slice(0, 3)

  const stats = [
    { label: "Lessons Completed", value: user?.lessonsCompleted || 0, icon: BookOpen },
    { label: "Current Streak", value: `${user?.currentStreak || 0} days`, icon: Flame },
    { label: "Paths Enrolled", value: user?.pathsEnrolled || 0, icon: Target },
    { label: "Achievements", value: userAchievements.filter((a) => a.earned).length, icon: Trophy },
  ]

  const handleSaveProfile = () => {
    // In a real app, this would save to the database
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted hover:bg-accent">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-9 text-lg font-bold"
                      placeholder="Your name"
                    />
                    <Input
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Your email"
                      type="email"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
                    <p className="text-muted-foreground">{user?.email || "user@example.com"}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {user?.createdAt || "January 2024"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {user?.currentStreak || 0} day streak
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {isEditing ? (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1 border-b border-border -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="border bg-card/50 p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Enrolled Paths */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Enrolled Paths</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledPaths.map((path) => (
                  <Card key={path.id} className="border bg-card/50 p-6">
                    <h3 className="font-semibold">{path.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {path.description}
                    </p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: "45%" }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Achievements</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userAchievements
                  .filter((a) => a.earned)
                  .slice(0, 3)
                  .map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`border-2 p-4 ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background">
                          <achievement.icon
                            className={`h-6 w-6 ${rarityTextColors[achievement.rarity as keyof typeof rarityTextColors]}`}
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold">All Achievements</h2>
              <p className="text-sm text-muted-foreground">
                {userAchievements.filter((a) => a.earned).length} of{" "}
                {userAchievements.length} unlocked
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`relative border-2 p-6 transition-all ${
                    achievement.earned
                      ? rarityColors[achievement.rarity as keyof typeof rarityColors]
                      : "border-border bg-muted/30 opacity-60"
                  }`}
                >
                  {achievement.earned && (
                    <div className="absolute top-3 right-3">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background mb-4">
                    <achievement.icon
                      className={`h-7 w-7 ${
                        achievement.earned
                          ? rarityTextColors[achievement.rarity as keyof typeof rarityTextColors]
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        rarityTextColors[achievement.rarity as keyof typeof rarityTextColors]
                      }`}
                    >
                      {achievement.rarity}
                    </span>
                    {achievement.earned && achievement.earnedAt && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-8">
            {/* Account Settings */}
            <Card className="border bg-card/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    className="mt-1"
                    defaultValue={user?.name || ""}
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    className="mt-1"
                    type="email"
                    defaultValue={user?.email || ""}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>America/New_York (UTC-5)</option>
                    <option>America/Los_Angeles (UTC-8)</option>
                    <option>Europe/London (UTC+0)</option>
                    <option>Europe/Paris (UTC+1)</option>
                    <option>Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
                <Button className="mt-2">Save Changes</Button>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="border bg-card/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Email notifications for new lessons", key: "email-lessons" },
                  { label: "Streak reminder notifications", key: "streak-reminder" },
                  { label: "Achievement notifications", key: "achievements" },
                  { label: "Weekly progress summary", key: "weekly-summary" },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm">{setting.label}</span>
                    <button
                      className="relative h-6 w-11 rounded-full bg-muted transition-colors data-[state=checked]:bg-primary"
                      data-state="checked"
                    >
                      <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform data-[state=checked]:translate-x-5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Privacy Settings */}
            <Card className="border bg-card/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Show profile to other users", key: "public-profile" },
                  { label: "Display achievements publicly", key: "public-achievements" },
                  { label: "Show learning activity", key: "public-activity" },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm">{setting.label}</span>
                    <button
                      className="relative h-6 w-11 rounded-full bg-muted transition-colors"
                    >
                      <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border border-destructive/30 bg-destructive/5 p-6">
              <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
