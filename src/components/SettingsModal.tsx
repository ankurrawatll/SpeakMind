import { useState } from 'react'
import type { Screen } from '../App'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (screen: Screen) => void
}

export default function SettingsModal({ isOpen, onClose, onNavigate }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    notifications: {
      meditationReminders: true,
      achievementAlerts: true,
      weeklyReports: true,
      brainHealthUpdates: false
    },
    privacy: {
      shareProgress: false,
      showInLeaderboard: true,
      allowFriendRequests: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      meditationDuration: 15,
      defaultMood: 'calm'
    },
    goals: {
      dailyMinutes: 20,
      weeklySessions: 5,
      monthlyStreak: 20
    }
  })

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Profile Customization */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">U</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Profile Picture</div>
                    <div className="text-sm text-gray-500">Tap to change</div>
                  </div>
                </div>
                <button className="text-purple-500 font-medium">Change</button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your meditation journey..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500">
                      {key === 'meditationReminders' && 'Daily meditation reminders'}
                      {key === 'achievementAlerts' && 'Get notified when you earn achievements'}
                      {key === 'weeklyReports' && 'Weekly progress reports'}
                      {key === 'brainHealthUpdates' && 'Brain health monitoring alerts'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', key, !value)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      value ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
            <div className="space-y-3">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500">
                      {key === 'shareProgress' && 'Allow friends to see your meditation progress'}
                      {key === 'showInLeaderboard' && 'Show your stats in community leaderboards'}
                      {key === 'allowFriendRequests' && 'Allow others to send you friend requests'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('privacy', key, !value)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      value ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Meditation Duration</label>
                <select
                  value={settings.preferences.meditationDuration}
                  onChange={(e) => handleSettingChange('preferences', 'meditationDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Mood</label>
                <div className="grid grid-cols-2 gap-2">
                  {['calm', 'focused', 'relaxed', 'anxious'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => handleSettingChange('preferences', 'defaultMood', mood)}
                      className={`p-3 rounded-xl border transition-colors ${
                        settings.preferences.defaultMood === mood
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <div className="capitalize font-medium">{mood}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Meditation Goal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={settings.goals.dailyMinutes}
                    onChange={(e) => handleSettingChange('goals', 'dailyMinutes', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-900 w-12">{settings.goals.dailyMinutes} min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Sessions Goal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={settings.goals.weeklySessions}
                    onChange={(e) => handleSettingChange('goals', 'weeklySessions', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-900 w-12">{settings.goals.weeklySessions}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Streak Goal</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="7"
                    max="31"
                    value={settings.goals.monthlyStreak}
                    onChange={(e) => handleSettingChange('goals', 'monthlyStreak', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-900 w-12">{settings.goals.monthlyStreak} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
              Save Settings
            </button>
            <button className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
