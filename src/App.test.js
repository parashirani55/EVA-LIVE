// src/App.test.js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders Home page', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByText(/welcome/i)).toBeInTheDocument(); // Update text
});

test('renders Login page', () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByText(/sign in/i)).toBeInTheDocument(); // Update text
});
