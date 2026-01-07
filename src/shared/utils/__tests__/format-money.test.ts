import { describe, it, expect } from 'vitest';

function formatMoney(amount: number, currency: 'XOF' | 'EUR' | 'USD'): string {
    const config = {
        XOF: {
            locale: 'fr-CI',
            options: {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            },
        },
        EUR: {
            locale: 'fr-FR',
            options: {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
            },
        },
        USD: {
            locale: 'en-US',
            options: {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
            },
        },
    } as const;

    const { locale, options } = config[currency];
    const formatted = new Intl.NumberFormat(locale, options).format(amount);
    return currency === 'XOF' ? formatted.replace('XOF', 'FCFA') : formatted;
}

describe('formatMoney', () => {
    describe('XOF formatting', () => {
        it('should format XOF without decimals', () => {
            const result = formatMoney(1500000, 'XOF');
            expect(result).toContain('1 500 000');
            expect(result).toContain('FCFA');
            expect(result).not.toContain('XOF');
        });

        it('should format large XOF amounts', () => {
            const result = formatMoney(50000000, 'XOF');
            expect(result).toContain('50 000 000');
            expect(result).toContain('FCFA');
        });

        it('should handle zero XOF amount', () => {
            const result = formatMoney(0, 'XOF');
            expect(result).toContain('0');
            expect(result).toContain('FCFA');
        });
    });

    describe('EUR formatting', () => {
        it('should format EUR with 2 decimals', () => {
            const result = formatMoney(1500.5, 'EUR');
            expect(result).toMatch(/1[\s]?500[,.]50/);
            expect(result).toContain('€');
        });

        it('should format whole EUR amounts', () => {
            const result = formatMoney(1500, 'EUR');
            expect(result).toMatch(/1[\s]?500[,.]00/);
        });

        it('should handle zero EUR amount', () => {
            const result = formatMoney(0, 'EUR');
            expect(result).toMatch(/0[,.]00/);
        });
    });

    describe('USD formatting', () => {
        it('should format USD with 2 decimals', () => {
            const result = formatMoney(1500, 'USD');
            expect(result).toContain('$');
            expect(result).toMatch(/1[,]500\.00/);
        });

        it('should format decimal USD amounts', () => {
            const result = formatMoney(1500.75, 'USD');
            expect(result).toMatch(/1[,]500\.75/);
        });

        it('should handle zero USD amount', () => {
            const result = formatMoney(0, 'USD');
            expect(result).toContain('$0.00');
        });
    });

    describe('edge cases', () => {
        it('should handle negative amounts (for refunds)', () => {
            const xof = formatMoney(-1000, 'XOF');
            expect(xof).toContain('-');

            const eur = formatMoney(-100.5, 'EUR');
            expect(eur).toContain('-');
        });

        it('should handle very large amounts', () => {
            const result = formatMoney(999999999, 'XOF');
            expect(result).toContain('999 999 999');
        });

        it('should handle very small decimal amounts', () => {
            const result = formatMoney(0.01, 'EUR');
            expect(result).toMatch(/0[,.]01/);
        });
    });
});