'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Facebook, Linkedin } from './social-icons/icons'

const Popup = ({ message, onClose, isVisible }) => {
  return (
    <div
      className={`fixed inset-x-0 top-10 z-50 flex justify-center transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex w-[40rem] items-center justify-between rounded-lg bg-black p-4 text-white shadow-lg">
        <div className="text-left">{message}</div>
        <button onClick={onClose} className="text-white hover:text-gray-400 focus:outline-none">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

const ShareDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isVisible, setIsVisible] = useState(false) // Manage visibility for animation

  const timeoutRef = useRef<number | null>(null) // Ref to keep track of the timeout
  const shareUrl = window.location.href

  useEffect(() => {
    if (showPopup) {
      setIsVisible(true) // Trigger the fade-in animation
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set a new timeout
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false) // Trigger the fade-out animation
        timeoutRef.current = window.setTimeout(() => setShowPopup(false), 300) // Wait for the animation to finish before unmounting
      }, 1000)
    }

    // Cleanup function to clear the timeout when the component unmounts or when showPopup changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [showPopup])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setShowPopup(true)
  }

  const openPopup = (url: string) => {
    const width = 600
    const height = 400
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2

    window.open(
      url,
      'FloatingWindow',
      `toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`
    )
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="mt-2 flex items-center text-sm text-gray-500 focus:outline-none dark:text-gray-400"
      >
        Share
        <svg
          className="ml-1 h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.75 7.75 10 12.25l4.25-4.5"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              onClick={copyToClipboard}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="m12.505 9.678.59-.59a5 5 0 0 1 1.027 7.862l-2.829 2.83a5 5 0 0 1-7.07-7.072l2.382-2.383q.002.646.117 1.298l-1.793 1.792a4 4 0 0 0 5.657 5.657l2.828-2.828a4 4 0 0 0-1.046-6.411q.063-.081.137-.155m-1.01 4.646-.589.59a5 5 0 0 1-1.027-7.862l2.828-2.83a5 5 0 0 1 7.071 7.072l-2.382 2.383a7.7 7.7 0 0 0-.117-1.297l1.792-1.793a4 4 0 1 0-5.657-5.657l-2.828 2.828a4 4 0 0 0 1.047 6.411 2 2 0 0 1-.138.155"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Copy link
            </button>
            <button
              onClick={() =>
                openPopup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`)
              }
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              <X className="mr-2 h-5 w-5" />
              Share on X
            </button>
            <button
              onClick={() =>
                openPopup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`)
              }
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              <Facebook className="mr-2 h-5 w-5" />
              Share on Facebook
            </button>
            <button
              onClick={() =>
                openPopup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`)
              }
              className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              <Linkedin className="mr-2 h-5 w-5" />
              Share on LinkedIn
            </button>
          </div>
        </div>
      )}
      {showPopup && (
        <Popup
          message="Link copied"
          onClose={() => {
            setIsVisible(false)
            timeoutRef.current = window.setTimeout(() => setShowPopup(false), 300) // Wait for the animation to finish before unmounting
          }}
          isVisible={isVisible}
        />
      )}
    </div>
  )
}

export default ShareDropdown
