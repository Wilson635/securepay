export abstract class TransactionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class TransactionNotFoundError extends TransactionError {
    constructor(id: string) {
        super(`Transaction with ID ${id} not found`);
    }
}

export class InvalidAmountRangeError extends TransactionError {
    constructor() {
        super('Minimum amount cannot be greater than maximum amount');
    }
}

export class InvalidDateRangeError extends TransactionError {
    constructor() {
        super('Start date cannot be after end date');
    }
}

export class TransactionCannotBeRetriedError extends TransactionError {
    constructor(id: string) {
        super(`Transaction ${id} cannot be retried. Only failed transactions can be retried.`);
    }
}

export class TransactionCannotBeCancelledError extends TransactionError {
    constructor(id: string) {
        super(`Transaction ${id} cannot be cancelled. Only pending transactions can be cancelled.`);
    }
}

export class ExportLimitExceededError extends TransactionError {
    constructor(count: number, limit: number) {
        super(`Cannot export ${count} transactions. Maximum limit is ${limit}.`);
    }
}