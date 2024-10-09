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

describe("TypeScript 4.9", () => {
    it("satisfies", () => {
        const obj = { x: 1 } satisfies { x?: number }
        // as を利用すると obj.x は number | undefined 型になるためコンパイルエラーになる
        // satisfies を利用すると obj.x は number 型になる
        const target = obj.x.toFixed(1)
        expect(target).toBe("1.0")
    })
})

// describe("TypeScript 5.0", () => {
// declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
// declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
// declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
// declare type ParameterDecorator = (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
// it("Method Decorator", () => {
//     const decorator = (originalMethod: (...args: any[]) => any, _context: any) => {
//         return (this: any, ...args: any[]) => {
//             console.log("🔥")
//             const result = originalMethod.apply(this, args)
//             console.log("🔥🔥🔥🔥🔥🔥🔥")
//             return result
//         }
//     }
//     const hoge = 1234
//     hoge.toExponential(1)
// })
// })

describe("TypeScript 5.2", () => {
    it("using: リソース破棄", async () => {
        let disposed = false
        // eslint-disable-next-line no-lone-blocks
        {
            using usingTester: Disposable = { [Symbol.dispose]: () => (disposed = true) }
            void usingTester
        }
        expect(disposed).toBe(true)
    })
    it("await using: リソース破棄 (非同期)", async () => {
        let disposed = false
        // eslint-disable-next-line no-lone-blocks
        {
            await using asyncUsingTester: AsyncDisposable = {
                [Symbol.asyncDispose]: async () => {
                    disposed = true
                }
            }
            void asyncUsingTester
        }
        expect(disposed).toBe(true)
    })
})
