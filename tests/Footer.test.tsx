import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('Footer', () => {
  it('renders the footer component', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('Footer contains correct links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Map' })).toHaveAttribute('href', '/map');
    expect(screen.getByRole('link', { name: 'List' })).toHaveAttribute('href', '/list');
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile');
  });

  it('renders correct text for each link', () => {
    render(<Footer />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});