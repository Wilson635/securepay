export type Currency = 'XOF' | 'EUR' | 'USD'

export class Money {
    public readonly amount: number
    public readonly currency: Currency

    private constructor(amount: number, currency: Currency) {
        if (amount < 0) {
            throw new Error('Amount cannot be negative')
        }

        this.amount = amount
        this.currency = currency
    }

    static create(amount: number, currency: Currency): Money {
        return new Money(amount, currency)
    }

    static zero(currency: Currency): Money {
        return new Money(0, currency)
    }

    format(): string {
        const config: Record<
            Currency,
            { locale: string; options: Intl.NumberFormatOptions }
        > = {
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
        }

        const { locale, options } = config[this.currency]
        const formatted = new Intl.NumberFormat(locale, options).format(this.amount)

        return this.currency === 'XOF'
            ? formatted.replace('XOF', 'FCFA')
            : formatted
    }

    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency
    }

    isGreaterThan(other: Money): boolean {
        if (this.currency !== other.currency) {
            throw new Error('Cannot compare amounts with different currencies')
        }
        return this.amount > other.amount
    }
}
