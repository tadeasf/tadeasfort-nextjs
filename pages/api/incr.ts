import { NextRequest, NextResponse } from "next/server";
import {supabase} from 'util/supabaseClient'

export const config = {
	runtime: "edge",
};

export default async function incr(req: NextRequest): Promise<NextResponse> {
	if (req.method !== "POST") {
		return new NextResponse("use POST", { status: 405 });
	}
	if (req.headers.get("Content-Type") !== "application/json") {
		return new NextResponse("must be json", { status: 400 });
	}

	const body = await req.json();
	let slug: string | undefined = undefined;
	if ("slug" in body) {
		slug = body.slug;
	}
	if (!slug) {
		return new NextResponse("Slug not found", { status: 400 });
	}
	const ip = req.ip;
	if (ip) {
		// Hash the IP in order to not store it directly in your db.
		const buf = await crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(ip),
		);
		const hash = Array.from(new Uint8Array(buf))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		// deduplicate the ip for each slug
		const { error: upsertError } = await supabase
			.from('deduplicate')
			.upsert([
				{ hash: hash, slug: slug }
			]);
		if (upsertError) {
			return new NextResponse("Error inserting data", { status: 500 });
		}
	}
	// Fetch the current count
	const { data: currentData, error: fetchError } = await supabase
		.from('pageviews')
		.select('count')
		.eq('slug', slug);

	if (fetchError) {
		return new NextResponse("Error fetching data", { status: 500 });
	}

	// Increment the count
	const newCount = currentData[0].count + 1;

	// Update the row with the new count
	const { error: updateError } = await supabase
		.from('pageviews')
		.update({ count: newCount })
		.eq('slug', slug);

	if (updateError) {
		return new NextResponse("Error updating data", { status: 500 });
	}
	return new NextResponse(null, { status: 202 });
}
