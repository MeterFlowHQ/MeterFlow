"use client";

import { useActionState } from "react";
import { uploadProfileImage } from "./actions";

interface ImageUploadFormProps {
  currentImage: string | null;
}

export function ImageUploadForm({ currentImage }: ImageUploadFormProps) {
  const [state, action, isPending] = useActionState(uploadProfileImage, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-600">
          Upload New Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          required
          className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
        />
        <p className="mt-1 text-xs text-gray-600">
          JPEG, PNG, or WebP. Max 5MB.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Profile image uploaded successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {isPending ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  );
}
