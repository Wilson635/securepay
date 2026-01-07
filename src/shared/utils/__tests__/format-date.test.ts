import { describe, it, expect } from 'vitest';

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

describe('formatDate', () => {
    it('should format date in French format', () => {
        const result = formatDate('2024-01-15T14:30:00.000Z');
        expect(result).toMatch(/15\s+janv\.\s+2024/);
        expect(result).toContain('14:30');
    });

    it('should handle different months', () => {
        const jan = formatDate('2024-01-15T10:00:00.000Z');
        expect(jan).toContain('janv.');

        const dec = formatDate('2024-12-25T10:00:00.000Z');
        expect(dec).toContain('déc.');
    });

    it('should handle different times', () => {
        const morning = formatDate('2024-01-15T09:05:00.000Z');
        expect(morning).toContain('09:05');

        const evening = formatDate('2024-01-15T22:45:00.000Z');
        expect(evening).toContain('22:45');
    });

    it('should handle midnight', () => {
        const result = formatDate('2024-01-15T00:00:00.000Z');
        expect(result).toContain('00:00');
    });
});