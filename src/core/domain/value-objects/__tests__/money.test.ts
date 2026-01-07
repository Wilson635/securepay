import { describe, it, expect } from 'vitest';
import { Money } from '../money';

describe('Money Value Object', () => {
    describe('creation', () => {
        it('should create money with valid amount and currency', () => {
            const money = Money.create(1000, 'XOF');
            expect(money.amount).toBe(1000);
            expect(money.currency).toBe('XOF');
        });

        it('should throw error for negative amount', () => {
            expect(() => Money.create(-100, 'EUR')).toThrow('Amount cannot be negative');
        });

        it('should create zero money', () => {
            const money = Money.zero('USD');
            expect(money.amount).toBe(0);
            expect(money.currency).toBe('USD');
        });
    });

    describe('formatting', () => {
        it('should format XOF without decimals', () => {
            const money = Money.create(1500000, 'XOF');
            const formatted = money.format();
            expect(formatted).toContain('1 500 000');
            expect(formatted).toContain('FCFA');
        });

        it('should format EUR with 2 decimals', () => {
            const money = Money.create(1500.5, 'EUR');
            const formatted = money.format();
            expect(formatted).toMatch(/1[\s]?500[,.]50/);
            expect(formatted).toContain('€');
        });

        it('should format USD with 2 decimals', () => {
            const money = Money.create(1500, 'USD');
            const formatted = money.format();
            expect(formatted).toMatch(/1[,]500\.00/);
            expect(formatted).toContain('$');
        });

        it('should handle zero amount', () => {
            const money = Money.zero('EUR');
            expect(money.format()).toMatch(/0[,.]00/);
        });
    });

    describe('comparison', () => {
        it('should detect equal money objects', () => {
            const money1 = Money.create(1000, 'EUR');
            const money2 = Money.create(1000, 'EUR');
            expect(money1.equals(money2)).toBe(true);
        });

        it('should detect unequal amounts', () => {
            const money1 = Money.create(1000, 'EUR');
            const money2 = Money.create(2000, 'EUR');
            expect(money1.equals(money2)).toBe(false);
        });

        it('should detect unequal currencies', () => {
            const money1 = Money.create(1000, 'EUR');
            const money2 = Money.create(1000, 'USD');
            expect(money1.equals(money2)).toBe(false);
        });

        it('should compare amounts correctly', () => {
            const money1 = Money.create(1000, 'EUR');
            const money2 = Money.create(2000, 'EUR');
            expect(money1.isGreaterThan(money2)).toBe(false);
            expect(money2.isGreaterThan(money1)).toBe(true);
        });

        it('should throw error when comparing different currencies', () => {
            const money1 = Money.create(1000, 'EUR');
            const money2 = Money.create(2000, 'USD');
            expect(() => money1.isGreaterThan(money2)).toThrow('Cannot compare amounts with different currencies');
        });
    });
});