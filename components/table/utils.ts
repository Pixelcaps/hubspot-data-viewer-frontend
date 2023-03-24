export const objectColumns = {
	companies: [
		{
			Header: "Name",
			accessor: "properties.name",
		},
		{
			Header: "Domain",
			accessor: "properties.domain",
		},
		{
			Header: "City",
			accessor: "properties.city",
		},
		{
			Header: "Country",
			accessor: "properties.country",
		},
	],
	contacts: [
		{
			Header: "First Name",
			accessor: "properties.firstname",
		},
		{
			Header: "Last Name",
			accessor: "properties.lastname",
		},
		{
			Header: "Email",
			accessor: "properties.email",
		},
		{
			Header: "Company",
			accessor: "properties.company",
		},
	],
	deals: [
		{
			Header: "Deal Name",
			accessor: "properties.dealname",
		},
		{
			Header: "Deal State",
			accessor: "properties.dealstage",
		},
		{
			Header: "Amount",
			accessor: "properties.amount",
			Cell: (props: { value: number | bigint }) =>
				new Intl.NumberFormat("en-GB", {
					style: "currency",
					currency: "USD",
				}).format(props.value),
		},
	],
};

export enum objectProperties {
	companies = "name,domain,city,country",
	contacts = "firstname,lastname,email,company",
	deals = "dealname,dealstage,amount",
}

export const hubspotFilterOperators = [
	"LT",
	"LTE",
	"GT",
	"GTE",
	"EQ",
	"NEQ",
	"HAS_PROPERTY",
	"NOT_HAS_PROPERTY",
	"CONTAINS_TOKEN",
	"NOT_CONTAINS_TOKEN",
];
