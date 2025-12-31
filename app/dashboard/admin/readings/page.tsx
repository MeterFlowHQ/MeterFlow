export default function AdminReadingsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-gray-900">All readings</h1>
      <p className="text-gray-600">
        Admin-only: review, search, and filter all meter readings. Validation and meter access enforcement will be server-side.
      </p>
    </section>
  );
}
