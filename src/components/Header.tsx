import { RefObject } from 'react';
import classes from './Header.module.css';
import Icon from './Icon';

export interface Step {
	label: string
	detail: string
	done: boolean
	targetRef: RefObject<HTMLElement>
}

interface Header {
	steps: Step[]
}
function Header({ steps }: Header) {
	const current = steps.findIndex(step => !step.done);
	return (
		<header className={classes.root}>
			<div className={classes.inner}>
				<a className={classes.brand} href="#top">
					<img src="./favicon.svg" width={28} height={28} alt=""/>
					<span className={classes.brandName}>Sitemap redirect builder</span>
				</a>
				<nav aria-label="Progress">
					<ol className={classes.steps}>
						{steps.map((step, i) => (
							<li key={step.label} className={classes.stepItem}>
								<button
									type="button"
									className={
										step.done ? classes.stepDone :
										i === current ? classes.stepCurrent :
										classes.step
									}
									aria-current={i === current ? 'step' : undefined}
									onClick={() => {
										const target = step.targetRef.current;
										if (!target) return;
										target.scrollIntoView({ block: 'start' });
										target.focus({ preventScroll: true });
									}}
								>
									<span className={classes.stepIndicator} aria-hidden>
										{step.done ? <Icon name="check" size={14}/> : i + 1}
									</span>
									<span className={classes.stepText}>
										<span className={classes.stepLabel}>{step.label}</span>
										<span className={classes.stepDetail}>{step.detail}</span>
									</span>
								</button>
							</li>
						))}
					</ol>
				</nav>
			</div>
		</header>
	);
}
export default Header;
