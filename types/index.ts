import { Column } from "react-table";

export interface IObjectTableProps {
	object: string;
	headers: Column[];
}

export interface IObjectTableFilter {
	object: string;
	query: string;
	handleQuery: Function;
	filter: Filter;
	handleFilter: Function;
	fetchFilteredData: Function;
}

export enum filterActionKind {
	CHANGE_PROPERTY = "CHANGE_PROPERTY",
	CHANGE_OPERATOR = "CHANGE_OPERATOR",
	CHANGE_VALUE = "CHANGE_VALUE",
	DELETE_VALUE = "DELETE_VALUE",
	RESET_STATE = "RESET_STATE",
}

export interface FilterAction {
	type: filterActionKind;
	payload: string;
}

export interface Filter {
	value?: string;
	highValue?: string;
	values?: string[];
	propertyName: string;
	operator: string;
}

export interface FilterGroup {
	filters: Filter[];
}

export interface SearchObjectDto {
	filterGroups?: FilterGroup[];
	query?: string;
	sorts?: string[];
	properties?: string[];
	limit?: number;
	after?: number;
}
