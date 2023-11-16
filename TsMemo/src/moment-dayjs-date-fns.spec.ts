import { describe, it, expect } from "vitest"

/*
#
date-fns の format にロケールを指定してもローカルのタイムゾーンを参照する。
タイムゾーンを指定したい場合は date-fns-tz の formatInTimeZone や utcToZonedTime を使う。
1. `formatInTimeZone(new Date(), "+09:00", "yyyy-MM-dd", { locale: ja })`
2. `formatInTimeZone(utcToZonedTime(new Date()), "+09:00", "yyyy-MM-dd", { locale: ja })`

#
utcToZonedTime は 時差 (第二引数のタイムゾーン - ローカルのタイムゾーン) を Add Hours する関数。
zonedTimeToUtc は 時差 (第二引数のタイムゾーン - ローカルのタイムゾーン) を Sub Hours する関数。

環境によって動作が異なるので難しくない？

じゃあ parse のときはどうやんの？ date-fns-tz に parse はない
parse("2021-01-01 09:00:00", "yyyy-MM-dd HH:mm:ss", new Date()) これはローカルのタイムゾーンでパースされる。
なので、 Asia/Tokyo で実行すると "2021-01-01T00:00:00Z" になるが、 UTC で実行すると "2021-01-01T09:00:00Z" となって異なる結果になる。

これを回避するためには、後ろにタイムゾーンをつけてからパースしてやればUTC時刻で取得できる。
parse("2021-01-01 09:00:00 +09:00", "yyyy-MM-dd HH:mm:ss XXX", new Date())
*/
describe("TypeScript 2.2", () => {
    it("object型", () => {
        // object 型はプリミティブ型 (number, string, boolean, bigint, symbol, null, undefined) 以外の型を表す
        const obj: object = { a: 1 }
        expect(obj).toEqual({ a: 1 })
    })
})
