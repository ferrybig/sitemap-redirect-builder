import { useRef } from 'react';

const empty = Symbol('useRefWithInit');

export default function useRefWithInit<T>(init: () => T): { readonly current: T } {
	const ref = useRef<T | typeof empty>(empty);
	if(ref.current === empty) {
		ref.current = init();
	}
	return ref as { readonly current: T };
}