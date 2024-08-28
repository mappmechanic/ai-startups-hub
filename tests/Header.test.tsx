import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('Header', () => {
  it('renders the header with correct elements', () => {
    render(<Header />);

    // Check if the logo is present
    const logo = screen.getByTestId('rocket-icon');
    expect(logo).toBeInTheDocument();

    // Check if the title is present
    const title = screen.getByText('Startups Directory');
    expect(title).toBeInTheDocument();

    // Check if the "View Map" link is present with correct href
    const mapLink = screen.getByText('View Map');
    expect(mapLink).toBeInTheDocument();
    expect(mapLink).toHaveAttribute('href', '/map');
  });
});