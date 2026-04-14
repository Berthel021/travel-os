import { NextRequest, NextResponse } from "next/server";
import { generateItinerary } from "@/lib/claude";
import { processItineraryResponse } from "@/lib/processItinerary";
import { generateTripLinks } from "@/lib/linkGenerator";
import { trackItineraryGenerated } from "@/lib/analytics";
import { generateRequestId } from "@/lib/utils";

export interface ItineraryResponse {
  success: true;
  itinerary: {
    raw: string;
    title: string;
    overview: string;
    wordCount: number;
    generatedAt: string;
  };
  links: Record<string, unknown[]>;
  requestId: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  requestId: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ItineraryResponse | ErrorResponse>> {
  const requestId = generateRequestId();

  try {
    const body = await request.json();
    const { destination, origin, budget, travelers, duration, travelStyle, specialRequests, sessionId } = body;

    if (!destination || !origin || !budget || !travelers) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          code: "VALIDATION_ERROR",
          requestId,
        },
        { status: 400 }
      );
    }

    const startGenerate = Date.now();
    const result = await generateItinerary({
      destination,
      origin,
      budget,
      travelers: parseInt(travelers, 10),
      duration: duration ? parseInt(duration, 10) : 7,
      travelStyle: travelStyle || "balanced",
      specialRequests: specialRequests || "",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          code: result.code,
          requestId,
        },
        { status: 500 }
      );
    }

    const processed = processItineraryResponse(result.itinerary);

    const links = generateTripLinks({
      destination,
      origin,
      travelers: parseInt(travelers, 10),
    });

    const durationMs = Date.now() - startGenerate;
    trackItineraryGenerated({
      destination,
      origin,
      budget,
      travelers: parseInt(travelers, 10),
      durationMs,
      itineraryId: requestId,
      sessionId,
    }).catch((err) => console.warn("[Analytics] Failed to track event:", err));

    return NextResponse.json(
      {
        success: true,
        itinerary: {
          raw: processed.raw,
          title: processed.title,
          overview: processed.overview,
          wordCount: processed.wordCount,
          generatedAt: processed.generatedAt,
        },
        links,
        requestId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[API] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
        code: "INTERNAL_ERROR",
        requestId,
      },
      { status: 500 }
    );
  }
}