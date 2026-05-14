import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import AssessmentModal from './components/AssessmentModal.jsx';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <AssessmentModal />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
            <ChatbotWidget />
        </Router>
    );
}

export default App;