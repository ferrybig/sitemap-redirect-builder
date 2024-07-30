import { RefObject } from 'react';
import classes from './NextSectionButton.module.css';


interface NextSectionButton {
	nextRef: RefObject<HTMLElement>
	children: string
	enabled: boolean
}
function NextSectionButton ({children, nextRef, enabled}: NextSectionButton) {
	return (
		<button
			className={enabled ? classes.rootEnabled : classes.root}
			onClick={() => {
				if (enabled) {
					nextRef.current?.scrollIntoView();
					nextRef.current?.focus();
				}
			}}
		>
			<strong className={classes.title}>Next step: </strong>
			<span className={classes.subTitle}>{children}</span>
		</button>
	)
}
export default NextSectionButton;