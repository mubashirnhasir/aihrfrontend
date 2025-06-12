export async function GET() {
  try {
    const res = await fetch("http://localhost:5000/api/employees");
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("Error fetching employees:", err);
    return Response.json({ message: "Error fetching employees", error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ message: "Error creating employee" }, { status: 500 });
  }
}
