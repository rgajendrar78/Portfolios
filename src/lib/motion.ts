/** Stagger delay for the nth item of a row, as the `--d` the entrance styles read. */
export const stagger = (index: number, perRow: number) => ({ "--d": `${(index % perRow) * 80}ms` });
