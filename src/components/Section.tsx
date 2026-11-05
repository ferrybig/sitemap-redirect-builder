import { ReactNode, RefObject, useId } from 'react';
import classes from './Section.module.css';

interface Section {
	sectionRef?: RefObject<HTMLElement>
	step: number
	title: string
	description?: ReactNode
	aside?: ReactNode
	children: ReactNode
	done?: boolean
}
function Section({ sectionRef, step, title, description, aside, children, done }: Section) {
	const headingId = useId();
	return (
		<section
			ref={sectionRef}
			tabIndex={-1}
			aria-labelledby={headingId}
			className={classes.root}
		>
			<header className={classes.header}>
				<span className={done ? classes.badgeDone : classes.badge} aria-hidden>{step}</span>
				<div className={classes.heading}>
					<h2 id={headingId} className={classes.title}>{title}</h2>
					{description && <p className={classes.description}>{description}</p>}
				</div>
				{aside && <div className={classes.aside}>{aside}</div>}
			</header>
			<div className={classes.body}>
				{children}
			</div>
		</section>
	);
}
export default Section;
