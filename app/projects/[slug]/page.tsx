import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import {supabase} from 'util/supabaseClient';

export const revalidate = 60;

type Props = {
	params: {
		slug: string;
	};
};

export async function generateStaticParams(): Promise<Props["params"][]> {
	return allProjects
		.filter((p) => p.published)
		.map((p) => ({
			slug: p.slug,
		}));
}

export default async function PostPage({ params }: Props) {
	const slug = params?.slug;
	const project = allProjects.find((project) => project.slug === slug);

	if (!project) {
		notFound();
	}
	let views = 0; // default value

	const { data, error } = await supabase
		.from('pageviews')
		.select('count')
		.eq('slug', slug);
	
	if (error) {
		console.error('Error fetching views: ', error);
	} else if (data && data.length > 0) {
		views = data[0].count;
	}
	

	return (
		<div className="bg-zinc-50 min-h-screen">
			<Header project={project} views={views} />
			<ReportView slug={project.slug} />

			<article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
			  {project.body && <Mdx code={project.body.code} />}
			</article>
		</div>
	);
}
