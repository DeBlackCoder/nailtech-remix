export function validateBooking(body: Record<string, unknown>): string[] {
  const required = ["name", "phone", "service", "date", "time"];
  return required.filter(f => !body[f] || String(body[f]).trim() === "").map(f => `Missing required field: ${f}`);
}
export function validateComment(body: Record<string, unknown>): string[] {
  const required = ["name", "message"];
  const errors = required.filter(f => !body[f] || String(body[f]).trim() === "").map(f => `Missing required field: ${f}`);
  if (body.rating !== undefined && body.rating !== null) {
    const r = Number(body.rating);
    if (isNaN(r) || r < 1 || r > 5) errors.push("Rating must be between 1 and 5");
  }
  return errors;
}
