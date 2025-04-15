import "@testing-library/jest-dom";

// Add TextEncoder polyfill
if (typeof TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
  global.TextDecoder = require("util").TextDecoder;
}

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock next/server
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, options) => ({
      body,
      options,
    })),
  },
  NextRequest: jest.fn().mockImplementation((input, init) => ({
    json: jest.fn().mockResolvedValue(input || {}),
  })),
}));
