export async function updateUserPAN(clerkId: string, pan: string) {
  try {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId, pan }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error };
  }
}