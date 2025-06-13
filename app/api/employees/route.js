export async function GET() {
  try {
    // Add retry logic for intermittent connection issues
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        const res = await fetch("http://localhost:5000/api/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        return Response.json(data);
      } catch (err) {
        lastError = err;
        retries--;

        if (retries > 0) {
          console.log(
            `Retrying request to backend... ${retries} attempts left`
          );
          // Wait 500ms before retry
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    throw lastError;
  } catch (err) {
    console.error("Error fetching employees:", err);
    return Response.json(
      {
        message: "Error fetching employees",
        error: err.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json(
      { message: "Error creating employee" },
      { status: 500 }
    );
  }
}
