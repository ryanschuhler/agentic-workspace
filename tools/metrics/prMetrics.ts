/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable no-console */

import {execFileSync} from 'node:child_process';

export type PullRequest = {
	author: {login: string};
	comments: unknown[];
	createdAt: string;
	mergedAt: string;
	reviews: {author: {login: string}; body: string}[];
};

export type Metrics = {
	authorsPerMonth: Record<string, number>;
	leadTimeHours: {median: number; p75: number};
	prsPerAuthorPerMonth: Record<string, number>;
	reviewCommentsPerPr: number;
	shippedPerWeek: Record<string, number>;
};

function percentile(values: number[], fraction: number): number {
	if (!values.length) {
		return 0;
	}

	const sorted = [...values].sort((a, b) => a - b);

	return sorted[
		Math.min(sorted.length - 1, Math.floor(fraction * sorted.length))
	];
}

function isoWeek(date: Date): string {
	const thursday = new Date(date);

	thursday.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));

	const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
	const week = Math.ceil(
		((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
	);

	return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function computeMetrics(pullRequests: PullRequest[]): Metrics {
	const shippedPerWeek: Record<string, number> = {};
	const prsPerMonth: Record<string, number> = {};
	const authors: Record<string, Set<string>> = {};

	for (const pullRequest of pullRequests) {
		const mergedAt = new Date(pullRequest.mergedAt);
		const week = isoWeek(mergedAt);
		const month = pullRequest.mergedAt.slice(0, 7);

		shippedPerWeek[week] = (shippedPerWeek[week] ?? 0) + 1;
		prsPerMonth[month] = (prsPerMonth[month] ?? 0) + 1;
		(authors[month] ??= new Set()).add(pullRequest.author.login);
	}

	const leadTimes = pullRequests.map(
		(pullRequest) =>
			(new Date(pullRequest.mergedAt).getTime() -
				new Date(pullRequest.createdAt).getTime()) /
			3600000,
	);

	const reviewComments = pullRequests.map(
		(pullRequest) =>
			pullRequest.comments.length +
			pullRequest.reviews.filter((review) => review.body).length,
	);

	return {
		authorsPerMonth: Object.fromEntries(
			Object.entries(authors).map(([month, logins]) => [
				month,
				logins.size,
			]),
		),
		leadTimeHours: {
			median: percentile(leadTimes, 0.5),
			p75: percentile(leadTimes, 0.75),
		},
		prsPerAuthorPerMonth: Object.fromEntries(
			Object.entries(prsPerMonth).map(([month, count]) => [
				month,
				count / authors[month].size,
			]),
		),
		reviewCommentsPerPr: reviewComments.length
			? reviewComments.reduce((sum, count) => sum + count, 0) /
				reviewComments.length
			: 0,
		shippedPerWeek,
	};
}

function main(): number {
	const repoIndex = process.argv.indexOf('--repo');
	const limitIndex = process.argv.indexOf('--limit');

	const args = [
		'pr',
		'list',
		'--json',
		'author,comments,createdAt,mergedAt,reviews',
		'--limit',
		limitIndex === -1 ? '500' : process.argv[limitIndex + 1],
		'--state',
		'merged',
	];

	if (repoIndex !== -1) {
		args.push('--repo', process.argv[repoIndex + 1]);
	}

	const metrics = computeMetrics(
		JSON.parse(execFileSync('gh', args, {encoding: 'utf8'})),
	);

	console.log('## Delivery Metrics\n');
	console.log(
		`The median lead time from open to merge is ${metrics.leadTimeHours.median.toFixed(1)} hours, and the p75 is ${metrics.leadTimeHours.p75.toFixed(1)} hours.`,
	);
	console.log(
		`A PR gets ${metrics.reviewCommentsPerPr.toFixed(1)} review comments on average. Read it next to the change failure rate, because fewer comments is good only when fewer changes fail.\n`,
	);
	console.log('| Month | Authors | PRs per Author |\n| --- | --- | --- |');

	for (const month of Object.keys(metrics.authorsPerMonth).sort()) {
		console.log(
			`| ${month} | ${metrics.authorsPerMonth[month]} | ${metrics.prsPerAuthorPerMonth[month].toFixed(1)} |`,
		);
	}

	console.log('\n| Week | Shipped PRs |\n| --- | --- |');

	for (const week of Object.keys(metrics.shippedPerWeek).sort()) {
		console.log(`| ${week} | ${metrics.shippedPerWeek[week]} |`);
	}

	return 0;
}

if (import.meta.main) {
	process.exit(main());
}
