'use client';

import { useEffect, useState } from 'react';

export default function DOMCleaner() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Global outside click handler for all dropdowns and modals
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Find all open dropdowns, modals, and pop-ups
      const openElements = document.querySelectorAll('[data-dropdown="open"], [data-modal="open"], [data-popup="open"]');
      
      openElements.forEach((element) => {
        // Check if click is outside the element
        if (!element.contains(target)) {
          // Close the element by removing the open attribute or triggering close
          element.removeAttribute('data-dropdown');
          element.removeAttribute('data-modal');
          element.removeAttribute('data-popup');
          
          // Dispatch custom close event
          element.dispatchEvent(new CustomEvent('outsideClick', { bubbles: true }));
        }
      });
    };

    // Global escape key handler
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close all open dropdowns, modals, and pop-ups
        const openElements = document.querySelectorAll('[data-dropdown="open"], [data-modal="open"], [data-popup="open"]');
        
        openElements.forEach((element) => {
          element.removeAttribute('data-dropdown');
          element.removeAttribute('data-modal');
          element.removeAttribute('data-popup');
          element.dispatchEvent(new CustomEvent('escapePressed', { bubbles: true }));
        });
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    // Clean up any unwanted elements or attributes
    const cleanupInterval = setInterval(() => {
      // Remove any stale modal backdrops
      const staleBackdrops = document.querySelectorAll('.modal-backdrop:not([data-active])');
      staleBackdrops.forEach(backdrop => backdrop.remove());

      // Clean up any orphaned tooltips
      const orphanedTooltips = document.querySelectorAll('[role="tooltip"]:not([data-active])');
      orphanedTooltips.forEach(tooltip => {
        if (!document.body.contains(tooltip.parentElement)) {
          tooltip.remove();
        }
      });

      // Remove any duplicate IDs
      const elementsWithIds = document.querySelectorAll('[id]');
      const seenIds = new Set();
      elementsWithIds.forEach(element => {
        if (seenIds.has(element.id)) {
          element.removeAttribute('id');
        } else {
          seenIds.add(element.id);
        }
      });

      // Clean up bis_skin_checked attributes that cause hydration issues
      const bisElements = document.querySelectorAll('[bis_skin_checked]');
      bisElements.forEach(element => {
        element.removeAttribute('bis_skin_checked');
      });
    }, 5000); // Run every 5 seconds

    return () => clearInterval(cleanupInterval);
  }, [mounted]);

  return null;
}