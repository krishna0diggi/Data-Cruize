import React, { useState } from 'react';
import { Laptop, Mouse, Tablet, Monitor, Keyboard, PrinterCheck, History, Ellipsis, SquarePen, Trash2, User, Eye, RefreshCcw } from 'lucide-react';
import Paginator from './Paginator';

const AssetStatusDisplayMap = {
    assigned: 'Assigned',
    repair: 'Under-Repair',
    not_assigned: 'Not-Assigned',
    new: 'New',
    expired: 'Expired',
};

const getStatusColor = (status: string) => {
    const colors: Record<string, { color: string; bg: string }> = {
        Expired: { color: 'text-red-700', bg: 'bg-red-100' },
        'Not-Assigned': { color: 'text-yellow-700', bg: 'bg-yellow-100' },
        'Under-Repair': { color: 'text-orange-700', bg: 'bg-orange-100' },
        Assigned: { color: 'text-green-700', bg: 'bg-green-100' },
        New: { color: 'text-blue-700', bg: 'bg-blue-100' },
    };
    return colors[status] || { color: 'text-gray-700', bg: 'bg-gray-100' };
};


interface Column {
    id: string;
    label: string;
}

interface DataTableProps {
    columns: Column[];
    rows: any[];
    onEdit?: (row: any) => void;
    onAssignedAsset?: (row: any) => void;
    onDelete?: (row: any) => void;
    onInfo?: (row: any) => void;
    onHistory?: (row: any) => void;
    onChangeStatus?: (row: any) => void;
    onToggleStatus?: (row: any) => void;
    onRowSelect?: (row: any) => void;
    onRowClick?: (row: any) => void;
    withCheckbox?: boolean;
    pageIndex?: number;
    pageSize?: number;
    totalCount?: number;
    onPageSizeChange?: (event: { pageIndex: number; pageSize: number }) => void;
    onDecrement?: (newIndex: number) => void;
    onIncrement?: (newIndex: number) => void;
    onOverDecrement?: () => void;
    onOverIncrement?: (lastPage: number) => void;
    from?: number;
    to?: number;
    customizedPaginator?: boolean;
    isBlock?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    rows,
    onEdit,
    onAssignedAsset,
    onDelete,
    onInfo,
    onHistory,
    onChangeStatus,
    onToggleStatus,
    onRowSelect,
    onRowClick,
    withCheckbox = false,
    pageIndex = 0,
    pageSize = 5,
    totalCount,
    onPageSizeChange,
    onDecrement,
    onIncrement,
    onOverDecrement,
    onOverIncrement,
    from = 1,
    to = 5,
}) => {
    console.log(rows);
    console.log(columns);
    
    
    const [selected, setSelected] = useState<any[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('');
    const [menuRow, setMenuRow] = useState<any | null>(null);

    const handleSort = (field: string) => {
        const isAsc = orderBy === field && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(field);
    };


    const sortedRows = React.useMemo(() => {
        if (!orderBy) return rows;
        return [...rows].sort((a, b) => {
            const valA = a[orderBy];
            const valB = b[orderBy];
            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [rows, order, orderBy]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSelected = e.target.checked ? rows : [];
        setSelected(newSelected);
        if (onRowSelect) {
            newSelected.forEach(row => onRowSelect(row));
        }
    };

    const handleSelectRow = (row: any) => {
        const newSelected = selected.includes(row)
            ? selected.filter((item) => item !== row)
            : [...selected, row];
        setSelected(newSelected);
        if (onRowSelect) {
            onRowSelect(row);
        }
    };

    const isRowSelected = (row: any) => selected.includes(row);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setMenuRow(null);
        if (menuRow) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [menuRow]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
                        <tr>
                            {withCheckbox && (
                                <th className="p-3 text-left">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selected.length === rows.length && rows.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className="p-3 text-left font-medium text-gray-900 cursor-pointer select-none hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort(col.id)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{col.label}</span>
                                        {orderBy === col.id && (
                                            <span className="text-blue-600 font-bold">
                                                {order === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onInfo || onEdit || onDelete || onAssignedAsset || onHistory || onChangeStatus) && (
                                <th className="p-3 text-center font-medium text-gray-900">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedRows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + (withCheckbox ? 1 : 0) + ((onInfo || onEdit || onDelete || onAssignedAsset || onHistory || onChangeStatus) ? 1 : 0)}
                                    className="text-center p-8 text-gray-500"
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Tablet size={24} className="text-gray-400" />
                                        </div>
                                        <span>No records found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {sortedRows.map((row, idx) => (
                            <tr
                                key={idx}
                                className={`hover:bg-gray-50 transition-colors ${isRowSelected(row) ? 'bg-blue-50 border-blue-200' : ''
                                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => onRowClick?.(row)}
                            >
                                {withCheckbox && (
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={isRowSelected(row)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleSelectRow(row);
                                            }}
                                        />
                                    </td>
                                )}
                                {columns.map((col) => (
                                    <td key={col.id} className="p-3 text-gray-900">
                                        {col.id === 'status' ? (
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(AssetStatusDisplayMap[row.status as keyof typeof AssetStatusDisplayMap] || row.status).bg
                                                    } ${getStatusColor(AssetStatusDisplayMap[row.status as keyof typeof AssetStatusDisplayMap] || row.status).color
                                                    }`}
                                            >
                                                {AssetStatusDisplayMap[row.status as keyof typeof AssetStatusDisplayMap] || row.status}
                                            </span>
                                        ) : (
                                            <span className="text-gray-900">{row[col.id] ?? '-'}</span>
                                        )}
                                    </td>
                                ))}
                                {(onInfo || onEdit || onDelete || onAssignedAsset || onHistory || onChangeStatus) && (
                                    <td className="p-3 text-center relative">
                                        <button
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuRow(menuRow === row ? null : row);
                                            }}
                                        >
                                            <Ellipsis size={18} className="text-gray-600" />
                                        </button>
                                        {menuRow === row && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                                <div className="py-1">
                                                    {onInfo && (
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMenuRow(null);
                                                                onInfo(row);
                                                            }}
                                                        >
                                                            <Eye size={16} />
                                                            <span>View Details</span>
                                                        </button>
                                                    )}
                                                    {onEdit && (
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMenuRow(null);
                                                                onEdit(row);
                                                            }}
                                                        >
                                                            <SquarePen size={16} />
                                                            <span>Edit</span>
                                                        </button>
                                                    )}
                                                    {onChangeStatus && (
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMenuRow(null);
                                                                onChangeStatus(row);
                                                            }}
                                                        >
                                                            <RefreshCcw size={16} />
                                                            <span>Change Status</span>
                                                        </button>
                                                    )}
                                                    {onHistory && (
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMenuRow(null);
                                                                onHistory(row);
                                                            }}
                                                        >
                                                            <History size={16} />
                                                            <span>Asset History</span>
                                                        </button>
                                                    )}
                                                    {onAssignedAsset && (row.status === "not_assigned" || row.status === 'new') && (
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMenuRow(null);
                                                                onAssignedAsset(row);
                                                            }}
                                                        >
                                                            <User size={16} />
                                                            <span>Assign</span>
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <>
                                                            <hr className="my-1" />
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMenuRow(null);
                                                                    onDelete(row);
                                                                }}
                                                            >
                                                                <Trash2 size={16} />
                                                                <span>Delete</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t bg-gray-50 px-4 py-2">
                <Paginator
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={totalCount ?? rows.length}
                    onPageSizeChange={onPageSizeChange ?? (() => { })}
                    onDecrement={onDecrement ?? (() => { })}
                    onIncrement={onIncrement ?? (() => { })}
                    onOverIncrement={onOverIncrement ?? (() => { })}
                    onOverDecrement={onOverDecrement ?? (() => { })}
                    from={from}
                    to={to}
                />
            </div>

        </div>
    );
};

export default DataTable;