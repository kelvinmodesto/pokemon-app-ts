import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="button-hover-effect bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-w-[40px] h-10 transition-all duration-300"
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="button-hover-effect bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-w-[40px] h-10 transition-all duration-300"
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getVisiblePages().map((page, index) => {
        if (page === "...") {
          return (
            <div
              key={`dots-${index}`}
              className="flex items-center justify-center min-w-[40px] h-10 text-gray-500"
            >
              <MoreHorizontal className="h-4 w-4" />
            </div>
          );
        }

        const isCurrentPage = currentPage === page;

        return (
          <Button
            key={page}
            variant={isCurrentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className={`button-hover-effect min-w-[40px] h-10 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isCurrentPage
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl border-0 font-semibold"
                : "bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white hover:border-gray-300 text-gray-700 hover:text-gray-900"
            }`}
            title={`Page ${page}`}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="button-hover-effect bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-w-[40px] h-10 transition-all duration-300"
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="button-hover-effect bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-w-[40px] h-10 transition-all duration-300"
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>

      <div className="hidden sm:flex items-center ml-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-white/30">
        <span className="text-sm text-gray-600 font-medium">
          Page{" "}
          <span className="font-semibold text-gray-800">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-800">{totalPages}</span>
        </span>
      </div>
    </div>
  );
};
