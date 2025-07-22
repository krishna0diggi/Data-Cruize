import React from 'react';

interface PaginatorProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  from: number;
  to: number;
  customizedPaginator?: boolean;
  isBlock?: boolean;

  onPageSizeChange: (event: { pageIndex: number; pageSize: number }) => void;
  onDecrement: (newIndex: number) => void;
  onIncrement: (newIndex: number) => void;
  onOverIncrement: (lastPage: number) => void;
  onOverDecrement: () => void;
}

const Paginator: React.FC<PaginatorProps> = ({
  pageIndex,
  pageSize,
  totalCount,
  from,
  to,
  customizedPaginator = false,
  isBlock = false,
  onPageSizeChange,
  onDecrement,
  onIncrement,
  onOverIncrement,
  onOverDecrement,
}) => {
  const pageSizes = [5, 10, 20];
  const lastPageIndex = Math.max(0, Math.ceil(totalCount / pageSize) - 1);

  // const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newSize = parseInt(e.target.value);
  //   const totalPages = Math.ceil(totalCount / newSize);
  //   const newPageIndex =
  //     pageIndex > totalPages ? Math.max(1, totalPages) : pageIndex;
  //   onPageSizeChange({ pageIndex: newPageIndex, pageSize: newSize });
  // };
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(event.target.value);
    onPageSizeChange?.({ pageIndex: 0, pageSize: newSize });
  };
  
  
  const handleDecrement = () => {
    if (pageIndex > 0) {
      onDecrement?.(pageIndex - 1);
    }
  };
  
  const handleIncrement = () => {
    if (pageIndex < lastPageIndex) {
      onIncrement?.(pageIndex + 1);
    }
  };

  const handleOverDecrement = () => {
    onOverDecrement?.();
  };

  const handleOverIncrement = () => {
    onOverIncrement?.(lastPageIndex);
  };
  

  if (customizedPaginator) return null;

  const iconStyle = (disabled: boolean) =>
    `cursor-${disabled ? 'not-allowed' : 'pointer'} ${
      disabled ? 'opacity-40' : 'hover:text-black'
    }`;

  return (
    <div
      className={`flex justify-end items-center h-12 p-4 gap-12 ${
        isBlock ? 'bg-deepPurple' : 'bg-gray-100'
      } rounded-b-[15px]`}
    >
      {/* Page Size Selector */}
      <div className="flex items-center">
        <span className="text-sm text-textColor whitespace-nowrap">
          Rows per page:
        </span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="ml-4 border-2 text-sm rounded-md w-16 h-9 text-textColor"
        >
          {pageSizes.map((item) => (
            <option  className="hover:bg-deepPurple hover:text-white" key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Range Info */}
      <div className="text-lg text-textColor whitespace-nowrap">
        {from} - {to} of {totalCount}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 items-center w-28 justify-between">
        {/* Over Decrement */}
        <button
          disabled={pageIndex === 0}
          onClick={handleOverDecrement}
          className={iconStyle(pageIndex === 0)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="M445-253.85 218.85-480 445-706.15 487.15-664 303.77-480l183.38 184L445-253.85Zm254 0L472.85-480 699-706.15 741.15-664 557.77-480l183.38 184L699-253.85Z"/>
          </svg>
        </button>

        {/* Decrement */}
        <button
          disabled={pageIndex === 0}
          onClick={handleDecrement}
          className={iconStyle(pageIndex === 0)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z"/>
          </svg>
        </button>

        {/* Increment */}
        <button
          disabled={pageIndex >= lastPageIndex}
          onClick={handleIncrement}
          className={iconStyle(pageIndex >= lastPageIndex)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z"/>
          </svg>
        </button>

        {/* Over Increment */}
        <button
          disabled={pageIndex >= lastPageIndex}
          onClick={handleOverIncrement}
          className={iconStyle(pageIndex >= lastPageIndex)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="M402.23-480 218.85-664 261-706.15 487.15-480 261-253.85 218.85-296l183.38-184Zm254 0L472.85-664 515-706.15 741.15-480 515-253.85 472.85-296l183.38-184Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
