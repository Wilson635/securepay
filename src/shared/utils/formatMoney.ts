import type {Currency} from "../types";

const formatMoney = (amount: number, currency: Currency): string => {
    const config: Record<Currency, { locale: string; options: Intl.NumberFormatOptions }> = {
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
    };

    const { locale, options } = config[currency];
    const formatted = new Intl.NumberFormat(locale, options).format(amount);
    return currency === 'XOF' ? formatted.replace('XOF', 'FCFA') : formatted;
};

export default formatMoney;