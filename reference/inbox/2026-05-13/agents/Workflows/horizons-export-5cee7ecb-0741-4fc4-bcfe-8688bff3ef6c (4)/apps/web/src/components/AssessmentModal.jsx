import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AssessmentModal = ({ forceOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    
    const hasSeen = localStorage.getItem('assessmentModalSeen');
    if (!hasSeen) {
      // Add a slight delay so it doesn't aggressively pop up the millisecond the page loads
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('assessmentModalSeen', 'true');
  };

  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[600px] bg-[#1a2332] border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assessment-modal-title"
          >
            {/* Close Button */}
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={handleClose}
                className="p-2 bg-background/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shadow-sm"
                aria-label="Close assessment modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Iframe Container */}
            <div className="w-full h-[600px] bg-background/50 relative">
              {/* Loading skeleton placeholder behind iframe */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
              
              <iframe
                src="https://form.jotform.com/260828415226053"
                frameBorder="0"
                style={{ width: '100%', height: '100%' }}
                title="AI Readiness Assessment"
                className="w-full h-full relative z-10"
                allow="geolocation; microphone; camera"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssessmentModal;