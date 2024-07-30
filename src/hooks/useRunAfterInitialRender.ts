let list: (() => void)[] | null = typeof window === 'undefined' ? null : [];

export default function useRunAfterInitialRender(callback: () => void) {
	list?.push(callback);
}

export function runTasks() {
	if (list) {
		const oldList = list;
		list = null;
		for(const task of oldList) {
			task();
		}
	}
}