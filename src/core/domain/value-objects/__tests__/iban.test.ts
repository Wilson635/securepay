import { describe, it, expect } from 'vitest';
import { IBAN } from '../iban';

describe('IBAN Value Object', () => {
    describe('creation', () => {
        it('should create valid IBAN', () => {
            const iban = IBAN.create('CI93CI0080111301134291200589');
            expect(iban.value).toBe('CI93CI0080111301134291200589');
        });

        it('should handle IBAN with spaces', () => {
            const iban = IBAN.create('CI93 CI00 8011 1301 1342 9120 0589');
            expect(iban.value).toBe('CI93CI0080111301134291200589');
        });

        it('should throw error for too short IBAN', () => {
            expect(() => IBAN.create('CI93')).toThrow('Invalid IBAN length');
        });

        it('should throw error for too long IBAN', () => {
            const tooLong = 'CI93' + '0'.repeat(32);
            expect(() => IBAN.create(tooLong)).toThrow('Invalid IBAN length');
        });

        it('should throw error for invalid format', () => {
            expect(() => IBAN.create('1234567890123456')).toThrow('Invalid IBAN format');
            expect(() => IBAN.create('CIXX1234567890123456')).toThrow('Invalid IBAN format');
        });
    });

    describe('masking', () => {
        it('should mask CI IBAN correctly', () => {
            const iban = IBAN.create('CI93CI0080111301134291200589');
            expect(iban.mask()).toBe('CI93 •••• •••• •••• •••• •••• ••89');
        });

        it('should mask FR IBAN correctly', () => {
            const iban = IBAN.create('FR7630006000011234567890189');
            expect(iban.mask()).toBe('FR76 •••• •••• •••• •••• ••89');
        });

        it('should return original if too short', () => {
            const iban = IBAN.create('CI9312345');
            expect(iban.mask()).toBe('CI9312345');
        });
    });

    describe('formatting', () => {
        it('should format IBAN with spaces every 4 characters', () => {
            const iban = IBAN.create('CI93CI0080111301134291200589');
            expect(iban.formatted()).toBe('CI93 CI00 8011 1301 1342 9120 0589');
        });
    });

    describe('equality', () => {
        it('should detect equal IBANs', () => {
            const iban1 = IBAN.create('CI93CI0080111301134291200589');
            const iban2 = IBAN.create('CI93 CI00 8011 1301 1342 9120 0589');
            expect(iban1.equals(iban2)).toBe(true);
        });

        it('should detect unequal IBANs', () => {
            const iban1 = IBAN.create('CI93CI0080111301134291200589');
            const iban2 = IBAN.create('CI93CI0080111301134291200590');
            expect(iban1.equals(iban2)).toBe(false);
        });
    });
});
