// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

// render
frappe.listview_settings["Sales Invoice"] = {
	has_indicator_for_draft: true,
	has_indicator_for_cancelled: true,
	add_fields: [
		"customer",
		"customer_name",
		"base_grand_total",
		"outstanding_amount",
		"due_date",
		"company",
		"currency",
		"is_return",
	],
	get_indicator: function (doc) {
		const status_colors = {
			Draft: "blue",
			Unpaid: "orange",
			Paid: "green",
			Return: "gray",
			"Credit Note Issued": "cyan",
			"Unpaid and Discounted": "amber",
			"Partly Paid and Discounted": "light-blue",
			"Overdue and Discounted": "pink",
			Overdue: "red",
			"Partly Paid": "yellow",
			"Internal Transfer": "purple",
			Cancelled: "darkgrey",
		};

		if (doc.status === "Credit Note Issued" && flt(doc.outstanding_amount) === 0) {
			return [
				__("Settled with Credit Note"),
				"green",
				`status,=,Credit Note Issued|outstanding_amount,=,0`,
			];
		}

		return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
	},
	right_column: "grand_total",

	onload: function (listview) {
		if (frappe.model.can_create("Delivery Note")) {
			listview.page.add_action_item(__("Delivery Note"), () => {
				erpnext.bulk_transaction_processing.create(listview, "Sales Invoice", "Delivery Note");
			});
		}

		if (frappe.model.can_create("Payment Entry")) {
			listview.page.add_action_item(__("Payment"), () => {
				erpnext.bulk_transaction_processing.create(listview, "Sales Invoice", "Payment Entry");
			});
		}
	},
};
