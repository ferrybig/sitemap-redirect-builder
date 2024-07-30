import { HtmlHTMLAttributes, MouseEvent } from 'react';

interface LinkButton extends HtmlHTMLAttributes<HTMLButtonElement> {
	onClick: (e: MouseEvent<HTMLButtonElement>) => void
}
function LinkButton(props: LinkButton) {
	return (
		<button {...props}/>
	)
}
export default LinkButton;