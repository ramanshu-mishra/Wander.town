export default function ErrorToast({ message }: { message?: string }) {
  const m = message ?? "Something went Wrong";
  return (
    <div className="flex justify-center items-center  text-neutral-800 ">
      {m}
    </div>
  );
}