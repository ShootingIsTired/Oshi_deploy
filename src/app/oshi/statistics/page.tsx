import StatPage from "./_components/statPage";

export default function statisticsPage() {
  return (
    <main className="h-full w-full overflow-auto bg-gray-100">
      <div className="p-10 space-y-10">
        <StatPage />
      </div>
    </main>
  );
}