"use client"

import { useState } from "react"

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    email: true,
    newsletter: false,
    pushNotifications: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the preferences to your backend
    console.log("Preferences submitted:", preferences)
    // You could also show a success message to the user
    alert("Preferences updated successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-6">Notification Preferences</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="email"
                    checked={preferences.email}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Receive email notifications</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={preferences.newsletter}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Subscribe to newsletter</span>
                </label>
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={preferences.pushNotifications}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Enable push notifications</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

