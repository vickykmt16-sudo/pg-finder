"use server";

export async function fetchAllUsersFromClerk() {
  try {
    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Hamesha fresh data layega
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();

    // Data ko aapki table ke hisaab se format kar rahe hain
    return users.map((user: any) => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || "User",
      email: user.email_addresses?.[0]?.email_address || "No Email",
      role: user.unsafe_metadata?.role || "Student",
      joined: new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' })
    }));
  } catch (error) {
    console.error("Clerk Admin Fetch Error:", error);
    return [];
  }
}