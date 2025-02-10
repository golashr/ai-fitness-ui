'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateProfile } from '@/redux/auth-session/thunks';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'Hindi' },
];

export default function ProfileForm() {
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector((state) => state.session);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userDetails?.name?.split(' ')[0] || '',
    lastName: userDetails?.name?.split(' ')[1] || '',
    phone: userDetails?.phone || '',
    language: userDetails?.language || 'en',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(
        updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          language: formData.language,
          phone: formData.phone,
        })
      ).unwrap();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(`Failed to update profile: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number (optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-1">
          Preferred Language
        </label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
