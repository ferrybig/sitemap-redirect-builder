import { ReactNode, useEffect } from 'react';
import { Sitemap } from '../types';
import ReplacementSuggestionsContext from './ReplacementSuggestionsContext';
import useRefWithInit from '../hooks/useRefWithInit';
import webworkerInit from './webworkerInit';


interface ReplacementSuggestions {
	newSitemap: Sitemap;
	oldSitemap: Sitemap;
	children: ReactNode;
}
function ReplacementSuggestions({
	children,
	newSitemap,
	oldSitemap,
}: ReplacementSuggestions) {
	const context = useRefWithInit(webworkerInit);

	useEffect(() => {
		context.current.setSitemaps(oldSitemap, newSitemap);
	}, [context, oldSitemap, newSitemap])

	return (
		<ReplacementSuggestionsContext.Provider value={context.current}>
			{children}
		</ReplacementSuggestionsContext.Provider>
	)
}
export default ReplacementSuggestions