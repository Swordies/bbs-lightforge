
import { useState, useEffect } from "react";

export const useDeleteConfirm = () => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      if (deleteConfirmId) {
        setDeleteConfirmId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [deleteConfirmId]);

  const handleDeleteClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    return deleteConfirmId === postId;
  };

  return {
    deleteConfirmId,
    setDeleteConfirmId,
    handleDeleteClick,
  };
};

