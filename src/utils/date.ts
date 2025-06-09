/**
 * Converts a Date object to the format YYYY-MM-DD in local time.
 */
export const toLocalDateString = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

/**
 * Converts a YYYY-MM-DD string to a Date object (local time).
 */
export const fromDateString = (dateStr: string): Date => {
    const [yyyy, mm, dd] = dateStr.split("-").map(Number);
    return new Date(yyyy, mm - 1, dd);
};

/**
 * Calculates age from a date of birth in the format YYYY-MM-DD.
 */
export const calculateAge = (dobStr: string): number => {
    if (!dobStr) return 0;
    const dob = fromDateString(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthday =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    if (!hasHadBirthday) age--;
    return age >= 0 ? age : 0;
};