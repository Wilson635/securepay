import { describe, it, expect } from 'vitest';

function maskIBAN(iban: string): string {
    const cleaned = iban.replace(/\s/g, '');
    if (cleaned.length < 8) return iban;

    const first4 = cleaned.slice(0, 4);
    const last2 = cleaned.slice(-2);
    const middleLength = cleaned.length - 6;
    const maskedGroups = Math.ceil(middleLength / 4);
    const maskedMiddle = Array(maskedGroups).fill('••••').join(' ');

    return `${first4} ${maskedMiddle} ••${last2}`;
}

describe('maskIBAN', () => {
    it('should mask CI IBAN correctly', () => {
        const iban = 'CI93CI0080111301134291200589';
        const masked = maskIBAN(iban);
        expect(masked).toBe('CI93 •••• •••• •••• •••• •••• ••89');
    });

    it('should mask FR IBAN correctly', () => {
        const iban = 'FR7630006000011234567890189';
        const masked = maskIBAN(iban);
        expect(masked).toBe('FR76 •••• •••• •••• •••• ••89');
    });

    it('should handle IBAN with spaces', () => {
        const iban = 'CI93 CI00 8011 1301 1342 9120 0589';
        const masked = maskIBAN(iban);
        expect(masked).toBe('CI93 •••• •••• •••• •••• •••• ••89');
    });

    it('should return original if IBAN too short', () => {
        const iban = 'CI93123';
        const masked = maskIBAN(iban);
        expect(masked).toBe('CI93123');
    });

    it('should preserve first 4 and last 2 characters', () => {
        const iban = 'AB12345678901234567890';
        const masked = maskIBAN(iban);
        expect(masked).toMatch(/^AB12/);
        expect(masked).toMatch(/90$/);
    });

    it('should mask different length IBANs correctly', () => {
        // Short IBAN (15 chars)
        const short = 'CI93123456789AB';
        const maskedShort = maskIBAN(short);
        expect(maskedShort).toBe('CI93 •••• •••• ••AB');

        // Long IBAN (27 chars)
        const long = 'FR7630006000011234567890189';
        const maskedLong = maskIBAN(long);
        expect(maskedLong).toMatch(/^FR76/);
        expect(maskedLong).toMatch(/89$/);
    });
});
