import { jest, describe, test, expect } from "@jest/globals";

describe("Simple Test Suite", () => {
  test("should pass a basic test", () => {
    expect(1 + 1).toBe(2);
    console.log("Basic test passed");
  });

  test("should mock a function", () => {
    const mockFn = jest.fn().mockReturnValue(42);
    expect(mockFn()).toBe(42);
    expect(mockFn).toHaveBeenCalled();
    console.log("Mock function test passed");
  });
});

console.log("Running simple tests...");
