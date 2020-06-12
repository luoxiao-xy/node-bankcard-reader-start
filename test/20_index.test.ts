/// <reference types="mocha" />

import { join } from '@waiting/shared-core'
import { basename } from 'path'
import * as assert from 'power-assert'

import * as bcr from '../src/lib/index'
import { Options } from '../src/lib/model'


const filename = basename(__filename)

describe(filename, () => {

  it('Should read() works', async () => {
    const dll = join(__dirname, '../dll/starInbar.dll')
    const dllSearchPath = join(__dirname, '../dll')
    const opts: Options = {
      cardType: 'auto',
      debug: false,
      dllTxt: dll,
      dllSearchPath,
    }

    try {
      const devices = await bcr.init(opts)
      const ret = await bcr.read(devices[0])

      console.info(ret)
      assert(!! ret, 'IDData invalid')
      assert(ret && ret.cardno, 'card number invalid')
    }
    catch (ex) {
      assert(false, ex)
    }
  })
})
