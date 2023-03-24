import { filterActionKind, IObjectTableFilter } from "@/types";
import { useEffect, useState } from "react";
import { objectProperties, hubspotFilterOperators } from "./utils";

export default function ObjectTableFilter({
	object,
	query,
	handleQuery,
	filter,
	handleFilter,
	setFilterDataToInput,
}: IObjectTableFilter) {
	const availableProperties =
		objectProperties[object as keyof typeof objectProperties].split(",");

	const [filterTypeToggle, setFilterTypeToggle] = useState(true);

	useEffect(() => {
		handleQuery("");
		handleFilter({
			type: filterActionKind.RESET_STATE,
		});
	}, [filterTypeToggle, handleQuery, handleFilter]);

	return (
		<div className="flex flex-col gap-y-1.5 items-start">
			<label className="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					value=""
					className="sr-only peer"
					checked={filterTypeToggle}
					onChange={() => setFilterTypeToggle(!filterTypeToggle)}
				/>
				<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
				<span className="ml-3 text-sm font-medium">Simple filter</span>
			</label>
			{filterTypeToggle ? (
				<div className="relative flex flex-wrap items-stretch">
					<input
						type="search"
						className="relative m-0 -mr-px block w-[1%] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
						placeholder="Filter"
						aria-label="Filter"
						value={query}
						onChange={(event) => handleQuery(event.target.value)}
					/>
				</div>
			) : (
				<div className="flex flex-row">
					<select
						className="m-2 cursor-pointer"
						value={filter.propertyName}
						onChange={(event) =>
							handleFilter({
								type: filterActionKind.CHANGE_PROPERTY,
								payload: event.target.value,
							})
						}
					>
						<option value="">Select property</option>
						{availableProperties.map((property) => (
							<option key={property} value={property}>
								{property}
							</option>
						))}
					</select>
					<div className="relative flex w-full flex-wrap items-stretch">
						<input
							type="search"
							className="relative m-0 -mr-px block w-[1%] min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
							placeholder="Filter"
							aria-label="Filter"
							value={filter.value}
							onChange={(event) =>
								handleFilter({
									type: filterActionKind.CHANGE_VALUE,
									payload: event.target.value,
								})
							}
						/>
					</div>
					<select
						className="m-2 cursor-pointer"
						value={filter.operator}
						onChange={(event) =>
							handleFilter({
								type: filterActionKind.CHANGE_OPERATOR,
								payload: event.target.value,
							})
						}
					>
						<option value="">Select operator</option>
						{hubspotFilterOperators.map((operator) => (
							<option key={operator} value={operator}>
								{operator}
							</option>
						))}
					</select>
				</div>
			)}
			<button
				className="bg-transparent hover:bg-grey-500 text-grey-700 font-semibold py-2 px-4 border border-black-500 rounded"
				onClick={() => setFilterDataToInput()}
			>
				Filter objects
			</button>
		</div>
	);
}
