interface CoachResponse {
  text?: string;
  error?: string;
}

export async function requestCoachReport(prompt: string): Promise<string> {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = (await res.json().catch(() => ({}))) as CoachResponse;

  if (!res.ok) {
    throw new Error(data.error || "Unable to generate the nutrition report.");
  }

  if (!data.text?.trim()) {
    throw new Error("The AI response was empty.");
  }

  return data.text;
}
