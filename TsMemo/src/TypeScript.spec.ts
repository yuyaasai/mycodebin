import { describe, it, expect } from "vitest"

describe("TypeScript 3.7", () => {
    it("asserts", () => {
        function assertIsString(value: unknown): asserts value is string {
            if (typeof value !== "string") throw new Error("Not a string!")
        }
        expect(() => {
            const numVal: unknown = 1
            assertIsString(numVal)
            numVal.toLowerCase() // コンパイルエラーにならなければOK
        }).toThrow("Not a string!")
    })
})

describe("TypeScript 5.0", () => {
    //
})

describe("TypeScript 5.1", () => {
    //
})

describe("TypeScript 5.2", () => {
    //
})
