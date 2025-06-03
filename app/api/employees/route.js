// app/api/employees/route.js

export async function GET() {
  try {
    const res = await fetch("http://localhost:5000/api/employees");
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ message: "Error fetching employees" }, { status: 500 });
  }
}
