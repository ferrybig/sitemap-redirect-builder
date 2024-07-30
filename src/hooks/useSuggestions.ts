import { useContext, useSyncExternalStore } from 'react';
import ReplacementSuggestionsContext from '../replacements/ReplacementSuggestionsContext';

export default function useSuggestions(from: string) {
	const context = useContext(ReplacementSuggestionsContext);
	if(!context) throw new Error('Context missing');
	const select = () => context.getSuggestionsForUrl(from);
	return useSyncExternalStore(context.onUpdate, select, select)
}