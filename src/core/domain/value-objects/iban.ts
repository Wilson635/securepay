export class IBAN {
    public readonly value: string

    private constructor(value: string) {
        this.value = value
    }
    
    static create(value: string): IBAN {
        const cleaned = value.replace(/\s/g, '');

        if (cleaned.length < 15 || cleaned.length > 34) {
            throw new Error('Invalid IBAN length');
        }

        if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned)) {
            throw new Error('Invalid IBAN format');
        }

        return new IBAN(cleaned);
    }

    mask(): string {
        const cleaned = this.value;
        if (cleaned.length < 8) return this.value;

        const first4 = cleaned.slice(0, 4);
        const last2 = cleaned.slice(-2);
        const middleLength = cleaned.length - 6;
        const maskedGroups = Math.ceil(middleLength / 4);
        const maskedMiddle = Array(maskedGroups).fill('••••').join(' ');

        return `${first4} ${maskedMiddle} ••${last2}`;
    }

    formatted(): string {
        return this.value.match(/.{1,4}/g)?.join(' ') || this.value;
    }

    equals(other: IBAN): boolean {
        return this.value === other.value;
    }
}