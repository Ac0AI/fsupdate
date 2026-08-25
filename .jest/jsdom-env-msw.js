const { TestEnvironment: JsdomEnvironment } = require('jest-environment-jsdom')
const { TextEncoder, TextDecoder } = require('node:util')

/**
 * Custom jsdom environment that preserves Node.js Web API globals
 * (fetch, Request, Response, Headers, TextEncoder etc.) which msw v2 requires.
 * jest-environment-jsdom 28.x strips these globals; this env restores them.
 */
class JsdomEnvironmentMsw extends JsdomEnvironment {
  constructor(...args) {
    super(...args)

    // Restore Node.js globals that jsdom strips or doesn't provide.
    // Must be set in constructor so they're available when test modules are imported.
    this.global.fetch = fetch
    this.global.Headers = Headers
    this.global.Request = Request
    this.global.Response = Response
    this.global.TextEncoder = TextEncoder
    this.global.TextDecoder = TextDecoder
    this.global.ReadableStream = ReadableStream
    this.global.WritableStream = WritableStream
    this.global.TransformStream = TransformStream
    this.global.Blob = Blob
    this.global.FormData = FormData
    this.global.AbortController = AbortController
    this.global.AbortSignal = AbortSignal
    this.global.BroadcastChannel = BroadcastChannel
    this.global.structuredClone = structuredClone
  }
}

module.exports = JsdomEnvironmentMsw
