export const ROW_ATTRIBUTE = 'data-replacement-row';

function getRows() {
	return Array.from(document.querySelectorAll<HTMLElement>(`[${ROW_ATTRIBUTE}]`));
}

export function focusRow(row: HTMLElement | null | undefined) {
	if (!row) return false;
	row.focus({ preventScroll: true });
	row.scrollIntoView({ block: 'nearest' });
	return true;
}

export function focusRowByUrl(url: string) {
	return focusRow(getRows().find(row => row.getAttribute(ROW_ATTRIBUTE) === url));
}

export function focusNextRow(current: HTMLElement | null) {
	const rows = getRows();
	const index = current ? rows.indexOf(current) : -1;
	return focusRow(rows[index + 1]);
}
