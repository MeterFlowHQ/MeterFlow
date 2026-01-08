"use client";

import { useState, useRef, useEffect } from "react";
import { EditMeterForm } from "@/components/forms/edit-meter-form";
import { deleteMeter } from "@/app/admin/meters/actions";
import { useActionState } from "react";

type MeterStatus = "ENABLED" | "DISABLED" | "NOT_WORKING";

interface MeterActionsDropdownProps {
  meter: {
    id: string;
    meterCode: string;
    location: string;
    status: MeterStatus;
    assignedUserId: string | null;
    _count: {
      readings: number;
    };
  };
}

export function MeterActionsDropdown({ meter }: MeterActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, deleteAction, isDeleting] = useActionState(deleteMeter, undefined);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    setShowEditModal(true);
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete meter ${meter.meterCode}? This action cannot be undone.`)) {
      const formData = new FormData();
      formData.append("meterId", meter.id);
      deleteAction(formData);
    }
    setIsOpen(false);
  };

  const canDelete = meter._count.readings === 0;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Actions
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 z-10 mt-1 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              <button
                onClick={handleEdit}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete || isDeleting}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                title={!canDelete ? "Cannot delete meter with readings" : ""}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showEditModal && (
        <EditMeterForm 
          meter={meter} 
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
