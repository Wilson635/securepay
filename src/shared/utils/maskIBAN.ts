const maskIBAN = (iban: string): string => {
    const cleaned = iban.replace(/\s/g, '');
    if (cleaned.length < 8) return iban;

    const first4 = cleaned.slice(0, 4);
    const last2 = cleaned.slice(-2);
    const middleLength = cleaned.length - 6;
    const maskedGroups = Math.ceil(middleLength / 4);
    const maskedMiddle = Array(maskedGroups).fill('••••').join(' ');

    return `${first4} ${maskedMiddle} ••${last2}`;
};

export default maskIBAN;