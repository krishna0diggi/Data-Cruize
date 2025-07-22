import { useState } from "react";
import AddHyperscaler from "./AddHyperscaler";

export default function HyperScaler() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setDialogOpen(true)}
        className="rounded-md bg-gray-950/5 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
      >
        Add Category
      </button>

      <AddHyperscaler
        visible={isDialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
