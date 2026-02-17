import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
    it('renders children correctly', () => {
        render(<Badge>Test Label</Badge>);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
        const { container } = render(<Badge variant="inferia">Test</Badge>);
        // Badge renders a span with text-inferia class for 'inferia' variant
        expect(container.firstChild).toHaveClass('text-inferia');
    });
});
