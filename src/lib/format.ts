/** "3" → "03", for step and card numbers. */
export const pad = (value: number) => String(value).padStart(2, "0");
