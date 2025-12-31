"use client";

import { useActionState, useState, useEffect } from "react";
import { updateMeter } from "@/app/dashboard/admin/meters/actions";

type MeterStatus = "ENABLED" | "DISABLED" | "NOT_WORKING";

interface EditMeterFormProps {
  meter: {
    id: string;
    meterCode: string;
    location: string;
    status: MeterStatus;
  };
  onClose?: () => void;
}

export function EditMeterForm({ meter, onClose }: EditMeterFormProps) {
  const [state, action, isPending] = useActionState(updateMeter, undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Close modal on successful submission
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          setIsEditing(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, onClose]);

  const handleClose = () => {
    setIsEditing(false);
    onClose?.();
  };

  // If onClose is provided, show the modal directly (controlled mode)
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Edit Meter</h3>
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <form action={action} className="space-y-4">
            <input type="hidden" name="meterId" value={meter.id} />

            <div>
              <label htmlFor="meterCode" className="block text-sm font-medium text-gray-700">
                Meter Code
              </label>
              <input
                type="text"
                id="meterCode"
                name="meterCode"
                required
                maxLength={50}
                defaultValue={meter.meterCode}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                maxLength={200}
                defaultValue={meter.location}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue={meter.status}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="ENABLED">Enabled</option>
                <option value="DISABLED">Disabled</option>
                <option value="NOT_WORKING">Not Working</option>
              </select>
            </div>

            {state?.error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
            )}

            {state?.success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                Meter updated successfully!
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Original uncontrolled mode
  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-emerald-600 hover:text-emerald-700"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit Meter</h3>
          <button
            onClick={handleClose}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form action={action} className="space-y-4">
          <input type="hidden" name="meterId" value={meter.id} />

          <div>
            <label htmlFor="meterCode" className="block text-sm font-medium text-gray-700">
              Meter Code
            </label>
            <input
              type="text"
              id="meterCode"
              name="meterCode"
              required
              maxLength={50}
              defaultValue={meter.meterCode}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              maxLength={200}
              defaultValue={meter.location}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue={meter.status}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ENABLED">Enabled</option>
              <option value="DISABLED">Disabled</option>
              <option value="NOT_WORKING">Not Working</option>
            </select>
          </div>

          {state?.error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
          )}

          {state?.success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
              Meter updated successfully!
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
