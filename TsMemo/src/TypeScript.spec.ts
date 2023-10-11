import { describe, it, expect } from "vitest"

// [リリースノート] https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-1.html

describe("TypeScript 2.2", () => {
    it("object型", () => {
        // object 型はプリミティブ型 (number, string, boolean, bigint, symbol, null, undefined) 以外の型を表す
        const obj: object = { a: 1 }
        expect(obj).toEqual({ a: 1 })
    })
})

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
