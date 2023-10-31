import { type InspectOptions } from "util"
import {
    type RuntimeConfig,
    type TestContext,
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    vitest,
    describe,
    it,
    expect,
    type Mock,
    type SpyInstance
} from "vitest"

// Jestからの移行については https://vitest.dev/guide/migration.html を読む
const ifJest: boolean = false
const jest: any = {}

/*
 * TODO
[Expect · Jest](https://jestjs.io/ja/docs/expect#expectextendmatchers)
[Jestの曖昧な比較 - Qiita](https://qiita.com/pirosikick/items/cb9419a1233e8f316b88)
[JestでTypeScriptを高速化 esbuildやswc](https://miyauchi.dev/ja/posts/speeding-up-jest/)
[jest useFakeTimers - Google 検索](https://www.google.com/search?q=jest+useFakeTimers&rlz=1C1GCEU_jaJP1000JP1001)
[Jest再入門 - 関数・モジュールモック編 | 豆蔵デベロッパーサイト](https://developer.mamezou-tech.com/testing/jest/jest-mock/)
[なぜJestのmockライブラリに混乱してしまうのか？ - Qiita](https://qiita.com/s_karuta/items/ee211251d944e72b2517)
[Jest · 🃏 Delightful JavaScript Testing](https://jestjs.io/ja/)
 */

if (ifJest) {
    jest.setTimeout(34567) // ミリ秒を指定 (既定値は5秒)
} else {
    const config: RuntimeConfig = {
        testTimeout: 34567
    }
    vitest.setConfig(config)
}

;(() => {
    //
    // TypeScriptの勉強
    //
    if ("".length === 0) {
        const foo = (bar: string) => 2000

        // typeof {関数} で関数を型に変換
        const a: typeof foo = (num: string) => parseInt(num, 10)
        a("12")

        // ReturnType<typeof {関数}> で関数の戻り値を型に変換
        const b: ReturnType<typeof foo> = 1

        // ReturnType<typeof {関数}> extends Promise<infer R> ? R : never 非同期関数の戻り値Promise<T>のT型に変換
        const hoge = async (num: number) => [1, 2, 3, b]
        const c: ReturnType<typeof hoge> extends Promise<infer R> ? R : never = [4]
        c.pop()
    }
    if ("".length === 0) {
        //
        // "is" の使い方
        //
        const isLiteralUnionEnum = <TLiteralUnionEnum>(
            x: unknown,
            unionEnums: readonly TLiteralUnionEnum[]
        ): x is TLiteralUnionEnum => unionEnums.includes(x as never)

        const LITERAL_UNION_ENUMS = ["foobar", 2000] as const
        const val = 2000
        if (isLiteralUnionEnum(val, LITERAL_UNION_ENUMS)) {
            // このブロックでは val は 2000 として推論されるため、下記のコードでエラーにならない
            // ※2000ではない場合はTypeScriptのエラーとなる
            console.log(123 * val)
        }
    }
})()

/*
import axios from "axios"
jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>
test("tsで型安全にmockを取得する方法", async () => {
    axiosMock.get.mockResolvedValue({ data: "typedMockTest" })
    expect(axios.get()).resolves.toBe("typedMockTest") // eslint-disable-line
})
 */

/**
 * 強制的にテストを失敗させる関数はないので throw new Error("msg") などで失敗させる
 */

/**
 * (before|after)(All|Each) 関数 引数は(ctx: TextContext, timeoutInMs)で4つとも同じ
 * Jestの場合は (before|after)(All|Each) 引数は(fn, timeoutInMs)で4つとも同じ
 *     これらは describe 内に書くことでスコープを分割することもできる (vitest の場合は？)
 */
beforeAll(() => {
    /* 最初に実行される */
})
beforeEach(async (ctx: TestContext) => {
    /* テスト毎に最初に実行される */
    // jest の場合は doneCallback を引数に取る関数を渡せたが vitest には無い (替わりに Promise を返すことで非同期処理を実行できる)
    ctx.expect("MyConfig").not.toBeNull()
})
afterAll(() => {
    /* すべてのテスト完了後、最後に実行される */
})

describe("xstylishAws", () => {
    it.todo("TODOを書くだけ。後ろに関数を渡すとエラーになって機能しない")

    it.todo(
        "[TypeScript+Jestでテストを書くときに型安全にモックする方法を教えてほしかった - みどりのさるのエンジニア](https://t-yng.jp/post/jest-typescript-types)"
    )
    it.todo("Date(日時日付時刻)のモック: https://github.com/sinonjs/fake-timers")
    it.todo(".mock(): [ES6 クラスのモック · Jest](https://jestjs.io/ja/docs/es6-class-mocks)")
    it.todo("mockFn.withImplementation")
    it.todo("jest.Spied って何…マニュアル見てもよくわからん")

    // skip と only: describe.skip, test.skip はテストをしない。 describe.only, test.only はonlyが指定してあるテストのみ実行(他はskipする)

    const make = (x: any) => [x, x, x, x, x, x, x, x]
    it.concurrent.each([make("X"), make(3.7), make(new Date()), make({ a: 1 })])(
        "書式: #%# %%p:%p %%s:%s %%d:%d %%i:%i %%f:%f %%j:%j %%o:%o ",
        (val) => {
            // %# - テスト番号,  %p - pretty-format, %j - json, %o - object
        }
    )

    it.concurrent("テストの並列実行", () => {
        // Jestはファイルはデフォルトで並列実行される (直列にする場合は --runInBand オプション)
        // 各テストは (test|it).concurrent の場合は直列実行される
    })
    it.only("vitest.fnによるコールバック関数呼び出しのテスト", async () => {
        const pass139 = (fn: (dat: { nyam: number }) => void) => {
            // テスト対象の関数
            fn({ nyam: 1 })
            fn({ nyam: 3 })
            fn({ nyam: 9 })
        }
        let total = 0
        // 下記の書き方は jest.fn(fn) の省略形とjestにある、がTypeScriptで書くと
        // mockImplementationは jest.Mock<any, any> 型となり型推論されないので jest.fn(fn) のほうが良いだろう
        const spy: Mock<[dat: { nyam: number }], { total: number }> = vitest.fn(
            (dat: { nyam: number }) => {
                total += dat.nyam
                return { total }
            }
        )

        pass139(spy)

        expect(spy.mock.calls.length).toBe(3) // .mock.calls はcallbackに渡されたargumentsの配列
        expect(spy).toBeCalledTimes(3) // 上と等価
        expect(spy).toHaveBeenCalledTimes(3) // 上と等価。 toHaveBeenCalledなんとかは他のライブラリに合わせたエイリアスだそう

        expect(spy).toBeCalledWith({ nyam: 9 }) // toBeCalledWith
        expect(spy).toBeCalledWith({ nyam: 1 }) //   spyに渡された値のテスト (順不同)
        expect(spy).nthCalledWith(2, { nyam: 3 }) // 2番目に呼び出されたときの引数 (引数がn個ある場合は第n+1引数に指定)
        expect(spy.mock.calls[1]?.[0]).toEqual({ nyam: 3 }) // 上と等価

        expect(spy).toReturn() // spyが一度は戻り値を返したかどうか
        expect(spy).toReturnTimes(3) // spyが戻り値を返した回数 (undefined返してもカウントされる。toBeCalledTimesとの違いはthrowで関数を抜けた場合にカウントされないこと)
        expect(spy).toReturnWith({ total: 4 }) // 戻り値に含まれる値があるか(toEqualで)チェック
        expect(spy.mock.results[0]?.type).toBe("return") //  .mock.results は戻り値の配列 Array({ type: "return" | "throw" | "incomplete", value: any })
        expect(spy.mock.results[0]?.value).toEqual({ total: 1 })
        expect(spy).nthReturnedWith(3, { total: 1 + 3 + 9 }) // 3番目に返された値
        expect(spy.mock.results[2]?.value).toEqual({ total: 1 + 3 + 9 }) // 上と等価
        // TODO: spy.mock.instances
        // TODO: spy.mock.invocationCallOrder
        // TODO: spy.mock.lastCall

        // expect(Promise) による非同期関数のテスト
        const cry = async (isThrow: boolean) => {
            if (isThrow) {
                throw new Error("meow")
            } else {
                return "bowwow"
            }
        }
        await expect(/* awaitせずPromiseを渡す */ cry(false)).resolves.toBe("bowwow")
        await expect(cry(true)).rejects.toThrow("meow") // resolvesとrejectsを使う場合はexpectの左にawaitが必要なので注意

        // mock名 (テスト結果の出力で利用される)
        expect(spy.getMockName()).toBe("spy") // Jest の場合 .toBe("jest.fn()")
        spy.mockName("foobar")
        expect(spy.getMockName()).toBe("foobar")
    })

    it.only("vitest.spyOn.mockImplementation(Once)の動作確認", async () => {
        const target = { get: () => "origin" }
        const getSpy = vitest.spyOn(target, "get") // spyは実装を置き換えられる (jest.fnは単にコールバック関数として使う)
        expect(getSpy.getMockName()).toBe("get") // Jest だと .toBe("jest.fn()")
        expect(target.get()).toBe("origin") // ⚠ spyOnのみでmockImplementationしないと元の実装が呼び出される

        getSpy.mockImplementationOnce(() => "once 1")
        expect(target.get()).toBe("once 1")
        expect(target.get()).toBe("origin")

        getSpy.mockImplementation(() => "mock 1")
        getSpy.mockImplementationOnce(() => "once 2")
        getSpy.mockImplementation(() => "mock 2")
        getSpy.mockImplementationOnce(() => "once 3")
        expect(target.get()).toBe("once 2")
        expect(target.get()).toBe("once 3")
        expect(target.get()).toBe("mock 2")
        expect(target.get()).toBe("mock 2")
        expect(getSpy).toBeCalledTimes(7)

        getSpy.mockClear() // getSpy.mock.(calls|instances|contexts|results) を初期化する
        expect(target.get()).toBe("mock 2")
        expect(getSpy).toBeCalledTimes(1)

        getSpy.mockReset() // モックされた戻り値または実装も削除 + mockClear
        expect(target.get()).toBe(undefined) // 実装が削除されると () => undefined になる
        expect(getSpy).toBeCalledTimes(1)

        getSpy.mockRestore() // spyOnされたモックを元のオブジェクトの状態に戻す
        expect(target.get()).toBe("origin")
        getSpy.mockImplementation(() => "mock 3")
        expect(target.get()).toBe("origin") // mockRestoreするとmockImplementationが効かない (spyが使えなくなる)
    })

    it("custom matcher: 任意のマッチャーを定義できる", () => {
        expect.extend({
            toBeDividable(received: any, expected: any, _options: any) {
                const { isNot } = this
                return {
                    pass: received % expected === 0,
                    message: () =>
                        `${received} is${isNot === true ? " not" : ""} dividable by ${expected}`
                    // (optional) actualとexpectedを渡すと、パスしなかったときに自動的に diff 内に表示される。
                    // actual?: any
                    // expected?: any;
                }
            }
            // Jestの場合
            // toBeDividable: (actual: number, num: number): jest.CustomMatcherResult => {
            //     const pass = actual % num === 0
            //     const message = () => (pass ? "割り切れる" : "割り切れない")
            //     return { pass, message }
            // }
        } satisfies Parameters<typeof expect.extend>[0])
        // eslint-disable-next-line
        // @ts-ignore TypeScriptで型安全にカスタムマッチャーを作る方法はマニュアル見る、ここでは面倒なので書かない
        expect(12).toBeDividable(3)
    })

    it.only("基本のexpect(matcher)のサンプル", () => {
        // 関数が例外スロー: toThrowの引数はスローされたErrorやメッセージを入れる (というかmessage見てるだけらしい、しかも部分一致！えぇ…)
        expect(() => {
            throw new Error("a")
        }).toThrow("a")
        expect(() => {
            throw new Error("b")
        }).toThrow(new Error("b"))
        expect(() => {
            throw { message: "cde" } // eslint-disable-line @typescript-eslint/no-throw-literal
        }).toThrow("d")

        // toBe はObject.is(===とほぼ同じだがNaNと-0の扱いが異なる)で比較
        expect(NaN).toBe(NaN)
        expect(-0).not.toBe(0)
        expect(() => {
            expect([1]).toBe([1])
        }).toThrow()
        // toEqual は値を比較 (再帰的にオブジェクトの中身を比較してくれるがundefinedとキーなしが等価と判定される(厳密ではない))
        expect({ a: [1], b: undefined }).toEqual({ a: [1] })
        // toStrictEqual は undefined と キーなし を toEqual と違って等価とは判定しない
        expect({ a: [1], b: undefined }).not.toStrictEqual([1])

        // toMatch
        // TODO: expect(1).toMatch

        // toMatchObject: 部分集合 (expectedがactualの一部分であればOK)
        expect({ a: 1, b: 2, c: { foo: ["bar"] } }).toMatchObject({ a: 1, c: { foo: ["bar"] } })
        // toMatchSnapshot
        // TODO: expect(1).toMatchSnapshot
        // toMatchInlineSnapshot
        // TODO: expect(1).toMatchInlineSnapshot

        // 数値の比較 (※expectに number | bigint 以外を渡すとコケる)
        expect(5).toBeLessThan(6)
        // TODO: expect(5n).toBeLessThanOrEqual(6n)
        // TODO: expect(5n).toBeGreaterThan(4n)
        expect(() => {
            expect("5").toBeGreaterThanOrEqual(4)
        }).toThrow()

        // expect(Boolean(any)).toBe(true or false) みたいなの (boolean以外も可)
        expect("0").toBeTruthy()
        expect(0).toBeFalsy()

        // toContain と toContainEqual: 含まれているかどうかの確認
        expect([5, 8]).toContain(8) // Array#includes とほぼ同じ (`[NaN].includes(NaN)` はtrueになる点に注意)
        expect([2, 5, 8]).not.toContain([5, 8]) // 配列に複数の値が含まれているかどうかには使えない
        expect([{ a: 1 }, { b: 2 }]).toContainEqual({ a: 1 }) // 参照ではなく値で比較
        expect([{ a: 1 }, { b: 2 }]).not.toContain({ a: 1 }) // toContainは参照で比較するのでマッチしない
        expect(
            new Map([
                [1, 2],
                [3, 4]
            ])
        ).toContainEqual([1, 2])
        expect("abcde").toContain("bcd") // string#includes (stringだけは特殊化されてるっぽい)
        if (ifJest) {
            // Jestなら下記も使えるが vitest では
            // AssertionError: the given combination of arguments (object and string) is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a string
            // というエラーになり string, array, map, object, set, weakset 以外は使えない
            expect({ includes: () => true }).not.toContain("includesを呼び出しているわけではない")
            expect({
                *[Symbol.iterator]() {
                    yield 3
                }
            }).toContain(3) // 反復可能(for...ofで使える)オブジェクトであれば使える
            expect(
                (function* () {
                    yield 5
                })()
            ).toContain(5) // generator()
        }

        // 配列の部分集合
        expect([2, 4, 6, 8]).toEqual(expect.arrayContaining([6, 4]))

        // その他のexpect(matcher).toHogePiyo
        expect(new Date()).toBeInstanceOf(Date) // instance of
        expect([2, 5, 8]).toHaveLength(3) // lengthのチェック
        expect({ length: 100 }).toHaveLength(100) // これもいける
        expect({ foo: undefined }).toHaveProperty("foo") // プロパティの存在があるか (値がundefinedでも通る)
        expect({ bar: 123 }).toHaveProperty("bar", 123) // プロパティの値判定
        // TODO: expect(1).toHaveReturned
        // TODO: expect(1).toHaveReturnedTimes
        // TODO: expect(2).toHaveReturnedWith
    })

    it("expected value として使える特殊なやつ", () => {
        expect(1).toStrictEqual(expect.anything()) // expect.anything()はnullやundefinedでないものにマッチ
        expect(null).not.toStrictEqual(expect.anything())
    })
})

describe("spyOnでモック", () => {
    let spy: SpyInstance<[obj: any, options?: InspectOptions | undefined], void>
    beforeEach(() => {
        spy = vitest.spyOn(console, "dir")
    })
    afterEach(() => {
        spy.mockRestore()
    })

    it("spyOnモック: beforeEach/afterEachのコードが冗長か？", () => {
        const dests: any[] = []
        spy.mockImplementation((message?: any, ...optionalParams: any[]) => {
            dests.push(message)
            for (const optionalParam of optionalParams) {
                dests.push(optionalParam)
            }
        })

        console.dir("foo")
        console.dir("bar", 2000)
        expect(dests).toEqual(["foo", "bar", 2000])
    })
})
