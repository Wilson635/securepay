import { describe, it, expect } from 'vitest';
import { TransactionId } from '../transaction-id';

describe('TransactionId Value Object', () => {
    describe('creation', () => {
        it('should create valid transaction ID', () => {
            const id = TransactionId.create('txn_00001');
            expect(id.value).toBe('txn_00001');
        });

        it('should throw error for empty ID', () => {
            expect(() => TransactionId.create('')).toThrow('Transaction ID cannot be empty');
            expect(() => TransactionId.create('   ')).toThrow('Transaction ID cannot be empty');
        });

        it('should throw error for invalid format', () => {
            expect(() => TransactionId.create('invalid')).toThrow('Invalid Transaction ID format');
            expect(() => TransactionId.create('txn_123')).toThrow('Invalid Transaction ID format');
            expect(() => TransactionId.create('txn_1234567')).toThrow('Invalid Transaction ID format');
        });
    });

    describe('generation', () => {
        it('should generate ID with correct format', () => {
            const id = TransactionId.generate(1);
            expect(id.value).toBe('txn_00001');
        });

        it('should pad with zeros correctly', () => {
            expect(TransactionId.generate(1).value).toBe('txn_00001');
            expect(TransactionId.generate(42).value).toBe('txn_00042');
            expect(TransactionId.generate(12345).value).toBe('txn_12345');
        });
    });

    describe('equality', () => {
        it('should detect equal IDs', () => {
            const id1 = TransactionId.create('txn_00001');
            const id2 = TransactionId.create('txn_00001');
            expect(id1.equals(id2)).toBe(true);
        });

        it('should detect unequal IDs', () => {
            const id1 = TransactionId.create('txn_00001');
            const id2 = TransactionId.create('txn_00002');
            expect(id1.equals(id2)).toBe(false);
        });
    });
});