import { NextRequest, NextResponse } from "next/server";

export interface ApiVersion {
  version: string;
  supported: boolean;
  deprecated?: boolean;
  sunsetDate?: string;
}

export const API_VERSIONS: Record<string, ApiVersion> = {
  v1: {
    version: "v1",
    supported: true,
    deprecated: false,
  },
  v2: {
    version: "v2",
    supported: true,
    deprecated: false,
  },
  v3: {
    version: "v3",
    supported: false,
    deprecated: true,
    sunsetDate: "2025-12-31",
  },
};

export function getApiVersion(request: NextRequest): string | null {
  const pathname = request.nextUrl.pathname;
  const versionMatch = pathname.match(/^\/api\/(v\d+)\//);
  return versionMatch ? versionMatch[1] : null;
}

export function validateApiVersion(request: NextRequest): NextResponse | null {
  const version = getApiVersion(request);

  if (!version) {
    return new NextResponse(
      JSON.stringify({
        error: "API version required",
        message:
          "Please specify an API version in the URL (e.g., /api/v1/endpoint)",
        supportedVersions: Object.keys(API_VERSIONS).filter(
          (v) => API_VERSIONS[v].supported
        ),
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "X-API-Versions": Object.keys(API_VERSIONS).join(", "),
        },
      }
    );
  }

  const versionInfo = API_VERSIONS[version];

  if (!versionInfo) {
    return new NextResponse(
      JSON.stringify({
        error: "Unsupported API version",
        message: `API version '${version}' is not supported`,
        supportedVersions: Object.keys(API_VERSIONS).filter(
          (v) => API_VERSIONS[v].supported
        ),
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "X-API-Versions": Object.keys(API_VERSIONS).join(", "),
        },
      }
    );
  }

  if (!versionInfo.supported) {
    return new NextResponse(
      JSON.stringify({
        error: "API version not supported",
        message: `API version '${version}' is no longer supported`,
        supportedVersions: Object.keys(API_VERSIONS).filter(
          (v) => API_VERSIONS[v].supported
        ),
        ...(versionInfo.sunsetDate && { sunsetDate: versionInfo.sunsetDate }),
      }),
      {
        status: 410,
        headers: {
          "Content-Type": "application/json",
          "X-API-Versions": Object.keys(API_VERSIONS).join(", "),
        },
      }
    );
  }

  // Add version headers for supported versions
  const response = NextResponse.next();
  response.headers.set("X-API-Version", version);

  if (versionInfo.deprecated) {
    response.headers.set("X-API-Deprecated", "true");
    if (versionInfo.sunsetDate) {
      response.headers.set("X-API-Sunset", versionInfo.sunsetDate);
    }
  }

  return null;
}

export function createVersionedApiHandler(
  handler: (request: NextRequest, version: string) => Promise<NextResponse>
) {
  return async function versionedHandler(request: NextRequest) {
    // Validate API version
    const versionError = validateApiVersion(request);
    if (versionError) {
      return versionError;
    }

    const version = getApiVersion(request)!;
    return handler(request, version);
  };
}
