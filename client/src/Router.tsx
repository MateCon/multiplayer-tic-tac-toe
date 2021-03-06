import React, { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Game from './pages/Game';

const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/game/:roomId" element={<Game />} />
                <Route path="*" element={<div>404</div>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
