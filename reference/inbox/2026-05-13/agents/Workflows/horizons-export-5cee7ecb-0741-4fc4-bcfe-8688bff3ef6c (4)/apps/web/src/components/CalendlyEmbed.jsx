import React from 'react';

const CalendlyEmbed = ({ url = "https://calendly.com/placeholder/30min" }) => {
  return (
    <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Calendly Scheduling"
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default CalendlyEmbed;