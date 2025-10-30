import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Expected env vars:
// - KYC_API_BASE: Base URL of the third-party KYC API (e.g., https://api.kycprovider.com)
// - KYC_API_KEY: API key for authenticating with the third-party KYC API
// - KYC_SUCCESS_REDIRECT: Where to send users after successful verification (e.g., /)
// - KYC_FAILURE_REDIRECT: Where to send users after failed verification (e.g., /login)

const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const status = url.searchParams.get("status");
	const referenceId = url.searchParams.get("referenceId");
	const token = url.searchParams.get("token");

	// If no params are present, immediately ACK so third-party callbacks succeed.
	if (!referenceId || !token) {
		return new NextResponse("ACK", {
			status: 200,
			headers: { "content-type": "text/plain; charset=utf-8" },
		});
	}

	const apiBase = process.env.KYC_API_BASE;
	const apiKey = process.env.KYC_API_KEY;
	const successRedirect = process.env.KYC_SUCCESS_REDIRECT || "/";
	const failureRedirect = process.env.KYC_FAILURE_REDIRECT || "/login";

	if (!apiBase || !apiKey) {
		return NextResponse.json(
			{ error: "KYC API not configured" },
			{ status: 500 }
		);
	}

	try {
		// Call third-party to verify the KYC result and obtain a session id
		const verifyUrl = new URL("/verify", apiBase);
		verifyUrl.searchParams.set("referenceId", referenceId);
		verifyUrl.searchParams.set("token", token);
		if (status) verifyUrl.searchParams.set("status", status);

		const response = await fetch(verifyUrl.toString(), {
			method: "GET",
			headers: {
				"accept": "application/json",
				"x-api-key": apiKey,
			},
			// Keep timeouts sane in serverless
			cache: "no-store",
		});

		if (!response.ok) {
			// If the provider gives a message, forward a minimal hint in query for failure path
			const hint = encodeURIComponent(`${response.status}`);
			return NextResponse.redirect(`${failureRedirect}?error=${hint}`);
		}

		const data = (await response.json()) as {
			sessionId?: string;
			userId?: string;
			message?: string;
		};

		if (!data.sessionId) {
			const hint = encodeURIComponent("no_session_id");
			return NextResponse.redirect(`${failureRedirect}?error=${hint}`);
		}

		// Set secure, HTTP-only cookie for the session
		const cookieStore = await cookies();
		cookieStore.set("rme_session", data.sessionId, {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			maxAge: ONE_WEEK_SECONDS,
		});

		return NextResponse.redirect(successRedirect);
	} catch {
		// Avoid leaking internals, just redirect with a minimal hint
		const hint = encodeURIComponent("exception");
		return NextResponse.redirect(`${failureRedirect}?error=${hint}`);
	}
}

export const dynamic = "force-dynamic";

