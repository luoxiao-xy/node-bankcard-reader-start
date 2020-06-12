import {
  parseDeviceOpts,
  BankCardData,
  Options,
} from '@waiting/bankcard-reader-base'
import { info } from '@waiting/log'
import {
  setPathDirectory, validateDllFile,
} from '@waiting/shared-core'
import * as ffi from 'ffi'

import {
  dllFuncs,
} from './config'
import { disconnectDevice, findDeviceList, readIC, readMC } from './device'
import { Device } from './model'


export async function init(options: Options): Promise<Device[]> {
  const deviceOpts = parseDeviceOpts(options)
  const { debug } = deviceOpts

  if (debug) {
    info(deviceOpts)
  }

  await validateDllFile(deviceOpts.dllTxt)
  if (deviceOpts.dllSearchPath) {
    setPathDirectory(deviceOpts.dllSearchPath)
  }
  const apib = ffi.Library(deviceOpts.dllTxt, dllFuncs)
  const devices = findDeviceList(deviceOpts, apib)

  if (devices && devices.length) {
    return devices
  }
  else {
    throw new Error('未找到读卡设备')
  }
}


/** Read card data */
export function read(device: Device): Promise<BankCardData> {
  const ret: BankCardData = {
    cardno: '',
  }

  try {
    ret.cardno = readIC(device) || readMC(device) || ''
  }
  catch (err) {
    ret.cardno = ''
  }

  try {
    disconnectDevice(device)
  }
  catch (ex) {
    throw ex
  }

  return Promise.resolve(ret)
}
