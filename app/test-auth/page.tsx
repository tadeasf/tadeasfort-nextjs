import Link from "next/link";
import React from "react";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Eye } from "lucide-react";
import {supabase} from 'util/supabaseClient';

export const revalidate = 60;
export default async function ProjectsPage() {
	let { data: viewsData, error } = await supabase
		.from('pageviews')
		.select('slug, count');
	if (error) {
		console.error("Error fetching pageviews:", error);
		viewsData = [];
	}
	const views = viewsData ? viewsData.reduce((acc: Record<string, number>, v: { slug: string, count: number }) => {
		acc[v.slug] = v.count;
		return acc;
	}, {} as Record<string, number>) : {};

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
				<div className="max-w-2xl mx-auto lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
						Projects
					</h2>
					<p className="mt-4 text-zinc-400">
						Some of the projects are from work and some are on my own time.
					</p>
				</div>
				<div className="w-full h-px bg-zinc-800" />
					</div>
				</div>
	);
}
