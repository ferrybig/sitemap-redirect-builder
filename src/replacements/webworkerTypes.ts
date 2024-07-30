export type MessageFromWorker =
| {
	type: 'results',
	mutationId: number
	results: readonly [string,  readonly (readonly [string, number])[]][]
	processed: number,
}
| {
	type: 'started',
	mutationId: number,
}

export type MessageToWorker =
| {
	type: 'stop',
}
| {
	type: 'reset',
	mutationId: number,
	old: readonly string[],
	new: readonly string[]
}