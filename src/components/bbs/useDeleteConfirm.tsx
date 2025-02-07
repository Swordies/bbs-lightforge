
import { useState, useEffect } from "react";

export const useDeleteConfirm = () => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (deleteConfirmId) {
        setDeleteConfirmId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [deleteConfirmId]); // Added proper dependency array

  const handleDeleteClick = (postId: string, e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    return deleteConfirmId === postId;
  };

  return {
    deleteConfirmId,
    setDeleteConfirmId,
    handleDeleteClick,
  };
};
