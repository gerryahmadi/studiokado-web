// Fills {placeholders} in a dictionary string: format("Cart, {count} items", { count: 3 }).
// Unknown placeholders are left as they are so a missing value is visible rather than silent.
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

// Picks the singular or plural form from a { one, other } pair and fills {count} (plus any extra values).
export function plural(
  forms: { one: string; other: string },
  count: number,
  values: Record<string, string | number> = {},
): string {
  return format(count === 1 ? forms.one : forms.other, { count, ...values });
}
