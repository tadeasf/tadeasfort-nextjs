import { NextRequest, NextResponse } from "next/server";
import supabase from 'util/supabaseClient'

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
		const { data: isNew, error } = await supabase
			.from('deduplicate')
			.insert([
				{ hash: hash, slug: slug }
			], { upsert: true })
		if (error) {
			return new NextResponse("Error inserting data", { status: 500 });
		}
		if (!isNew) {
			new NextResponse(null, { status: 202 });
		}
	}
	const { data, error } = await supabase
		.from('pageviews')
		.update({ count: supabase.raw('count + 1') })
		.eq('slug', slug)
	if (error) {
		return new NextResponse("Error updating data", { status: 500 });
	}
	return new NextResponse(null, { status: 202 });
}
