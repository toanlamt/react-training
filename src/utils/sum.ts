
/**
 * Calculates the sum of the `amount` property from an array of items.
 *
 * @param items - An array of objects, each containing an `amount` property.
 *                The `amount` property is expected to be a value that can be parsed as a float.
 * @returns The total sum of the `amount` values from the provided items.
 *          If an item's `amount` cannot be parsed as a float, it is treated as 0.
 */
export const sum = (items: any[]) =>
    items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);