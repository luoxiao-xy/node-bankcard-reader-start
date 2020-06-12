import { info } from '@waiting/log'

import {
  Device,
} from './model'


export function connectDevice(device: Device): boolean {
  if (device && device.inUse) {
    device.deviceOpts.debug && info('Cautiton: connectDevice() device in use')
    return false
  }
  const openRet = device.apib.star_Open(0, 9600, '0')
  device.deviceOpts.debug && info(`open com ret: ${openRet}`)

  return openRet === 0 ? true : false
}

export function disconnectDevice(device: Device): boolean {
  const closeRet = device.apib.star_Close()
  device.deviceOpts.debug && info(`disconnectDevice at port: ${device.openPort}, ret: ${closeRet} `)
  device.inUse = false
  return closeRet === 0 ? true : false
}


/** 检查端口是否已打开 */
export function isDevicePortOpen(device: Device): boolean {
  const szDevInfo = Buffer.alloc(64)
  const iInfoLen = Buffer.alloc(64)
  const ret = device.apib.star_GetDevInfo(szDevInfo, iInfoLen) // 使用获取设备信息接口来检查是否连接成功
  device.deviceOpts.debug && info(`isPortOpen: ${ret}`)
  info(`设备信息: ${szDevInfo}`)
  info(`设备信息长度: ${iInfoLen}`)
  return ret === 0 ? true : false
}


export function findDeviceList(deviceOpts: Device['deviceOpts'], apib: Device['apib']): Device[] {
  const arr: Device[] = []

  const device = findDevice(deviceOpts, apib)
  arr.push(device)
  return arr
}


export function findDevice(
  deviceOpts: Device['deviceOpts'],
  apib: Device['apib'],
): Device {

  const device: Device = {
    apib,
    deviceOpts,
    inUse: false,
    openPort: 0,
  }

  const openRet = connectDevice(device)
  if (openRet && ! isDevicePortOpen(device)) {
    device.inUse = true
    device.openPort = 0
    deviceOpts.debug && info(`Found device at serial/usb port: ${0}`)
    disconnectDevice(device)
  }

  return device
}



/** 读取银行卡  磁条卡  */
export function readMC(device: Device): string {
  const szCardNo = Buffer.alloc(64)
  const iCardNoLen = Buffer.alloc(64)

  if (device.deviceOpts.debug) {
    info('starting reading 磁条卡 ...')
  }

  const code = device.apib.star_ReadMagCardNo(23, 0, szCardNo, iCardNoLen , 10)

  let cardno = ''
  if (code === 0) {
    // 卡号可能重复数字  ...1234557\u0000557
    cardno = parseBuffer(szCardNo)

  }

  if (device.deviceOpts.debug) {
    info(`readDataBase code: ${code}`)
    info(`readDataBase bufLen: ${szCardNo.byteLength}`)
    info('readDataBase buf: ')
    info(szCardNo)
    info(`readDataBase cardno: ${cardno}`)
  }

  return cardno
}


/** 读取银行卡 支持 接触、非接触 IC卡 */
export function readIC(device: Device): string {
  const buf = Buffer.alloc(64)
  if (device.deviceOpts.debug) {
    info('starting reading IC卡 ...')
  }

  const code = device.apib.star_ICGetInfo(2, Buffer.from('124|A'), buf , 1)

  let cardno = ''
  if (code === 0) {
    // 卡号可能重复数字  ...1234557\u0000557
    const bufstr = parseBuffer(buf)

    cardno = bufstr ? bufstr.substring(4) : ''

  }

  if (device.deviceOpts.debug) {
    info(`readDataBase code: ${code}`)
    info(`readDataBase bufLen: ${buf.byteLength}`)
    info('readDataBase buf: ')
    info(buf)
    info(`readDataBase cardno: ${cardno}`)
  }

  return cardno
}

/** 转换Buffer */
export function parseBuffer(buf: Buffer): string {
  const bufstr = buf.toString('utf8').trim().replace(/\0+$/g, '')

  return bufstr

}

