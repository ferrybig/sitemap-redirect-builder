import { flushSync } from 'react-dom';
import { Dispatch, KeyboardEvent, ReactNode, SetStateAction, useId, useRef, useState } from 'react';
import { Replacement } from '../types';
import classes from './ReplacementRow.module.css';
import ui from '../components/ui.module.css';
import useSuggestions from '../hooks/useSuggestions';
import Icon from '../components/Icon';
import { ROW_ATTRIBUTE, focusNextRow } from './focusRow';

interface Option {
	name: string
	shortcut: string
	checked: boolean
	disabled?: boolean
	onSelect?: () => void
	children: ReactNode
	aside?: ReactNode
}
function Option({ name, shortcut, checked, disabled, onSelect, children, aside }: Option) {
	return (
		<label className={disabled ? classes.optionDisabled : checked ? classes.optionChecked : classes.option}>
			<input
				type="radio"
				className={classes.radio}
				name={name}
				checked={checked}
				disabled={disabled}
				onChange={onSelect}
				aria-keyshortcuts={shortcut}
			/>
			<span className={classes.optionLabel}>{children}</span>
			{aside}
			<kbd className={ui.kbd} aria-hidden>{shortcut}</kbd>
		</label>
	);
}

function Score({ value }: { value: number }) {
	const percent = Math.round(value * 100);
	return (
		<span className={classes.score} title={`${percent}% relevance`}>
			<span className={classes.scoreTrack}>
				<span className={classes.scoreFill} style={{ width: `${percent}%` }}/>
			</span>
			<span className={classes.scoreValue}>{percent}%</span>
		</span>
	);
}

interface ReplacementRow {
	from: string;
	replacement: Replacement | null;
	onChange: Dispatch<SetStateAction<Replacement[]>>;
	newUrlsId: string
	lost: boolean
}
function ReplacementRow({
	from,
	replacement: to,
	onChange,
	lost,
	newUrlsId,
}: ReplacementRow) {
	const fromId = useId();
	const otherId = useId();
	const rowRef = useRef<HTMLDivElement>(null);
	const otherInput = useRef<HTMLInputElement>(null);

	const topSuggestions = useSuggestions(from);
	const pickedTopSuggestion = topSuggestions.find(([url]) => url === to?.to);
	// Tracks if the user explicitly picked "Other", so typing a value that equals a suggestion keeps the custom field selected
	const [customMode, setCustomMode] = useState(false);
	const isCustom = typeof to?.to === 'string' && (customMode || !pickedTopSuggestion);

	function setState(setStateAction: SetStateAction<Replacement | null>, custom = false) {
		setCustomMode(custom);
		onChange((prevReplacements) => {
			const newReplacements = [...prevReplacements];
			const index = newReplacements.findIndex(replacement => replacement.from === from);
			const entry = setStateAction instanceof Function ? setStateAction(index >= 0 ? newReplacements[index] : null) : setStateAction;
			if (index === -1) {
				if (entry !== null) {
					newReplacements.push(entry);
				} else {
					return prevReplacements;
				}
			} else {
				if (entry === null) {
					newReplacements.splice(index, 1);
				} else {
					newReplacements[index] = entry;
				}
			}
			return newReplacements;
		});
	}
	function selectCustom() {
		// Render the prefilled value synchronously, so it can be selected and typing replaces it
		flushSync(() => setState(old => ({
			from,
			to: typeof old?.to === 'string' && isCustom ? old.to : '/',
		}), true));
		otherInput.current?.focus();
		otherInput.current?.select();
	}

	function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
		if (e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		if (e.target === otherInput.current) {
			if (e.key === 'Enter') {
				e.preventDefault();
				focusNextRow(rowRef.current);
			} else if (e.key === 'Escape') {
				e.preventDefault();
				rowRef.current?.focus();
			}
			return;
		}
		switch (e.key) {
		case '1':
		case '2':
		case '3': {
			const suggestion = topSuggestions[Number(e.key) - 1];
			if (!suggestion) return;
			e.preventDefault();
			setState({ from, to: suggestion[0] });
			focusNextRow(rowRef.current);
			break;
		}
		case 'g':
		case 'G':
			e.preventDefault();
			setState({ from, to: null });
			focusNextRow(rowRef.current);
			break;
		case 'i':
		case 'I':
			e.preventDefault();
			setState({ from, to: undefined });
			focusNextRow(rowRef.current);
			break;
		case '/':
			e.preventDefault();
			selectCustom();
			break;
		}
	}

	const name = 'from-' + from;
	return (
		<div
			ref={rowRef}
			className={to === null ? classes.rootUnmapped : classes.root}
			tabIndex={-1}
			onKeyDown={handleKeyDown}
			{...{ [ROW_ATTRIBUTE]: from }}
		>
			<div className={classes.head}>
				<code id={fromId} className={classes.from} title={from}>{from}</code>
				<div className={classes.status}>
					{lost && (
						<span className={ui.chipAccent} title="This rule is for a URL that is no longer missing from the new sitemap">
							Custom rule
						</span>
					)}
					{to === null ? (
						<span className={ui.chipDanger}>Needs mapping</span>
					) : to.to === null ? (
						<span className={ui.chipWarning}><Icon name="ban" size={12}/> 410 Gone</span>
					) : to.to === undefined ? (
						<span className={ui.chip}><Icon name="eyeOff" size={12}/> Ignored</span>
					) : (
						<span className={ui.chipSuccess}><Icon name="arrowRight" size={12}/> Redirect</span>
					)}
					<button
						type="button"
						className={`${ui.ghost} ${ui.small}`}
						disabled={to === null}
						onClick={() => setState(null)}
						title={lost ? 'Delete this rule' : 'Clear the choice for this URL'}
					>
						<Icon name={lost ? 'trash' : 'reset'} size={14}/>
						{lost ? 'Delete' : 'Reset'}
					</button>
				</div>
			</div>
			<div className={classes.options} role="radiogroup" aria-labelledby={fromId}>
				<div className={classes.group}>
					{[0, 1, 2].map((i) => topSuggestions.length > i ? (
						<Option
							key={i}
							name={name}
							shortcut={String(i + 1)}
							checked={!isCustom && to?.to === topSuggestions[i][0]}
							onSelect={() => setState({ from, to: topSuggestions[i][0] })}
							aside={<Score value={topSuggestions[i][1]}/>}
						>
							<code className={classes.url}>{topSuggestions[i][0]}</code>
						</Option>
					) : (
						<Option key={i} name={name} shortcut={String(i + 1)} checked={false} disabled>
							<em>No suggestion</em>
						</Option>
					))}
				</div>
				<div className={classes.group}>
					<Option
						name={name}
						shortcut="g"
						checked={to !== null && to.to === null}
						onSelect={() => setState({ from, to: null })}
					>
						Mark as gone <span className={classes.hint}>(410)</span>
					</Option>
					<Option
						name={name}
						shortcut="i"
						checked={to !== null && to.to === undefined}
						onSelect={() => setState({ from, to: undefined })}
					>
						Ignore <span className={classes.hint}>(no rule)</span>
					</Option>
					<div className={isCustom ? classes.customChecked : classes.custom}>
						<label className={classes.customLabel}>
							<input
								type="radio"
								className={classes.radio}
								name={name}
								checked={isCustom}
								onChange={selectCustom}
								aria-keyshortcuts="/"
							/>
							Other
						</label>
						<input
							ref={otherInput}
							id={otherId}
							className={classes.customInput}
							value={isCustom ? to?.to ?? '' : ''}
							placeholder="/new-url"
							onChange={e => setState({ from, to: e.target.value }, true)}
							list={newUrlsId}
							aria-label={`Custom redirect target for ${from}`}
							spellCheck={false}
							autoComplete="off"
						/>
						<kbd className={ui.kbd} aria-hidden>/</kbd>
					</div>
				</div>
			</div>
		</div>
	);
}
export default ReplacementRow
