type Props = {
  params: {
    id: string;
  };
};

export default function BoostJobPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-[#f5f6f8] p-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="mb-4 text-4xl font-bold">Boost Job #{params.id}</h1>
        <p className="text-lg text-slate-600">
        </p>
      </div>
    </main>
  );
}