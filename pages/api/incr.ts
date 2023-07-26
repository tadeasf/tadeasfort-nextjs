import { NextRequest, NextResponse } from "next/server";
import {supabase} from 'util/supabaseClient'

export const config = {
	runtime: "edge",
};

export default async function incr(req: NextRequest): Promise<NextResponse> {
	console.log('Received a request to /api/incr');

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
	console.log(`Slug: ${slug}`);

	const ip = req.ip;
	console.log(`IP: ${ip}`);
	if (ip) {
		// Hash the IP in order to not store it directly in your db.
		const buf = await crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(ip),
		);
		const hash = Array.from(new Uint8Array(buf))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		console.log(`Hash: ${hash}`);

		// deduplicate the ip for each slug
		const { error: upsertError } = await supabase
			.from('deduplicate')
			.upsert([
				{ hash: hash, slug: slug }
			]);
		if (upsertError) {
			console.error('Error inserting data:', upsertError);
			return new NextResponse("Error inserting data", { status: 500 });
		}
	}

	// Fetch the current count
	const { data: currentData, error: fetchError } = await supabase
		.from('pageviews')
		.select('count')
		.eq('slug', slug);

	if (fetchError) {
		console.error('Error fetching data:', fetchError);
		return new NextResponse("Error fetching data", { status: 500 });
	}

	// If the slug doesn't exist in the pageviews table, insert a new row
	if (!currentData || currentData.length === 0) {
		const { error: insertError } = await supabase
			.from('pageviews')
			.insert([{ slug: slug, count: 1 }]);
		if (insertError) {
			console.error('Error inserting data:', insertError);
			return new NextResponse("Error inserting data", { status: 500 });
		}
		return new NextResponse(null, { status: 202 });
	}

	// Increment the count
	const newCount = currentData[0].count + 1;

	// Update the row with the new count
	const { error: updateError } = await supabase
		.from('pageviews')
		.update({ count: newCount })
		.eq('slug', slug);

	if (updateError) {
		console.error('Error updating data:', updateError);
		return new NextResponse("Error updating data", { status: 500 });
	}
	return new NextResponse(null, { status: 202 });
}
