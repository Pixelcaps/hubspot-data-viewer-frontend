import useHubspot from "@/hooks/useHubspot";
import { Filter, filterActionKind, IObjectTableProps } from "@/types";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useQuery } from "react-query";
import { useTable, usePagination, Column } from "react-table";
import LoadingSpinner from "../shared/LoadingSpinner";
import ObjectTableFilter from "./ObjectTableFilter";
import { filterReducer, initialFilterState, objectProperties } from "./utils";

export default function ObjectTable({ object, headers }: IObjectTableProps) {
	const { getObjects, filterObjects } = useHubspot();

	const [queryPageIndex, setQueryPageIndex] = useState(0);
	const [queryPageSize, setQueryPageSize] = useState(10);
	const [afterId, setAfterId] = useState(undefined);

	const [queryInput, setQueryInput] = useState("");
	const [filterInput, setFilterInput] = useReducer(
		filterReducer,
		initialFilterState
	);

	const [filterObjectsTotalCount, setFilterObjectsTotalCount] = useState(0);

	const [queryData, setQueryData] = useState("");
	const [filterData, setFilterData] = useReducer(
		filterReducer,
		initialFilterState
	);

	const { isLoading, error, data, isSuccess } = useQuery(
		[object, queryPageIndex, queryPageSize, queryData, filterData],
		() => fetchObjects(queryPageSize, afterId, queryData, filterData),
		{
			keepPreviousData: true,
			staleTime: Infinity,
		}
	);

	const fetchObjects = async (
		limit?: number,
		after?: string,
		query?: string,
		filter?: Filter
	) => {
		try {
			if (query) {
				const response = await filterObjects(object, {
					limit,
					after: queryPageIndex * queryPageSize,
					query,
					properties:
						objectProperties[
							object as keyof typeof objectProperties
						].split(","),
				});

				setFilterObjectsTotalCount(response.total);
				return response.results;
			} else if (
				filter &&
				Object.values(filter).some((property) => !!property)
			) {
				const response = await filterObjects(object, {
					limit,
					after: queryPageIndex * queryPageSize,
					filterGroups: [{ filters: [filter] }],
					properties:
						objectProperties[
							object as keyof typeof objectProperties
						].split(","),
				});
				setFilterObjectsTotalCount(response.total);
				return response.results;
			} else {
				const response = await getObjects(
					object,
					limit,
					after,
					objectProperties[object as keyof typeof objectProperties]
				);

				setAfterId(response.paging.next.after);
				return response.results;
			}
		} catch (e) {
			throw new Error(`API error:${e}`);
		}
	};

	const setFilterDataToInput = () => {
		gotoPage(0);
		if (queryInput) {
			setQueryData(queryInput);
		} else if (Object.values(filterInput).some((property) => !!property)) {
			setFilterData({
				type: filterActionKind.CHANGE_PROPERTY,
				payload: filterInput.propertyName,
			});
			setFilterData({
				type: filterActionKind.CHANGE_OPERATOR,
				payload: filterInput.operator,
			});
			filterInput.value
				? setFilterData({
						type: filterActionKind.CHANGE_VALUE,
						payload: filterInput.value,
				  })
				: setFilterData({
						type: filterActionKind.DELETE_VALUE,
						payload: "",
				  });
		}
	};

	const columns: Array<Column> = useMemo(() => headers, [headers]);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		nextPage,
		previousPage,
		gotoPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data: isSuccess ? data : [],
			initialState: {
				pageIndex: queryPageIndex,
				pageSize: queryPageSize,
			},
			manualPagination: true,
			pageCount:
				filterObjectsTotalCount > 0
					? Math.ceil(filterObjectsTotalCount / queryPageSize)
					: -1,
		},
		usePagination
	);

	useEffect(() => {
		setQueryPageIndex(pageIndex);
	}, [pageIndex]);

	useEffect(() => {
		setQueryPageSize(pageSize);
		gotoPage(0);
		setAfterId(undefined);
	}, [pageSize, gotoPage]);

	useEffect(() => {
		if (!queryInput) {
			setQueryData("");
			gotoPage(0);
			setFilterObjectsTotalCount(0);
		}
	}, [queryInput, gotoPage]);

	useEffect(() => {
		if (Object.values(filterInput).every((property) => !property)) {
			setFilterData({
				type: filterActionKind.RESET_STATE,
				payload: "",
			});
			gotoPage(0);
			setFilterObjectsTotalCount(0);
		}
	}, [filterInput, gotoPage]);

	if (error) {
		return (
			<p>
				Error while loading table for object {object}, please refresh.
			</p>
		);
	}

	return (
		<>
			<h1 className="text-xl font-semibold">
				{object.charAt(0).toUpperCase() + object.slice(1)}
			</h1>
			<ObjectTableFilter
				object={object}
				query={queryInput}
				handleQuery={setQueryInput}
				filter={filterInput}
				handleFilter={setFilterInput}
				setFilterDataToInput={setFilterDataToInput}
			></ObjectTableFilter>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className="mt-4 flex flex-col">
					<div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
						<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
							<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
								<table
									{...getTableProps()}
									className="min-w-full divide-y divide-gray-200"
								>
									<thead className="bg-gray-50">
										{headerGroups.map((headerGroup) => {
											const { key, ...restHeaderProps } =
												headerGroup.getHeaderGroupProps();

											return (
												<tr
													key={key}
													{...restHeaderProps}
												>
													{headerGroup.headers.map(
														(column) => {
															const {
																key,
																...restColumnProps
															} =
																column.getHeaderProps();

															return (
																<th
																	key={key}
																	{...restColumnProps}
																	className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																>
																	{column.render(
																		"Header"
																	)}
																</th>
															);
														}
													)}
												</tr>
											);
										})}
									</thead>
									<tbody
										{...getTableBodyProps()}
										className="bg-white divide-y divide-gray-200"
									>
										{page.map((row) => {
											prepareRow(row);
											const { key, ...restRowProps } =
												row.getRowProps();
											return (
												<tr key={key} {...restRowProps}>
													{row.cells.map((cell) => {
														const {
															key,
															...restCellProps
														} = cell.getCellProps();
														return (
															<td
																key={key}
																{...restCellProps}
																className="px-6 py-4 whitespace-nowrap"
															>
																{cell.render(
																	"Cell"
																)}
															</td>
														);
													})}
												</tr>
											);
										})}
									</tbody>
								</table>
								<div className="py-3 flex items-center justify-between">
									<div className="inline-flex m-2">
										<button
											className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 cursor-pointer"
											onClick={() => previousPage()}
											disabled={!canPreviousPage}
										>
											Prev
										</button>
										<button
											className="px-4 py-2 text-sm font-medium rounded hover:bg-gray-100 cursor-pointer"
											onClick={() => nextPage()}
											disabled={!canNextPage}
										>
											Next
										</button>
									</div>
									<select
										className="m-2 cursor-pointer"
										value={pageSize}
										onChange={(e) => {
											setPageSize(Number(e.target.value));
										}}
									>
										{[10, 20, 30, 40, 50].map(
											(pageSize) => (
												<option
													key={pageSize}
													value={pageSize}
												>
													Show {pageSize}
												</option>
											)
										)}
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
