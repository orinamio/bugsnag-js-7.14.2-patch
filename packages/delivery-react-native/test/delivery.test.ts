/* eslint-disable jest/no-disabled-tests */

import Client from '@bugsnag/core/client'
import delivery from '../'
import EventWithInternals from '@bugsnag/core/event'

type NativeStackIOS = string[]
interface AndroidStackFrame {
  class: string
  file: string
  lineNumber: number
  methodName: string
}
type NativeStackAndroid = AndroidStackFrame[]

type NativeClientEvent = Pick<EventWithInternals,
| 'errors'
| 'severity'
| 'unhandled'
| 'app'
| 'device'
| 'threads'
| 'breadcrumbs'
| 'context'
| 'groupingHash'
| 'apiKey'
> & {
  severityReason: EventWithInternals['_handledState']['severityReason']
  user: EventWithInternals['_user']
  metadata: EventWithInternals['_metadata']
  nativeStack: NativeStackIOS | NativeStackAndroid
}

class ReactNativeError extends Error {
  nativeStackAndroid?: NativeStackAndroid
  nativeStackIOS?: NativeStackIOS
}

describe('delivery: react native', () => {
  it('sends the correct payload using the native client’s dispatch() method', done => {
    const sent: NativeClientEvent[] = []
    const NativeClient = {
      dispatch: (event: NativeClientEvent) => {
        sent.push(event)
        return new Promise((resolve) => resolve(true))
      }
    }
    const c = new Client({ apiKey: 'api_key' })
    c._setDelivery(client => delivery(client, NativeClient))
    c.leaveBreadcrumb('hi')
    c.setContext('test screen')
    c.setUser('123')
    c.notify(new Error('oh no'), (e) => {
      e.groupingHash = 'ER_GRP_098'
      e.apiKey = 'abcdef123456abcdef123456abcdef123456'
    }, (err, event) => {
      expect(err).not.toBeTruthy()
      expect(sent.length).toBe(1)
      expect(sent[0].errors[0].errorMessage).toBe('oh no')
      expect(sent[0].severity).toBe('warning')
      expect(sent[0].severityReason.type).toBe('handledException')
      expect(sent[0].unhandled).toBe(false)
      expect(sent[0].app).toEqual({ releaseStage: 'production', version: undefined, type: undefined })
      expect(sent[0].device).toEqual({})
      expect(sent[0].threads).toEqual([])
      expect(sent[0].breadcrumbs.length).toBe(1)
      expect(sent[0].breadcrumbs[0].message).toBe('hi')
      expect(sent[0].context).toBe('test screen')
      expect(sent[0].user).toEqual({ id: '123', email: undefined, name: undefined })
      expect(sent[0].metadata).toEqual({})
      expect(sent[0].groupingHash).toEqual('ER_GRP_098')
      expect(sent[0].apiKey).toBe('abcdef123456abcdef123456abcdef123456')
      done()
    })
  })

  it.skip('extracts nativeStackIOS', done => {
    const sent: NativeClientEvent[] = []
    const NativeClient = {
      dispatch: (event: NativeClientEvent) => {
        sent.push(event)
        return new Promise((resolve) => resolve(true))
      }
    }
    const c = new Client({ apiKey: 'api_key' })
    c._setDelivery(client => delivery(client, NativeClient))
    const error = new ReactNativeError('oh no')
    error.nativeStackIOS = [
      '0   ReactNativeTest                     0x000000010fda7f1b RCTJSErrorFromCodeMessageAndNSError + 79',
      '1   ReactNativeTest                     0x000000010fd76897 __41-[RCTModuleMethod processMethodSignature]_block_invoke_2.103 + 97',
      '2   ReactNativeTest                     0x000000010fccd9c3 -[BenCrash asyncReject:rejecter:] + 106',
      '3   CoreFoundation                      0x00007fff23e44dec __invoking___ + 140',
      '4   CoreFoundation                      0x00007fff23e41fd1 -[NSInvocation invoke] + 321',
      '5   CoreFoundation                      0x00007fff23e422a4 -[NSInvocation invokeWithTarget:] + 68',
      '6   ReactNativeTest                     0x000000010fd76eae -[RCTModuleMethod invokeWithBridge:module:arguments:] + 578',
      '7   ReactNativeTest                     0x000000010fd79138 _ZN8facebook5reactL11invokeInnerEP9RCTBridgeP13RCTModuleDatajRKN5folly7dynamicE + 246'
    ]
    c.notify(error, (e) => {}, (err, event) => {
      expect(err).not.toBeTruthy()
      expect(sent[0].nativeStack).toEqual(error.nativeStackIOS)
      done()
    })
  })

  it.skip('extracts nativeStackAndroid', done => {
    const sent: NativeClientEvent[] = []
    const NativeClient = {
      dispatch: (event: NativeClientEvent) => {
        sent.push(event)
        return new Promise((resolve) => resolve(true))
      }
    }
    const c = new Client({ apiKey: 'api_key' })
    c._setDelivery(client => delivery(client, NativeClient))
    const error = new ReactNativeError('oh no')
    error.nativeStackAndroid = [
      {
        class: 'com.testing.Blah',
        lineNumber: 101,
        file: 'app/com.testing.Blah.java',
        methodName: 'crash()'
      }
    ]
    c.notify(error, (e) => {}, (err, event) => {
      expect(err).not.toBeTruthy()
      expect(sent[0].nativeStack).toBe(error.nativeStackAndroid)
      done()
    })
  })
})
