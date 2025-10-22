import { Spinner } from "../ui/spinner";

interface IProp {
  isLoading?: boolean;
}

export default function Loader({ isLoading = true }: IProp) {
  return (
    isLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  );
}
